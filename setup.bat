@echo off
REM Nagrik AI - Integrated Setup Script (Windows)

echo.
echo ==========================================
echo 🏛️  Nagrik AI - Smart City CRM
echo Integrated Setup with AI Orchestrator
echo ==========================================

REM Colors not supported in batch, we'll use text

echo.
echo Checking prerequisites...

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 16+
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js found: %NODE_VERSION%

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install Python 3.13+
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✓ Python found: %PYTHON_VERSION%

REM Setup Backend
echo.
echo Setting up Node.js Backend...
cd server
if not exist ".env" (
    copy .env.example .env
    echo Created .env file - please update with your configuration
)
call npm install
echo ✓ Backend dependencies installed
cd ..

REM Setup AI Server
echo.
echo Setting up Python AI Orchestrator...
cd ai_server

if not exist "venv" (
    python -m venv venv
    echo ✓ Virtual environment created
)

call venv\Scripts\activate.bat

if not exist ".env" (
    copy .env.example .env
    echo Created .env file - please update with your Groq API key
)

pip install -r requirements.txt
echo ✓ AI Server dependencies installed
cd ..

REM Setup Frontend
echo.
echo Setting up React Frontend...
cd client
call npm install
echo ✓ Frontend dependencies installed
cd ..

echo.
echo ==========================================
echo ✓ Setup Complete!
echo ==========================================

echo.
echo Next Steps:
echo 1. Update configuration files:
echo    - server\.env
echo    - ai_server\.env
echo.
echo 2. Start services:
echo    Option A - Containerized (requires Docker):
echo       docker-compose up
echo.
echo    Option B - Manual (3 terminals/PowerShell windows needed):
echo       Terminal 1: cd server ^&^& npm run dev
echo       Terminal 2: cd ai_server ^&^& venv\Scripts\activate.bat ^&^& python -m uvicorn server:app --reload
echo       Terminal 3: cd client ^&^& npm run dev
echo.
echo 3. Access the application:
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:5000
echo    AI Server: http://localhost:7860
echo.
echo Documentation:
echo    - Full setup: PROJECT_SETUP_COMPLETE.md
echo    - API docs: server\docs\api.md
echo    - AI docs: ai_server\README.md
