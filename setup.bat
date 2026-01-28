@echo off
echo ========================================
echo Task Tracker - Automated Setup Script
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python 3 is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo [INFO] Setting up Backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt --quiet

echo [SUCCESS] Backend setup complete!
echo.

REM Go back to root
cd ..

echo [INFO] Setting up Frontend...
cd frontend

REM Install Node dependencies
if not exist "node_modules" (
    echo Installing Node dependencies...
    call npm install
) else (
    echo Node modules already installed, skipping...
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
)

echo [SUCCESS] Frontend setup complete!
echo.

REM Go back to root
cd ..

echo =========================================
echo [SUCCESS] Setup Complete!
echo =========================================
echo.
echo Starting servers...
echo.
echo Backend will run on: http://localhost:8000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate.bat && python main.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo.
pause
