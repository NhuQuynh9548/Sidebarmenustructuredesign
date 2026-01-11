# 🚀 BLUEBOLT - Hệ Thống Quản Lý Thu Chi

Hệ thống quản lý thu chi chuyên nghiệp cho công ty BLUEBOLT, được xây dựng với React, TypeScript, Tailwind CSS và Supabase.

![BLUEBOLT](https://img.shields.io/badge/BLUEBOLT-Financial%20Management-1E6BB8)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ](#-công-nghệ)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [Sử Dụng](#-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [API Documentation](#-api-documentation)
- [Đóng Góp](#-đóng-góp)
- [License](#-license)

## ✨ Tính Năng

### 🎯 Chức Năng Chính

- **Dashboard Báo Cáo**
  - Tổng quan tài chính theo thời gian thực
  - Biểu đồ thu/chi theo tháng và Business Unit
  - KPIs: Tổng thu, tổng chi, lợi nhuận, pending transactions
  - Filter theo BU, thời gian, loại giao dịch

- **Quản Lý Business Unit (BU)**
  - CRUD operations hoàn chỉnh
  - Phân quyền theo BU (CEO xem tất cả, Trưởng BU chỉ xem BU của mình)
  - Drag & drop columns để tùy chỉnh hiển thị
  - Lưu cấu hình cột cho từng user

- **Quản Lý Thu Chi**
  - 3 loại giao dịch: Thu (T), Chi (C), Vay (V)
  - Tự động sinh mã giao dịch: `T0126_01`, `C0126_02`, `V0126_03`
  - Phân bổ chi phí: Trực tiếp/Gián tiếp với preview phân bổ
  - Quy trình phê duyệt: Draft → Pending → Approved/Rejected
  - Upload và quản lý chứng từ đính kèm
  - Drag & drop columns

- **Quản Lý Nhân Sự**
  - Quản lý thông tin nhân viên
  - Phân loại theo BU, chuyên môn, cấp bậc
  - Trạng thái: Đang làm việc, Thử việc, Đã nghỉ
  - Drag & drop columns

- **Quản Lý Đối Tác**
  - Khách hàng, Nhà cung cấp, hoặc cả hai
  - Thông tin chi tiết: MST, địa chỉ, liên hệ
  - Filter theo loại và trạng thái
  - Full CRUD với API

- **Quản Trị Hệ Thống**
  - Quản lý người dùng và phân quyền
  - 5 vai trò: CEO, Giám Đốc BU, Kế Toán, Nhân Viên, Admin
  - Thiết lập bảo mật
  - Nhật ký hệ thống

- **Master Data (6 modules)**
  - Danh mục thu/chi/vay
  - Quy tắc phân bổ chi phí
  - Quản lý dự án
  - Cấp bậc nhân sự
  - Chuyên môn/Vai trò
  - Phương thức thanh toán

### 🎨 UI/UX Features

- **Design System**: Brand colors BLUEBOLT (Blue #1E6BB8, Orange #F7931E)
- **Responsive**: Mobile, Tablet, Desktop
- **Dark Mode Ready**: Chuẩn bị sẵn cho dark theme
- **Drag & Drop**: Tùy chỉnh thứ tự cột theo preference
- **Real-time Updates**: Dữ liệu sync với database
- **Loading States**: Skeleton loaders và spinners
- **Error Handling**: User-friendly error messages

## 🛠 Công Nghệ

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS 4** - Styling
- **React Router 7** - Navigation
- **React DnD** - Drag & Drop
- **Recharts** - Data Visualization
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Edge Functions (Deno)
  - KV Store
  - Authentication
  - Storage (for attachments)

### Development Tools
- **Vite** - Build Tool
- **ESLint** - Linting
- **Prettier** - Code Formatting

## 📦 Cài Đặt

### Prerequisites

- Node.js 18+ và npm/yarn/pnpm
- Tài khoản Supabase (miễn phí)

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/bluebolt-finance.git
cd bluebolt-finance
```

### Install Dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

## ⚙️ Cấu Hình

### 1. Supabase Setup

1. Tạo project mới tại [supabase.com](https://supabase.com)
2. Copy Project ID và Anon Key
3. Tạo file `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'YOUR_PROJECT_ID';
export const publicAnonKey = 'YOUR_ANON_KEY';
```

### 2. Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy functions
supabase functions deploy make-server-393f5b29
```

### 3. Seed Database

1. Chạy app: `npm run dev`
2. Login với tài khoản demo
3. Vào **Settings** page
4. Click **"Seed Dữ Liệu Mẫu"**

## 🚀 Sử Dụng

### Development

```bash
npm run dev
```

App sẽ chạy tại `http://localhost:5173`

### Build Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Cấu Trúc Dự Án

```
bluebolt-finance/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── pages/       # Page components
│   │   │   ├── QuanTriHeThong/  # Admin pages
│   │   │   ├── master/          # Master data pages
│   │   │   ├── QuanLyBU.tsx
│   │   │   ├── QuanLyThuChi.tsx
│   │   │   ├── QuanLyNhanSu.tsx
│   │   │   ├── QuanLyDoiTac.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/       # Custom hooks
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   ├── contexts/        # React Context
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── hooks/          # Custom hooks
│   │   ├── useTransactions.ts
│   │   ├── useEmployees.ts
│   │   └── usePartners.ts
│   ├── utils/          # Utilities
│   │   └── supabase/
│   ├── styles/         # Global styles
│   │   └── globals.css
│   └── App.tsx         # Root component
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx    # API endpoints
│           ├── api.tsx      # Business logic
│           └── kv_store.tsx # KV operations
├── INTEGRATION_GUIDE.md     # API integration guide
└── package.json
```

## 📚 API Documentation

### Base URL
```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-393f5b29
```

### Endpoints

#### Business Units
- `GET /business-units` - Get all BUs
- `POST /business-units` - Create BU
- `PUT /business-units/:id` - Update BU
- `DELETE /business-units/:id` - Delete BU

#### Transactions
- `GET /transactions` - Get all transactions
- `POST /transactions` - Create transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

#### Employees
- `GET /employees` - Get all employees
- `POST /employees` - Create employee
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

#### Partners
- `GET /partners` - Get all partners
- `POST /partners` - Create partner
- `PUT /partners/:id` - Update partner
- `DELETE /partners/:id` - Delete partner

#### Master Data
- `GET /master-data/:type` - Get by type
- `POST /master-data/:type` - Create item
- `PUT /master-data/:type/:id` - Update item
- `DELETE /master-data/:type/:id` - Delete item

Xem chi tiết trong [INTEGRATION_GUIDE.md](/INTEGRATION_GUIDE.md)

## 👥 Tài Khoản Demo

| Username | Password | Role | Access |
|----------|----------|------|--------|
| ceo@bluebolt.vn | ceo123 | CEO | Tất cả BU |
| admin@bluebolt.vn | admin123 | Admin | Tất cả BU + Admin pages |
| bu.services@bluebolt.vn | services123 | Trưởng BU | BlueBolt Services only |
| bu.software@bluebolt.vn | software123 | Trưởng BU | BlueBolt Software only |
| accountant@bluebolt.vn | acc123 | Kế Toán | Tất cả BU (read-only) |
| staff@bluebolt.vn | staff123 | Nhân Viên | BU được assign |

## 🔒 Bảo Mật

- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Row-level security (Supabase)
- ✅ API key không expose ra frontend
- ✅ Input validation và sanitization
- ✅ CORS enabled cho authorized domains

## 🎯 Roadmap

- [ ] Export to Excel/PDF
- [ ] Email notifications
- [ ] Multi-language support (EN/VI)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics với AI
- [ ] Integration với bank APIs
- [ ] Automated backup

## 🤝 Đóng Góp

Contributions, issues và feature requests luôn được chào đón!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Liên Hệ

BLUEBOLT Team - contact@bluebolt.vn

Project Link: [https://github.com/YOUR_USERNAME/bluebolt-finance](https://github.com/YOUR_USERNAME/bluebolt-finance)

---

**Made with ❤️ by BLUEBOLT Team**
