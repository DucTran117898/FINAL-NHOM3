# Hệ Thống Quản Lý Trường Học

## Tổng Quan
Đây là một dự án hoàn chỉnh để quản lý trường học với kiến trúc **API-first**. Hệ thống bao gồm:

- **Backend (API)**: PHP thuần, RESTful API với JWT authentication
- **Frontend**: Vue 3 (Vite SPA)
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
- Refactored frontend sang Vue 3 + Vue Router (build bằng Vite)
- Centralized API client trong `final-frontend/src/services/api.js` với JWT token handling
- Login, dashboard và các trang quản lý được xây dựng bằng Vue components với validation & error handling

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
└── final-frontend/                     # FRONTEND (Vue 3 + Vite)
  ├── index.html                      # Vite entry (dashboard)
  ├── login.html                      # Vite entry (login)
  ├── src/
  │   ├── main.js                     # Vue app entry + router
  │   ├── App.vue                     # Root component
  │   ├── components/                 # Vue pages/components (Dashboard, Students, Teachers, ...)
  │   ├── services/
  │   │   └── api.js                  # API client (JWT, REST calls)
  │   └── assets/
  │       └── css/style.css           # Global styles
  ├── public/                         # (Legacy) static HTML/CSS/JS frontend, có thể xoá sau khi không dùng nữa
  ├── package.json                    # Vite + Vue dependencies & scripts
  └── vite.config.js                  # Vite config (multi-entry: index.html, login.html)
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

### 5. Chạy Frontend (Vue + Vite)
```bash
cd final-frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: **`http://localhost:3000`** (theo cấu hình Vite).

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
└── final-frontend/              # Frontend (Vue 3 + Vite SPA)
  ├── index.html               # Vite entry (dashboard)
  ├── login.html               # Vite entry (login)
  ├── src/
  │   ├── main.js              # Khởi tạo Vue app + router
  │   ├── App.vue              # Root component
  │   ├── components/          # Các màn hình: Login, Dashboard, Students, Teachers, Subjects, Scores, ...
  │   ├── services/
  │   │   └── api.js           # HTTP client giao tiếp backend (JWT)
  │   └── assets/
  │       └── css/style.css    # Styling chính (dùng lại CSS cũ)
  ├── public/                  # Legacy static frontend (có thể xoá nếu không dùng)
  ├── package.json             # Scripts: dev/build/preview với Vite
  └── vite.config.js           # Cấu hình Vite (multi-entry, alias @ -> src)
```

## Hướng Dẫn Chạy Dự Án

### 1. Chuẩn Bị
- Cài **PHP 7.4+**
- Cài **MySQL 5.7+**
- Cài **Node.js 18+** (để chạy Vite)
- Cài **Visual Studio Code**

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

```bash
# 4. Chạy PHP server
cd final-api
php -S 127.0.0.1:8000 index.php
```

Backend sẽ chạy tại: **`http://127.0.0.1:8000`**

### 3. Cài Đặt Frontend (Vue 3 + Vite)

```bash
cd final-frontend
npm install
npm run dev
```

Frontend development server sẽ chạy tại: **`http://localhost:3000`**.

### 4. Kiểm Tra Kết Nối
- ✅ Backend API: **`http://127.0.0.1:8000`**
- ✅ Frontend (Vite dev): **`http://localhost:3000`**
- ✅ Đảm bảo cả 2 đều chạy cùng lúc

### 5. Đăng Nhập Lần Đầu
- Truy cập: `http://localhost:3000/login.html`
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
- **JWT-based Authentication** - Xác thực người dùng bằng JWT token

### Frontend
- **Vue 3** - UI framework (Single Page Application)
- **Vue Router** - Client-side routing
- **Vite** - Dev server & bundler
- **CSS3** - Styling (tái sử dụng style cũ)

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

### Frontend Pages (Vue)
- **Login.vue** (route `/login.html`) - Trang đăng nhập với validation & error handling
- **Dashboard.vue** (routes `/` và `/index.html`) - Dashboard với role display & protected navigation
- **StudentsList.vue / TeachersList.vue / SubjectsList.vue / ScoresList.vue** - Các trang quản lý danh sách
- **StudentEdit.vue / TeacherEdit.vue / SubjectEdit.vue / ScoreEdit.vue** - Form thêm/sửa dữ liệu
- **ResetPasswordRequest.vue / AdminResetRequests.vue** - Luồng reset password
- **src/services/api.js** - API client với JWT token authentication

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
