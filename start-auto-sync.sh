#!/bin/bash
# FundiMatch Auto-Sync Startup Script
# ===================================
# This script starts all services with automatic database synchronization

echo "🚀 FundiMatch Auto-Sync Startup Script"
echo "======================================"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $JSON_SERVER_PID $REACT_PID $AUTO_SYNC_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if required files exist
if [ ! -f "db.json" ]; then
    echo "❌ db.json not found!"
    exit 1
fi

if [ ! -f "lib/db/auto_sync.py" ]; then
    echo "❌ auto_sync.py not found!"
    exit 1
fi

# Start JSON Server
echo "📊 Starting JSON Server..."
npx json-server --watch db.json --port 3001 &
JSON_SERVER_PID=$!
echo "✅ JSON Server started (PID: $JSON_SERVER_PID)"

# Wait for JSON Server to start
sleep 2

# Start Auto-Sync (Python)
echo "🔄 Starting Auto-Sync..."
pipenv run python lib/db/auto_sync.py --watch --interval 3 &
AUTO_SYNC_PID=$!
echo "✅ Auto-Sync started (PID: $AUTO_SYNC_PID)"

# Wait for auto-sync to initialize
sleep 3

# Start React Development Server
echo "🌐 Starting React Development Server..."
npm run dev &
REACT_PID=$!
echo "✅ React Development Server started (PID: $REACT_PID)"

echo ""
echo "🎉 All services started successfully!"
echo "======================================"
echo "📊 JSON Server: http://localhost:3001"
echo "🌐 React App: http://localhost:5173"
echo "🔄 Auto-Sync: Running (checking every 3 seconds)"
echo ""
echo "📝 What happens now:"
echo "  • Add data through React app → automatically saved to db.json"
echo "  • Auto-sync detects changes → automatically updates SQLite database"
echo "  • CLI can access latest data without manual sync"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
wait
