@echo off
echo Stopping any process on port 5000...
npx kill-port 5000

echo.
echo Starting backend server...
cd backend
npm start
