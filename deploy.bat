@echo off
REM Task Tracker - Vercel Deployment Setup for Windows

echo.
echo 🚀 Task Tracker - Vercel Deployment Setup
echo ======================================
echo.

REM Check if git is initialized
if not exist .git (
    echo 📦 Initializing Git repository...
    git init
    echo.
)

REM Check requirements
echo ✅ Checking requirements...
echo    - Python: 
python --version
echo    - Node.js: 
node --version
echo    - npm: 
npm --version
echo.

REM Frontend setup
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo ✅ Frontend dependencies installed
echo.

REM Backend setup
echo 📦 Installing backend dependencies...
pip install -r requirements.txt
echo ✅ Backend dependencies installed
echo.

REM Instructions
echo 🎯 Next Steps:
echo ==============
echo.
echo 1. Commit changes to GitHub:
echo    git add .
echo    git commit -m "Initial commit: Task Tracker with Vercel support"
echo    git push -u origin main
echo.
echo 2. Go to https://vercel.com
echo 3. Click 'New Project' and import your GitHub repository
echo 4. Configure:
echo    - Framework: Vite
echo    - Root Directory: ./frontend
echo    - Build Command: npm run build
echo    - Output Directory: dist
echo.
echo 5. Add Environment Variables in Vercel:
echo    - VITE_API_URL: https://your-project.vercel.app/api
echo    - DATABASE_URL: sqlite:///./tasks.db (or your database URL)
echo.
echo 6. Deploy!
echo.
echo 📖 For detailed instructions, see DEPLOYMENT_VERCEL.md
echo.
