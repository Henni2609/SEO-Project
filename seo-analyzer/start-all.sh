#!/bin/bash

echo "Starting SEO Analyzer Application..."
echo ""

# Start test page server
echo "Starting test page server on http://localhost:8000"
cd "$(dirname "$0")"
node test-server.js &
TEST_PID=$!

# Start backend server
echo "Starting backend API server on http://localhost:5000"
cd backend
npx ts-node src/server.ts &
BACKEND_PID=$!

# Start frontend server
echo "Starting frontend on http://localhost:5173"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "==================================="
echo "All servers are starting up..."
echo "==================================="
echo "Test Page: http://localhost:8000"
echo "Backend API: http://localhost:5000"
echo "Frontend UI: http://localhost:5173"
echo "==================================="
echo ""
echo "To test the analyzer, open http://localhost:5173"
echo "Then enter http://localhost:8000 as the URL to analyze"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "kill $TEST_PID $BACKEND_PID $FRONTEND_PID; exit" INT
wait
