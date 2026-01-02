# Hệ Thống Quản Lý Trường Học

## Tổng Quan
Đây là một dự án hoàn chỉnh để quản lý trường học với kiến trúc **API-first**. Hệ thống bao gồm:

- **Backend (API)**: PHP thuần, RESTful API
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Database**: MySQL
- **Documentation**: Swagger UI

## 🚀 Tính Năng Chính

### Backend API
- ✅ **Authentication**: Login/Logout với JWT token
- ✅ **Subjects Management**: CRUD môn học
- ✅ **Teachers Management**: CRUD giáo viên
- ✅ **Students Management**: CRUD học sinh
- ✅ **Scores Management**: CRUD điểm số
- ✅ **API Documentation**: Swagger UI

### Frontend
- ✅ **Dashboard**: Tổng quan hệ thống
- ✅ **Subjects Page**: Quản lý môn học
- ✅ **Teachers Page**: Quản lý giáo viên
- ✅ **Students Page**: Quản lý học sinh
- ✅ **Scores Page**: Quản lý điểm số
- ✅ **Responsive Design**: Hoạt động trên mọi thiết bị

## 📁 Cấu Trúc Dự Án

```
Cuoiky/
├── README.md                           # Tài liệu chính
├── GUIDE.md                            # Hướng dẫn phát triển
├── PROJECT_STRUCTURE.md                # Chi tiết cấu trúc
├── final-api/                          # BACKEND (PHP API)
│   ├── index.php                       # Entry point & routing
│   ├── database_schema.sql             # MySQL schema
│   ├── .env                            # Environment config
│   ├── .env.example                    # Config template
│   ├── app/
│   │   ├── api/                        # API Endpoints
│   │   │   ├── auth.php                # Authentication
│   │   │   ├── subjects.php            # Subjects CRUD
│   │   │   ├── teachers.php            # Teachers CRUD
│   │   │   ├── students.php            # Students CRUD
│   │   │   └── scores.php              # Scores CRUD
│   │   ├── common/
│   │   │   ├── db.php                  # Database connection
│   │   │   └── define.php              # Constants & config
│   │   ├── controller/
│   │   │   └── common.php              # Middleware
│   │   ├── model/
│   │   │   └── teacher.php             # Teacher model
│   │   └── modules/
│   │       ├── auth/models/admin.php   # Admin model
│   │       ├── subjects/models/subject.php
│   │       ├── teachers/models/teacher.php
│   │       ├── students/models/student.php
│   │       └── scores/models/score.php
│
└── final-frontend/                     # FRONTEND (Vanilla JS)
    ├── public/
    │   ├── index.html                  # Dashboard
    │   ├── login.html                  # Login page
    │   ├── subjects.html               # Subjects management
    │   ├── teachers.html               # Teachers management
    │   ├── students.html               # Students management
    │   ├── scores.html                 # Scores management
    │   ├── api/docs/                   # API Documentation
    │   │   ├── index.html              # Swagger UI
    │   │   └── swagger.json            # OpenAPI spec
    │   └── assets/
    │       ├── css/style.css           # Global styles
    │       ├── js/
    │       │   ├── app.js              # Main app script
    │       │   ├── services/api.js     # API client
    │       │   ├── pages/              # Page scripts
    │       │   └── utils/helpers.js    # Utilities
    │       ├── images/                 # Static images
    │       └── icons/                  # Icons
```

## 🛠️ Cài Đặt & Chạy

### Yêu Cầu Hệ Thống
- PHP 7.4+
- MySQL 5.7+
- Web server (Apache/Nginx) hoặc PHP built-in server

### 1. Clone Repository
```bash
git clone <repository-url>
cd Cuoiky
```

### 2. Cấu Hình Database
```bash
# Tạo database MySQL
mysql -u root -p
CREATE DATABASE school_management;
exit

# Import schema
mysql -u root -p school_management < final-api/database_schema.sql
```

### 3. Cấu Hình Backend
```bash
cd final-api
cp .env.example .env
# Edit .env với thông tin database của bạn
```

### 4. Chạy Backend
```bash
cd final-api
php -S 127.0.0.1:8000 index.php
```

### 5. Chạy Frontend
Mở `final-frontend/public/index.html` trong browser hoặc dùng Live Server extension.

## 📖 API Documentation

Sau khi khởi động backend:
- **Swagger UI**: `http://127.0.0.1:8000/api/docs`
- **OpenAPI JSON**: `http://127.0.0.1:8000/api/docs/swagger.json`

## 🔑 API Endpoints

### Authentication
```
POST /api/auth/login     # Đăng nhập
POST /api/auth/logout    # Đăng xuất
GET  /api/auth/me        # Thông tin user hiện tại
```

### Subjects
```
GET    /api/subjects           # List subjects
GET    /api/subjects/{id}      # Get subject by ID
POST   /api/subjects           # Create subject
PUT    /api/subjects/{id}      # Update subject
DELETE /api/subjects/{id}      # Delete subject
```

### Teachers
```
GET    /api/teachers           # List teachers
GET    /api/teachers/{id}      # Get teacher by ID
POST   /api/teachers           # Create teacher
PUT    /api/teachers/{id}      # Update teacher
DELETE /api/teachers/{id}      # Delete teacher
```

### Students
```
GET    /api/students           # List students
GET    /api/students/{id}      # Get student by ID
POST   /api/students           # Create student
PUT    /api/students/{id}      # Update student
DELETE /api/students/{id}      # Delete student
```

### Scores
```
GET    /api/scores             # List scores
GET    /api/scores/{id}        # Get score by ID
POST   /api/scores             # Create score
PUT    /api/scores/{id}        # Update score
DELETE /api/scores/{id}        # Delete score
```

## 🎨 Giao Diện

### Dashboard
- Tổng quan hệ thống
- Navigation menu
- User info & logout

### Management Pages
- **Subjects**: Thêm/sửa/xóa/tìm kiếm môn học
- **Teachers**: Quản lý giáo viên
- **Students**: Quản lý học sinh
- **Scores**: Quản lý điểm số

## 🏗️ Kiến Trúc

### Backend
- **Entry Point**: `index.php` - Route requests
- **API Layer**: `app/api/` - RESTful endpoints
- **Business Logic**: `app/controller/` - Middleware
- **Data Layer**: `app/model/` & `app/modules/*/models/` - Database operations
- **Config**: `app/common/` - DB connection & constants

### Frontend
- **Pages**: HTML files cho từng chức năng
- **Scripts**: JavaScript xử lý logic & API calls
- **Styles**: CSS responsive design
- **API Client**: `api.js` - Centralized HTTP requests

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For questions or issues, please create an issue in the repository.
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
