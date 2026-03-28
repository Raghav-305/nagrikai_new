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
        "ticket_id": final_state.get("ticket_id", "TICKET-GEN-PENDING"),
        "final_department": final_state.get("final_department_assigned", "Triage Required"),
        "final_priority": final_state.get("final_priority", "Standard Triage"),
        "deadline": final_state.get("deadline", "3 days"),
        "action_plan": final_state.get("action_taken", "Internal work order pending detailed assessment."),
        "auditor_log": final_state.get("auditor_compliance_log", "Quality control check pending."),
        "raw_analysis": final_state.get("thought_process", "No analysis generated."),
        "message_history": message_log
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
