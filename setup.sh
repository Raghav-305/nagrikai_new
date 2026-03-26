#!/bin/bash

# Nagrik AI - Integrated Setup Script (Linux/Mac)

echo "=========================================="
echo "🏛️  Nagrik AI - Smart City CRM"
echo "Integrated Setup with AI Orchestrator"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "\n${BLUE}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js not found. Please install Node.js 16+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node -v)${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}❌ Python3 not found. Please install Python 3.13+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python found: $(python3 --version)${NC}"

# Check MongoDB
echo -e "${BLUE}Note: MongoDB will run in Docker${NC}"

# Setup Backend
echo -e "\n${BLUE}Setting up Node.js Backend...${NC}"
cd server
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}Created .env file - please update with your configuration${NC}"
fi

npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
cd ..

# Setup AI Server
echo -e "\n${BLUE}Setting up Python AI Orchestrator...${NC}"
cd ai_server

if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi

source venv/bin/activate

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}Created .env file - please update with your Groq API key${NC}"
fi

pip install -r requirements.txt
echo -e "${GREEN}✓ AI Server dependencies installed${NC}"
cd ..

# Setup Frontend
echo -e "\n${BLUE}Setting up React Frontend...${NC}"
cd client
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
cd ..

echo -e "\n${GREEN}=========================================="
echo "✓ Setup Complete!"
echo "==========================================${NC}"

echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Update configuration files:"
echo "   - server/.env"
echo "   - ai_server/.env"
echo ""
echo "2. Start services:"
echo "   Option A - Containerized (requires Docker):"
echo "      ${GREEN}docker-compose up${NC}"
echo ""
echo "   Option B - Manual (3 terminals needed):"
echo "      Terminal 1: ${GREEN}cd server && npm run dev${NC}"
echo "      Terminal 2: ${GREEN}cd ai_server && source venv/bin/activate && python -m uvicorn server:app --reload${NC}"
echo "      Terminal 3: ${GREEN}cd client && npm run dev${NC}"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5000"
echo "   AI Server: http://localhost:7860"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "   - Full setup: PROJECT_SETUP_COMPLETE.md"
echo "   - API docs: server/docs/api.md"
echo "   - AI docs: ai_server/README.md"
