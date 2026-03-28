import os
import uuid
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from langchain_core.messages import messages_to_dict

from graph import crm_app
from state import CRMState

app = FastAPI(title="Smart City AI Orchestration Engine")

INTERNAL_SECRET_TOKEN = os.getenv("INTERNAL_SECRET_TOKEN")


def verify_token(x_api_token: str = Header(...)):
    if x_api_token != INTERNAL_SECRET_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized access to AI Server")


class ComplaintRequest(BaseModel):
    text: str
    image_base64: str = ""
    location_text: str = ""
    timestamp: str = ""


class HumanUpdateRequest(BaseModel):
    complaint_id: str
    crew_note: str


@app.get("/health")
def health_check():
    """A simple endpoint for Docker to check if the server is healthy."""
    return {"status": "healthy", "model": "LangGraph Multi-Agent Orchestrator Active"}


@app.post("/api/process-ticket")
def process_ticket(request: ComplaintRequest, token: None = Depends(verify_token)):
    """Receives new citizen data, runs the Orchestrator, and starts the memory thread, routes to Managers, and returns final QC'd data."""
    master_complaint_id = f"COMP-{str(uuid.uuid4())[:8]}"
    first_ticket_id = f"TICKET-GEN-{str(uuid.uuid4())[:8]}"

    initial_state = CRMState(
        complaint_id=master_complaint_id,
        citizen_report_text=request.text,
        image_base64=request.image_base64,
        location_data={"reported_address": request.location_text},
        timestamp=request.timestamp,
        messages=[],
        current_ticket_id=first_ticket_id,
        department_assigned="",
        priority="",
        deadline="",
        action_plan="",
        next_node="",
        ai_analysis={},
        auditor_compliance_log="",
        auditor_feedback="",
        latest_human_update="",
        ticket_history=[],
    )

    config = {"configurable": {"thread_id": master_complaint_id}}
    final_state = crm_app.invoke(initial_state, config=config)
    serializable_messages = messages_to_dict(final_state.get("messages", []))

    return {
        "success": True,
        "status": "AWAITING_FIELD_CREW",
        "complaint_id": final_state.get("complaint_id"),
        "current_ticket_id": final_state.get("current_ticket_id"),
        "department_assigned": final_state.get("department_assigned"),
        "priority": final_state.get("priority"),
        "deadline": final_state.get("deadline"),
        "action_plan": final_state.get("action_plan"),
        "ai_analysis": final_state.get("ai_analysis"),
        "full_ticket_history": final_state.get("ticket_history"),
        "ai_message_log": serializable_messages,
    }


@app.post("/api/human-update")
def process_human_update(request: HumanUpdateRequest, token: None = Depends(verify_token)):
    """Receives a note from a field crew, wakes up the AI, and generates the next ticket."""
    config = {"configurable": {"thread_id": request.complaint_id}}
    update_state = {"latest_human_update": request.crew_note}

    updated_state = crm_app.invoke(update_state, config=config)
    serializable_messages = messages_to_dict(updated_state.get("messages", []))

    if updated_state.get("next_node") == "END":
        current_status = "FULLY_RESOLVED"
    else:
        current_status = "AWAITING_FIELD_CREW"

    return {
        "success": True,
        "status": current_status,
        "complaint_id": updated_state.get("complaint_id"),
        "current_ticket_id": updated_state.get("current_ticket_id"),
        "new_department_assigned": updated_state.get("department_assigned"),
        "priority": updated_state.get("priority"),
        "deadline": updated_state.get("deadline"),
        "revised_action_plan": updated_state.get("action_plan"),
        "ai_analysis": updated_state.get("ai_analysis"),
        "full_ticket_history": updated_state.get("ticket_history"),
        "ai_message_log": serializable_messages,
    }
