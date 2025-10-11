@echo off
REM RE:MIND Production Setup Script for Windows
REM Run this script to set up RE:MIND for production deployment

echo 🚀 RE:MIND Production Setup
echo ============================

REM Check if Node.js is installed
echo 📋 Checking dependencies...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available

REM Install Vercel CLI if not installed
echo 📦 Installing Vercel CLI...
npm install -g vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Failed to install Vercel CLI. Please install manually:
    echo    npm install -g vercel
    pause
    exit /b 1
)

echo ✅ Vercel CLI installed

REM Check for environment file
echo 🔧 Checking environment configuration...
if not exist .env.local (
    echo ⚠️  .env.local not found. Creating from template...
    copy env.production.example .env.local >nul
    echo ✅ Created .env.local from template
    echo.
    echo ⚠️  IMPORTANT: Please edit .env.local with your actual values:
    echo    - Supabase URL and keys
    echo    - Database connection string
    echo    - Email configuration
    echo    - Push notification keys
    echo.
    pause
)

echo ✅ Environment file ready

REM Install dependencies
echo 📦 Installing project dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed

REM Run type checking
echo 🔍 Running type check...
npm run type-check
if %errorlevel% neq 0 (
    echo ❌ Type check failed. Please fix TypeScript errors first.
    pause
    exit /b 1
)

echo ✅ Type check passed

REM Run linting
echo 🔍 Running linter...
npm run lint
if %errorlevel% neq 0 (
    echo ⚠️  Linting issues found. Please fix them for production.
    echo    You can continue, but it's recommended to fix linting issues.
    pause
)

echo ✅ Linting completed

REM Test build
echo 🔍 Testing production build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix build errors first.
    pause
    exit /b 1
)

echo ✅ Build test passed

echo.
echo 🎉 RE:MIND is ready for production deployment!
echo.
echo 📋 Next steps:
echo 1. Edit .env.local with your actual configuration values
echo 2. Run: vercel login
echo 3. Run: vercel --prod
echo 4. Configure custom domain in Vercel dashboard
echo 5. Submit to app stores
echo 6. Launch marketing campaign
echo.
echo 🚀 Ready to revolutionize reminder apps with UP→DOWN feature!

pause
