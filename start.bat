@echo off
echo ==================================
echo Nagrik AI - Full Stack Application
echo ==================================
echo.
echo Starting Backend Server...
echo.
cd /d C:\Users\sande\OneDrive\Desktop\Nagrik_AI\server
start "Nagrik AI Backend" cmd /k npm run dev
timeout /t 3
echo.
echo Starting Frontend Server...
echo.
cd /d C:\Users\sande\OneDrive\Desktop\Nagrik_AI\client
start "Nagrik AI Frontend" cmd /k npm start
timeout /t 2
echo.
echo ==================================
echo ✅ Both servers are starting!
echo ==================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C in either terminal to stop the server
pause
