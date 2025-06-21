#!/bin/bash

# SprintFlow Development Startup Script
# This script starts both backend and frontend servers

set -e

echo "🚀 Starting SprintFlow Development Environment..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first."
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    pnpm install
fi

if [ ! -d "apps/server/node_modules" ]; then
    echo "Installing server dependencies..."
    cd apps/server && pnpm install && cd ../..
fi

if [ ! -d "apps/web/node_modules" ]; then
    echo "Installing web dependencies..."
    cd apps/web && pnpm install && cd ../..
fi

# Start backend server
echo "🔧 Starting backend server (port 3001)..."
cd apps/server
pnpm run start:dev &
BACKEND_PID=$!
cd ../..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if ! curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "⚠️  Backend might not be ready yet, continuing..."
fi

# Start frontend server
echo "🌐 Starting frontend server (port 3000)..."
cd apps/web
pnpm run dev &
FRONTEND_PID=$!
cd ../..

# Wait a moment for frontend to start
sleep 3

echo ""
echo "✅ Development servers started!"
echo "================================================"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001/api"
echo "📚 API Documentation: http://localhost:3001/api/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "================================================"

# Wait for user to stop
wait 