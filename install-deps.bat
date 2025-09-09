@echo off
echo Installing dependencies...
echo.

echo Step 1: Installing dotenv...
npm install dotenv@^16.5.0 --no-optional --no-audit --no-fund
if %errorlevel% neq 0 (
    echo Failed to install dotenv
    pause
    exit /b 1
)

echo Step 2: Installing express...
npm install express@^4.18.2 --no-optional --no-audit --no-fund
if %errorlevel% neq 0 (
    echo Failed to install express
    pause
    exit /b 1
)

echo Step 3: Installing sqlite3...
npm install sqlite3@^5.1.7 --no-optional --no-audit --no-fund
if %errorlevel% neq 0 (
    echo Failed to install sqlite3
    pause
    exit /b 1
)

echo Step 4: Installing puppeteer...
npm install puppeteer@^21.0.0 --no-optional --no-audit --no-fund
if %errorlevel% neq 0 (
    echo Failed to install puppeteer
    pause
    exit /b 1
)

echo Step 5: Installing node-cron...
npm install node-cron@^3.0.3 --no-optional --no-audit --no-fund
if %errorlevel% neq 0 (
    echo Failed to install node-cron
    pause
    exit /b 1
)

echo.
echo All dependencies installed successfully!
echo.
pause
