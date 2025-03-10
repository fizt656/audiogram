@echo off
echo ===================================
echo NeuroSonic Project Runner
echo ===================================
echo.

echo Starting backend server...
start cmd /k "call venv\Scripts\activate && cd src\backend && python app.py"

echo Starting frontend development server...
start cmd /k "cd src\frontend && npm start"

echo.
echo ===================================
echo Servers are starting!
echo.
echo The frontend will automatically open in your default browser.
echo If it doesn't, navigate to: http://localhost:3000
echo.
echo Press Ctrl+C in each terminal window to stop the servers when done.
echo ===================================
