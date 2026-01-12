# 🚀 Hướng Dẫn Deploy Edge Function

**VẤN ĐỀ**: Bạn không thể lấy dữ liệu từ Supabase vì **Edge Function chưa được deploy**.

**GIẢI PHÁP**: Deploy Edge Function lên Supabase theo các bước dưới đây.

---

## ⚡ Cách Nhanh Nhất (Khuyến Nghị)

### Bước 1: Cài Supabase CLI

**macOS/Linux:**
```bash
brew install supabase/tap/supabase
```

**Windows (với Scoop):**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Windows (với NPM):**
```bash
npm install -g supabase
```

### Bước 2: Chạy Script Deploy

**macOS/Linux:**
```bash
chmod +x deploy-edge-function.sh
./deploy-edge-function.sh geaklirrfdhdrqunjjjz
```

**Windows:**
```bash
deploy-edge-function.bat geaklirrfdhdrqunjjjz
```

### Bước 3: Đăng Nhập Supabase

Script sẽ tự động mở browser để bạn đăng nhập vào Supabase.
- Đăng nhập bằng tài khoản Supabase của bạn
- Cho phép CLI access

### Bước 4: Chờ Deploy Hoàn Tất

Script sẽ tự động:
- Link với project của bạn
- Deploy Edge Function
- Hiển thị URL của function

### Bước 5: Test Kết Nối

**Cách 1 - Dùng cURL:**
```bash
curl https://geaklirrfdhdrqunjjjz.supabase.co/functions/v1/make-server-393f5b29/health
```

Kết quả mong đợi: `{"status":"ok"}`

**Cách 2 - Dùng Node.js:**
```bash
node test-connection.js
```

**Cách 3 - Dùng Browser:**
Mở file: `debug-connection.html` trong browser và click "Chạy Tất Cả Tests"

**Cách 4 - Trong Ứng Dụng:**
```bash
npm run dev
```
Truy cập: http://localhost:5173/test-connection

---

## 📝 Chi Tiết Từng Bước

### 1. Cài Đặt Supabase CLI

#### macOS (Homebrew)
```bash
# Cài Homebrew nếu chưa có
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Cài Supabase CLI
brew install supabase/tap/supabase

# Kiểm tra
supabase --version
```

#### Windows (Scoop)
```bash
# Cài Scoop nếu chưa có
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Cài Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Kiểm tra
supabase --version
```

#### Linux (Homebrew)
```bash
# Cài Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Cài Supabase CLI
brew install supabase/tap/supabase

# Kiểm tra
supabase --version
```

### 2. Đăng Nhập Supabase

```bash
supabase login
```

Lệnh này sẽ:
1. Mở browser tự động
2. Đưa bạn đến trang đăng nhập Supabase
3. Yêu cầu bạn cho phép CLI access
4. Lưu token vào máy của bạn

### 3. Link Project

```bash
supabase link --project-ref geaklirrfdhdrqunjjjz
```

Lệnh này sẽ kết nối CLI với project Supabase của bạn.

### 4. Deploy Edge Function

```bash
cd supabase/functions
supabase functions deploy make-server-393f5b29 --no-verify-jwt
```

Hoặc từ thư mục gốc:
```bash
supabase functions deploy make-server-393f5b29 --no-verify-jwt
```

**Lưu ý**: `--no-verify-jwt` cho phép function hoạt động mà không cần JWT verification (phù hợp với public endpoints).

### 5. Xác Nhận Deploy Thành Công

Sau khi deploy xong, bạn sẽ thấy:
```
✅ Deployed Function make-server-393f5b29 on project geaklirrfdhdrqunjjjz
📍 URL: https://geaklirrfdhdrqunjjjz.supabase.co/functions/v1/make-server-393f5b29
```

Test ngay:
```bash
curl https://geaklirrfdhdrqunjjjz.supabase.co/functions/v1/make-server-393f5b29/health
```

---

## 🔧 Xử Lý Lỗi

### Lỗi: "command not found: supabase"

**Nguyên nhân**: Chưa cài Supabase CLI

**Giải pháp**: Xem lại Bước 1 - Cài Supabase CLI

---

### Lỗi: "Not logged in"

**Nguyên nhân**: Chưa đăng nhập vào Supabase CLI

**Giải pháp**:
```bash
supabase login
```

---

### Lỗi: "Project not found"

**Nguyên nhân**: Project Reference ID không đúng hoặc bạn không có quyền truy cập

**Giải pháp**:
1. Kiểm tra Project Reference ID tại: Supabase Dashboard > Settings > General
2. Đảm bảo bạn đăng nhập đúng tài khoản Supabase
3. Kiểm tra quyền truy cập project

---

### Lỗi: "Function already exists"

**Nguyên nhân**: Function đã được deploy trước đó

**Giải pháp**: Deploy lại (sẽ overwrite):
```bash
supabase functions deploy make-server-393f5b29 --no-verify-jwt
```

---

### Lỗi: "CORS error" khi test

**Nguyên nhân**: CORS chưa được cấu hình trong function

**Giải pháp**: Function code đã có CORS headers sẵn, chỉ cần deploy lại:
```bash
supabase functions deploy make-server-393f5b29 --no-verify-jwt
```

---

## ✅ Checklist Deploy Thành Công

- [ ] Supabase CLI đã được cài đặt (`supabase --version` hoạt động)
- [ ] Đã đăng nhập Supabase CLI (`supabase login`)
- [ ] Project đã được link (`supabase link --project-ref geaklirrfdhdrqunjjjz`)
- [ ] Edge Function đã deploy thành công
- [ ] Health check trả về `{"status":"ok"}`
- [ ] Business Units API trả về dữ liệu

---

## 🎯 Sau Khi Deploy Xong

### Test Ngay Lập Tức

**Test 1: Health Check**
```bash
curl https://geaklirrfdhdrqunjjjz.supabase.co/functions/v1/make-server-393f5b29/health
```
Kết quả: `{"status":"ok"}`

**Test 2: Business Units**
```bash
curl https://geaklirrfdhdrqunjjjz.supabase.co/functions/v1/make-server-393f5b29/business-units
```
Kết quả: `{"success":true,"data":[...]}`

**Test 3: Seed Data (nếu database trống)**
```bash
curl -X POST https://geaklirrfdhdrqunjjjz.supabase.co/functions/v1/make-server-393f5b29/seed
```

**Test 4: Trong Ứng Dụng**
```bash
npm run dev
```
Vào: http://localhost:5173/test-connection

---

## 🚨 Nếu Vẫn Không Được

### Option 1: Deploy Thủ Công

1. Đăng nhập Supabase Dashboard: https://supabase.com/dashboard
2. Vào project của bạn
3. Vào **Edge Functions** (menu bên trái)
4. Click **Create new function**
5. Đặt tên: `make-server-393f5b29`
6. Copy code từ `supabase/functions/make-server-393f5b29/index.ts`
7. Paste vào editor và click **Deploy**

### Option 2: Liên Hệ Hỗ Trợ

Nếu tất cả các cách trên đều không được:
1. Screenshot các lỗi bạn gặp
2. Chạy `supabase --version` và gửi kết quả
3. Chạy `supabase projects list` và gửi kết quả
4. Tôi sẽ giúp bạn debug chi tiết hơn

---

## 📚 Tài Liệu Tham Khảo

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Deploying Functions](https://supabase.com/docs/guides/functions/deploy)
