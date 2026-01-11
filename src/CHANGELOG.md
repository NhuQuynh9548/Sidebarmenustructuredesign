# Changelog

Tất cả thay đổi quan trọng của dự án sẽ được ghi nhận ở đây.

Format dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
và dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-11

### 🎉 Initial Release

#### ✨ Added

**Core Features:**
- Dashboard với biểu đồ thống kê thu/chi theo thời gian thực
- Quản lý Business Units với CRUD operations
- Quản lý giao dịch thu/chi/vay với tự động sinh mã
- Quản lý nhân sự với phân loại theo BU
- Quản lý đối tác (khách hàng, nhà cung cấp)
- Hệ thống phân quyền 5 vai trò

**Backend:**
- Supabase Edge Functions với Deno
- REST API với 40+ endpoints
- KV Store cho data persistence
- Business logic layer với error handling
- CORS enabled và logging

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS 4 với brand colors
- React Router 7 navigation
- Custom hooks: useTransactions, useEmployees, usePartners
- API client với type safety

**UI/UX:**
- Drag & drop columns với localStorage persistence
- Responsive design (mobile, tablet, desktop)
- Loading states và error boundaries
- Brand colors: Blue #1E6BB8, Orange #F7931E

**Admin Panel:**
- Quản lý người dùng
- Phân quyền vai trò
- Thiết lập bảo mật
- Nhật ký hệ thống

**Master Data:**
- Danh mục thu/chi/vay
- Quy tắc phân bổ chi phí
- Quản lý dự án
- Cấp bậc nhân sú
- Chuyên môn/vai trò
- Phương thức thanh toán

**Authentication:**
- 6 tài khoản demo với roles khác nhau
- JWT-based auth
- Role-based access control
- BU-based data filtering

**Documentation:**
- README.md với đầy đủ hướng dẫn
- INTEGRATION_GUIDE.md cho API integration
- GITHUB_SETUP.md cho Git workflow
- Inline code comments

#### 🔧 Technical

- TypeScript strict mode
- ESLint configuration
- Prettier code formatting
- Git workflow với branches
- Environment variables management

#### 📦 Dependencies

**Main:**
- react: ^18.x
- react-router-dom: ^7.12.0
- typescript: ^5.x
- tailwindcss: ^4.x
- recharts: ^2.x
- react-dnd: ^16.x
- lucide-react: ^0.x

**Dev:**
- vite: ^5.x
- @types/react: ^18.x
- eslint: ^8.x

---

## [Unreleased]

### 🚧 In Progress

- [ ] Export to Excel/PDF functionality
- [ ] Email notification system
- [ ] Multi-language support (EN/VI)
- [ ] Advanced analytics dashboard

### 💡 Planned

- [ ] Mobile app (React Native)
- [ ] Bank API integration
- [ ] Automated backup system
- [ ] Real-time notifications
- [ ] Dark mode theme
- [ ] File attachment management
- [ ] Advanced reporting module
- [ ] Budget forecasting
- [ ] Cash flow analysis

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-01-11 | Initial release with core features |

---

## Migration Guide

### From Mock Data to API (v0.9 → v1.0)

**Breaking Changes:**
- Tất cả mock data đã được thay thế bằng API calls
- Cần cấu hình Supabase credentials trong `/utils/supabase/info.tsx`
- Phải chạy seed data lần đầu tiên

**Migration Steps:**
1. Setup Supabase project
2. Deploy edge functions
3. Update credentials
4. Run seed data từ Settings page
5. Test CRUD operations

---

## Contributors

- **AI Assistant** - Initial development
- **BLUEBOLT Team** - Requirements & Design

---

## Support

Nếu gặp vấn đề hoặc có câu hỏi:
- 📧 Email: contact@bluebolt.vn
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/bluebolt-finance/issues)
- 📖 Docs: [README.md](./README.md)

---

**Legend:**
- ✨ Added - Tính năng mới
- 🔧 Changed - Thay đổi trong tính năng hiện có
- 🐛 Fixed - Bug fixes
- 🗑️ Removed - Tính năng đã xóa
- 🔒 Security - Vấn đề bảo mật
- 📝 Documentation - Cập nhật tài liệu
