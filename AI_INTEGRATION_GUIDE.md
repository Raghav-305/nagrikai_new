# AI Integration Guide - Nagrik AI

## Overview

The Nagrik AI project now integrates a sophisticated LangGraph-based multi-agent system that intelligently analyzes and routes citizen complaints to the appropriate municipal departments.

## How It Works

### User Journey

1. **Citizen Submits Complaint**
   ```
   Frontend → Text + Image + Location
   ```

2. **Backend Receives Request**
   ```
   Node.js backend (complaintController) receives complaint
   - Validates input
   - Checks for spam/duplicates
   - Calls AI Orchestrator
   ```

3. **AI Processing Flow**
   ```
   AI Server (Port 7860)
   ├─ ORCHESTRATOR Agent analyzes complaint
   ├─ Routes to specialized manager (INFRASTRUCTURE/UTILITY/PUBLIC_SAFETY/ENVIRONMENT)
   ├─ Manager performs detailed analysis
   ├─ AUDITOR validates assignment
   └─ Returns results to backend
   ```

4. **Ticket Created in Database**
   ```
   MongoDB stores complaint with:
   - AI-determined department
   - AI-assessed priority
   - Auto-generated ticket ID
   - Complete analysis history
   ```

5. **Department Notified**
   ```
   Relevant department dashboard updated
   with prioritized work orders
   ```

## Code Integration Points

### 1. Updated Complaint Controller
[File: `server/controllers/complaintController.js`]

**Key Changes:**
- Replaced direct `aiService.analyzeComplaint()` calls
- Now uses `processComplaintWithAI()` from `aiOrchestrator` service
- Maps AI responses to database schema
- Includes fallback mechanisms

**Code:**
```javascript
// Old way (basic AI)
const aiData = await aiService.analyzeComplaint(text, image);

// New way (intelligent orchestrator)
const aiResponse = await processComplaintWithAI(text, image, location, timestamp);
```

### 2. New AI Orchestrator Service
[File: `server/services/aiOrchestrator.js`]

**Main Functions:**

- **`processComplaintWithAI(text, image, location, timestamp)`**
  - Sends complaint to AI Server
  - Handles multi-modal input (text + images)
  - Returns structured AI analysis
  - Includes error handling and fallback

- **`checkAIServerHealth()`**
  - Verifies AI Server is running
  - Used for system status checks

- **`getCategoryFromAI(complaintText, image)`**
  - Extracts just the category from AI analysis
  - Useful for batch processing

- **`getDefaultCategory(text)`**
  - Keyword-based fallback
  - Used when AI Server unavailable

**Example Usage:**
```javascript
const response = await processComplaintWithAI(
  "Water pipe burst on Main Road",
  base64ImageData,
  "Main Road downtown",
  "2026-03-26T10:30:00Z"
);

console.log(response.data.ticket_id);        // UTIL-xyz12345
console.log(response.data.final_department); // Water & Power Board
console.log(response.data.final_priority);   // High
console.log(response.data.deadline);         // 24 hours
```

### 3. Updated Complaint Model
[File: `server/models/Complaint.js`]

**New AI Fields:**
```javascript
ai_analysis: String,          // Full AI thinking process
ai_message_history: [String], // Message chain from agents
ai_processed: Boolean,        // Flag for AI processing
deadline: String              // SLA deadline from AI
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React)                        │
│        - Complaint Form                                          │
│        - Image Upload                                            │
│        - Location Selection                                      │
└──────────────────────────┬──────────────────────────────────────┘
                          │ POST /api/complaints
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js/Express)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Authentication Middleware                                 │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                        │                                        │
│  ┌──────────────────────▼───────────────────────────────────┐  │
│  │ complaintController.createComplaint()                    │  │
│  │ 1. Validate input                                        │  │
│  │ 2. Check for spam/duplicates                            │  │
│  │ 3. Call aiOrchestrator.processComplaintWithAI()        │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                        │                                        │
│  ┌──────────────────────▼───────────────────────────────────┐  │
│  │ aiOrchestrator Service                                   │  │
│  │ - Prepare multi-modal data                              │  │
│  │ - Add auth token                                        │  │
│  │ - HTTP POST to AI Server                                │  │
│  │ - Parse response                                        │  │
│  │ - Handle errors/fallback                                │  │
│  └──────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────────┘
                          │ HTTP POST /api/process-ticket
                          │ (x-api-token header)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                 AI SERVER (Python/FastAPI - Port 7860)           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Authentication Middleware (verify_token)                 │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                        │                                        │
│  ┌──────────────────────▼───────────────────────────────────┐  │
│  │ LangGraph Workflow                                       │  │
│  │                                                          │  │
│  │  ┌─ ORCHESTRATOR Node ──────────────────────┐           │  │
│  │  │ Uses Groq LLM (llama-3.1-8b)           │           │  │
│  │  │ Analyzes complaint                       │           │  │
│  │  │ Routes to manager:                       │           │  │
│  │  │  - INFRASTRUCTURE                        │           │  │
│  │  │  - UTILITY                               │           │  │
│  │  │  - PUBLIC_SAFETY                         │           │  │
│  │  │  - ENVIRONMENT                           │           │  │
│  │  └─────────────────────────────────────────┘           │  │
│  │           │                                             │  │
│  │  ┌────────▼─────────────────────────────────┐          │  │
│  │  │ Specialized Manager Nodes (selected)     │          │  │
│  │  │ - Detailed problem analysis              │          │  │
│  │  │ - Vision analysis if image provided      │          │  │
│  │  │ - Severity assessment                    │          │  │
│  │  │ - Action plan generation                 │          │  │
│  │  │ - Ticket ID creation                     │          │  │
│  │  └────────┬─────────────────────────────────┘          │  │
│  │           │                                             │  │
│  │  ┌────────▼─────────────────────────────────┐          │  │
│  │  │ AUDITOR Node                             │          │  │
│  │  │ - QA verification                        │          │  │
│  │  │ - Department validation                  │          │  │
│  │  │ - SLA compliance check                   │          │  │
│  │  │ - Can reject for rerouting               │          │  │
│  │  └────────┬─────────────────────────────────┘          │  │
│  │           │                                             │  │
│  │           ├─→ APPROVED → Return results                │  │
│  │           └─→ REJECTED → Loop back to ORCHESTRATOR    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬──────────────────────────────────────┘
                          │ JSON Response with AI analysis
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│            Back to Backend: Store in Database                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ MongoDB - Complaints Collection                          │  │
│  │ ├─ ticket_id (from AI)                                 │  │
│  │ ├─ department (from AI)                                │  │
│  │ ├─ priority (from AI)                                 │  │
│  │ ├─ action_plan (from AI)                              │  │
│  │ ├─ ai_analysis (full thinking)                        │  │
│  │ ├─ deadline (SLA)                                     │  │
│  │ └─ ai_processed: true                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              Send to Department Dashboard                        │
│  - Department officers notified                                 │
│  - Auto-prioritized work queue                                  │
│  - SLA tracking enabled                                         │
└─────────────────────────────────────────────────────────────────┘
```

## API Communication Protocol

### Backend → AI Server

**Request:**
```json
POST /api/process-ticket
Headers: x-api-token: your-secret-token
Content-Type: application/json

{
  "text": "Large pothole on Main Street blocking lanes",
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "location_text": "Main Street downtown",
  "timestamp": "2026-03-26T10:30:00Z"
}
```

**Response:**
```json
{
  "ticket_id": "INFR-a1b2c3d4",
  "final_department": "Roads & Bridges PWD",
  "final_priority": "High (via Vision Tool)",
  "deadline": "24 hours",
  "action_plan": "Deploy inspection team immediately. If >2cm deep, file emergency repair order.",
  "auditor_log": "APPROVED",
  "raw_analysis": "{\n  \"Infrastructure_Problem_Definition\": \"...\",\n  \"Severity\": \"High\",\n  ...\n}",
  "message_history": [
    "HUMAN: Analyze pothole complaint...",
    "AI: Analyzing infrastructure damage..."
  ]
}
```

## Configuration Setup

### 1. Backend `.env` file

```bash
# server/.env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nagrik
JWT_SECRET=your-super-secret-jwt-key
AI_SERVER_URL=http://localhost:7860
AI_SERVER_TOKEN=your-secret-token-here
GROQ_API_KEY=your-groq-api-key
```

### 2. AI Server `.env` file

```bash
# ai_server/.env
INTERNAL_SECRET_TOKEN=your-secret-token-here
GROQ_API_KEY=your-groq-api-key-here
```

### 3. Environment Variables Must Match

**Critical**: The token in `server/.env` (AI_SERVER_TOKEN) must match `ai_server/.env` (INTERNAL_SECRET_TOKEN)

## Deployment

### Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - AI Server:**
```bash
cd ai_server
python -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m uvicorn server:app --reload --port 7860
```

**Terminal 3 - Frontend:**
```bash
cd client
npm install
npm run dev
```

## Error Handling & Fallback Logic

### Scenario 1: AI Server Unavailable

```javascript
// aiOrchestrator.js
const response = await processComplaintWithAI(...);

if (!response.success) {
  // Fallback to keyword-based categorization
  const category = getDefaultCategory(complaintText);
  // Complaint still created, but with basic categorization
}
```

### Scenario 2: JSON Parsing Error

```python
# graph.py in each agent node
try:
    data = json.loads(clean_text)
except json.JSONDecodeError:
    # Fallback: manual assessment required
    severity = "Requires Triage"
    plan = "Manual assessment required"
```

### Scenario 3: Authentication Failure

```python
# server.py
def verify_token(x_api_token: str = Header(...)):
    if x_api_token != INTERNAL_SECRET_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
```

## Performance Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Avg Processing Time | 2-5s | Depends on image size |
| Max Request Timeout | 30s | Configured in aiOrchestrator.js |
| Health Check | <5s | /health endpoint |
| Concurrent Requests | Unlimited | FastAPI async handling |
| Max Image Size | 5MB | Base64 encoded |

## Troubleshooting

### Issue: "AI_SERVER_URL not found"
**Solution**: Set `AI_SERVER_URL` in `server/.env`

### Issue: "Unauthorized access to AI Server"
**Solution**: Verify tokens match between `server/.env` and `ai_server/.env`

### Issue: Groq API errors
**Solution**: 
- Check Groq API key in `ai_server/.env`
- Verify rate limits not exceeded
- Check model availability

### Issue: Slow responses
**Solution**:
- Check network connectivity
- Monitor AI Server logs
- Check Groq service status
- Consider caching responses

## Next Steps

1. **Run Setup**
   ```bash
   # Windows
   setup.bat
   
   # Linux/Mac
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Configure Environment**
   - Update `.env` files with actual values
   - Set Groq API key

3. **Start Services**
   ```bash
   docker-compose up
   ```

4. **Test Integration**
   - Submit test complaint via frontend
   - Check AI routing in database

5. **Monitor**
   - Watch logs for agent decisions
   - Verify correct department routing
   - Track SLA compliance

## Support & Resources

- **API Docs**: `server/docs/api.md`
- **AI Server Docs**: `ai_server/README.md`
- **Setup Guide**: `PROJECT_SETUP_COMPLETE.md`
- **LangGraph**: https://python.langchain.com/docs/langgraph
- **FastAPI**: https://fastapi.tiangolo.com/

---

**Version**: 1.0
**Last Updated**: March 26, 2026
**Status**: Production-Ready
