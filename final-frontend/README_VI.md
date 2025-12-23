# Frontend - Hệ Thống Quản Lý Trường Học

## 📌 Giới Thiệu

Frontend được xây dựng bằng **Vanilla HTML5 + CSS3 + JavaScript (ES6+)** - không sử dụng framework như React, Vue hay Angular.

## 🚀 Cách Chạy

### Phương pháp 1: Live Server (Khuyến Nghị)
```bash
# Cài VS Code Extension "Live Server" (by Ritwick Dey)
# Chuột phải vào public/index.html
# Chọn "Open with Live Server"
# Truy cập http://localhost:5500
```

### Phương pháp 2: Python HTTP Server
```bash
cd final-frontend/public
python -m http.server 8080
# Truy cập http://localhost:8080
```

### Phương pháp 3: Node.js HTTP Server
```bash
cd final-frontend/public
npx http-server
# Truy cập http://localhost:8080
```

### Phương pháp 4: Mở trực tiếp
```bash
# Mở public/index.html bằng trình duyệt
# Chuột phải > Mở bằng > Trình duyệt
```

## 📁 Cấu Trúc Thư Mục

```
final-frontend/
├── README_VI.md              ← File này
├── public/                   ← Tất cả file phục vụ cho client
│   ├── index.html
│   ├── login.html
│   ├── subjects.html
│   ├── teachers.html
│   ├── students.html
│   ├── classrooms.html
│   ├── scores.html
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

## 📱 Tính Năng

### 1. **Trang Đăng Nhập** (login.html)
- Form nhập email và mật khẩu
- Validation client-side
- Lưu token trong localStorage
- Redirect sau khi đăng nhập thành công

### 2. **Dashboard** (index.html)
- Hiển thị navigation menu
- Thông tin người dùng
- Nút đăng xuất

### 3. **Quản Lý Môn Học** (subjects.html)
- Danh sách môn học với phân trang
- Thêm môn học mới
- Sửa thông tin môn học
- Xóa môn học
- Tìm kiếm môn học

### 4. **Quản Lý Giáo Viên** (teachers.html)
- Danh sách giáo viên
- CRUD operations (Create, Read, Update, Delete)
- Tìm kiếm

### 5. **Quản Lý Học Sinh** (students.html)
- Danh sách học sinh
- CRUD operations
- Tìm kiếm

### 6. **Quản Lý Lớp Học** (classrooms.html)
- Danh sách lớp học
- CRUD operations
- Tìm kiếm

### 7. **Quản Lý Điểm Số** (scores.html)
- Danh sách điểm số
- CRUD operations
- Tìm kiếm

## 🛠️ Công Nghệ

| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| HTML5 | - | Markup structure |
| CSS3 | - | Styling & Layout |
| JavaScript | ES6+ | Logic & Interactivity |
| Fetch API | - | HTTP requests |
| Local Storage | - | Client-side storage |

## 📝 Cấu Trúc Code

### Ví dụ: subjects.js

```javascript
// 1. Đảm bảo xác thực
document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    
    loadSubjects();
    setupEventListeners();
});

// 2. Thiết lập event listeners
function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', openAddModal);
    // ... more listeners
}

// 3. Tải dữ liệu
async function loadSubjects(page = 1) {
    try {
        const response = await subjectService.getAll(page, 10);
        renderTable(response.data);
    } catch (error) {
        AlertUtils.error('Lỗi tải dữ liệu');
    }
}

// 4. Render giao diện
function renderTable(data) {
    // HTML template
}

// 5. Lưu dữ liệu
async function saveSubject() {
    const data = getFormData();
    try {
        await subjectService.create(data);
        AlertUtils.success('Thêm thành công');
        loadSubjects();
    } catch (error) {
        AlertUtils.error('Lỗi lưu dữ liệu');
    }
}
```

## 🔐 Xác Thực

```javascript
// Login
- Email & Password validation
- API call đến /api/auth/login
- Lưu token trong localStorage
- Redirect đến trang chủ

// Logout
- Clear token từ localStorage
- Redirect đến trang đăng nhập

// Check Auth
- Kiểm tra token trước khi tải page
- Nếu không có token, redirect đến login
```

## 🎨 CSS

### Biến Màu (CSS Variables)
```css
:root {
    --primary: #3b82f6;           /* Xanh dương */
    --secondary: #10b981;         /* Xanh lá */
    --danger: #ef4444;            /* Đỏ */
    --warning: #f59e0b;           /* Vàng */
    --success: #10b981;           /* Xanh lá */
    --border: #e5e7eb;            /* Xám nhạt */
    --text-primary: #1f2937;      /* Đen */
    --text-secondary: #6b7280;    /* Xám */
}
```

### Component Classes
```css
.btn                 /* Button base */
.btn-primary         /* Primary button */
.btn-danger          /* Danger button */
.form-group          /* Form field */
.table-wrapper       /* Table container */
.modal               /* Modal dialog */
.alert               /* Alert message */
.spinner             /* Loading spinner */
```

## 📦 API Client

### Cách Sử Dụng

```javascript
// Setup
const apiClient = new APIClient('http://localhost:8000');

// Login
const response = await authService.login(email, password);
apiClient.setToken(response.token);

// CRUD Operations
const data = await subjectService.getAll(page, limit);
await subjectService.create(formData);
await subjectService.update(id, formData);
await subjectService.delete(id);
await subjectService.search(query);
```

## 🔧 Utility Functions

### DOM Operations
```javascript
DOM.getElementById('id')
DOM.querySelector('selector')
DOM.show(element)
DOM.hide(element)
DOM.on(element, 'event', handler)
```

### Validation
```javascript
ValidationUtils.isEmail(email)
ValidationUtils.isPhone(phone)
ValidationUtils.isStrongPassword(password)
```

### Date Formatting
```javascript
DateUtils.format(date, 'DD/MM/YYYY')
DateUtils.isToday(date)
DateUtils.daysAgo(date)
```

### Alerts
```javascript
AlertUtils.success('Thành công')
AlertUtils.error('Lỗi')
AlertUtils.warning('Cảnh báo')
AlertUtils.info('Thông tin')
```

### Storage
```javascript
StorageUtils.set('key', value)
StorageUtils.get('key', defaultValue)
StorageUtils.remove('key')
```

## 🌐 API Endpoints

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/subjects?page=1&limit=10
POST   /api/subjects
GET    /api/subjects/:id
PUT    /api/subjects/:id
DELETE /api/subjects/:id
GET    /api/subjects/search?q=query

(Tương tự cho teachers, students, classrooms, scores)
```

## 💡 Best Practices

1. **Luôn validate dữ liệu** trước khi gửi
2. **Xử lý error** cho mọi API call
3. **Hiển thị feedback** cho user (success/error messages)
4. **Tái sử dụng code** thông qua utility functions
5. **Comment code** để giải thích logic phức tạp
6. **Follow naming conventions** (camelCase cho JS)

## 🚀 Thêm Tính Năng Mới

1. Tạo file HTML mới (ví dụ: `myfeature.html`)
2. Tạo file JS tương ứng (`assets/js/pages/myfeature.js`)
3. Import các script cần thiết
4. Viết logic trong file JS
5. Update navigation trong sidebar
6. Test trên browser

## 📱 Responsive Design

Frontend được thiết kế responsive cho:
- Desktop (> 768px)
- Tablet (480px - 768px)
- Mobile (< 480px)

```css
/* Breakpoints */
max-width: 768px   /* Tablet */
max-width: 480px   /* Mobile */
```

## 🧪 Testing

### Test Manual
1. Mở browser Developer Tools (F12)
2. Kiểm tra Console tab cho errors
3. Kiểm tra Network tab cho API calls
4. Kiểm tra Elements tab cho HTML structure

### Test Cases
- Đăng nhập thành công/thất bại
- Xem danh sách (pagination)
- Thêm item mới
- Sửa item
- Xóa item
- Tìm kiếm
- Responsive design

## 🐛 Troubleshooting

### Lỗi: "API not responding"
- Kiểm tra backend đang chạy trên port 8000
- Kiểm tra URL trong `api.js`
- Kiểm tra CORS settings

### Lỗi: "Token is invalid"
- Clear localStorage
- Đăng nhập lại
- Kiểm tra token format

### Lỗi: "Page not loading"
- Kiểm tra file paths
- Kiểm tra browser console
- Kiểm tra HTML syntax

## 📞 Support

Nếu có câu hỏi:
1. Xem [README.md](../README.md)
2. Xem [GUIDE.md](../GUIDE.md)
3. Xem [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md)
4. Check browser console

## 📄 License

MIT

---

**Version**: 1.0  
**Last Updated**: December 2024  
**Author**: Dev Team
├── components/          # Các thành phần React có thể tái sử dụng
│   ├── layout/         # Các thành phần bố cục (Header, Sidebar, Footer)
│   └── common/         # Các thành phần chung (Button, Input, Modal, Table)
├── pages/              # Các trang chính của ứng dụng
│   ├── auth/           # Đăng nhập, Đăng xuất, Quên mật khẩu
│   ├── subjects/       # Quản lý môn học
│   ├── teachers/       # Quản lý giáo viên
│   ├── students/       # Quản lý học sinh
│   ├── scores/         # Quản lý điểm
│   └── classrooms/     # Quản lý lớp học
├── services/           # API calls và tương tác với backend
│   ├── authService.js
│   ├── subjectService.js
│   ├── teacherService.js
│   ├── studentService.js
│   ├── scoreService.js
│   └── classroomService.js
├── utils/              # Các hàm tiện ích
│   ├── helpers.js      # Hàm trợ giúp chung
│   ├── validators.js   # Hàm kiểm tra dữ liệu
│   └── constants.js    # Hằng số ứng dụng
├── styles/             # CSS toàn cục
│   ├── index.css
│   ├── variables.css
│   └── tailwind.css
├── App.jsx            # Component chính
└── main.jsx           # Entry point của React
```

### `/public` - Tài Nguyên Tĩnh
```
public/
├── index.html         # File HTML chính
├── assets/            # Hình ảnh, icon, font
│   ├── images/
│   ├── icons/
│   └── fonts/
└── favicon.ico
```

## Các Module Chính

### 1. **Xác Thực (Auth)**
- Đăng nhập
- Đăng xuất
- Quên mật khẩu
- Đặt lại mật khẩu

**Files:**
- `pages/auth/Login.jsx`
- `pages/auth/ResetPassword.jsx`
- `pages/auth/Home.jsx`
- `services/authService.js`

### 2. **Quản Lý Môn Học (Subjects)**
- Danh sách môn học
- Thêm môn học
- Chỉnh sửa môn học
- Xóa môn học
- Tìm kiếm môn học

**Files:**
- `pages/subjects/SubjectList.jsx`
- `pages/subjects/SubjectAdd.jsx`
- `pages/subjects/SubjectEdit.jsx`
- `services/subjectService.js`

### 3. **Quản Lý Giáo Viên (Teachers)**
- Danh sách giáo viên
- Thêm giáo viên
- Chỉnh sửa giáo viên
- Xóa giáo viên
- Tìm kiếm giáo viên

**Files:**
- `pages/teachers/TeacherList.jsx`
- `pages/teachers/TeacherAdd.jsx`
- `pages/teachers/TeacherEdit.jsx`
- `services/teacherService.js`

### 4. **Quản Lý Học Sinh (Students)**
- Danh sách học sinh
- Thêm học sinh
- Chỉnh sửa học sinh
- Xóa học sinh
- Tìm kiếm học sinh

**Files:**
- `pages/students/StudentList.jsx`
- `pages/students/StudentAdd.jsx`
- `pages/students/StudentEdit.jsx`
- `services/studentService.js`

### 5. **Quản Lý Điểm (Scores)**
- Danh sách điểm
- Thêm điểm
- Chỉnh sửa điểm
- Xóa điểm
- Tìm kiếm điểm

**Files:**
- `pages/scores/ScoreList.jsx`
- `pages/scores/ScoreAdd.jsx`
- `pages/scores/ScoreEdit.jsx`
- `services/scoreService.js`

### 6. **Quản Lý Lớp Học (Classrooms)**
- Danh sách lớp học
- Thêm lớp học
- Chỉnh sửa lớp học
- Xóa lớp học
- Tìm kiếm lớp học

**Files:**
- `pages/classrooms/ClassroomList.jsx`
- `pages/classrooms/ClassroomAdd.jsx`
- `pages/classrooms/ClassroomEdit.jsx`
- `services/classroomService.js`

## Hướng Dẫn Cài Đặt

### 1. Cài Đặt Dependencies
```bash
npm install
```

### 2. Cấu Hình Biến Môi Trường
Tạo file `.env.local` trong thư mục gốc:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=10000
```

### 3. Chạy Development Server
```bash
npm run dev
```

### 4. Build cho Production
```bash
npm run build
```

## Quy Ước Code

### Đặt Tên File
- **Components**: `PascalCase` (ví dụ: `SubjectList.jsx`)
- **Services**: `camelCase` (ví dụ: `subjectService.js`)
- **Utils**: `camelCase` (ví dụ: `helpers.js`)

### Cấu Trúc Component
```jsx
import React, { useState, useEffect } from 'react';
import { subjectService } from '@/services/subjectService';

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error) {
      console.error('Lỗi khi tải môn học:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
}
```

## Hướng Dẫn Phát Triển

### Thêm Tính Năng Mới
1. Tạo component tương ứng trong `pages/`
2. Tạo service trong `services/`
3. Thêm route vào `App.jsx`
4. Tạo unit tests

### Tạo Service Mới
```javascript
// services/subjectService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const subjectService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/subjects`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/api/subjects/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/api/subjects`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/api/subjects/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/api/subjects/${id}`);
    return response.data;
  },

  search: async (keyword) => {
    const response = await axios.get(`${API_BASE_URL}/api/subjects/search`, {
      params: { q: keyword }
    });
    return response.data;
  }
};
```

## Công Nghệ Sử Dụng
- **React**: 18.2.0 - UI library
- **React Router**: 6.0.0 - Routing
- **Axios**: 1.6.0 - HTTP client
- **Tailwind CSS**: 3.0.0 - Styling
- **Vite**: 4.0.0 - Build tool

## Tiêu Chuẩn Git

### Quy Ước Commit
```
feat: Thêm tính năng
fix: Sửa lỗi
docs: Cập nhật tài liệu
style: Thay đổi định dạng
refactor: Tái cấu trúc code
test: Thêm/Sửa tests
chore: Cập nhật dependencies
```

### Ví Dụ
```
git commit -m "feat: Thêm tính năng tìm kiếm môn học"
git commit -m "fix: Sửa lỗi validation form đăng nhập"
```

## Danh Sách Công Việc Để Hoàn Thành

- [ ] Tạo các component Layout (Header, Sidebar, Footer)
- [ ] Tạo các component chung (Button, Input, Modal, Table)
- [ ] Tạo trang Đăng nhập (Login)
- [ ] Tạo trang Quản lý Môn Học
- [ ] Tạo trang Quản lý Giáo Viên
- [ ] Tạo trang Quản lý Học Sinh
- [ ] Tạo trang Quản lý Điểm
- [ ] Tạo trang Quản lý Lớp Học
- [ ] Tạo các service API
- [ ] Tạo middleware xác thực
- [ ] Viết unit tests
- [ ] Tối ưu hóa hiệu năng
- [ ] Cấu hình CI/CD

## Liên Hệ Và Hỗ Trợ

Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ với team lead hoặc tạo một issue trong repository.

---

**Cập nhật lần cuối:** December 23, 2025
