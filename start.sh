#!/bin/bash

echo "===================================="
echo "Nagrik AI - Full Stack Application"
echo "===================================="
echo ""
echo "Starting Backend Server..."
echo ""

cd c:/Users/sande/OneDrive/Desktop/Nagrik_AI/server
npm run dev &
BACKEND_PID=$!
sleep 3

echo ""
echo "Starting Frontend Server..."
echo ""

cd c:/Users/sande/OneDrive/Desktop/Nagrik_AI/client
npm start &
FRONTEND_PID=$!

echo ""
echo "===================================="
echo "✅ Both servers are starting!"
echo "===================================="
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"

wait
