# Tổng Quan Cấu Trúc Dự Án (Project Structure Overview)

## 📊 Sơ Đồ Cấu Trúc Tổng Thể

```
Cuoiky/
│
├── README.md                           ← Tài liệu chính
├── GUIDE.md                            ← Hướng dẫn phát triển
├── PROJECT_STRUCTURE.md                ← File này
│
├── final-api/                          ← BACKEND (PHP + MySQL)
│   ├── index.php                       ← Entry point & API routing
│   ├── database_schema.sql             ← MySQL database schema
│   ├── .env                            ← Environment configuration
│   ├── .env.example                    ← Config template
│   │
│   ├── app/
│   │   ├── api/                        ← RESTful API endpoints
│   │   │   ├── auth.php                ← Authentication (login/logout/me)
│   │   │   ├── subjects.php            ← Subjects CRUD operations
│   │   │   ├── teachers.php            ← Teachers CRUD operations
│   │   │   ├── students.php            ← Students CRUD operations
│   │   │   └── scores.php              ← Scores CRUD operations
│   │   │
│   │   ├── common/
│   │   │   ├── db.php                  ← Database connection
│   │   │   └── define.php              ← Constants & configuration
│   │   │
│   │   ├── controller/
│   │   │   └── common.php              ← Authentication middleware
│   │   │
│   │   ├── model/
│   │   │   └── teacher.php             ← Teacher data model
│   │   │
│   │   └── modules/
│   │       ├── auth/
│   │       │   └── models/
│   │       │       └── admin.php       ← Admin authentication model
│   │       │
│   │       ├── subjects/
│   │       │   └── models/
│   │       │       └── subject.php     ← Subject data model
│   │       │
│   │       ├── teachers/
│   │       │   └── models/
│   │       │       └── teacher.php     ← Teacher data model
│   │       │
│   │       ├── students/
│   │       │   └── models/
│   │       │       └── student.php     ← Student data model
│   │       │
│   │       └── scores/
│   │           └── models/
│   │               └── score.php       ← Score data model
│
└── final-frontend/                     ← FRONTEND (Vanilla HTML/CSS/JavaScript)
    ├── public/
    │   ├── index.html                  ← Dashboard chính (entry point)
    │   ├── login.html                  ← Trang đăng nhập
    │   ├── subjects.html               ← Quản lý môn học
    │   ├── teachers.html               ← Quản lý giáo viên
    │   ├── students.html               ← Quản lý học sinh
    │   ├── scores.html                 ← Quản lý điểm số
    │   │
    │   ├── api/docs/                   ← API Documentation (Swagger)
    │   │   ├── index.html              ← Swagger UI interface
    │   │   └── swagger.json            ← OpenAPI 3.0 specification
    │   │
    │   └── assets/
    │       │
    │       ├── css/
    │       │   └── style.css           ← Styling toàn cục
    │       │                           • Biến màu sắc
    │       │                           • Layout & Grid
    │       │                           • Components (btn, form, table...)
    │       │                           • Responsive Design
    │       │
    │       ├── js/
    │       │   ├── app.js              ← Script chính
    │       │   │                       • Navigation
    │       │   │                       • Authentication state
    │       │   │                       • Global utilities
    │       │   │
    │       │   ├── services/
    │       │   │   └── api.js          ← API client (Fetch API)
    │       │   │                       • HTTP requests
    │       │   │                       • Token management
    │       │   │                       • Error handling
    │       │   │
    │       │   ├── utils/
    │       │   │   └── helpers.js      ← Utility functions
    │       │   │                       • DOM manipulation
    │       │   │                       • Data formatting
    │       │   │                       • Validation
    │       │   │
    │       │   └── pages/
    │       │       ├── subjects.js     ← Xử lý trang Môn Học
    │       │       ├── teachers.js     ← Xử lý trang Giáo Viên
    │       │       ├── students.js     ← Xử lý trang Học Sinh
    │       │       └── scores.js       ← Xử lý trang Điểm Số
    │       │
    │       ├── images/                 ← Static images
    │       └── icons/                  ← Icons & favicons

## 🎯 Kiến Trúc Ứng Dụng

### Backend Architecture
- **Entry Point**: `index.php` xử lý routing cho tất cả requests
- **API Layer**: `app/api/` chứa các endpoint RESTful
- **Business Logic**: `app/controller/` middleware xác thực
- **Data Access**: `app/model/` & `app/modules/*/models/` tương tác database
- **Configuration**: `app/common/` kết nối DB & constants

### Frontend Architecture
- **Pages**: HTML files cho từng chức năng
- **Scripts**: JavaScript xử lý logic & API calls
- **Services**: `api.js` - HTTP client tập trung
- **Utilities**: Helper functions cho DOM & validation
- **Styling**: CSS responsive với component system

## 📋 Danh Sách Files Theo Chức Năng

### Backend Files

| File | Mô tả | Chức năng |
|------|--------|-----------|
| `index.php` | Entry point | API routing & static file serving |
| `database_schema.sql` | Database schema | MySQL tables: admins, subjects, teachers, students, scores |
| `.env` | Environment config | Database credentials & app settings |

#### API Endpoints
| File | Module | Endpoints |
|------|--------|-----------|
| `app/api/auth.php` | Authentication | POST /login, POST /logout, GET /me |
| `app/api/subjects.php` | Subjects | CRUD operations for subjects |
| `app/api/teachers.php` | Teachers | CRUD operations for teachers |
| `app/api/students.php` | Students | CRUD operations for students |
| `app/api/scores.php` | Scores | CRUD operations for scores |

#### Models
| File | Entity | Methods |
|------|--------|---------|
| `app/modules/auth/models/admin.php` | Admin | login(), validate() |
| `app/modules/subjects/models/subject.php` | Subject | getAll(), create(), update(), delete() |
| `app/modules/teachers/models/teacher.php` | Teacher | CRUD operations |
| `app/modules/students/models/student.php` | Student | CRUD operations |
| `app/modules/scores/models/score.php` | Score | CRUD operations |

### Frontend Files

#### HTML Pages
| File | Purpose | Features |
|------|---------|----------|
| `index.html` | Dashboard | Navigation, user info, logout |
| `login.html` | Authentication | Login form |
| `subjects.html` | Subject management | List, add, edit, delete subjects |
| `teachers.html` | Teacher management | CRUD teachers |
| `students.html` | Student management | CRUD students |
| `scores.html` | Score management | CRUD scores |

#### JavaScript Files
| File | Responsibility | Functions |
|------|----------------|-----------|
| `app.js` | Main application | Navigation, auth state, routing |
| `services/api.js` | API client | HTTP requests, token management |
| `utils/helpers.js` | Utilities | DOM helpers, validation, formatting |
| `pages/subjects.js` | Subject page | UI logic for subject management |
| `pages/teachers.js` | Teacher page | UI logic for teacher management |
| `pages/students.js` | Student page | UI logic for student management |
| `pages/scores.js` | Score page | UI logic for score management |

#### API Documentation
| File | Purpose |
|------|---------|
| `api/docs/index.html` | Swagger UI interface |
| `api/docs/swagger.json` | OpenAPI 3.0 specification |

## 🔄 Data Flow

### User Request Flow
1. **Frontend**: User interacts with HTML/JS
2. **API Call**: JavaScript calls `api.js` service
3. **HTTP Request**: Fetch API sends request to backend
4. **Routing**: `index.php` routes to appropriate API file
5. **Processing**: API file calls model methods
6. **Database**: Model interacts with MySQL database
7. **Response**: JSON response sent back to frontend
8. **UI Update**: JavaScript updates DOM with new data

### Authentication Flow
1. User submits login form
2. `api.js` sends POST /api/auth/login
3. Backend validates credentials
4. Returns JWT token
5. Token stored in localStorage
6. Subsequent requests include Bearer token
7. Token validated by middleware

## 📊 Database Schema

```sql
-- Core Tables
admins (id, login_id, password, actived_flag, reset_password_token, updated, created)
subjects (id, name, avatar, description, school_year, updated, created)
teachers (id, name, avatar, description, specialized, degree, updated, created)
students (id, name, avatar, description, classroom_id, updated, created)
scores (id, student_id, subject_id, score, exam_date, updated, created)
```

## 🚀 Deployment

### Development
- Backend: `php -S 127.0.0.1:8000 index.php`
- Frontend: Open `final-frontend/public/index.html` or use Live Server

### Production
- Backend: Deploy to PHP server (Apache/Nginx)
- Frontend: Static hosting or same server
- Database: MySQL server
- Environment: Configure `.env` for production settings

## 🛠️ Development Workflow

1. **Backend Changes**: Modify API files, test with Postman/Swagger
2. **Frontend Changes**: Update HTML/JS, test in browser
3. **Database Changes**: Update schema, run migrations
4. **Testing**: Manual testing, API documentation
5. **Deployment**: Git push, server restart

## 📝 Notes

- **Separation of Concerns**: Backend chỉ API, Frontend chỉ UI
- **API-First Design**: RESTful endpoints with OpenAPI spec
- **Modular Structure**: Clear separation by functionality
- **No Legacy Code**: Removed old MVC views, cleaned up unused files
- **Documentation**: Comprehensive Swagger docs for API consumers
