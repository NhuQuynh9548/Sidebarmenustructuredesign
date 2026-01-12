# Quick Start - Hướng Dẫn Nhanh

## Khởi Chạy Ứng Dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

## Đăng Nhập

Khi truy cập ứng dụng lần đầu, bạn sẽ thấy trang đăng nhập. Sử dụng một trong các tài khoản demo sau:

### 1. CEO Account (Toàn quyền)
- **Email**: `ceo@bluebolt.vn`
- **Password**: `ceo123`
- **Quyền**: Xem tất cả BU, toàn quyền quản trị

### 2. Admin Account
- **Email**: `admin@bluebolt.vn`
- **Password**: `admin123`
- **Quyền**: Xem tất cả BU, toàn quyền quản trị

### 3. BU Manager - Software
- **Email**: `manager.software@bluebolt.vn`
- **Password**: `manager123`
- **Quyền**: Chỉ xem BU Software

### 4. BU Manager - Academy
- **Email**: `manager.academy@bluebolt.vn`
- **Password**: `manager123`
- **Quyền**: Chỉ xem BU Academy

### 5. BU Manager - Services
- **Email**: `manager.services@bluebolt.vn`
- **Password**: `manager123`
- **Quyền**: Chỉ xem BU Services

### 6. Employee Account
- **Email**: `employee@bluebolt.vn`
- **Password**: `employee123`
- **Quyền**: Quyền hạn chế, chỉ xem BU của mình

## Các Trang Chính

Sau khi đăng nhập, bạn có thể truy cập:

### 📊 Dashboard
- Tổng quan về thu chi, Business Units
- Biểu đồ và thống kê

### 🏢 Quản Lý BU
- Xem, thêm, sửa, xóa Business Units
- 5 BU đã có sẵn trong database

### 💰 Quản Lý Thu Chi
- Quản lý giao dịch thu/chi
- Tạo giao dịch mới
- Phê duyệt giao dịch

### 👥 Quản Lý Nhân Sự
- Quản lý thông tin nhân viên
- Phân bổ theo BU

### 🤝 Quản Lý Đối Tác
- Quản lý thông tin đối tác/khách hàng
- Phân loại đối tác

### ⚙️ Settings
- Kiểm tra kết nối database
- Xem thống kê dữ liệu
- Test connection

## Database Connection

Ứng dụng đã được kết nối với **Supabase Database**:

- ✅ Kết nối trực tiếp (không qua Edge Function)
- ✅ 6 bảng: business_units, employees, partners, transactions, users, master_data
- ✅ 5 Business Units đã có sẵn
- ✅ Build thành công

## Kiểm Tra Kết Nối

1. Đăng nhập bằng tài khoản CEO
2. Vào trang **Settings** (⚙️ ở menu)
3. Nhấn nút **"Kiểm tra lại"**
4. Nếu hiển thị **"Đã kết nối"** màu xanh → Thành công!

## Troubleshooting

### Giao diện không hiển thị
- ✅ ĐÃ FIX: Di chuyển AppProvider vào ProtectedRoute
- Build lại: `npm run build`

### Lỗi kết nối database
1. Kiểm tra file `.env`:
   ```
   VITE_SUPABASE_URL=https://ssjrpnziotdwhmxnljpm.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
2. Restart dev server: Ctrl+C rồi `npm run dev`

### Không đăng nhập được
- Kiểm tra email và password
- Sử dụng đúng tài khoản demo ở trên
- Clear localStorage: F12 → Application → Local Storage → Clear

## Tài Liệu Chi Tiết

- `SUPABASE_CONNECTION_GUIDE.md` - Hướng dẫn kết nối Supabase
- `HUONG_DAN_KET_NOI_SUPABASE.md` - Hướng dẫn setup project mới
- `README.md` - Tổng quan dự án

## Đã Fix

✅ **Giao diện không hiển thị** - Di chuyển AppProvider vào ProtectedRoute
✅ **Kết nối database** - Chuyển từ Edge Function sang Supabase client trực tiếp
✅ **Build thành công** - Không có lỗi TypeScript

Chúc bạn sử dụng ứng dụng hiệu quả! 🎉
