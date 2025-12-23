# Tổng Quan Cấu Trúc Dự Án (Project Structure Overview)

## 📊 Sơ Đồ Cấu Trúc Tổng Thể

```
Cuoiky/
│
├── README.md                           ← Tài liệu chính
├── GUIDE.md                            ← Hướng dẫn phát triển
├── PROJECT_STRUCTURE.md                ← File này
│
├── final-api/                          ← BACKEND (PHP + PostgreSQL)
│   ├── index.php
│   ├── classroom.php
│   ├── database_schema.sql
│   ├── folder_structure.txt
│   │
│   ├── app/
│   │   ├── common/
│   │   │   ├── db.php                  ← Kết nối database
│   │   │   └── define.php              ← Config & constants
│   │   │
│   │   ├── controller/
│   │   │   ├── common.php              ← Middleware
│   │   │   ├── classroom_add.php
│   │   │   ├── classroom_edit.php
│   │   │   └── classroom_search.php
│   │   │
│   │   ├── model/
│   │   │   ├── classroom.php
│   │   │   ├── device.php
│   │   │   ├── teacher.php
│   │   │   └── transaction.php
│   │   │
│   │   └── modules/
│   │       ├── auth/
│   │       │   ├── models/
│   │       │   │   └── admin.php
│   │       │   └── views/
│   │       │       ├── login.php
│   │       │       ├── home.php
│   │       │       ├── reset-password.php
│   │       │       └── admin-reset.php
│   │       │
│   │       ├── subjects/
│   │       │   ├── models/
│   │       │   │   └── subject.php
│   │       │   └── views/
│   │       │       ├── subjects.php
│   │       │       └── subject_add.php
│   │       │
│   │       ├── teachers/
│   │       │   ├── models/
│   │       │   │   └── teacher.php
│   │       │   └── views/
│   │       │       ├── teachers.php
│   │       │       └── teacher_add.php
│   │       │
│   │       ├── students/
│   │       │   ├── models/
│   │       │   │   └── student.php
│   │       │   └── views/
│   │       │       ├── students.php
│   │       │       └── student_add.php
│   │       │
│   │       └── scores/
│   │           ├── models/
│   │           │   └── score.php
│   │           └── views/
│   │               ├── scores.php
│   │               └── score_add.php
│   │
│   └── web/
│       ├── css/
│       │   └── style.css
│       ├── js/
│       ├── image/
│       └── avatar/
│
└── final-frontend/                     ← FRONTEND (Vanilla HTML/CSS/JavaScript)
    ├── README_VI.md
    │
    ├── public/
    │   ├── index.html                  ← Dashboard chính (entry point)
    │   ├── login.html                  ← Trang đăng nhập
    │   ├── subjects.html               ← Quản lý môn học
    │   ├── teachers.html               ← Quản lý giáo viên
    │   ├── students.html               ← Quản lý học sinh
    │   ├── classrooms.html             ← Quản lý lớp học
    │   ├── scores.html                 ← Quản lý điểm số
    │   │
    │   └── assets/
    │       │
    │       ├── css/
    │       │   └── style.css            ← Styling toàn cục
    │       │                             • Biến màu sắc
    │       │                             • Layout & Grid
    │       │                             • Componentscomponents (btn, form, table...)
    │       │                             • Responsive Design
    │       │
    │       ├── js/
    │       │   │
    │       │   ├── app.js               ← Script chính
    │       │   │                         • Khởi tạo app
    │       │   │                         • Navigation
    │       │   │                         • Global event listeners
    │       │   │                         • Check authentication
    │       │   │
    │       │   ├── services/
    │       │   │   └── api.js           ← API Client (Fetch API)
    │       │   │                         • APIClient class
    │       │   │                         • authService
    │       │   │                         • subjectService
    │       │   │                         • teacherService
    │       │   │                         • studentService
    │       │   │                         • scoreService
    │       │   │                         • classroomService
    │       │   │
    │       │   ├── utils/
    │       │   │   └── helpers.js       ← Utility Functions
    │       │   │                         • DOM utilities
    │       │   │                         • String utilities
    │       │   │                         • Array utilities
    │       │   │                         • Number utilities
    │       │   │                         • Date utilities
    │       │   │                         • Validation utilities
    │       │   │                         • Storage utilities
    │       │   │                         • Alert utilities
    │       │   │                         • debounce, throttle
    │       │   │
    │       │   └── pages/
    │       │       ├── subjects.js      ← Xử lý trang Môn Học
    │       │       ├── teachers.js      ← Xử lý trang Giáo Viên
    │       │       ├── students.js      ← Xử lý trang Học Sinh
    │       │       ├── classrooms.js    ← Xử lý trang Lớp Học
    │       │       └── scores.js        ← Xử lý trang Điểm Số
    │       │
    │       ├── images/
    │       │   └── (Hình ảnh của dự án)
    │       │
    │       └── icons/
    │           └── (Icon SVG hoặc PNG)
```

## 📄 Mô Tả Chi Tiết

### Frontend - public/

#### HTML Files

| File | Mục Đích | Navigation |
|------|---------|-----------|
| `login.html` | Trang đăng nhập | - |
| `index.html` | Dashboard chính | 🏠 Dashboard |
| `subjects.html` | Quản lý môn học | 📖 Môn Học |
| `teachers.html` | Quản lý giáo viên | 👨‍🏫 Giáo Viên |
| `students.html` | Quản lý học sinh | 👨‍🎓 Học Sinh |
| `classrooms.html` | Quản lý lớp học | 🏫 Lớp Học |
| `scores.html` | Quản lý điểm số | 📊 Điểm Số |

#### CSS (assets/css/style.css)

**Phần 1: Reset & Base**
- CSS reset
- Font family, colors
- CSS variables

**Phần 2: Layout**
- Container
- Sidebar navigation
- Main content area
- Header

**Phần 3: Components**
- Forms (input, label, validation)
- Buttons (primary, secondary, danger)
- Tables (header, body, hover)
- Modals
- Alerts

**Phần 4: Utilities**
- Pagination
- Cards
- Search bar
- Loading spinner
- Animations

**Phần 5: Responsive**
- Mobile (max-width: 480px)
- Tablet (max-width: 768px)

#### JavaScript (assets/js/)

##### app.js
```
- initializeApp()           Khởi tạo ứng dụng
- setupEventListeners()     Thiết lập event listeners
- checkAuthentication()     Kiểm tra xác thực
- handleLogout()            Xử lý đăng xuất
- requireAuth()             Kiểm tra yêu cầu auth
```

##### services/api.js
```
- APIClient class
  ├── constructor()
  ├── setToken()
  ├── getToken()
  └── request()           GET, POST, PUT, PATCH, DELETE

- authService
  ├── login()
  ├── logout()
  ├── getCurrentUser()
  ├── resetPassword()
  └── updatePassword()

- subjectService
  ├── getAll()
  ├── getById()
  ├── create()
  ├── update()
  ├── delete()
  └── search()

- teacherService, studentService, classroomService, scoreService (tương tự)
```

##### utils/helpers.js
```
- DOM
  ├── getElementById()
  ├── querySelector()
  ├── show(), hide()
  ├── addClass(), removeClass()
  ├── on(), off()
  ├── html(), text(), val()
  └── create()

- StringUtils
- ArrayUtils
- NumberUtils
- DateUtils
- ValidationUtils
- StorageUtils
- SessionUtils
- AlertUtils

- Helper Functions
  ├── showAlert()
  ├── showLoading()
  ├── debounce()
  └── throttle()
```

##### pages/*.js

Mỗi file xử lý một trang:

```
- loadData()               Tải dữ liệu từ API
- renderTable()            Render bảng HTML
- openAddModal()           Mở modal thêm
- editData()               Chỉnh sửa dữ liệu
- saveData()               Lưu dữ liệu
- deleteData()             Xóa dữ liệu
- searchData()             Tìm kiếm
- renderPagination()       Render phân trang
- setupEventListeners()    Thiết lập sự kiện
- closeModal()             Đóng modal
- showLoading()            Hiển thị loading
```

## 🔄 Luồng Dữ Liệu

```
HTML Form
   ↓
JavaScript Event Handler
   ↓
Validation (ValidationUtils)
   ↓
API Call (apiClient)
   ↓
Backend Processing
   ↓
Response
   ↓
Update UI (renderTable)
   ↓
Show Alert (AlertUtils)
```

## 📦 Dependencies

### Frontend
- ✅ HTML5 (built-in)
- ✅ CSS3 (built-in)
- ✅ JavaScript ES6+ (built-in)
- ✅ Fetch API (built-in)

**Không sử dụng:**
- ❌ React, Vue, Angular
- ❌ jQuery, Lodash
- ❌ Bootstrap, Tailwind
- ❌ npm, webpack, vite

### Backend
- PHP 7.4+
- PostgreSQL

## 🎯 Quy Ước

### File Naming
```
- HTML: kebab-case (subjects.html)
- JS: camelCase (api.js, helpers.js, subjects.js)
- CSS: kebab-case (style.css)
```

### Function & Variable Naming
```
- Variables: camelCase (let userData = {})
- Functions: camelCase (function loadData() {})
- Constants: UPPER_SNAKE_CASE (const API_BASE_URL = '')
- Classes: PascalCase (class APIClient {})
```

### Folder Structure
```
- assets/
  ├── css/        (CSS files)
  ├── js/         (JavaScript files)
  │   ├── services/   (API calls)
  │   ├── utils/      (Helper functions)
  │   └── pages/      (Page-specific logic)
  ├── images/     (Images)
  └── icons/      (Icons)
```

## 🚀 Deployment

### Frontend
1. Đảm bảo tất cả file HTML, CSS, JS trong thư mục `public/`
2. Sử dụng web server (Apache, Nginx, Node.js, v.v.)
3. Cấu hình CORS nếu cần

### Backend
1. Cấu hình PHP trên server
2. Cấu hình PostgreSQL database
3. Update API_BASE_URL trong `api.js` để trỏ đến production backend

## 📝 Ghi Chú Quan Trọng

1. **No Framework**: Dự án sử dụng Vanilla JavaScript thuần túy
2. **Simple CSS**: Không sử dụng CSS framework, chỉ CSS thuần
3. **Easy to Learn**: Dễ hiểu, dễ bảo trì, dễ mở rộng
4. **No Build Process**: Không cần npm, webpack, hoặc build tools
5. **Direct Browser**: Chạy trực tiếp trong trình duyệt

## 🔗 Liên Kết Liên Quan

- [README.md](README.md) - Tài liệu chính
- [GUIDE.md](GUIDE.md) - Hướng dẫn phát triển chi tiết
- [Backend Documentation](final-api/folder_structure.txt)
