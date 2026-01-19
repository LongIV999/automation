#!/bin/bash
# Start both WebSocket monitor and HTTP dashboard server

echo "🚀 Starting Workflow Monitor System..."

# Start WebSocket monitor
node scripts/workflow-monitor/monitor.js &
MONITOR_PID=$!
echo "✅ WebSocket Monitor started (PID: $MONITOR_PID)"

# Wait a bit for monitor to initialize
sleep 2

# Start HTTP dashboard server
node scripts/workflow-monitor/server.js &
SERVER_PID=$!
echo "✅ HTTP Dashboard Server started (PID: $SERVER_PID)"

echo ""
echo "📊 Workflow Monitor: ws://localhost:3001"
echo "📈 Dashboard: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait
