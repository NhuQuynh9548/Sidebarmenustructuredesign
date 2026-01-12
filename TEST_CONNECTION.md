# Hướng Dẫn Test Kết Nối Supabase

Sau khi cấu hình Supabase, bạn có thể test kết nối bằng nhiều cách:

## Cách 1: Sử dụng Trang Test Trong Ứng Dụng (Khuyến Nghị)

### Bước 1: Chạy Ứng Dụng
```bash
npm run dev
```

### Bước 2: Truy Cập Trang Test
1. Mở browser tại `http://localhost:5173`
2. Đăng nhập bằng tài khoản bất kỳ (hoặc chưa cần đăng nhập)
3. Truy cập: `http://localhost:5173/test-connection`

### Bước 3: Chạy Tests
- Click nút **"Chạy Test Kết Nối"**
- Đợi khoảng 5-10 giây
- Xem kết quả từng test

### Kết Quả Mong Đợi

Nếu thành công, bạn sẽ thấy:
- ✅ **Test 1**: Kiểm tra cấu hình .env - PASS
- ✅ **Test 2**: Edge Function Health Check - PASS
- ✅ **Test 3**: Đọc Business Units - PASS (hiển thị số lượng records)
- ✅ **Test 4**: Đọc Transactions - PASS (hiển thị số lượng records)

Và thông báo: **🎉 Hoàn Hảo! Tất cả tests đều PASS!**

---

## Cách 2: Test Bằng Browser Console

### Test Health Check
1. Mở DevTools (F12)
2. Vào tab **Console**
3. Paste và chạy code:

```javascript
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-393f5b29/health', {
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(data => console.log('Health Check:', data))
.catch(err => console.error('Error:', err));
```

**Thay thế**:
- `YOUR_PROJECT_ID` với Project ID của bạn
- `YOUR_ANON_KEY` với anon key của bạn

**Kết quả mong đợi**: `{status: "ok"}`

### Test Business Units
```javascript
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-393f5b29/business-units', {
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(data => console.log('Business Units:', data))
.catch(err => console.error('Error:', err));
```

**Kết quả mong đợi**: `{success: true, data: [...]}`

---

## Cách 3: Test Bằng cURL

### Health Check
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-393f5b29/health \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Business Units
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-393f5b29/business-units \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Transactions
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-393f5b29/transactions \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

## Cách 4: Test Seed Data (Tạo Dữ Liệu Mẫu)

Nếu database trống, bạn có thể seed dữ liệu mẫu:

```bash
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-393f5b29/seed \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Kết quả**: Tạo 5 Business Units mẫu

---

## Xử Lý Lỗi

### Lỗi: "Failed to fetch" hoặc CORS error

**Nguyên nhân**: Edge Function chưa deploy hoặc CORS chưa được cấu hình

**Giải pháp**:
1. Kiểm tra Edge Function đã deploy chưa:
   ```bash
   supabase functions list
   ```
2. Nếu chưa, deploy lại:
   ```bash
   supabase functions deploy make-server-393f5b29 --no-verify-jwt
   ```

### Lỗi: 401 Unauthorized

**Nguyên nhân**: Anon key không đúng hoặc đã hết hạn

**Giải pháp**:
1. Vào Supabase Dashboard > Settings > API
2. Copy lại **anon public key**
3. Cập nhật file `.env` và `src/utils/supabase/info.tsx`

### Lỗi: "Function not found"

**Nguyên nhân**: Edge Function chưa được deploy

**Giải pháp**:
1. Chạy deploy script:
   - macOS/Linux: `./deploy-edge-function.sh YOUR_PROJECT_ID`
   - Windows: `deploy-edge-function.bat YOUR_PROJECT_ID`

### Test trả về dữ liệu rỗng (count: 0)

**Nguyên nhân**: Database chưa có dữ liệu

**Giải pháp**:
1. Chạy seed endpoint để tạo dữ liệu mẫu
2. Hoặc tạo dữ liệu thủ công trong ứng dụng

---

## Checklist Test Kết Nối

- [ ] File `.env` đã cập nhật đúng URL và key
- [ ] File `src/utils/supabase/info.tsx` đã cập nhật
- [ ] Edge Function đã deploy thành công
- [ ] Health check trả về `{status: "ok"}`
- [ ] Business Units endpoint hoạt động
- [ ] Transactions endpoint hoạt động
- [ ] Có thể tạo/sửa/xóa dữ liệu trong ứng dụng

---

## Kết Luận

Nếu tất cả tests đều PASS, chúc mừng! Bạn đã kết nối thành công Supabase.

Giờ bạn có thể:
- ✅ Đăng nhập vào ứng dụng
- ✅ Tạo Business Units mới
- ✅ Quản lý nhân sự, đối tác, thu chi
- ✅ Xem dashboard và báo cáo

**Next Steps**:
1. Đăng nhập với tài khoản demo
2. Khám phá các tính năng
3. Tạo dữ liệu thực tế
4. Deploy lên production (nếu cần)
