# Hệ Thống Quản Lý Trường Học

## Tổng Quan
Đây là một dự án hoàn chỉnh để quản lý trường học với kiến trúc **API-first**. Hệ thống bao gồm:

- **Backend (API)**: PHP thuần, RESTful API với JWT authentication
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Database**: MySQL với role-based user system
- **Documentation**: Swagger UI

## 🚀 Tính Năng Chính

### Backend API
- ✅ **Authentication**: Login/Logout với JWT token và role-based access
- ✅ **User Roles**: Hỗ trợ admin, teacher, student roles
- ✅ **Password Reset**: Hoàn thiện chức năng reset password
- ✅ **Subjects Management**: CRUD môn học
- ✅ **Teachers Management**: CRUD giáo viên
- ✅ **Students Management**: CRUD học sinh
- ✅ **Scores Management**: CRUD điểm số
- ✅ **API Documentation**: Swagger UI

### Frontend
- ✅ **Dashboard**: Tổng quan hệ thống với role display
- ✅ **Subjects Page**: Quản lý môn học
- ✅ **Teachers Page**: Quản lý giáo viên
- ✅ **Students Page**: Quản lý học sinh
- ✅ **Scores Page**: Quản lý điểm số
- ✅ **Responsive Design**: Hoạt động trên mọi thiết bị

## 🔑 Key Changes

### Session Persistence & JWT Integration
- Implemented JWT on the backend to handle user authentication
- Ensured user sessions persist across page refreshes and navigation by storing and verifying tokens

### Enhanced Input Validation
- Added comprehensive client-side validation in login.html
- Users now receive specific error feedback for empty fields or inputs that do not meet length requirements

### API Security (Action Specification)
- Secured all core API endpoints (subjects, teachers, students, scores)
- Integrated checkAuth() middleware to verify authorization before processing requests

### Database-Driven Authentication
- Removed hardcoded/dummy API responses
- Implemented real database queries to authenticate credentials and retrieve user profiles

### Navigation & UI
- Updated the Sidebar navigation logic to reflect the user's authentication state dynamically

## 📋 Technical Notes

### Backend
- Updated auth.php to issue and verify tokens
- Implemented User model with role support
- Added middleware protection for API endpoints

### Frontend
- Updated app.js to manage token storage (LocalStorage) and attach them to outgoing requests
- Enhanced login form with validation and error handling

### Schema
- Updated database_schema.sql to support user roles and credential fields
- Added sample users with different roles (admin, teacher, student)

## 🧪 How to Verify

### Authentication Testing
- Attempt to access /subjects or /students without logging in (should be blocked)
- Log in with valid credentials; verify that the sidebar updates and the session remains active after a refresh
- Test the login form with empty or short inputs to trigger the new validation messages

### Role-Based Access
- Test with different user roles:
  - **admin**: `admin` / `123456`
  - **teacher**: `teacher1` / `123456`
  - **student**: `student1` / `123456`
- Verify role display in dashboard header

### Password Reset
- Test reset password functionality with valid login_id
- Verify admin approval workflow for password resets

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

# Import schema với user roles và sample data
mysql -u root -p school_management < final-api/database_schema.sql

# Schema bao gồm:
# - users table với role-based authentication (admin, teacher, student)
# - Sample accounts cho testing
# - Teachers, students, subjects, scores tables
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
POST /api/auth/login         # Đăng nhập với JWT token
POST /api/auth/logout        # Đăng xuất
GET  /api/auth/me            # Thông tin user hiện tại với role
POST /api/auth/reset-request # Yêu cầu reset password
GET  /api/auth/reset-list    # Admin xem danh sách reset requests
POST /api/auth/reset-approve # Admin duyệt reset password
```

### User Roles
- **admin**: Full system access, manage users, approve password resets
- **teacher**: Access to scores and student management
- **student**: View personal scores and information

### Sample Accounts
- **Admin**: `admin` / `123456`
- **Teacher**: `teacher1` / `123456` (Nguyen Van A)
- **Student**: `student1` / `123456` (Le Van C)

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
- **Sample Accounts:**
  - **Admin**: `admin` / `123456` (full access)
  - **Teacher**: `teacher1` / `123456` (scores & students)
  - **Student**: `student1` / `123456` (personal scores)
- Test role-based access và JWT session persistence

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
- **auth.php** - API xác thực hoàn chỉnh với JWT & role-based access
  - POST `/api/auth/login` - Đăng nhập với JWT token
  - POST `/api/auth/logout` - Đăng xuất
  - GET `/api/auth/me` - Thông tin user với role
  - POST `/api/auth/reset-request` - Yêu cầu reset password
  - GET `/api/auth/reset-list` - Admin xem reset requests
  - POST `/api/auth/reset-approve` - Admin duyệt reset
- **User Model** - Hỗ trợ role-based authentication (admin/teacher/student)

### Frontend Pages
- **login.html** - Trang đăng nhập với validation & error handling
- **index.html** - Dashboard với role display & protected navigation
- **assets/js/app.js** - JWT session management & role-based UI
- **assets/js/services/api.js** - API client với token authentication

### Database
- **database_schema.sql** - Schema với users table, roles & sample data
- **Role-based system** - Admin, teacher, student roles với permissions

### Security & Middleware
- **JWT Authentication** - Secure token-based sessions
- **API Protection** - Middleware bảo vệ tất cả endpoints
- **Input Validation** - Client & server-side validation

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
- ✅ **JWT Authentication**: Secure token-based sessions
- ✅ **Role-Based Access**: Admin, teacher, student roles
- ✅ **Database-Driven**: Real authentication vs dummy responses
- ✅ **Session Persistence**: Sessions survive page refreshes
- ✅ **API Protection**: Middleware bảo vệ tất cả endpoints
- ✅ **Password Reset**: Complete reset workflow với admin approval
- ✅ **Input Validation**: Client-side validation với error feedback
- ✅ **UI State Management**: Dynamic navigation based on auth state

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
