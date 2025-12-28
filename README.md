# Hệ Thống Quản Lý Trường Học

## Tổng Quan
Đây là một dự án hoàn chỉnh để quản lý trường học bao gồm cả Backend (PHP) và Frontend (Vanilla HTML/CSS/JavaScript). Hệ thống giúp quản lý môn học, giáo viên, học sinh, điểm số và lớp học.

## Cấu Trúc Thư Mục Chính

```
Cuoiky/
├── README.md                    # Tài liệu chính (file này)
├── GUIDE.md                     # Hướng dẫn phát triển
├── PROJECT_STRUCTURE.md         # Tổng quan cấu trúc dự án
├── .gitignore                   # Git ignore file
├── final-api/                   # Backend (PHP + MySQL)
│   ├── api-router.php          # Router xử lý API request
│   ├── index.php               # Điểm vào chính
│   ├── classroom.php           # Quản lý lớp học (legacy)
│   ├── database_schema.sql     # Schema cơ sở dữ liệu MySQL
│   ├── folder_structure.txt    # Mô tả cấu trúc thư mục
│   ├── .env                    # File cấu hình môi trường (local)
│   ├── .env.example            # Template file cấu hình
│   ├── app/
│   │   ├── api/                # RESTful API endpoints
│   │   │   └── auth.php        # API xác thực (login, logout, reset-password)
│   │   ├── common/
│   │   │   ├── db.php          # Kết nối cơ sở dữ liệu MySQL
│   │   │   └── define.php      # Hằng số và cấu hình (đọc từ .env)
│   │   ├── controller/
│   │   │   ├── common.php      # Middleware xác thực
│   │   │   ├── classroom_add.php
│   │   │   ├── classroom_edit.php
│   │   │   └── classroom_search.php
│   │   ├── model/
│   │   │   ├── classroom.php
│   │   │   ├── device.php
│   │   │   ├── teacher.php
│   │   │   └── transaction.php
│   │   ├── modules/            # Các module chức năng
│   │   │   ├── auth/           # Xác thực & Quản lý admin
│   │   │   │   ├── models/
│   │   │   │   │   └── admin.php
│   │   │   │   └── views/
│   │   │   │       ├── admin-reset.php
│   │   │   │       ├── home.php
│   │   │   │       ├── login.php
│   │   │   │       └── reset-password.php
│   │   │   ├── subjects/       # Quản lý môn học
│   │   │   │   ├── models/
│   │   │   │   │   └── subject.php
│   │   │   │   └── views/
│   │   │   │       ├── subject_add.php
│   │   │   │       └── subjects.php
│   │   │   ├── teachers/       # Quản lý giáo viên
│   │   │   │   ├── models/
│   │   │   │   │   └── teacher.php
│   │   │   │   └── views/
│   │   │   │       ├── teacher_add.php
│   │   │   │       └── teachers.php
│   │   │   ├── students/       # Quản lý học sinh
│   │   │   │   ├── models/
│   │   │   │   │   └── student.php
│   │   │   │   └── views/
│   │   │   │       ├── student_add.php
│   │   │   │       └── students.php
│   │   │   └── scores/         # Quản lý điểm
│   │   │       ├── models/
│   │   │       │   └── score.php
│   │   │       └── views/
│   │   │           ├── score_add.php
│   │   │           └── scores.php
│   │   └── web/
│   │       ├── css/
│   │       ├── js/
│   │       ├── image/
│   │       └── avatar/
│   └── .gitignore              # Git ignore cho backend
│
└── final-frontend/              # Frontend (Pure HTML/CSS/JavaScript)
    ├── README_VI.md            # Tài liệu Frontend
    ├── public/
    │   ├── index.html          # Dashboard chính (home page)
    │   ├── login.html          # Trang đăng nhập
    │   ├── subjects.html       # Quản lý môn học
    │   ├── teachers.html       # Quản lý giáo viên
    │   ├── students.html       # Quản lý học sinh
    │   ├── classrooms.html     # Quản lý lớp học
    │   ├── scores.html         # Quản lý điểm số
    │   └── assets/
    │       ├── css/
    │       │   └── style.css   # Styling chính
    │       ├── js/
    │       │   ├── app.js      # Quản lý routing & session
    │       │   ├── services/
    │       │   │   └── api.js  # Service giao tiếp với backend API
    │       │   ├── utils/
    │       │   │   └── helpers.js
    │       │   └── pages/      # Page-specific scripts
    │       │       ├── subjects.js
    │       │       ├── teachers.js
    │       │       ├── students.js
    │       │       ├── classrooms.js
    │       │       └── scores.js
    │       ├── images/
    │       └── icons/
```

## Hướng Dẫn Chạy Dự Án

### 1. Chuẩn Bị
- Cài **PHP 7.4+**
- Cài **MySQL 5.7+**
- Cài **Visual Studio Code**
- Cài extension **Live Server** trong VS Code (Publisher: Ritwick Dey)

### 2. Cài Đặt Backend (API)

```bash
# 1. Di chuyển vào thư mục backend
cd final-api

# 2. Cấu hình environment
# - Sao chép .env.example thành .env (tùy chọn)
# - File define.php sẽ tự động tải từ .env hoặc .env.example

# 3. Tạo database và import schema
# - Tạo database: school_management
# - Import: database_schema.sql vào MySQL database
# - Hoặc chạy: mysql -u root -p school_management < database_schema.sql

# 4. Chạy PHP server
cd final-api
php -S localhost:8000
```

Backend sẽ chạy tại: **`http://localhost:8000`**

### 3. Cài Đặt Frontend (với Live Server Extension)

**Cách 1: Sử dụng Live Server Extension (Khuyến nghị)**

```
1. Mở VS Code
2. Mở folder: final-frontend/public
3. Chuột phải vào file index.html
4. Chọn "Open with Live Server"
5. Browser sẽ tự động mở tại: http://127.0.0.1:5500
```

**Cách 2: Sử dụng terminal (nếu muốn)**

```bash
# Cài đặt live-server globally (nếu chưa có)
npm install -g live-server

# Di chuyển vào thư mục frontend
cd final-frontend/public

# Chạy live-server
live-server
```

### 4. Kiểm Tra Kết Nối
- ✅ Backend API: **`http://localhost:8000`**
- ✅ Frontend: **`http://127.0.0.1:5500`**
- ✅ Đảm bảo cả 2 đều chạy cùng lúc

### 5. Đăng Nhập Lần Đầu
- Truy cập: `http://127.0.0.1:5500/login.html`
- Đăng nhập với tài khoản admin (xem database_schema.sql để lấy thông tin)

## Công Nghệ Sử Dụng

### Backend
- **PHP 7.4+** - Server-side scripting
- **MySQL 5.7+** - Database
- **RESTful API** - API Architecture
- **Session-based Authentication** - Xác thực người dùng

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling (Pure CSS, không dùng framework)
- **JavaScript (ES6+)** - Vanilla JS (không dùng React, Vue, Angular)
- **Fetch API** - Giao tiếp với backend
- **Live Server** - Local development server

## Các Phần Đã Xây Dựng

### Backend API (`final-api/app/api/`)
- **auth.php** - API xác thực (Login/Logout/Reset Password)
  - POST `/api/auth/login` - Đăng nhập
  - POST `/api/auth/logout` - Đăng xuất
  - POST `/api/auth/reset-password` - Reset mật khẩu

### Frontend Pages
- **login.html** - Trang đăng nhập với xác thực reCAPTCHA
- **index.html** - Dashboard chính (protected by authentication)
- **assets/js/app.js** - Quản lý routing và session
- **assets/js/services/api.js** - Service giao tiếp với backend API

### Database
- **database_schema.sql** - Schema hoàn chỉnh cho tất cả các bảng

### Router
- **api-router.php** - Xử lý routing API request

## Tính Năng Chính (Sắp Hoàn Thành)

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

### 6. Xác Thực ✅ (Đã Hoàn Thành)
- ✅ Đăng nhập với email và mật khẩu
- ✅ Xác thực bằng reCAPTCHA
- ✅ Đăng xuất
- ✅ Quản lý session
- ✅ Reset mật khẩu

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
