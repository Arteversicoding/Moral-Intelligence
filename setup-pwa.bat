@echo off
echo ========================================
echo    PWA Setup - Moral Intelligence
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js found
)

echo.
echo [2/4] Installing PWA dependencies...
npm install --save-dev sharp
if errorlevel 1 (
    echo ⚠️  Sharp installation failed, continuing with SVG icons...
) else (
    echo ✅ Sharp installed successfully
)

echo.
echo [3/4] Generating PWA icons...
node create-icons.cjs
if errorlevel 1 (
    echo ❌ Icon generation failed
    pause
    exit /b 1
) else (
    echo ✅ Icons generated successfully
)

echo.
echo [4/4] Setting up web server for testing...
echo Starting local development server...
echo.
echo 🌐 Your PWA is ready to test!
echo.
echo Open your browser and go to:
echo   http://localhost:8080
echo.
echo To test PWA installation:
echo 1. Open the website in Chrome/Edge on mobile or desktop
echo 2. Look for "Install App" button on login page
echo 3. Click to install as PWA
echo.
echo Press Ctrl+C to stop the server
echo.

REM Try different methods to start a simple web server
python -c "import http.server; import socketserver; socketserver.TCPServer(('', 8080), http.server.SimpleHTTPRequestHandler).serve_forever()" 2>nul || (
    python -m http.server 8080 2>nul || (
        python3 -m http.server 8080 2>nul || (
            php -S localhost:8080 2>nul || (
                echo ❌ No suitable web server found.
                echo Please install Python or PHP, or use:
                echo   npx serve . -p 8080
                pause
            )
        )
    )
)
