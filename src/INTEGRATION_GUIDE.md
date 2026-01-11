# Hướng Dẫn Tích Hợp API - Hệ Thống BLUEBOLT

## ✅ Đã Hoàn Thành

### 1. Backend Setup (Supabase)
- ✅ **API Endpoints** (`/supabase/functions/server/index.tsx`)
  - Business Units: GET, POST, PUT, DELETE
  - Transactions: GET, POST, PUT, DELETE
  - Employees: GET, POST, PUT, DELETE
  - Partners: GET, POST, PUT, DELETE
  - Users: GET, POST, PUT, DELETE
  - Master Data: GET, POST, PUT, DELETE
  - Dashboard: POST (với filters)
  - Seed Data: POST
  - Health Check: GET

- ✅ **API Service Layer** (`/supabase/functions/server/api.tsx`)
  - Business logic cho tất cả các entities
  - Error handling
  - Data validation

### 2. Frontend Services
- ✅ **API Client** (`/services/api.ts`)
  - Wrapper functions cho tất cả endpoints
  - Auto inject Authorization token
  - Error handling và logging
  - Response type safety

### 3. Custom Hooks
- ✅ **useTransactions** (`/hooks/useTransactions.ts`)
  - Load/Create/Update/Delete transactions
  - Auto generate transaction codes (T/C/V + MMYY_NN)
  - Approval status management
  
- ✅ **useEmployees** (`/hooks/useEmployees.ts`)
  - CRUD operations cho nhân sự
  
- ✅ **usePartners** (`/hooks/usePartners.ts`)
  - CRUD operations cho đối tác

### 4. Trang Đã Tích Hợp
- ✅ **Quản Lý BU** (`/components/pages/QuanLyBU.tsx`)
  - Load data từ API
  - Create/Update/Delete BU
  - Real-time data với loading states
  - Error handling UI
  
- ✅ **Quản Lý Đối Tác** (`/components/pages/QuanLyDoiTacNew.tsx`)
  - Sử dụng usePartners hook
  - Full CRUD với API
  - Filter và search

- ✅ **Settings Page** (`/components/pages/Settings.tsx`)
  - Health check backend
  - Seed dữ liệu mẫu
  - Thống kê database
  - API endpoints documentation

---

## 🔄 Cần Tích Hợp

### Trang Chính

#### 1. Quản Lý Thu Chi (`/components/pages/QuanLyThuChi.tsx`)
**Hook**: `useTransactions`

```typescript
import { useTransactions } from '../../hooks/useTransactions';

export function QuanLyThuChi() {
  const {
    transactions,
    loading,
    error,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    updateApprovalStatus,
    generateTransactionCode
  } = useTransactions();
  
  // Replace mock data với transactions từ API
  // Thay handleSubmit để gọi createTransaction hoặc updateTransaction
  // Thay handleDelete để gọi deleteTransaction
  // Approval workflow: updateApprovalStatus(id, 'approved')
}
```

**Lưu ý**:
- Mã giao dịch tự động: `generateTransactionCode('income' | 'expense' | 'loan')`
- Format: `T0126_01`, `C0126_02`, `V0126_03`
- Phân bổ chi phí: Lưu vào field `allocationRule` và `allocationPreview`

#### 2. Quản Lý Nhân Sự (`/components/pages/QuanLyNhanSu.tsx`)
**Hook**: `useEmployees`

```typescript
import { useEmployees } from '../../hooks/useEmployees';

export function QuanLyNhanSu() {
  const {
    employees,
    loading,
    error,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  } = useEmployees();
  
  // Normalize data:
  const normalizedEmployee = {
    employeeId: emp.employeeId || emp.id,
    fullName: emp.fullName || emp.name,
    businessUnit: emp.businessUnit || emp.bu,
    position: emp.position || emp.role,
    // ... map other fields
  };
}
```

#### 3. Dashboard (`/components/pages/Dashboard.tsx`)
**API**: `dashboardAPI.getData(filters)`

```typescript
import { dashboardAPI } from '../../services/api';

const loadDashboardData = async () => {
  const filters = {
    bu: selectedBU,
    startDate: dateRange.start,
    endDate: dateRange.end
  };
  
  const result = await dashboardAPI.getData(filters);
  if (result.success) {
    // Update KPIs, charts với result.data
    setTotalRevenue(result.data.totalRevenue);
    setTotalExpense(result.data.totalExpense);
    // ...
  }
};
```

### Trang Admin

#### 4. Quản Lý Người Dùng (`/components/pages/QuanTriHeThong/QuanLyNguoiDung.tsx`)
**API**: `usersAPI`

```typescript
import { usersAPI } from '../../../services/api';

const loadUsers = async () => {
  const result = await usersAPI.getAll();
  if (result.success) {
    setUsers(result.data);
  }
};

const handleCreate = async (userData) => {
  const result = await usersAPI.create(userData);
  if (result.success) {
    await loadUsers();
  }
};
```

#### 5. Phân Quyền Vai Trò (`/components/pages/QuanTriHeThong/PhanQuyenVaiTro.tsx`)
**Master Data Type**: `roles`

```typescript
import { masterDataAPI } from '../../../services/api';

const loadRoles = async () => {
  const result = await masterDataAPI.getByType('roles');
  if (result.success) {
    setRoles(result.data);
  }
};

const createRole = async (roleData) => {
  const result = await masterDataAPI.create('roles', roleData);
  // ...
};
```

### Master Data (6 trang)

Tất cả 6 trang Master Data sử dụng cùng pattern:

```typescript
import { masterDataAPI } from '../../../services/api';

export function MasterDataPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const type = 'categories'; // hoặc 'allocations', 'projects', 'levels', 'specializations', 'payment-methods'
  
  const loadData = async () => {
    setLoading(true);
    const result = await masterDataAPI.getByType(type);
    if (result.success) {
      setData(result.data);
    }
    setLoading(false);
  };
  
  const handleCreate = async (formData) => {
    const result = await masterDataAPI.create(type, formData);
    if (result.success) {
      await loadData();
    }
  };
  
  const handleUpdate = async (id, formData) => {
    const result = await masterDataAPI.update(type, id, formData);
    if (result.success) {
      await loadData();
    }
  };
  
  const handleDelete = async (id) => {
    const result = await masterDataAPI.delete(type, id);
    if (result.success) {
      await loadData();
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
}
```

#### Master Data Types:

1. **Danh Mục Thu/Chi/Vay** (`/components/pages/master/DanhMucThuChi.tsx`)
   - Type: `categories`
   - Fields: `code`, `name`, `type` (income/expense/loan), `description`

2. **Phân Bổ Chi Phí** (`/components/pages/master/PhanBoChiPhi.tsx`)
   - Type: `allocations`
   - Fields: `ruleName`, `ruleType`, `businessUnits`, `percentages`

3. **Quản Lý Dự Án** (`/components/pages/master/QuanLyDuAn.tsx`)
   - Type: `projects`
   - Fields: `projectCode`, `projectName`, `startDate`, `endDate`, `budget`, `status`

4. **Cấp Bậc Nhân Sự** (`/components/pages/master/CapBacNhanSu.tsx`)
   - Type: `levels`
   - Fields: `levelCode`, `levelName`, `description`, `order`

5. **Chuyên Môn/Vai Trò** (`/components/pages/master/ChuyenMonVaiTro.tsx`)
   - Type: `specializations`
   - Fields: `code`, `name`, `category`, `description`

6. **Phương Thức Thanh Toán** (`/components/pages/master/PhuongThucThanhToan.tsx`)
   - Type: `payment-methods`
   - Fields: `methodCode`, `methodName`, `description`, `isActive`

---

## 📋 Checklist Tích Hợp

### Cho mỗi trang cần làm:

- [ ] Import hook hoặc API service
- [ ] Replace mock data với `useState` empty array
- [ ] Add `loading` và `error` states
- [ ] Create `loadData()` function với API call
- [ ] Call `loadData()` trong `useEffect`
- [ ] Update `handleCreate` để gọi API
- [ ] Update `handleUpdate` để gọi API
- [ ] Update `handleDelete` để gọi API
- [ ] Add error handling UI (alert/toast)
- [ ] Add loading indicator (spinner)
- [ ] Test CRUD operations

### UI Patterns:

```typescript
{error && (
  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
    {error}
  </div>
)}

{loading && data.length === 0 ? (
  <div className="flex items-center justify-center py-12">
    <Loader className="w-8 h-8 animate-spin text-[#1E6BB8]" />
    <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
  </div>
) : (
  // Render table
)}
```

---

## 🚀 Testing Workflow

1. **Mở trang Settings** (`/settings`)
2. **Kiểm tra kết nối** - Nhấn "Kiểm tra lại"
3. **Seed dữ liệu** - Nhấn "Seed Dữ Liệu Mẫu" (chỉ lần đầu)
4. **Xem thống kê** - Kiểm tra số lượng records
5. **Test từng trang**:
   - Quản Lý BU: Tạo, sửa, xóa BU
   - Quản Lý Đối Tác: Tạo, sửa, xóa đối tác
   - Quản Lý Thu Chi: Tạo transaction, xem mã tự động
   - Dashboard: Xem metrics update real-time

---

## 🔧 Troubleshooting

### Lỗi CORS
- Kiểm tra `/supabase/functions/server/index.tsx` có enable CORS
- Headers: `Authorization: Bearer ${publicAnonKey}`

### Dữ liệu không load
- Check Network tab trong DevTools
- Xem Console logs
- Verify API endpoint URL đúng format

### Seed data failed
- Có thể đã seed rồi (duplicate keys)
- Xóa localStorage: `localStorage.clear()`
- Refresh page

---

## 📚 API Reference

### Base URL
```
https://${projectId}.supabase.co/functions/v1/make-server-393f5b29
```

### Headers
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`
}
```

### Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

---

## 💡 Best Practices

1. **Always handle errors**
   ```typescript
   if (!result.success) {
     setError(result.error || 'Unknown error');
     return;
   }
   ```

2. **Show loading states**
   ```typescript
   setLoading(true);
   try {
     // API call
   } finally {
     setLoading(false);
   }
   ```

3. **Reload after mutations**
   ```typescript
   const result = await createItem(data);
   if (result.success) {
     await loadItems(); // Refresh list
     closeModal();
   }
   ```

4. **Normalize data**
   ```typescript
   const normalized = items.map(item => ({
     id: item.id,
     code: item.buCode || item.code,
     name: item.buName || item.name,
     // Handle both old and new field names
   }));
   ```

---

## 📞 Support

Nếu gặp vấn đề:
1. Check Console logs
2. Check Network tab
3. Verify database có data (Settings page)
4. Test với Postman/Thunder Client
5. Re-seed data nếu cần

---

**Tác giả**: AI Assistant
**Ngày tạo**: 11/01/2026
**Phiên bản**: 1.0
