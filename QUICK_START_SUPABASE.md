# Quick Start - Kết Nối Supabase

Hướng dẫn nhanh 5 phút để kết nối Supabase của bạn.

## 1. Lấy thông tin từ Supabase

Truy cập [supabase.com](https://supabase.com) > Tạo project mới > Vào **Settings** > **API**

Lấy 2 thông tin:
- **Project URL**: `https://xxxxxxxxxxx.supabase.co`
- **anon public key**: `eyJhbGciOiJIUz...`

## 2. Cập nhật 2 files

### File `.env`:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
```

### File `src/utils/supabase/info.tsx`:
```typescript
export const projectId = "xxxxxxxxxxx"
export const publicAnonKey = "eyJhbGciOiJIUz..."
```

## 3. Deploy Edge Function

### macOS/Linux:
```bash
./deploy-edge-function.sh xxxxxxxxxxx
```

### Windows:
```cmd
deploy-edge-function.bat xxxxxxxxxxx
```

Thay `xxxxxxxxxxx` bằng Project Reference ID của bạn.

## 4. Chạy ứng dụng

```bash
npm install
npm run dev
```

Xong! 🎉

---

Xem hướng dẫn chi tiết tại: [HUONG_DAN_KET_NOI_SUPABASE.md](./HUONG_DAN_KET_NOI_SUPABASE.md)
