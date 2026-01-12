# BlueBolt Management System

Hệ thống quản lý tích hợp cho doanh nghiệp, bao gồm quản lý Business Units, nhân sự, đối tác, thu chi và báo cáo.

## Tính Năng Chính

- **Dashboard**: Tổng quan doanh thu, chi phí, lợi nhuận theo BU
- **Quản Lý BU**: Quản lý các đơn vị kinh doanh
- **Quản Lý Nhân Sự**: Theo dõi nhân viên, chức vụ, lương
- **Quản Lý Đối Tác**: Quản lý thông tin đối tác, khách hàng
- **Quản Lý Thu Chi**: Theo dõi giao dịch thu/chi theo từng BU
- **Master Data**: Quản lý danh mục dùng chung
- **Phân Quyền**: Hệ thống phân quyền theo vai trò và BU

## Kết Nối Supabase

Ứng dụng này cần kết nối với Supabase để hoạt động.

### Quick Start (5 phút)

Xem hướng dẫn nhanh: [QUICK_START_SUPABASE.md](./QUICK_START_SUPABASE.md)

### Hướng Dẫn Chi Tiết

Xem hướng dẫn đầy đủ: [HUONG_DAN_KET_NOI_SUPABASE.md](./HUONG_DAN_KET_NOI_SUPABASE.md)

## Cài Đặt & Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

## Tài Khoản Demo

Sau khi kết nối Supabase, bạn có thể đăng nhập bằng các tài khoản demo:

| Email | Password | Vai Trò |
|-------|----------|---------|
| ceo@bluebolt.vn | ceo123 | CEO - Toàn quyền |
| admin@bluebolt.vn | admin123 | Admin - Toàn quyền |
| manager.software@bluebolt.vn | manager123 | Trưởng BU Software |
| manager.academy@bluebolt.vn | manager123 | Trưởng BU Academy |
| manager.services@bluebolt.vn | manager123 | Trưởng BU Services |
| employee@bluebolt.vn | employee123 | Nhân viên |

## Công Nghệ

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Backend**: Supabase Edge Functions (Deno)
- **Storage**: Supabase KV Store
- **Routing**: React Router v7
- **State Management**: React Context API

## Cấu Trúc Project

```
├── src/
│   ├── components/      # UI components
│   ├── contexts/        # React contexts (Auth, App)
│   ├── hooks/           # Custom hooks
│   ├── services/        # API services
│   └── utils/           # Utilities
├── supabase/
│   └── functions/       # Edge Functions
│       └── make-server-393f5b29/
│           ├── index.ts      # Main server
│           ├── api.ts        # API handlers
│           └── kv_store.ts   # KV storage
└── ...
```

## Hỗ Trợ

Nếu gặp vấn đề khi kết nối Supabase, xem phần "Xử Lý Lỗi Thường Gặp" trong [HUONG_DAN_KET_NOI_SUPABASE.md](./HUONG_DAN_KET_NOI_SUPABASE.md)

## License

MIT
