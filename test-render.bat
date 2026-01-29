@echo off
REM Task Tracker - Render Deployment Test Script (Windows)
REM This script helps you test your application locally before deploying to Render

echo.
echo ========================================
echo Task Tracker - Local Test for Render
echo ========================================
echo.

REM Check Python installation
echo 1. Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo [OK] Python found: %PYTHON_VERSION%
echo.

REM Check Node.js installation
echo 2. Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%
echo.

REM Install backend dependencies
echo 3. Installing backend dependencies...
cd backend
pip install -r requirements.txt >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
cd ..
echo.

REM Install frontend dependencies
echo 4. Installing frontend dependencies...
cd frontend
call npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
cd ..
echo.

REM Test frontend build
echo 5. Testing frontend build...
cd frontend
call npm run build >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend builds successfully
echo     Build output: frontend\dist
cd ..
echo.

REM Check render.yaml
echo 6. Checking render.yaml configuration...
if not exist "render.yaml" (
    echo [ERROR] render.yaml not found
    pause
    exit /b 1
)
echo [OK] render.yaml found
echo.

REM Summary
echo ========================================
echo [SUCCESS] All tests passed!
echo ========================================
echo.
echo Your application is ready to deploy to Render!
echo.
echo Next steps:
echo 1. Push your code to GitHub/GitLab
echo 2. Go to https://dashboard.render.com/
echo 3. Click 'New +' -^> 'Blueprint'
echo 4. Connect your repository
echo 5. Render will detect render.yaml and set up everything automatically
echo.
echo For detailed instructions, see DEPLOYMENT_RENDER.md
echo.
pause
