@echo off
echo Starting PDF Editor...

:: Start Backend
start "PDF Editor Backend" cmd /k "cd backend && venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload --host 0.0.0.0"

:: Start Frontend
start "PDF Editor Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo Servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
pause
