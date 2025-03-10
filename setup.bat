@echo off
echo ===================================
echo NeuroSonic Project Setup
echo ===================================
echo.

echo Creating Python virtual environment...
python -m venv venv
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Setting up frontend...
cd src\frontend
echo Installing Node.js dependencies...
npm install

echo.
echo ===================================
echo Setup complete!
echo.
echo To run the application:
echo.
echo 1. Start the backend server:
echo    call venv\Scripts\activate
echo    cd src\backend
echo    python app.py
echo.
echo 2. In a new terminal, start the frontend:
echo    cd src\frontend
echo    npm start
echo.
echo 3. Open your browser and navigate to:
echo    http://localhost:3000
echo ===================================
