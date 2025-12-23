# Hướng Dẫn Phát Triển (Developer Guide) - Vanilla JavaScript

## 🚀 Bắt Đầu Nhanh

### Cài Đặt Môi Trường Phát Triển

#### Backend
```bash
cd final-api
# Cấu hình database trong app/common/define.php
php -S localhost:8000
```

#### Frontend
```bash
cd final-frontend
# Mở public/index.html bằng Live Server hoặc trình duyệt
# URL: http://localhost:5500 (Live Server) hoặc file:// (local)
# Đảm bảo backend chạy trên http://localhost:8000
```

## 📁 Cấu Trúc Folder Frontend

```
final-frontend/public/
├── index.html              # Dashboard chính
├── login.html              # Trang đăng nhập
├── subjects.html           # Quản lý môn học
├── teachers.html           # Quản lý giáo viên
├── students.html           # Quản lý học sinh
├── classrooms.html         # Quản lý lớp học
├── scores.html             # Quản lý điểm số
└── assets/
    ├── css/
    │   └── style.css       # CSS toàn cục
    ├── js/
    │   ├── app.js          # Script chính
    │   ├── services/
    │   │   └── api.js      # API client (Fetch API)
    │   ├── utils/
    │   │   └── helpers.js  # Utility functions
    │   └── pages/
    │       ├── subjects.js
    │       ├── teachers.js
    │       ├── students.js
    │       ├── classrooms.js
    │       └── scores.js
    ├── images/
    └── icons/
```

## 🛠️ API Services

### Cách Sử Dụng API Service

```javascript
// Gọi API từ bất kỳ đâu
// Tất cả các hàm đều return Promise

// Auth Service
await authService.login(email, password);
await authService.logout();
await authService.getCurrentUser();

// Subject Service
await subjectService.getAll(page, limit);
await subjectService.getById(id);
await subjectService.create(data);
await subjectService.update(id, data);
await subjectService.delete(id);
await subjectService.search(query);

// Teacher, Student, Classroom, Score Service tương tự
```

### API Client

```javascript
// Trong assets/js/services/api.js
const apiClient = new APIClient('http://localhost:8000');

// Thiết lập token sau khi đăng nhập
apiClient.setToken(token);

// Lấy token
const token = apiClient.getToken();

// Các phương thức: get, post, put, patch, delete
apiClient.get('/endpoint');
apiClient.post('/endpoint', data);
apiClient.put('/endpoint', data);
apiClient.delete('/endpoint');
```

## 🎨 Utility Functions

### DOM Utilities
```javascript
DOM.getElementById('id');
DOM.querySelector('selector');
DOM.show(element);
DOM.hide(element);
DOM.addClass(element, 'className');
DOM.removeClass(element, 'className');
DOM.on(element, 'event', handler);
DOM.val(element, value);
DOM.html(element, content);
```

### String Utilities
```javascript
StringUtils.capitalize(str);
StringUtils.camelToKebab(str);
StringUtils.truncate(str, length);
StringUtils.isEmpty(str);
```

### Array Utilities
```javascript
ArrayUtils.unique(arr);
ArrayUtils.flatten(arr);
ArrayUtils.groupBy(arr, key);
ArrayUtils.findBy(arr, key, value);
```

### Number Utilities
```javascript
NumberUtils.formatCurrency(amount);
NumberUtils.formatNumber(num, decimals);
NumberUtils.percentage(value, total);
```

### Date Utilities
```javascript
DateUtils.format(date, 'DD/MM/YYYY');
DateUtils.parse(dateString);
DateUtils.isToday(date);
DateUtils.daysAgo(date);
```

### Validation Utilities
```javascript
ValidationUtils.isEmail(email);
ValidationUtils.isPhone(phone);
ValidationUtils.isURL(url);
ValidationUtils.isStrongPassword(password);
ValidationUtils.isEmpty(value);
```

### Storage Utilities
```javascript
// Local Storage
StorageUtils.set(key, value);
StorageUtils.get(key, defaultValue);
StorageUtils.remove(key);

// Session Storage
SessionUtils.set(key, value);
SessionUtils.get(key);
```

### Alert Utilities
```javascript
AlertUtils.success(message);
AlertUtils.error(message);
AlertUtils.warning(message);
AlertUtils.info(message);

// Hoặc sử dụng hàm trực tiếp
showAlert(message, type, duration);
```

## 📋 Quy Ước Code

### 1. Đặt Tên
```javascript
// Variables & Functions
const isLoading = false;
function loadData() { }

// Classes
class APIClient { }

// Constants
const API_BASE_URL = 'http://localhost:8000';
const MAX_ITEMS = 10;
```

### 2. Cấu Trúc File

Mỗi trang (HTML file) có một file JS riêng:
- `subjects.html` ← `assets/js/pages/subjects.js`
- `teachers.html` ← `assets/js/pages/teachers.js`

Mỗi file JS page nên có:
1. Hàm `loadData()` - tải dữ liệu từ API
2. Hàm `renderTable()` - render bảng dữ liệu
3. Hàm `openAddModal()` / `openEditModal()` - mở modal
4. Hàm `saveData()` - lưu dữ liệu
5. Hàm `deleteData()` - xóa dữ liệu
6. Event listeners setup

### 3. Xử Lý Error

```javascript
try {
    const data = await subjectService.create(formData);
    AlertUtils.success('Thêm thành công!');
} catch (error) {
    console.error('Error:', error);
    AlertUtils.error(error.message || 'Lỗi không xác định');
}
```

### 4. Form Validation

```javascript
// Trước khi submit
function saveSubject() {
    const name = document.getElementById('name').value.trim();
    
    if (!name) {
        AlertUtils.error('Vui lòng nhập tên');
        return;
    }
    
    if (!ValidationUtils.isEmail(email)) {
        AlertUtils.error('Email không hợp lệ');
        return;
    }
    
    // Proceed with save
}
```

## 🔐 Xác Thực (Authentication)

### Luồng Đăng Nhập
1. User điền email và password
2. Gửi request đến `/api/auth/login`
3. Backend trả về token
4. Lưu token vào localStorage
5. Sử dụng token trong các request tiếp theo

### Kiểm Tra Authentication
```javascript
function requireAuth() {
    const token = apiClient.getToken();
    if (!token) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// Sử dụng
document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    // Load page data
});
```

## 📝 Thêm Tính Năng Mới

### Ví dụ: Thêm trang mới

1. **Tạo HTML file** (`public/newmodule.html`)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Module Mới</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Navigation, Header, Table, Modal -->
    
    <script src="assets/js/services/api.js"></script>
    <script src="assets/js/utils/helpers.js"></script>
    <script src="assets/js/app.js"></script>
    <script src="assets/js/pages/newmodule.js"></script>
</body>
</html>
```

2. **Tạo JS handler** (`assets/js/pages/newmodule.js`)
```javascript
document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    
    loadData();
    setupEventListeners();
});

function setupEventListeners() {
    // Bind button click handlers
}

async function loadData() {
    try {
        const response = await moduleService.getAll();
        renderTable(response.data);
    } catch (error) {
        AlertUtils.error('Lỗi tải dữ liệu');
    }
}

function renderTable(data) {
    // Render HTML table
}
```

3. **Cập nhật sidebar** (trong `public/index.html`)
```html
<li><a href="newmodule.html" class="nav-link" data-page="newmodule">📌 Module Mới</a></li>
```

## 🐛 Debug

### Xem logs
```javascript
// Chrome DevTools (F12)
// Console tab
console.log(data);
console.error(error);
console.table(arrayData);
```

### Kiểm tra API calls
```javascript
// Network tab trong DevTools
// Xem request/response
```

### Inspect Elements
```javascript
// Elements tab
// Kiểm tra HTML structure
```

## 📦 Dependencies

Frontend không phụ thuộc vào bất kỳ framework hay library nào (trừ là code của dự án).

Tất cả các chức năng được build từ:
- Vanilla HTML5
- Pure CSS3
- Vanilla JavaScript (ES6+)
- Fetch API (built-in)

## ⚡ Performance Tips

1. **Lazy Loading**: Chỉ load dữ liệu khi cần
2. **Debouncing**: Dùng `debounce()` cho search
3. **Caching**: Lưu dữ liệu trong sessionStorage nếu cần
4. **Minimization**: Giảm số lần DOM manipulation

```javascript
// Ví dụ debounce
const handleSearch = debounce(() => {
    searchData();
}, 300);

document.getElementById('searchInput').addEventListener('input', handleSearch);
```

## 🔗 API Endpoints

Backend cung cấp các endpoints:

```
GET    /api/subjects
POST   /api/subjects
GET    /api/subjects/:id
PUT    /api/subjects/:id
DELETE /api/subjects/:id

GET    /api/teachers
POST   /api/teachers
GET    /api/teachers/:id
PUT    /api/teachers/:id
DELETE /api/teachers/:id

GET    /api/students
POST   /api/students
GET    /api/students/:id
PUT    /api/students/:id
DELETE /api/students/:id

GET    /api/classrooms
POST   /api/classrooms
GET    /api/classrooms/:id
PUT    /api/classrooms/:id
DELETE /api/classrooms/:id

GET    /api/scores
POST   /api/scores
GET    /api/scores/:id
PUT    /api/scores/:id
DELETE /api/scores/:id

POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

## 💡 Best Practices

1. **Luôn kiểm tra xác thực** trước khi load page
2. **Validate dữ liệu** trước khi submit form
3. **Xử lý error** cho mọi API call
4. **Hiển thị thông báo** cho user sau mỗi action
5. **Sử dụng Promise** cho async operations
6. **Comment code** để giải thích logic phức tạp
7. **DRY Principle** - tái sử dụng code

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra browser console (F12)
2. Kiểm tra Network tab
3. Xem lại API response
4. Đảm bảo backend đang chạy
