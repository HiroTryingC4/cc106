@echo off
echo Stopping any process on port 3000...
npx kill-port 3000

echo.
echo Starting frontend server...
cd frontend
npm start
