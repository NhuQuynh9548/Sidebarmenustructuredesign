#!/bin/bash

# Script để deploy Edge Function lên Supabase
# Cách sử dụng: ./deploy-edge-function.sh YOUR_PROJECT_REF

set -e

echo "=========================================="
echo "Deploy Supabase Edge Function"
echo "=========================================="
echo ""

# Kiểm tra xem có project ref không
if [ -z "$1" ]; then
    echo "❌ Lỗi: Vui lòng cung cấp Project Reference ID"
    echo ""
    echo "Cách sử dụng:"
    echo "  ./deploy-edge-function.sh YOUR_PROJECT_REF"
    echo ""
    echo "Ví dụ:"
    echo "  ./deploy-edge-function.sh lnkcxrkwfcgpjrjrkqqw"
    echo ""
    exit 1
fi

PROJECT_REF=$1

echo "📋 Project Reference ID: $PROJECT_REF"
echo ""

# Kiểm tra xem đã cài Supabase CLI chưa
if ! command -v supabase &> /dev/null; then
    echo "❌ Lỗi: Supabase CLI chưa được cài đặt"
    echo ""
    echo "Cài đặt Supabase CLI:"
    echo "  macOS:   brew install supabase/tap/supabase"
    echo "  Windows: scoop install supabase"
    echo "  Linux:   brew install supabase/tap/supabase"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI đã được cài đặt"
echo ""

# Kiểm tra xem đã login chưa
echo "🔐 Kiểm tra đăng nhập..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Chưa đăng nhập vào Supabase"
    echo "Đang mở trình duyệt để đăng nhập..."
    supabase login
fi

echo "✅ Đã đăng nhập thành công"
echo ""

# Link project
echo "🔗 Đang link với project..."
supabase link --project-ref $PROJECT_REF

echo ""
echo "✅ Link project thành công"
echo ""

# Deploy function
echo "🚀 Đang deploy Edge Function..."
echo "Function name: make-server-393f5b29"
echo ""

supabase functions deploy make-server-393f5b29 --no-verify-jwt

echo ""
echo "=========================================="
echo "✅ Deploy thành công!"
echo "=========================================="
echo ""
echo "📍 Function URL:"
echo "   https://$PROJECT_REF.supabase.co/functions/v1/make-server-393f5b29"
echo ""
echo "🧪 Test endpoint health:"
echo "   curl https://$PROJECT_REF.supabase.co/functions/v1/make-server-393f5b29/health"
echo ""
echo "🌱 Seed dữ liệu mẫu:"
echo "   curl -X POST https://$PROJECT_REF.supabase.co/functions/v1/make-server-393f5b29/seed"
echo ""
