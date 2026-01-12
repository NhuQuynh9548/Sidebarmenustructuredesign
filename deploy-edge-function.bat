@echo off
REM Script để deploy Edge Function lên Supabase
REM Cách sử dụng: deploy-edge-function.bat YOUR_PROJECT_REF

setlocal

echo ==========================================
echo Deploy Supabase Edge Function
echo ==========================================
echo.

REM Kiểm tra xem có project ref không
if "%~1"=="" (
    echo ❌ Lỗi: Vui lòng cung cấp Project Reference ID
    echo.
    echo Cách sử dụng:
    echo   deploy-edge-function.bat YOUR_PROJECT_REF
    echo.
    echo Ví dụ:
    echo   deploy-edge-function.bat lnkcxrkwfcgpjrjrkqqw
    echo.
    exit /b 1
)

set PROJECT_REF=%~1

echo 📋 Project Reference ID: %PROJECT_REF%
echo.

REM Kiểm tra xem đã cài Supabase CLI chưa
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Lỗi: Supabase CLI chưa được cài đặt
    echo.
    echo Cài đặt Supabase CLI:
    echo   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
    echo   scoop install supabase
    echo.
    exit /b 1
)

echo ✅ Supabase CLI đã được cài đặt
echo.

REM Kiểm tra xem đã login chưa
echo 🔐 Kiểm tra đăng nhập...
supabase projects list >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Chưa đăng nhập vào Supabase
    echo Đang mở trình duyệt để đăng nhập...
    supabase login
)

echo ✅ Đã đăng nhập thành công
echo.

REM Link project
echo 🔗 Đang link với project...
supabase link --project-ref %PROJECT_REF%

echo.
echo ✅ Link project thành công
echo.

REM Deploy function
echo 🚀 Đang deploy Edge Function...
echo Function name: make-server-393f5b29
echo.

supabase functions deploy make-server-393f5b29 --no-verify-jwt

echo.
echo ==========================================
echo ✅ Deploy thành công!
echo ==========================================
echo.
echo 📍 Function URL:
echo    https://%PROJECT_REF%.supabase.co/functions/v1/make-server-393f5b29
echo.
echo 🧪 Test endpoint health:
echo    curl https://%PROJECT_REF%.supabase.co/functions/v1/make-server-393f5b29/health
echo.
echo 🌱 Seed dữ liệu mẫu:
echo    curl -X POST https://%PROJECT_REF%.supabase.co/functions/v1/make-server-393f5b29/seed
echo.

endlocal
