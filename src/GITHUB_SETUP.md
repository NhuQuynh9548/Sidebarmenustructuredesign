# 🚀 Hướng Dẫn Push Code Lên GitHub

## Bước 1: Chuẩn Bị Môi Trường

### 1.1. Cài Đặt Git (nếu chưa có)

**Windows:**
```bash
# Download từ https://git-scm.com/download/win
# Hoặc dùng winget
winget install --id Git.Git -e --source winget
```

**MacOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git  # Ubuntu/Debian
sudo yum install git      # CentOS/RHEL
```

### 1.2. Kiểm Tra Git Đã Cài Đặt

```bash
git --version
```

### 1.3. Cấu Hình Git (lần đầu tiên)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Bước 2: Tạo Repository Trên GitHub

### 2.1. Đăng nhập GitHub
- Truy cập [github.com](https://github.com)
- Đăng nhập vào tài khoản của bạn

### 2.2. Tạo Repository Mới
1. Click nút **"+"** ở góc trên bên phải
2. Chọn **"New repository"**
3. Điền thông tin:
   - **Repository name**: `bluebolt-finance` (hoặc tên bạn muốn)
   - **Description**: "Hệ thống quản lý thu chi BLUEBOLT"
   - **Visibility**: Chọn Public hoặc Private
   - ⚠️ **KHÔNG** check "Initialize with README" (vì đã có README.md)
   - ⚠️ **KHÔNG** add .gitignore hoặc license (đã có sẵn)
4. Click **"Create repository"**

### 2.3. Copy Repository URL
Sau khi tạo xong, bạn sẽ thấy URL dạng:
```
https://github.com/YOUR_USERNAME/bluebolt-finance.git
```

## Bước 3: Download Code Từ Figma Make

### Option A: Download Từ UI
1. Trong Figma Make, tìm nút **"Download"** hoặc **"Export"**
2. Download toàn bộ project về máy
3. Giải nén vào thư mục làm việc

### Option B: Copy Code Thủ Công
Nếu không có nút download, bạn cần copy từng file:
1. Tạo thư mục project: `mkdir bluebolt-finance`
2. Copy từng file từ Figma Make vào thư mục local

## Bước 4: Khởi Tạo Git Repository

Mở Terminal/Command Prompt tại thư mục project:

```bash
cd bluebolt-finance

# Khởi tạo git repository
git init

# Kiểm tra trạng thái
git status
```

## Bước 5: Commit Code

### 5.1. Add Tất Cả Files

```bash
# Add tất cả files
git add .

# Hoặc add từng file/folder
git add src/
git add public/
git add package.json
# ...
```

### 5.2. Commit

```bash
git commit -m "Initial commit: BLUEBOLT Financial Management System

- Complete frontend with React + TypeScript + Tailwind
- Supabase backend integration
- Dashboard with charts and KPIs
- BU, Transaction, Employee, Partner management
- Admin panel and master data
- Drag & drop columns
- Role-based access control
- Full CRUD operations with API
"
```

## Bước 6: Push Lên GitHub

### 6.1. Add Remote Repository

```bash
# Thay YOUR_USERNAME bằng username GitHub của bạn
git remote add origin https://github.com/YOUR_USERNAME/bluebolt-finance.git

# Kiểm tra remote đã add
git remote -v
```

### 6.2. Push Code

```bash
# Push lần đầu (tạo branch main)
git branch -M main
git push -u origin main

# Nhập username và password khi được yêu cầu
# Lưu ý: Password là Personal Access Token, KHÔNG phải password đăng nhập
```

### 6.3. Tạo Personal Access Token (nếu cần)

GitHub không cho dùng password trực tiếp nữa. Bạn cần tạo token:

1. Vào GitHub → **Settings** → **Developer settings**
2. Click **"Personal access tokens"** → **"Tokens (classic)"**
3. Click **"Generate new token"** → **"Generate new token (classic)"**
4. Điền:
   - **Note**: "BLUEBOLT Project"
   - **Expiration**: 90 days (hoặc No expiration)
   - **Scopes**: Check ✅ **repo** (full control)
5. Click **"Generate token"**
6. **⚠️ COPY TOKEN NGAY** (sẽ không thấy lại được!)
7. Dùng token này làm password khi push

## Bước 7: Xác Nhận Thành Công

### 7.1. Kiểm Tra Trên GitHub
1. Refresh trang repository trên GitHub
2. Bạn sẽ thấy tất cả code đã được push
3. README.md sẽ hiển thị ở trang chủ repo

### 7.2. Clone Thử (Optional)
Để chắc chắn, bạn có thể clone về một thư mục khác:

```bash
cd ..
git clone https://github.com/YOUR_USERNAME/bluebolt-finance.git test-clone
cd test-clone
```

## 🔄 Workflow Làm Việc Sau Này

### Khi Có Thay Đổi Mới

```bash
# 1. Kiểm tra files đã thay đổi
git status

# 2. Add files thay đổi
git add .

# 3. Commit với message mô tả
git commit -m "feat: Add export to Excel feature"

# 4. Push lên GitHub
git push
```

### Các Loại Commit Message

```bash
# Feature mới
git commit -m "feat: Add email notification"

# Fix bug
git commit -m "fix: Resolve null pointer in QuanLyBU"

# Update documentation
git commit -m "docs: Update API documentation"

# Refactor code
git commit -m "refactor: Improve transaction code generation"

# Style/UI changes
git commit -m "style: Update button colors to match brand"

# Performance
git commit -m "perf: Optimize dashboard loading time"
```

## 🌿 Branching Strategy (Nâng Cao)

### Tạo Branch Cho Feature Mới

```bash
# Tạo và chuyển sang branch mới
git checkout -b feature/export-excel

# Làm việc, commit như bình thường
git add .
git commit -m "feat: Add Excel export"

# Push branch lên GitHub
git push -u origin feature/export-excel

# Tạo Pull Request trên GitHub UI
# Sau khi merge, quay về main
git checkout main
git pull
```

### Các Branch Phổ Biến

- `main` - Production code
- `develop` - Development code
- `feature/feature-name` - Tính năng mới
- `bugfix/bug-name` - Sửa bug
- `hotfix/critical-bug` - Sửa bug khẩn cấp

## 📋 Checklist Trước Khi Push

- [ ] Code chạy không lỗi: `npm run dev`
- [ ] Build thành công: `npm run build`
- [ ] Đã test các tính năng chính
- [ ] Đã update README.md nếu cần
- [ ] Đã xóa console.log không cần thiết
- [ ] `.gitignore` đã cover tất cả sensitive files
- [ ] **KHÔNG** commit `.env` files
- [ ] **KHÔNG** commit `node_modules/`
- [ ] Commit message rõ ràng, mô tả đúng thay đổi

## 🔐 Bảo Mật

### ⚠️ TUYỆT ĐỐI KHÔNG COMMIT:

- ❌ `.env` files với API keys
- ❌ Supabase credentials
- ❌ Database passwords
- ❌ JWT secrets
- ❌ Personal access tokens

### ✅ Nếu Đã Commit Nhầm:

```bash
# Xóa file khỏi Git history (nhưng giữ file local)
git rm --cached .env
git commit -m "Remove .env from git"
git push

# Thêm vào .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
git push
```

**Sau đó:**
1. Đổi ngay API keys/tokens đã bị leak
2. Tạo keys mới trên Supabase
3. Update local `.env` với keys mới

## 🆘 Troubleshooting

### Lỗi: "Permission denied"
```bash
# Kiểm tra SSH key hoặc dùng HTTPS với token
git remote set-url origin https://github.com/YOUR_USERNAME/bluebolt-finance.git
```

### Lỗi: "Updates were rejected"
```bash
# Pull trước khi push
git pull origin main --rebase
git push
```

### Lỗi: "Large files"
```bash
# GitHub giới hạn file 100MB
# Dùng Git LFS hoặc xóa file lớn

# Install Git LFS
git lfs install
git lfs track "*.zip"
git add .gitattributes
```

### Reset Về Commit Trước
```bash
# Soft reset (giữ changes)
git reset --soft HEAD~1

# Hard reset (xóa changes)
git reset --hard HEAD~1
```

## 📚 Git Commands Cheat Sheet

```bash
# Status & Info
git status              # Xem trạng thái
git log                 # Xem lịch sử commit
git log --oneline       # Lịch sử ngắn gọn
git diff                # Xem thay đổi

# Branch
git branch              # List branches
git branch <name>       # Tạo branch
git checkout <name>     # Chuyển branch
git checkout -b <name>  # Tạo và chuyển branch
git merge <name>        # Merge branch

# Remote
git remote -v           # Xem remote
git fetch               # Fetch từ remote
git pull                # Pull và merge
git push                # Push lên remote

# Undo
git restore <file>      # Restore file
git restore --staged <file>  # Unstage file
git reset HEAD~1        # Undo commit
git revert <commit>     # Revert commit
```

## 🎓 Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Pro Git Book](https://git-scm.com/book/en/v2)

## 💡 Tips

1. **Commit thường xuyên**: Mỗi feature nhỏ nên commit
2. **Message rõ ràng**: Người khác đọc hiểu ngay
3. **Branch cho feature**: Không làm trực tiếp trên main
4. **Pull trước khi push**: Tránh conflict
5. **Review code**: Xem lại trước khi commit

---

**Chúc bạn thành công! 🎉**

Nếu gặp vấn đề, hãy check:
- [GitHub Community](https://github.community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/git)
