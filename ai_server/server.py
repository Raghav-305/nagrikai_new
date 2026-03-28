import os
import uuid

from fastapi import Depends, FastAPI, Header, HTTPException
from langchain_core.messages import messages_to_dict
from pydantic import BaseModel

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


def _serialize_messages(state: dict):
    return messages_to_dict(state.get("messages", []))


def _build_process_ticket_response(final_state: dict):
    serializable_messages = _serialize_messages(final_state)

    complaint_id = final_state.get("complaint_id")
    current_ticket_id = final_state.get("current_ticket_id", "TICKET-GEN-PENDING")
    department_assigned = final_state.get("department_assigned", "Triage Required")
    priority = final_state.get("priority", "Standard Triage")
    deadline = final_state.get("deadline", "3 days")
    action_plan = final_state.get("action_plan", "Internal work order pending detailed assessment.")
    ai_analysis = final_state.get("ai_analysis", {})
    auditor_log = final_state.get("auditor_compliance_log", "Quality control check pending.")

    return {
        "success": True,
        "status": "AWAITING_FIELD_CREW",
        "complaint_id": complaint_id,
        "current_ticket_id": current_ticket_id,
        "department_assigned": department_assigned,
        "priority": priority,
        "deadline": deadline,
        "action_plan": action_plan,
        "ai_analysis": ai_analysis,
        "ai_message_log": serializable_messages,
        # Legacy aliases kept for backward compatibility.
        "ticket_id": current_ticket_id,
        "final_department": department_assigned,
        "final_priority": priority,
        "auditor_log": auditor_log,
        "raw_analysis": ai_analysis,
        "message_history": serializable_messages,
    }


def _build_human_update_response(updated_state: dict):
    serializable_messages = _serialize_messages(updated_state)
    is_resolved = updated_state.get("next_node") == "END"
    current_status = "FULLY_RESOLVED" if is_resolved else "AWAITING_FIELD_CREW"

    complaint_id = updated_state.get("complaint_id")
    current_ticket_id = updated_state.get("current_ticket_id")
    department_assigned = updated_state.get("department_assigned")
    priority = updated_state.get("priority")
    deadline = updated_state.get("deadline")
    action_plan = updated_state.get("action_plan")
    ai_analysis = updated_state.get("ai_analysis", {})
    ticket_history = updated_state.get("ticket_history", [])
    auditor_log = updated_state.get("auditor_compliance_log", "")

    return {
        "success": True,
        "status": current_status,
        "complaint_id": complaint_id,
        "current_ticket_id": current_ticket_id,
        "new_department_assigned": department_assigned,
        "priority": priority,
        "deadline": deadline,
        "revised_action_plan": action_plan,
        "ai_analysis": ai_analysis,
        "full_ticket_history": ticket_history,
        "ai_message_log": serializable_messages,
        # Legacy aliases kept for backward compatibility.
        "ticket_id": current_ticket_id,
        "department_assigned": department_assigned,
        "final_department": department_assigned,
        "final_priority": priority,
        "action_plan": action_plan,
        "auditor_log": auditor_log,
        "raw_analysis": ai_analysis,
        "message_history": serializable_messages,
        "ticket_history": ticket_history,
    }


@app.get("/health")
def health_check():
    """A simple endpoint for Docker to check if the server is healthy."""
    return {"status": "healthy", "model": "LangGraph Multi-Agent Orchestrator Active"}


@app.post("/api/process-ticket")
def process_ticket(request: ComplaintRequest, token: None = Depends(verify_token)):
    """Create a new AI complaint thread and return both new and legacy response shapes."""
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

    return _build_process_ticket_response(final_state)


@app.post("/api/human-update")
def process_human_update(request: HumanUpdateRequest, token: None = Depends(verify_token)):
    """Wake an existing AI complaint thread using the latest department/crew note."""
    config = {"configurable": {"thread_id": request.complaint_id}}
    update_state = {
        "latest_human_update": request.crew_note,
    }

    updated_state = crm_app.invoke(update_state, config=config)

    return _build_human_update_response(updated_state)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=7860)
