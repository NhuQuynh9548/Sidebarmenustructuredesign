# Bắt Đầu - START HERE

Chào mừng bạn đến với BlueBolt Management System!

## Bạn cần làm gì trước tiên?

### Nếu bạn muốn kết nối Supabase của riêng bạn:

1. **Đọc Quick Start** (5 phút): [QUICK_START_SUPABASE.md](./QUICK_START_SUPABASE.md)
2. **Hoặc hướng dẫn chi tiết**: [HUONG_DAN_KET_NOI_SUPABASE.md](./HUONG_DAN_KET_NOI_SUPABASE.md)

### Các file quan trọng cần biết:

| File | Mô Tả |
|------|-------|
| `README.md` | Tổng quan về project, tính năng, công nghệ |
| `QUICK_START_SUPABASE.md` | Hướng dẫn nhanh kết nối Supabase (5 phút) |
| `HUONG_DAN_KET_NOI_SUPABASE.md` | Hướng dẫn chi tiết từng bước với troubleshooting |
| `DATABASE_SETUP.md` | Hướng dẫn setup Postgres Database (tùy chọn) |
| `supabase_schema.sql` | File SQL để tạo tables trong Supabase (tùy chọn) |
| `.env.example` | Template file cấu hình (copy thành `.env`) |
| `deploy-edge-function.sh` | Script tự động deploy (macOS/Linux) |
| `deploy-edge-function.bat` | Script tự động deploy (Windows) |

### Thứ tự thực hiện:

```
1. Tạo Supabase project mới
   ↓
2. Lấy Project URL và anon key
   ↓
3. Cập nhật .env và src/utils/supabase/info.tsx
   ↓
4. Chạy script deploy:
   - macOS/Linux: ./deploy-edge-function.sh YOUR_PROJECT_REF
   - Windows: deploy-edge-function.bat YOUR_PROJECT_REF
   ↓
5. npm install && npm run dev
   ↓
6. Đăng nhập với tài khoản demo và test
```

## Cần Hỗ Trợ?

- Lỗi kết nối? → Xem phần "Xử Lý Lỗi" trong `HUONG_DAN_KET_NOI_SUPABASE.md`
- Không biết bắt đầu từ đâu? → Đọc `QUICK_START_SUPABASE.md`
- Muốn hiểu chi tiết? → Đọc `HUONG_DAN_KET_NOI_SUPABASE.md`

## Tài Khoản Demo

Sau khi setup xong, đăng nhập bằng:
- **Email**: `ceo@bluebolt.vn`
- **Password**: `ceo123`

---

**Chúc bạn thành công!** 🚀

Nếu gặp khó khăn, đọc kỹ hướng dẫn hoặc kiểm tra phần troubleshooting.
