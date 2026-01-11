# ⚡ Quick Start Guide - BLUEBOLT Finance

Hướng dẫn nhanh để chạy dự án trong 5 phút!

## 🚀 Cách Nhanh Nhất (Development)

### 1. Clone & Install (2 phút)

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/bluebolt-finance.git
cd bluebolt-finance

# Install dependencies
npm install
# hoặc: yarn install
# hoặc: pnpm install
```

### 2. Cấu Hình Supabase (2 phút)

**Option A: Sử dụng Demo Credentials (Nhanh nhất)**

Tạo file `/utils/supabase/info.tsx`:

```typescript
// Demo credentials - CHỈ ĐỂ TEST
export const projectId = 'demo-project-id';
export const publicAnonKey = 'demo-anon-key';
```

**Option B: Sử dụng Supabase Account Riêng (Recommended)**

1. Đăng ký tại [supabase.com](https://supabase.com) (miễn phí)
2. Tạo project mới
3. Copy **Project URL** và **Anon Key** từ Settings → API
4. Tạo file `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'your-project-id-here';
export const publicAnonKey = 'your-anon-key-here';
```

### 3. Run App (30 giây)

```bash
npm run dev
```

App sẽ chạy tại: `http://localhost:5173`

### 4. Login & Seed Data (30 giây)

1. **Login** với tài khoản demo:
   - Username: `ceo@bluebolt.vn`
   - Password: `ceo123`

2. Vào trang **Settings** (menu bên trái)

3. Click nút **"Seed Dữ Liệu Mẫu"**

4. Đợi 2-3 giây → Thành công! ✅

### 5. Khám Phá (Tùy thích)

Giờ bạn có thể:
- ✅ Xem **Dashboard** với charts
- ✅ Thêm/Sửa/Xóa **Business Units**
- ✅ Tạo **Transactions** với mã tự động
- ✅ Quản lý **Đối Tác**
- ✅ Test drag & drop columns

---

## 📱 Các Tài Khoản Demo

| Email | Password | Role | Quyền |
|-------|----------|------|-------|
| `ceo@bluebolt.vn` | `ceo123` | CEO | Xem tất cả BU |
| `admin@bluebolt.vn` | `admin123` | Admin | Full access + Admin panel |
| `bu.services@bluebolt.vn` | `services123` | Trưởng BU | Chỉ BU Services |
| `bu.software@bluebolt.vn` | `software123` | Trưởng BU | Chỉ BU Software |
| `accountant@bluebolt.vn` | `acc123` | Kế Toán | Xem tất cả (read-only) |
| `staff@bluebolt.vn` | `staff123` | Nhân Viên | BU được assign |

**Khuyến nghị:** Dùng tài khoản **CEO** hoặc **Admin** để test đầy đủ tính năng.

---

## 🎯 Tính Năng Chính

### 1. Dashboard
- Tổng quan tài chính real-time
- Biểu đồ thu/chi theo tháng
- KPIs: Revenue, Expense, Profit, Pending
- Filter theo BU và thời gian

### 2. Quản Lý BU
- Thêm/Sửa/Xóa Business Units
- Drag & drop columns
- Filter và search
- API-backed (real database)

### 3. Quản Lý Thu Chi
- 3 loại: Thu (T), Chi (C), Vay (V)
- Mã tự động: `T0126_01`, `C0126_02`...
- Phân bổ chi phí
- Quy trình phê duyệt
- Upload chứng từ (coming soon)

### 4. Quản Lý Đối Tác
- Khách hàng / Nhà cung cấp
- Full CRUD với API
- Filter theo loại
- Drag & drop columns

### 5. Admin Panel
- Quản lý users
- Phân quyền
- Bảo mật
- Nhật ký

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Router** | React Router 7 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **DnD** | React DnD |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Build** | Vite |

---

## 📁 Cấu Trúc Quan Trọng

```
bluebolt-finance/
├── src/
│   ├── components/pages/     # Trang chính
│   │   ├── Dashboard.tsx
│   │   ├── QuanLyBU.tsx
│   │   ├── QuanLyThuChi.tsx
│   │   ├── QuanLyNhanSu.tsx
│   │   ├── QuanLyDoiTac.tsx
│   │   └── Settings.tsx
│   ├── hooks/                # Custom hooks
│   │   ├── useTransactions.ts
│   │   ├── useEmployees.ts
│   │   └── usePartners.ts
│   ├── services/api.ts       # API client
│   └── contexts/             # React Context
├── supabase/functions/       # Backend code
└── utils/supabase/info.tsx   # 🔑 Credentials
```

---

## 🐛 Troubleshooting

### ❌ "Cannot find module './utils/supabase/info'"

**Fix:**
```bash
# Tạo file credentials
cat > utils/supabase/info.tsx << EOL
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
EOL
```

### ❌ "Failed to fetch" khi load data

**Nguyên nhân:** Backend chưa được deploy

**Fix:**
1. Check Settings page → "Kiểm tra kết nối"
2. Nếu đỏ → Deploy edge functions:
```bash
supabase functions deploy make-server-393f5b29
```

### ❌ "Seed data failed"

**Nguyên nhân:** Đã seed rồi (duplicate keys)

**Fix:** OK, bỏ qua. Data đã có trong DB.

### ❌ Port 5173 đã được sử dụng

**Fix:**
```bash
# Dùng port khác
npm run dev -- --port 3000
```

---

## 📚 Tài Liệu Chi Tiết

- 📖 [README.md](./README.md) - Hướng dẫn đầy đủ
- 🔌 [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - API integration
- 🐙 [GITHUB_SETUP.md](./GITHUB_SETUP.md) - Git workflow
- 📝 [CHANGELOG.md](./CHANGELOG.md) - Version history

---

## 🎓 Learning Path

### Người mới bắt đầu:
1. Chạy app theo Quick Start
2. Login và seed data
3. Khám phá Dashboard
4. Thử tạo BU mới
5. Tạo transaction đầu tiên
6. Test drag & drop columns

### Developer:
1. Đọc [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
2. Xem code trong `/hooks/useTransactions.ts`
3. Tìm hiểu API endpoints trong `/supabase/functions/server/index.tsx`
4. Custom hooks và services
5. Tích hợp thêm trang mới

### Advanced:
1. Deploy to production
2. Custom domain
3. CI/CD với GitHub Actions
4. Database optimization
5. Performance tuning

---

## 🚢 Deploy to Production

### Vercel (Recommended - Miễn phí)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, done!
```

### Netlify

```bash
# Build
npm run build

# Drag & drop folder 'dist' vào Netlify
```

### Manual

```bash
npm run build
# Upload folder 'dist' lên web server
```

---

## 💡 Pro Tips

1. **Dùng tài khoản CEO** để test full features
2. **Seed data trước** khi test Dashboard
3. **Drag & drop columns** để customize UI
4. **Filter by BU** để test permissions
5. **Check Settings** nếu API không hoạt động

---

## 🆘 Cần Giúp Đỡ?

- 📧 Email: contact@bluebolt.vn
- 🐛 Báo lỗi: [GitHub Issues](https://github.com/YOUR_USERNAME/bluebolt-finance/issues)
- 💬 Discussion: [GitHub Discussions](https://github.com/YOUR_USERNAME/bluebolt-finance/discussions)

---

## ⭐ Next Steps

Sau khi chạy thành công:

- [ ] Test tất cả CRUD operations
- [ ] Tùy chỉnh brand colors (nếu cần)
- [ ] Deploy lên production
- [ ] Share với team
- [ ] Star repo trên GitHub ⭐
- [ ] Đóng góp features mới!

---

**Happy Coding! 🎉**

Made with ❤️ by BLUEBOLT Team
