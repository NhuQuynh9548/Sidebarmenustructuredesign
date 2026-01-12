# Hướng Dẫn Kết Nối Supabase Database

## Tổng Quan

Dự án đã được chuyển đổi thành công từ việc sử dụng Edge Functions sang kết nối trực tiếp với Supabase Database. Điều này mang lại nhiều lợi ích:

- ⚡ **Hiệu suất cao hơn**: Kết nối trực tiếp, không qua trung gian
- 🔒 **Bảo mật tốt hơn**: Sử dụng Row Level Security (RLS) của Supabase
- 🛠️ **Dễ bảo trì**: Code đơn giản hơn, dễ debug hơn
- 💰 **Tiết kiệm chi phí**: Không cần maintain Edge Functions

## Cấu Trúc Database

### Các Bảng Hiện Có

1. **business_units** - Quản lý các đơn vị kinh doanh (5 records hiện có)
2. **employees** - Quản lý nhân sự
3. **partners** - Quản lý đối tác
4. **transactions** - Quản lý thu chi
5. **users** - Quản lý người dùng
6. **master_data** - Dữ liệu danh mục

## Các File Đã Được Tạo/Cập Nhật

### 1. Supabase Client (`src/lib/supabase.ts`)
- Tạo mới Supabase client instance
- Định nghĩa TypeScript types cho tất cả tables
- Export `supabase` client để sử dụng trong toàn bộ app

### 2. Supabase API (`src/services/supabaseApi.ts`)
- Tạo mới, thay thế cho `src/services/api.ts`
- Kết nối trực tiếp với Supabase
- Các API endpoints:
  - `businessUnitsAPI`
  - `employeesAPI`
  - `partnersAPI`
  - `transactionsAPI`
  - `usersAPI`
  - `masterDataAPI`
  - `dashboardAPI`

### 3. Hooks đã được cập nhật
- ✅ `src/hooks/useEmployees.ts` - import từ `supabaseApi`
- ✅ `src/hooks/usePartners.ts` - import từ `supabaseApi`
- ✅ `src/hooks/useTransactions.ts` - import từ `supabaseApi`

### 4. Components đã được cập nhật
- ✅ `src/components/pages/QuanLyBU.tsx` - import từ `supabaseApi`
- ✅ `src/components/pages/Settings.tsx` - import từ `supabaseApi`, cập nhật logic

### 5. Environment Variables (`.env`)
```env
VITE_SUPABASE_URL=https://ssjrpnziotdwhmxnljpm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Cách Sử Dụng

### 1. Sử dụng trực tiếp Supabase Client

```typescript
import { supabase } from '../lib/supabase';

const { data, error } = await supabase
  .from('business_units')
  .select('*')
  .order('created_at', { ascending: false });
```

### 2. Sử dụng API Services

```typescript
import { businessUnitsAPI } from '../services/supabaseApi';

const result = await businessUnitsAPI.getAll();
if (result.success) {
  console.log(result.data);
}
```

### 3. Sử dụng Custom Hooks

```typescript
import { useEmployees } from '../hooks/useEmployees';

function MyComponent() {
  const { employees, loading, error, createEmployee } = useEmployees();
  // employees tự động được load
}
```

## Build & Test

### Build thành công
```bash
npm run build
# ✓ built in 11.85s
```

### Test kết nối
- File test: `src/test-supabase.ts`
- Truy cập Settings page trong app để kiểm tra kết nối

## Lưu Ý Quan Trọng

### Row Level Security (RLS)
⚠️ **Hiện tại RLS đã được DISABLE** để dễ test (`rls_enabled: false`)

Trong production, cần:
1. Enable RLS cho tất cả bảng
2. Tạo policies phù hợp
3. Test kỹ trước khi deploy

### API Response Format
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

## Troubleshooting

### Lỗi kết nối
1. Kiểm tra `.env` có đúng URL và ANON_KEY
2. Kiểm tra network/firewall
3. Xem console log

### Lỗi data không load
1. Kiểm tra hooks đã gọi đúng
2. Xem state `loading` và `error`
3. Check console log

## Next Steps
1. ✅ Kết nối Supabase thành công
2. ✅ Cập nhật tất cả hooks và components
3. ✅ Build project thành công
4. 🔜 Test các chức năng CRUD
5. 🔜 Setup RLS policies cho production
6. 🔜 Thêm authentication (nếu cần)
