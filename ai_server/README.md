# AI Server - LangGraph Multi-Agent Orchestrator

## Overview

The AI Server is a sophisticated multi-agent system built with LangGraph and FastAPI that intelligently routes citizen complaints to the appropriate municipal departments using dynamic routing and quality control mechanisms.

## Architecture

### Five Agent System

1. **ORCHESTRATOR** (The Brain)
   - Analyzes raw citizen input
   - Routes to appropriate specialized manager
   - Handles callback loops from auditor

2. **INFRASTRUCTURE Manager**
   - Handles: Roads, Bridges, Sidewalks, Potholes
   - Generates action plans for physical responses
   - Creates INFR-* ticket IDs

3. **UTILITY Manager**
   - Handles: Water supply, Electricity, Sewerage, Power lines
   - Assesses hazards (live wires, flooding, etc.)
   - Creates UTIL-* ticket IDs

4. **PUBLIC_SAFETY Manager**
   - Handles: Traffic, Police emergencies, Hazardous obstructions
   - Assesses danger to human life
   - Creates SAFE-* ticket IDs

5. **ENVIRONMENT Manager**
   - Handles: Waste management, Garbage, Sanitation, Parks, Trees
   - Assesses environmental impact
   - Creates ENVR-* ticket IDs

6. **AUDITOR** (Quality Control)
   - Verifies correct department routing
   - Validates action plans
   - Rejects tickets for rerouting if needed
   - Ensures SLA compliance

## Features

- **Multi-Modal Input Processing**
  - Text analysis
  - Image/Vision analysis (uses base64 encoded images)
  - Location data
  - Timestamp tracking

- **Intelligent Routing**
  - Dynamic conditional routing based on content analysis
  - Feedback loop from auditor for rejected tickets
  - Fallback keyword matching if AI fails

- **SLA-Based Prioritization**
  - Critical: 4 hours
  - High: 24 hours
  - Moderate: 3 days
  - Low: 7 days

- **Quality Assurance**
  - Auditor validates all assignments
  - Prevents tickets from going to wrong departments
  - Maintains audit trail

## Installation

### Prerequisites
- Python 3.13+
- pip package manager
- Groq API Key (for LLM models)

### Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the ai_server directory:

```
INTERNAL_SECRET_TOKEN=your-secret-token-here
GROQ_API_KEY=your-groq-api-key-here
```

## Running the Server

### Development

```bash
python -m uvicorn server:app --reload --port 7860
```

The server will start at `http://localhost:7860`

### Production

```bash
python -m uvicorn server:app --host 0.0.0.0 --port 7860
```

### Docker

```bash
# Build image
docker build -t nagrik-ai-server .

# Run container
docker run -p 7860:7860 \
  -e INTERNAL_SECRET_TOKEN=your-token \
  -e GROQ_API_KEY=your-key \
  nagrik-ai-server
```

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model": "LangGraph Multi-Agent Orchestrator Active"
}
```

### Process Complaint Ticket
```
POST /api/process-ticket
Headers: x-api-token: your-secret-token
Content-Type: application/json

Request Body:
{
  "text": "Pothole on Main Street causing traffic disruption",
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "location_text": "Main Street, downtown area",
  "timestamp": "2026-03-26T10:30:00Z"
}
```

Response:
```json
{
  "ticket_id": "INFR-a1b2c3d4",
  "final_department": "Roads & Bridges PWD",
  "final_priority": "High (via Vision Tool)",
  "deadline": "24 hours",
  "action_plan": "Inspect pothole for depth and width. If >2cm, schedule immediate repair crew. Block area if hazardous.",
  "auditor_log": "APPROVED",
  "raw_analysis": "{\n  \"Infrastructure_Problem_Definition\": \"...\"\n}",
  "message_history": [...]
}
```

## State Management

### CRMState (Complaint Request Management State)

```python
class CRMState(TypedDict):
    # Input data
    citizen_report_text: str
    image_base64: str
    location_data: dict
    timestamp: str
    
    # Internal routing
    next_node: str
    ticket_id: str
    
    # Analysis results
    infrastructure_analysis: str
    utility_analysis: str
    public_safety_analysis: str
    environment_analysis: str
    
    # Quality control
    auditor_compliance_log: str
    auditor_feedback: str
    
    # Final output
    final_department_assigned: str
    final_priority: str
    deadline: str
    action_taken: str
    thought_process: str
    
    # Message history
    messages: List[BaseMessage]
```

## LLM Configuration

### Text LLM (Orchestration & Routing)
- Model: `llama-3.1-8b-instant` (Groq)
- Temperature: 0 (deterministic)
- Used for: Decision-making, routing logic

### Vision LLM (Image Analysis)
- Model: `meta-llama/llama-4-scout-17b-16e-instruct` (Groq)
- Temperature: 0 (deterministic)
- Used for: Image analysis when images are provided

## Error Handling

### JSON Parsing Failures
- Automatic retry with markdown stripping
- Fallback to basic categorization
- Maintains complaint flow even if AI fails

### API Server Unavailability
- Handled gracefully by Node.js backend
- Falls back to keyword-based categorization
- Flags for manual review

## Workflow Example

1. **Input**: "There's a huge water leak on Oak Avenue, pipes are broken"
   - Text analysis detects water issue
   - Routes to UTILITY manager

2. **UTILITY Agent**:
   - Problem: Water pipe breakage
   - Severity: High (immediate safety concern)
   - Action: Block area, dispatch repair crew
   - Ticket: UTIL-xy1z2w3v

3. **AUDITOR**:
   - Validates: UTILITY department correct for water issue ✓
   - Status: APPROVED

4. **Output**: Ticket created with:
   - Department: Water & Power Board
   - Priority: High
   - Deadline: 24 hours
   - Action Plan: Block area, dispatch repair crew

## Performance Considerations

- Average processing time: 2-5 seconds per complaint
- Handles multi-modal data efficiently
- Base64 image processing optimized
- Async request handling via FastAPI

## Security

- Token-based authentication for all endpoints
- Input validation on all requests
- Base64 image size validation (recommended max 5MB)
- CORS configuration in production

## Monitoring & Logging

All agent operations are logged with timestamps:
- Routing decisions
- Analysis results
- Audit status
- Error messages

Monitor via:
```bash
docker logs nagrik-ai-server -f
```

## Troubleshooting

### "Failed to parse JSON" errors
- Check if LLM is returning proper JSON format
- Verify Groq API key is valid
- Check model availability in Groq console

### "Unauthorized access" errors
- Verify x-api-token header is included
- Check token matches INTERNAL_SECRET_TOKEN
- Ensure token doesn't have extra spaces

### Slow response times
- Check AI Server CPU/memory usage
- Verify Groq API connection
- Consider batch processing for high volume

## Development

### Adding New Manager Agents

1. Create new node function:
```python
def custom_node(state: CRMState):
    # Your logic here
    return {"messages": [response], "next_node": "AUDITOR"}
```

2. Add to workflow:
```python
workflow.add_node("CUSTOM", custom_node)
```

3. Update orchestrator routing logic

### Testing Locally

```bash
# Test health check
curl http://localhost:7860/health

# Test with sample complaint
curl -X POST http://localhost:7860/api/process-ticket \
  -H "x-api-token: test-token" \
  -H "Content-Type: application/json" \
  -d '{"text":"Pothole on Main St","image_base64":"","location_text":"Main St","timestamp":"2026-03-26T10:00:00Z"}'
```

## References

- [LangGraph Documentation](https://python.langchain.com/docs/langgraph)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Groq API Docs](https://console.groq.com/docs)

## Support

For issues or enhancements:
1. Check the logs: `docker logs nagrik-ai-server`
2. Verify environment variables
3. Test endpoints with curl
4. Check Groq API status

---

**Status**: Production-Ready
**Last Updated**: March 26, 2026
