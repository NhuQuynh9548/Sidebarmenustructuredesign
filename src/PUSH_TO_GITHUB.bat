@echo off
REM ========================================
REM BLUEBOLT Finance - GitHub Push Script
REM For Windows
REM ========================================

title BLUEBOLT Finance - GitHub Push

echo.
echo ========================================
echo BLUEBOLT Finance - GitHub Push Script
echo ========================================
echo.

REM Step 1: Check Git installation
echo Step 1: Checking Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed!
    echo Please install Git from https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git is installed
echo.

REM Step 2: Check Git configuration
echo Step 2: Checking Git configuration...
for /f "tokens=*" %%i in ('git config --global user.name') do set GIT_NAME=%%i
for /f "tokens=*" %%i in ('git config --global user.email') do set GIT_EMAIL=%%i

if "%GIT_NAME%"=="" (
    echo [WARN] Git user name not configured
    set /p GIT_NAME="Enter your name: "
    git config --global user.name "%GIT_NAME%"
)
if "%GIT_EMAIL%"=="" (
    echo [WARN] Git email not configured
    set /p GIT_EMAIL="Enter your email: "
    git config --global user.email "%GIT_EMAIL%"
)
echo [INFO] Git user: %GIT_NAME% ^<%GIT_EMAIL%^>
echo.

REM Step 3: Get repository URL
echo Step 3: GitHub repository setup...
echo [INFO] Create a repository on GitHub first if you haven't
echo [INFO] Repository URL format: https://github.com/YOUR_USERNAME/bluebolt-finance.git
echo.
set /p REPO_URL="Enter your GitHub repository URL: "

if "%REPO_URL%"=="" (
    echo [ERROR] Repository URL is required!
    pause
    exit /b 1
)
echo.

REM Step 4: Initialize Git
echo Step 4: Initializing Git repository...
if not exist ".git" (
    git init
    echo [OK] Git repository initialized
) else (
    echo [INFO] Git repository already initialized
)
echo.

REM Step 5: Sensitive files check
echo Step 5: Checking for sensitive files...
echo [WARN] Make sure these are NOT being committed:
echo   - .env files
echo   - node_modules/
echo   - API keys or secrets
echo.
set /p CONFIRM="Have you reviewed sensitive files? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo [ERROR] Please review sensitive files first
    pause
    exit /b 1
)
echo [OK] Sensitive files check passed
echo.

REM Step 6: Add files
echo Step 6: Adding files to Git...
git add .
echo [OK] All files staged
echo.

REM Step 7: Show status
echo Step 7: Files to be committed:
git status --short
echo.
set /p PROCEED="Proceed with these files? (y/n): "
if /i not "%PROCEED%"=="y" (
    echo [ERROR] Commit cancelled
    pause
    exit /b 1
)
echo.

REM Step 8: Create commit
echo Step 8: Creating commit...
git commit -m "Initial commit: BLUEBOLT Financial Management System" -m "Complete React + TypeScript + Tailwind CSS application with:" -m "- Dashboard with charts and KPIs" -m "- Business Units management with drag & drop" -m "- Transaction management with auto-generated codes" -m "- Employee and Partner management" -m "- Admin panel with user management" -m "- Master data modules" -m "- Supabase backend integration" -m "- Role-based access control" -m "- Comprehensive documentation"

if %errorlevel% equ 0 (
    echo [OK] Commit created successfully
) else (
    echo [ERROR] Commit failed
    pause
    exit /b 1
)
echo.

REM Step 9: Add remote
echo Step 9: Adding remote repository...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

if %errorlevel% equ 0 (
    echo [OK] Remote repository added: %REPO_URL%
) else (
    echo [ERROR] Failed to add remote repository
    pause
    exit /b 1
)
echo.

REM Step 10: Create main branch
echo Step 10: Setting up main branch...
git branch -M main
echo [OK] Main branch created
echo.

REM Step 11: Push to GitHub
echo Step 11: Pushing to GitHub...
echo [WARN] You may need to enter your GitHub credentials
echo [INFO] Note: Use Personal Access Token as password (not account password)
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo SUCCESS! Your project is now on GitHub
    echo ==========================================
    echo.
    echo [INFO] Repository URL: %REPO_URL%
    echo [INFO] View your project: %REPO_URL:.git=%
    echo.
    echo [INFO] Next steps:
    echo   1. Visit your repository on GitHub
    echo   2. Add topics/tags to your repo
    echo   3. Add collaborators if needed
    echo   4. Setup GitHub Pages (optional)
    echo   5. Deploy to production (Vercel/Netlify)
    echo.
) else (
    echo.
    echo [ERROR] Push failed
    echo.
    echo [WARN] Common issues:
    echo   1. Authentication failed - Use Personal Access Token
    echo   2. Repository already exists - Use 'git push -f' to force
    echo   3. Network issues - Check internet connection
    echo.
    echo [INFO] To create Personal Access Token:
    echo   GitHub -^> Settings -^> Developer settings -^> Personal access tokens
    echo   Generate new token -^> Select 'repo' scope -^> Copy token
    echo   Use token as password when pushing
    echo.
    pause
    exit /b 1
)

REM Step 12: Summary
echo ========================================
echo Summary:
echo   - Repository: %REPO_URL%
echo   - Branch: main
echo.
echo [OK] All done! Happy coding!
echo ========================================
echo.
pause
