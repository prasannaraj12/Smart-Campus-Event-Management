@echo off
echo ========================================
echo   CampusConnect - Starting Dev Servers
echo ========================================
echo.
echo This will open TWO terminal windows:
echo   1. Convex Backend Server
echo   2. React Frontend Server
echo.
echo Press any key to continue...
pause > nul

echo.
echo Starting Convex Backend...
start cmd /k "title Convex Backend && npx convex dev"

timeout /t 3 > nul

echo Starting React Frontend...
start cmd /k "title React Frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo.
echo Convex Backend: Check the first terminal
echo React Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
