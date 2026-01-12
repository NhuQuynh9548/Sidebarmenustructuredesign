# Hướng Dẫn Setup Database Postgres

> **Lưu ý quan trọng**: Bước này là **TÙY CHỌN**. Hiện tại ứng dụng đang sử dụng **Supabase KV Store** (key-value storage) và hoạt động tốt mà không cần Postgres tables.

Nếu bạn muốn migrate sang Postgres Database để có khả năng query phức tạp hơn, làm theo hướng dẫn dưới đây.

---

## Khi Nào Nên Dùng Postgres?

**Dùng KV Store** (hiện tại) khi:
- Dữ liệu đơn giản, ít quan hệ
- Cần tốc độ đọc/ghi nhanh
- Không cần query phức tạp

**Dùng Postgres** khi:
- Cần JOIN giữa nhiều bảng
- Cần query phức tạp với aggregation
- Cần transactions (ACID)
- Cần foreign keys và constraints
- Cần full-text search

---

## Cách Setup Postgres

### Bước 1: Mở SQL Editor

1. Đăng nhập vào Supabase Dashboard
2. Chọn project của bạn
3. Click vào **SQL Editor** (icon </> ở sidebar trái)
4. Click **New Query**

### Bước 2: Copy SQL Schema

1. Mở file `supabase_schema.sql` trong project
2. Copy toàn bộ nội dung (Ctrl+A, Ctrl+C)
3. Paste vào SQL Editor trong Supabase
4. Click **Run** (hoặc Ctrl+Enter / Cmd+Enter)

### Bước 3: Đợi Hoàn Tất

SQL sẽ thực thi và tạo:
- ✅ 6 bảng chính
- ✅ RLS policies cho bảo mật
- ✅ Indexes để tối ưu
- ✅ Triggers tự động
- ✅ Dữ liệu mẫu
- ✅ Views analytics

Thời gian: ~10-15 giây

### Bước 4: Kiểm Tra

Sau khi chạy xong:
1. Vào **Table Editor** trong Supabase
2. Bạn sẽ thấy 6 bảng mới:
   - `business_units`
   - `employees`
   - `partners`
   - `transactions`
   - `users`
   - `master_data`
3. Mỗi bảng đã có dữ liệu mẫu

---

## Bảng Được Tạo

### 1. business_units
Quản lý các đơn vị kinh doanh (BU)

**Columns**:
- `id` (uuid) - Primary key
- `bu_code` (text) - Mã BU, unique
- `bu_name` (text) - Tên BU
- `description` (text) - Mô tả
- `status` (text) - Trạng thái
- `director` (text) - Giám đốc BU
- `created_at`, `updated_at` - Timestamps

### 2. employees
Quản lý nhân sự

**Columns**:
- `id` (uuid) - Primary key
- `employee_id` (text) - Mã nhân viên, unique
- `employee_name` (text) - Họ tên
- `business_unit` (text) - BU
- `position` (text) - Chức vụ
- `email`, `phone` - Liên hệ
- `salary` (numeric) - Lương
- `status` (text) - Trạng thái

### 3. partners
Quản lý đối tác/khách hàng

**Columns**:
- `id` (uuid) - Primary key
- `partner_code` (text) - Mã đối tác, unique
- `partner_name` (text) - Tên đối tác
- `partner_type` (text) - Loại (customer/supplier)
- `business_unit` (text) - BU phụ trách
- `email`, `phone`, `address` - Thông tin liên hệ

### 4. transactions
Quản lý giao dịch thu/chi

**Columns**:
- `id` (uuid) - Primary key
- `transaction_code` (text) - Mã giao dịch, unique
- `transaction_date` (date) - Ngày giao dịch
- `type` (text) - income/expense
- `business_unit` (text) - BU
- `amount` (numeric) - Số tiền
- `description` (text) - Mô tả
- `payment_method` (text) - Phương thức thanh toán

### 5. users
Quản lý người dùng hệ thống

**Columns**:
- `id` (uuid) - Primary key
- `username` (text) - Tên đăng nhập, unique
- `email` (text) - Email, unique
- `full_name` (text) - Họ tên
- `role` (text) - Vai trò
- `business_units` (text[]) - Danh sách BU được phép

### 6. master_data
Danh mục chung (categories, payment methods, positions...)

**Columns**:
- `id` (uuid) - Primary key
- `type` (text) - Loại danh mục
- `code` (text) - Mã
- `name` (text) - Tên
- `description` (text) - Mô tả
- `metadata` (jsonb) - Dữ liệu bổ sung

---

## Migrate Code Sang Postgres

Sau khi tạo tables, bạn cần cập nhật code để dùng Postgres thay vì KV Store.

### Cập nhật Edge Function

Thay đổi trong `supabase/functions/make-server-393f5b29/api.ts`:

**Thay vì** dùng KV Store:
```typescript
import * as kv from "./kv_store.ts";

export const getBusinessUnits = async () => {
  const bus = await kv.getByPrefix('bu:');
  return bus.map(item => item.value);
};
```

**Dùng Supabase Client**:
```typescript
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export const getBusinessUnits = async () => {
  const { data, error } = await supabase
    .from('business_units')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
```

Làm tương tự cho tất cả các functions khác.

---

## Row Level Security (RLS)

Tất cả bảng đều có **RLS enabled** với policies:
- SELECT: Authenticated users có thể xem
- INSERT/UPDATE/DELETE: Authenticated users có thể thực hiện

Policies này rất **permissive**. Trong production, bạn nên:
1. Tạo policies chi tiết hơn dựa trên role
2. Giới hạn access theo BU
3. Check ownership trước khi cho phép thao tác

**Ví dụ policy an toàn hơn**:
```sql
-- Chỉ cho phép user xem transactions của BU mình
CREATE POLICY "Users can only view own BU transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    business_unit = ANY(
      SELECT unnest(business_units)
      FROM users
      WHERE id = auth.uid()
    )
  );
```

---

## Dữ Liệu Mẫu

Schema đã bao gồm dữ liệu mẫu:
- 5 Business Units
- 5 Users (admin, ceo, 3 managers)
- 5 Employees
- 3 Partners
- 5 Transactions
- Master data (categories, payment methods, positions)

Bạn có thể xóa dữ liệu mẫu sau khi test:
```sql
TRUNCATE business_units, employees, partners, transactions, users, master_data CASCADE;
```

---

## Backup & Restore

### Backup
```bash
supabase db dump -f backup.sql
```

### Restore
```bash
supabase db reset
psql $DATABASE_URL < backup.sql
```

---

## Troubleshooting

### Lỗi: "permission denied for schema public"
**Giải pháp**: Chạy lại SQL với user có quyền cao hơn hoặc liên hệ Supabase support.

### Lỗi: "relation already exists"
**Giải pháp**: Tables đã tồn tại. Muốn tạo lại, xóa tables cũ trước:
```sql
DROP TABLE IF EXISTS business_units, employees, partners, transactions, users, master_data CASCADE;
```

### Lỗi: "syntax error"
**Giải pháp**: Đảm bảo copy toàn bộ nội dung file SQL, không thiếu dòng nào.

---

## Kết Luận

- Setup Postgres là **tùy chọn**, không bắt buộc
- KV Store đủ tốt cho nhiều use cases
- Postgres tốt hơn khi cần queries phức tạp
- Sau khi tạo tables, nhớ cập nhật code Edge Functions

Nếu không chắc, hãy tiếp tục dùng **KV Store** - đơn giản và hiệu quả!
