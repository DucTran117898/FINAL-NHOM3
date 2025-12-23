# Hệ Thống Quản Lý Trường Học

## Tổng Quan
Đây là một dự án hoàn chỉnh để quản lý trường học bao gồm cả Backend (PHP) và Frontend (Vanilla HTML/CSS/JavaScript). Hệ thống giúp quản lý môn học, giáo viên, học sinh, điểm số và lớp học.

## Cấu Trúc Thư Mục Chính

```
Cuoiky/
├── README.md                    # Tài liệu chính (file này)
├── GUIDE.md                     # Hướng dẫn phát triển
├── PROJECT_STRUCTURE.md         # Tổng quan cấu trúc dự án
├── final-api/                   # Backend (PHP + PostgreSQL)
│   ├── index.php               # Điểm vào chính
│   ├── database_schema.sql     # Schema cơ sở dữ liệu PostgreSQL
│   ├── folder_structure.txt    # Mô tả cấu trúc thư mục
│   ├── classroom.php           # Quản lý lớp học
│   └── app/
│       ├── common/
│       │   ├── db.php          # Kết nối cơ sở dữ liệu
│       │   └── define.php      # Hằng số và cấu hình
│       ├── controller/
│       │   ├── common.php      # Middleware xác thực
│       │   ├── classroom_add.php
│       │   ├── classroom_edit.php
│       │   └── classroom_search.php
│       ├── model/
│       │   ├── classroom.php
│       │   ├── device.php
│       │   ├── teacher.php
│       │   └── transaction.php
│       ├── modules/
│       │   ├── auth/           # Xác thực & Hệ thống
│       │   ├── subjects/       # Quản lý môn học
│       │   ├── teachers/       # Quản lý giáo viên
│       │   ├── students/       # Quản lý học sinh
│       │   └── scores/         # Quản lý điểm
│       └── web/
│           ├── css/
│           ├── js/
│           ├── image/
│           └── avatar/
└── final-frontend/              # Frontend (Pure HTML/CSS/JavaScript)
    ├── README_VI.md            # Tài liệu Frontend
    ├── public/
    │   ├── index.html          # Dashboard chính
    │   ├── login.html          # Trang đăng nhập
    │   ├── subjects.html       # Quản lý môn học
    │   ├── teachers.html       # Quản lý giáo viên
    │   ├── students.html       # Quản lý học sinh
    │   ├── classrooms.html     # Quản lý lớp học
    │   ├── scores.html         # Quản lý điểm số
    │   └── assets/
    │       ├── css/
    │       │   └── style.css
    │       ├── js/
    │       │   ├── app.js
    │       │   ├── services/
    │       │   │   └── api.js
    │       │   ├── utils/
    │       │   │   └── helpers.js
    │       │   └── pages/
    │       │       ├── subjects.js
    │       │       ├── teachers.js
    │       │       ├── students.js
    │       │       ├── classrooms.js
    │       │       └── scores.js
    │       ├── images/
    │       └── icons/
```

## Hướng Dẫn Cài Đặt

### Backend (PHP)
```bash
cd final-api
# Cấu hình database trong app/common/define.php
# Tạo database và import schema từ database_schema.sql
php -S localhost:8000
```

### Frontend (Vanilla HTML/CSS/JavaScript)
```bash
# Cách 1: Mở file trực tiếp
cd final-frontend
# Mở public/index.html trong trình duyệt

# Cách 2: Sử dụng Live Server (khuyến nghị)
# Cài VS Code extension: Live Server
# Chuột phải vào public/index.html > Open with Live Server
# Hoặc mở http://localhost:5500

# Lưu ý: Đảm bảo backend chạy trên http://localhost:8000
```

## Công Nghệ Sử Dụng

### Backend
- **PHP** - Server-side scripting
- **PostgreSQL** - Database

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling (Pure CSS, không dùng framework)
- **JavaScript (ES6+)** - Vanilla JS (không dùng React, Vue, Angular)
- **Fetch API** - Giao tiếp với backend

## Tính Năng Chính

### 1. Quản Lý Môn Học
- Xem danh sách môn học
- Thêm môn học mới
- Sửa thông tin môn học
- Xóa môn học
- Tìm kiếm môn học

### 2. Quản Lý Giáo Viên
- Xem danh sách giáo viên
- Thêm giáo viên mới
- Sửa thông tin giáo viên
- Xóa giáo viên
- Tìm kiếm giáo viên

### 3. Quản Lý Học Sinh
- Xem danh sách học sinh
- Thêm học sinh mới
- Sửa thông tin học sinh
- Xóa học sinh
- Tìm kiếm học sinh

### 4. Quản Lý Lớp Học
- Xem danh sách lớp học
- Thêm lớp học mới
- Sửa thông tin lớp học
- Xóa lớp học
- Tìm kiếm lớp học

### 5. Quản Lý Điểm Số
- Xem danh sách điểm số
- Thêm điểm số cho học sinh
- Sửa điểm số
- Xóa điểm số
- Tìm kiếm điểm số

### 6. Xác Thực
- Đăng nhập với email và mật khẩu
- Đăng xuất
- Quản lý session

## Quy Ước Code

### Đặt Tên File
| Loại | Quy Ước | Ví Dụ |
|------|--------|-------|
| HTML | kebab-case | `subjects.html` |
| JavaScript | camelCase | `subjectService.js` |
| CSS | kebab-case | `style.css` |

### Đặt Tên Hàm và Biến
```javascript
// JavaScript - camelCase
const isLoading = false
function getUserData() { }
const API_BASE_URL = 'http://localhost:8000'  // Constants UPPER_SNAKE_CASE
```

## Hỗ Trợ Browser

- Chrome (88+)
- Firefox (87+)
- Safari (14+)
- Edge (88+)

## Tác Giả

Dev Team

## License

MIT
