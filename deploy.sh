#!/bin/bash

# Task Tracker - Vercel Deployment Setup

echo "🚀 Task Tracker - Vercel Deployment Setup"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo ""
fi

# Check if GitHub remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  GitHub remote not configured"
    echo "To set up GitHub remote, run:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git"
    echo ""
fi

# Check requirements
echo "✅ Checking requirements..."
echo "   - Python: $(python --version 2>&1)"
echo "   - Node.js: $(node --version 2>&1)"
echo "   - npm: $(npm --version 2>&1)"
echo ""

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo "✅ Frontend dependencies installed"
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
pip install -r requirements.txt
echo "✅ Backend dependencies installed"
echo ""

# Instructions
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. Commit changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Initial commit: Task Tracker with Vercel support'"
echo "   git push -u origin main"
echo ""
echo "2. Go to https://vercel.com"
echo "3. Click 'New Project' and import your GitHub repository"
echo "4. Configure:"
echo "   - Framework: Vite"
echo "   - Root Directory: ./frontend"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo ""
echo "5. Add Environment Variables in Vercel:"
echo "   - VITE_API_URL: https://your-project.vercel.app/api"
echo "   - DATABASE_URL: sqlite:///./tasks.db (or your database URL)"
echo ""
echo "6. Deploy!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_VERCEL.md"
echo ""
