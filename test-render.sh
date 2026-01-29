#!/bin/bash

# Task Tracker - Render Deployment Test Script
# This script helps you test your application locally before deploying to Render

set -e  # Exit on error

echo "🚀 Task Tracker - Local Test for Render Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
echo "1️⃣  Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Python found: $PYTHON_VERSION"
else
    echo -e "${RED}✗${NC} Python 3 is not installed. Please install Python 3.9+"
    exit 1
fi

# Check if Node.js is installed
echo ""
echo "2️⃣  Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js found: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

# Install backend dependencies
echo ""
echo "3️⃣  Installing backend dependencies..."
cd backend
if pip3 install -r requirements.txt; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${RED}✗${NC} Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo ""
echo "4️⃣  Installing frontend dependencies..."
cd frontend
if npm install; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${RED}✗${NC} Failed to install frontend dependencies"
    exit 1
fi
cd ..

# Test backend build
echo ""
echo "5️⃣  Testing backend startup..."
cd backend
export DATABASE_URL="sqlite:///./test_tasks.db"
timeout 5 uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
sleep 3

if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓${NC} Backend starts successfully"
    kill $BACKEND_PID 2>/dev/null || true
else
    echo -e "${RED}✗${NC} Backend failed to start"
    exit 1
fi
cd ..

# Test frontend build
echo ""
echo "6️⃣  Testing frontend build..."
cd frontend
if npm run build; then
    echo -e "${GREEN}✓${NC} Frontend builds successfully"
    echo "   Build output: frontend/dist"
else
    echo -e "${RED}✗${NC} Frontend build failed"
    exit 1
fi
cd ..

# Check render.yaml
echo ""
echo "7️⃣  Checking render.yaml configuration..."
if [ -f "render.yaml" ]; then
    echo -e "${GREEN}✓${NC} render.yaml found"
else
    echo -e "${RED}✗${NC} render.yaml not found"
    exit 1
fi

# Summary
echo ""
echo "=================================================="
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "Your application is ready to deploy to Render!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub/GitLab"
echo "2. Go to https://dashboard.render.com/"
echo "3. Click 'New +' → 'Blueprint'"
echo "4. Connect your repository"
echo "5. Render will detect render.yaml and set up everything automatically"
echo ""
echo "For detailed instructions, see DEPLOYMENT_RENDER.md"
echo ""
