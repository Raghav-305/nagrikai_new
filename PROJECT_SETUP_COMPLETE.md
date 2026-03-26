# Project Overview

## 🏛️ Nagrik AI - Smart City Complaint Management System

A full-stack intelligent complaint management platform that uses multi-agent AI orchestration to automatically route citizen complaints to the appropriate municipal departments.

## 🎯 Project Architecture

### Components

1. **Frontend (React/Vite)** - `client/`
   - Citizen complaint submission interface
   - Department dashboard
   - Admin management console
   - Real-time status tracking

2. **Backend (Node.js/Express)** - `server/`
   - RESTful API endpoints
   - User authentication & authorization
   - Complaint management
   - Database operations (MongoDB)
   - Integration layer with AI server

3. **AI Orchestrator (Python/FastAPI)** - `ai_server/`
   - LangGraph multi-agent system
   - Intelligent complaint routing
   - 5 specialized manager agents:
     - **ORCHESTRATOR**: Routes complaints to appropriate departments
     - **INFRASTRUCTURE**: Handles roads, bridges, sidewalks
     - **UTILITY**: Handles water, electricity, sewerage
     - **PUBLIC_SAFETY**: Handles traffic, police emergencies
     - **ENVIRONMENT**: Handles waste, sanitation, parks
   - **AUDITOR**: Quality control and compliance checking
   - Vision & text understanding with Groq LLM

## 🚀 Setup & Installation

### Prerequisites
- Node.js 16+
- Python 3.13+
- MongoDB (local or container)
- Docker & Docker Compose (optional for containerized setup)
- Groq API Key (for AI models)

### Quick Start with Docker Compose

```bash
# Clone repository and navigate to project root
cd Nagrik_AI

# Update .env files with your configuration
cp server/.env.example server/.env
cp ai_server/.env.example ai_server/.env

# Update environment variables with your actual values
# - MongoDB credentials
# - JWT secret
# - Groq API key
# - AI Server token

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Manual Setup (Development)

#### 1. Backend Setup
```bash
cd server
npm install
# Update .env with your configuration
npm run dev
```

#### 2. AI Server Setup
```bash
cd ai_server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn server:app --reload --port 7860
```

#### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📡 API Endpoints

### Complaint Processing
- `POST /api/process-ticket` - Process complaint through AI orchestrator
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints` - Get user's complaints
- `GET /api/complaints/:id` - Get complaint details

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Admin/Department
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/department/complaints` - Department-specific complaints
- `PATCH /api/complaints/:id/status` - Update complaint status

## 🤖 AI Orchestrator Workflow

1. **Intake**: Citizen submits complaint with text + image
2. **Orchestration**: ORCHESTRATOR agent analyzes and routes to appropriate manager
3. **Specialization**: Manager agent (INFRASTRUCTURE, UTILITY, etc.) performs detailed analysis
4. **Audit**: AUDITOR agent performs quality control
5. **Routing**: Approved tickets are stored; rejected tickets loop back to ORCHESTRATOR
6. **Storage**: Final ticket data saved to database with AI analysis

## 📊 Database Schema

### Complaint Model
- `user`: Reference to User
- `text`: Complaint description
- `image`: Base64 encoded image
- `ticket_id`: Unique AI-generated ticket ID
- `department`: AI-determined department
- `priority`: AI-assessed priority (low/medium/high/critical)
- `action_plan`: AI-generated action plan
- `ai_analysis`: Full AI thinking process
- `ai_message_history`: Complete message history from AI agents
- `ai_processed`: Boolean flag indicating AI processing
- `deadline`: SLA deadline from AI assessment

## 🔧 Environment Variables

Create `.env` files in both `server/` and `ai_server/` directories:

### server/.env
```
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nagrik
JWT_SECRET=your-secret
AI_SERVER_URL=http://localhost:7860
AI_SERVER_TOKEN=your-token
GROQ_API_KEY=your-groq-key
```

### ai_server/.env
```
INTERNAL_SECRET_TOKEN=your-token
GROQ_API_KEY=your-groq-key
```

## 🐳 Docker Commands

```bash
# Build and start services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Rebuild specific service
docker-compose up --build ai-server

# SSH into container
docker exec -it nagrik-backend sh
docker exec -it nagrik-ai-server bash
```

## 📝 Development Notes

- Backend runs on port 5000
- AI Server runs on port 7860
- Frontend runs on port 3000
- MongoDB runs on port 27017
- All services communicate via `nagrik-network` bridge

## 🔐 Security

- JWT authentication for API endpoints
- API token verification for AI server
- CORS configuration for frontend
- Input validation and sanitization
- Role-based access control (RBAC)

## 🧪 Testing

```bash
# Backend tests
cd server && npm test

# AI Server tests (if implemented)
cd ai_server && pytest
```

## 📚 Additional Resources

- [API Documentation](server/docs/api.md)
- [AI Server Architecture](ai_server/README.md)
- [Frontend Components](client/README.md)

## 📄 License

This project is part of the Nagrik AI initiative for smart city management.

## 👥 Team

- Raghav (AI Architecture & LangGraph)
- Lokesh (Backend Integration)
- [Your Name] (Integration & Setup)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Last Updated**: March 26, 2026
**Status**: In Development with AI Integration
