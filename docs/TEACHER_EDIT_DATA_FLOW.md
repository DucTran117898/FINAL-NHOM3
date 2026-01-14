# Tài liệu Data Flow: Nút "Sửa" Giáo Viên (Teacher Edit Button)

## Mục lục
1. [Tổng quan](#1-tổng-quan)
2. [Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
3. [Data Flow Chi Tiết](#3-data-flow-chi-tiết)
4. [Giải thích Code từng bước](#4-giải-thích-code-từng-bước)
5. [Sequence Diagram](#5-sequence-diagram)
6. [Xử lý Avatar URL động](#6-xử-lý-avatar-url-động)
7. [API Endpoints](#7-api-endpoints)

---

## 1. Tổng quan

Nút **"Sửa"** trong trang danh sách giáo viên cho phép người dùng chỉnh sửa thông tin của một giáo viên đã tồn tại. Flow bao gồm:

1. **Click nút "Sửa"** → Điều hướng đến trang chỉnh sửa với `id` giáo viên
2. **Load dữ liệu** → Gọi API để lấy thông tin giáo viên
3. **Hiển thị form** → Điền dữ liệu vào form (bao gồm avatar)
4. **Submit form** → Gửi dữ liệu cập nhật lên server
5. **Redirect** → Chuyển đến trang thành công

---

## 2. Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Vue.js + Vite)                        │
│                         Port: 3000 (localhost) hoặc Codespaces              │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐        │
│  │  TeachersList   │────▶│  Vue Router     │────▶│  TeacherEdit    │        │
│  │     .vue        │     │   (main.js)     │     │     .vue        │        │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘        │
│           │                                              │                   │
│           │                                              ▼                   │
│           │                                    ┌─────────────────┐           │
│           │                                    │   api.js        │           │
│           │                                    │  (API Client)   │           │
│           └────────────────────────────────────┴────────┬────────┘           │
└─────────────────────────────────────────────────────────┼────────────────────┘
                                                          │
                                                          │ HTTP Requests
                                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (PHP)                                   │
│                         Port: 8000 (localhost) hoặc Codespaces              │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐        │
│  │  teachers.php   │────▶│  Teacher Model  │────▶│    MySQL DB     │        │
│  │   (API Route)   │     │  (teacher.php)  │     │                 │        │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                         │
│  │  /web/avatar/   │  ← Static files (Avatar images)                         │
│  │    teacher/     │                                                         │
│  └─────────────────┘                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cấu trúc thư mục liên quan

```
final-frontend/
├── src/
│   ├── main.js                    # Vue Router configuration
│   ├── services/
│   │   └── api.js                 # API Client & Services
│   └── components/
│       ├── TeachersList.vue       # Danh sách giáo viên (chứa nút "Sửa")
│       └── TeacherEdit.vue        # Form chỉnh sửa giáo viên

final-api/
├── app/
│   ├── api/
│   │   └── teachers.php           # API endpoints
│   └── modules/
│       └── teachers/
│           └── models/
│               └── teacher.php    # Teacher Model (Database operations)
└── web/
    └── avatar/
        └── teacher/               # Lưu trữ avatar images
```

---

## 3. Data Flow Chi Tiết

### Bước 1: Click nút "Sửa"

```
┌──────────────┐    click     ┌──────────────┐    navigate    ┌──────────────┐
│   Nút "Sửa"  │─────────────▶│ editTeacher()│───────────────▶│ /teachers/   │
│   (Button)   │              │   method     │                │ edit?id=3    │
└──────────────┘              └──────────────┘                └──────────────┘
```

### Bước 2: Load Teacher Data

```
┌──────────────┐   mounted()   ┌──────────────┐    GET        ┌──────────────┐
│ TeacherEdit  │──────────────▶│ loadTeacher  │──────────────▶│ /api/        │
│    .vue      │               │   Detail()   │               │ teachers/3   │
└──────────────┘               └──────────────┘               └──────────────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │   Response   │
                               │  JSON data   │
                               └──────────────┘
```

### Bước 3: Display Avatar

```
┌──────────────┐  getAPIBaseURL()  ┌───────────────────────────────────────┐
│ Teacher.avatar│─────────────────▶│ https://...github.dev:8000/web/avatar │
│  (filename)   │                  │       /teacher/teacher_xxx.png        │
└──────────────┘                   └───────────────────────────────────────┘
```

### Bước 4: Submit Update

```
┌──────────────┐   FormData    ┌──────────────┐    POST       ┌──────────────┐
│   Submit     │──────────────▶│  apiClient   │──────────────▶│ /api/        │
│    Form      │               │  .request()  │  _method=PUT  │ teachers/3   │
└──────────────┘               └──────────────┘               └──────────────┘
```

---

## 4. Giải thích Code từng bước

### 4.1 Nút "Sửa" trong TeachersList.vue

**File:** `src/components/TeachersList.vue`

```html
<!-- Template: Định nghĩa nút "Sửa" trong bảng -->
<tr v-for="(teacher, index) in teachers" :key="teacher.id">
  <td>{{ index + 1 }}</td>
  <td>{{ teacher.name || 'N/A' }}</td>
  <td>{{ teacher.specialized || 'N/A' }}</td>
  <td class="description-cell">{{ teacher.description || 'N/A' }}</td>
  <td>
    <button class="btn-delete" @click="deleteTeacher(teacher)">Xóa</button>
    <!-- Nút "Sửa" - gọi method editTeacher với teacher.id -->
    <button class="btn-edit" @click="editTeacher(teacher.id)">Sửa</button>
  </td>
</tr>
```

```javascript
// Method: Điều hướng đến trang chỉnh sửa
methods: {
  editTeacher(id) {
    // Sử dụng Vue Router để navigate đến /teachers/edit với query param id
    this.$router.push(`/teachers/edit?id=${id}`)
  }
}
```

**Giải thích:**
- `@click="editTeacher(teacher.id)"`: Khi click, gọi method `editTeacher` với ID của giáo viên
- `this.$router.push()`: Sử dụng Vue Router để chuyển trang mà không reload toàn bộ page (SPA navigation)
- Query param `?id=3`: Truyền ID giáo viên qua URL

---

### 4.2 Vue Router Configuration

**File:** `src/main.js`

```javascript
import TeacherEdit from './components/TeacherEdit.vue'

const routes = [
  // ... other routes
  {
    path: '/teachers/edit',      // URL pattern
    name: 'TeacherEdit',         // Route name
    component: TeacherEdit,      // Component để render
    meta: { requiresAuth: true } // Yêu cầu đăng nhập
  }
]

const router = createRouter({
  history: createWebHistory(),   // HTML5 History mode (không có #)
  routes
})
```

**Giải thích:**
- `path: '/teachers/edit'`: Định nghĩa URL pattern cho route này
- `component: TeacherEdit`: Khi URL match, Vue sẽ render component `TeacherEdit.vue`
- `meta: { requiresAuth: true }`: Metadata để kiểm tra authentication

---

### 4.3 TeacherEdit.vue - Component chính

**File:** `src/components/TeacherEdit.vue`

#### 4.3.1 Import và Setup

```javascript
<script>
import { teacherService, apiClient, authService } from '../services/api.js'
import AlertUtils from '../utils/helpers.js'

// Hàm để lấy API Base URL động (cho cả localhost và Codespaces)
const getAPIBaseURL = () => {
  if (window.location.hostname.includes('github.dev') || 
      window.location.hostname.includes('app.github.dev')) {
    // Trong Codespaces: thay port 3000 thành 8000
    return `${window.location.protocol}//${window.location.hostname.replace('-3000', '-8000')}`
  }
  // Local development
  return 'http://localhost:8000'
}
```

**Giải thích:**
- `teacherService`: Service để gọi các API liên quan đến teachers
- `apiClient`: HTTP client để gửi requests
- `getAPIBaseURL()`: **QUAN TRỌNG** - Hàm này xác định URL backend dựa trên môi trường:
  - **Codespaces**: `https://xxx-8000.app.github.dev`
  - **Localhost**: `http://localhost:8000`

#### 4.3.2 Data và State

```javascript
export default {
  name: 'TeacherEdit',
  data() {
    return {
      currentStep: 'input',        // Bước hiện tại: 'input' | 'confirm' | 'complete'
      teacherId: null,             // ID giáo viên đang sửa (null nếu tạo mới)
      form: {
        name: '',                  // Tên giáo viên
        specialized: '',           // Mã chuyên ngành (001, 002, 003)
        degree: '',                // Mã bằng cấp (001-005)
        description: '',           // Mô tả chi tiết
        avatarFile: null,          // File avatar mới (nếu có)
        existingAvatar: ''         // Tên file avatar hiện tại
      },
      previewUrl: '',              // URL để preview avatar
      errors: {},                  // Validation errors
      saving: false                // Trạng thái đang lưu
    }
  }
}
```

**Giải thích:**
- `currentStep`: Điều khiển multi-step form (3 bước: nhập liệu → xác nhận → hoàn thành)
- `form.existingAvatar`: Lưu tên file avatar hiện tại để không yêu cầu upload lại

#### 4.3.3 Lifecycle Hook - mounted()

```javascript
async mounted() {
  // 1. Kiểm tra authentication
  await this.checkAuthentication()

  // 2. Lấy teacher ID từ URL query params
  const params = new URLSearchParams(window.location.search)
  this.teacherId = params.get('id')  // Lấy giá trị của ?id=xxx

  // 3. Nếu có ID, load thông tin giáo viên (Edit mode)
  if (this.teacherId) {
    await this.loadTeacherDetail(this.teacherId)
  }
  // Nếu không có ID → Create mode (form trống)
}
```

**Giải thích:**
- `mounted()`: Vue lifecycle hook, chạy sau khi component được render vào DOM
- `URLSearchParams`: API để parse query string từ URL
- `this.teacherId = params.get('id')`: Lấy ID từ URL, ví dụ `/teachers/edit?id=3` → `teacherId = '3'`

#### 4.3.4 Load Teacher Data

```javascript
async loadTeacherDetail(id) {
  try {
    // 1. Gọi API để lấy thông tin giáo viên
    const res = await teacherService.getById(id)
    const data = res.data || res

    if (!data) {
      AlertUtils.error('Không tìm thấy giáo viên')
      this.$router.push('/teachers')
      return
    }

    // 2. Điền dữ liệu vào form
    this.form.name = data.name || ''
    this.form.specialized = data.specialized || ''
    this.form.degree = data.degree || ''
    this.form.description = data.description || ''
    this.form.existingAvatar = data.avatar || ''

    // 3. Hiển thị avatar hiện tại
    if (data.avatar) {
      // Tạo URL đầy đủ cho avatar image
      this.previewUrl = `${getAPIBaseURL()}/web/avatar/teacher/${data.avatar}`
    }
  } catch (error) {
    console.error(error)
    AlertUtils.error('Không thể tải thông tin giáo viên.')
    this.$router.push('/teachers')
  }
}
```

**Giải thích luồng dữ liệu:**

```
1. teacherService.getById(3)
   │
   ▼
2. API Request: GET https://xxx-8000.github.dev/api/teachers/3
   │
   ▼
3. Backend Response:
   {
     "success": true,
     "data": {
       "id": 3,
       "name": "Nguyễn Văn A",
       "specialized": "001",
       "degree": "002",
       "description": "Giáo viên khoa CNTT...",
       "avatar": "teacher_69679bebe85e8.png",
       "created": "2026-01-14 10:00:00",
       "updated": "2026-01-14 10:00:00"
     }
   }
   │
   ▼
4. Populate form fields với dữ liệu
   │
   ▼
5. Avatar URL: getAPIBaseURL() + '/web/avatar/teacher/' + 'teacher_69679bebe85e8.png'
   = 'https://xxx-8000.github.dev/web/avatar/teacher/teacher_69679bebe85e8.png'
```

---

### 4.4 API Service Layer

**File:** `src/services/api.js`

```javascript
// API Base URL Detection
const getAPIBaseURL = () => {
  if (window.location.hostname.includes('github.dev') || 
      window.location.hostname.includes('app.github.dev')) {
    return `${window.location.protocol}//${window.location.hostname.replace('-3000', '-8000')}`
  }
  return 'http://localhost:8000'
}

const API_BASE_URL = getAPIBaseURL()

// HTTP Client Class
class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
    this.token = localStorage.getItem('authToken') || null
  }

  async request(method, endpoint, data = null) {
    const url = `${this.baseURL}${endpoint}`
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    // Add Authorization header
    if (this.token) {
      options.headers['Authorization'] = `Bearer ${this.token}`
    }

    // Handle FormData (for file uploads)
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      if (data instanceof FormData) {
        options.body = data
        delete options.headers['Content-Type']  // Browser sẽ tự set
      } else {
        options.body = JSON.stringify(data)
      }
    }

    const response = await fetch(url, options)
    // ... error handling
    return await response.json()
  }
}

// Teacher Service
const teacherService = {
  getAll: (page = 1, limit = 10) => 
    apiClient.get(`/api/teachers?page=${page}&limit=${limit}`),
    
  getById: (id) => 
    apiClient.get(`/api/teachers/${id}`),
    
  search: (keyword, specialized) => {
    const params = new URLSearchParams()
    if (keyword) params.append('keyword', keyword)
    if (specialized) params.append('specialized', specialized)
    return apiClient.get(`/api/teachers?${params.toString()}`)
  }
}
```

**Giải thích:**
- `APIClient`: Wrapper class cho `fetch()` API
- `Authorization: Bearer ${token}`: Gửi JWT token cho mỗi request
- `FormData handling`: Khi gửi file, không set `Content-Type` header (browser tự thêm boundary)

---

### 4.5 Backend API

**File:** `app/api/teachers.php`

#### GET /api/teachers/:id

```php
if ($method === 'GET') {
    if (is_numeric($action)) {
        // GET /api/teachers/123 - Lấy chi tiết 1 giáo viên
        $teacher = $teacherModel->getById($action);
        if ($teacher) {
            echo json_encode([
                'success' => true,
                'data' => $teacher
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Teacher not found'
            ]);
        }
    }
}
```

#### POST /api/teachers/:id (với _method=PUT)

```php
} elseif (is_numeric($action) && isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
    // Update teacher với FormData
    $errors = [];
    
    // Validation
    $name = $_POST['name'] ?? '';
    $specialized = $_POST['specialized'] ?? '';
    $degree = $_POST['degree'] ?? '';
    $description = $_POST['description'] ?? '';
    
    // ... validation logic ...

    // Handle avatar
    $avatar_filename = '';
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        // Upload new avatar
        $extension = strtolower(pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION));
        $avatar_filename = uniqid('teacher_') . '.' . $extension;
        $upload_dir = __DIR__ . '/../../web/avatar/teacher/';
        move_uploaded_file($_FILES['avatar']['tmp_name'], $upload_dir . $avatar_filename);
    } elseif (!empty($_POST['existing_avatar'])) {
        // Keep existing avatar
        $avatar_filename = $_POST['existing_avatar'];
    }

    // Update database
    $data = [
        'name' => $name,
        'avatar' => $avatar_filename,
        'description' => $description,
        'specialized' => $specialized,
        'degree' => $degree
    ];
    
    $result = $teacherModel->update($action, $data);
}
```

**Giải thích:**
- `_method=PUT`: Vì HTML form không hỗ trợ PUT, dùng POST với field `_method=PUT`
- `existing_avatar`: Nếu không upload file mới, giữ lại avatar cũ
- `uniqid('teacher_')`: Tạo tên file unique để tránh trùng

---

### 4.6 Teacher Model

**File:** `app/modules/teachers/models/teacher.php`

```php
class Teacher {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM teachers WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare(
            "UPDATE teachers 
             SET name = ?, avatar = ?, description = ?, specialized = ?, degree = ?, updated = NOW() 
             WHERE id = ?"
        );
        return $stmt->execute([
            $data['name'], 
            $data['avatar'], 
            $data['description'], 
            $data['specialized'], 
            $data['degree'], 
            $id
        ]);
    }
}
```

---

## 5. Sequence Diagram

```
┌──────┐     ┌───────────────┐     ┌───────────┐     ┌──────────────┐     ┌──────────┐     ┌───────┐
│ User │     │ TeachersList  │     │Vue Router │     │ TeacherEdit  │     │API Client│     │Backend│
└──┬───┘     └───────┬───────┘     └─────┬─────┘     └──────┬───────┘     └────┬─────┘     └───┬───┘
   │                 │                   │                  │                  │               │
   │  1. Click "Sửa" │                   │                  │                  │               │
   │────────────────▶│                   │                  │                  │               │
   │                 │                   │                  │                  │               │
   │                 │ 2. $router.push   │                  │                  │               │
   │                 │   ('/teachers/    │                  │                  │               │
   │                 │    edit?id=3')    │                  │                  │               │
   │                 │──────────────────▶│                  │                  │               │
   │                 │                   │                  │                  │               │
   │                 │                   │ 3. Match route   │                  │               │
   │                 │                   │    & render      │                  │               │
   │                 │                   │─────────────────▶│                  │               │
   │                 │                   │                  │                  │               │
   │                 │                   │                  │ 4. mounted()     │               │
   │                 │                   │                  │    Parse URL     │               │
   │                 │                   │                  │    id=3          │               │
   │                 │                   │                  │                  │               │
   │                 │                   │                  │ 5. getById(3)    │               │
   │                 │                   │                  │─────────────────▶│               │
   │                 │                   │                  │                  │               │
   │                 │                   │                  │                  │ 6. GET        │
   │                 │                   │                  │                  │ /api/teachers │
   │                 │                   │                  │                  │ /3            │
   │                 │                   │                  │                  │──────────────▶│
   │                 │                   │                  │                  │               │
   │                 │                   │                  │                  │ 7. Query DB   │
   │                 │                   │                  │                  │◀──────────────│
   │                 │                   │                  │                  │               │
   │                 │                   │                  │ 8. Teacher data  │               │
   │                 │                   │                  │◀─────────────────│               │
   │                 │                   │                  │                  │               │
   │                 │                   │                  │ 9. Populate form │               │
   │                 │                   │                  │    Build avatar  │               │
   │                 │                   │                  │    URL           │               │
   │                 │                   │                  │                  │               │
   │ 10. Display form with data         │                  │                  │               │
   │◀───────────────────────────────────────────────────────│                  │               │
   │                 │                   │                  │                  │               │
```

---

## 6. Xử lý Avatar URL động

### Vấn đề
Khi chạy trên GitHub Codespaces, URL của frontend và backend khác nhau:
- Frontend: `https://xxx-3000.app.github.dev`
- Backend: `https://xxx-8000.app.github.dev`

Nếu hardcode `http://localhost:8000`, sẽ gây lỗi **Mixed Content** (HTTPS page loading HTTP resource).

### Giải pháp

```javascript
const getAPIBaseURL = () => {
  // Kiểm tra nếu đang chạy trên GitHub Codespaces
  if (window.location.hostname.includes('github.dev') || 
      window.location.hostname.includes('app.github.dev')) {
    // Ví dụ: miniature-couscous-xxx-3000.app.github.dev
    //     → miniature-couscous-xxx-8000.app.github.dev
    return `${window.location.protocol}//${window.location.hostname.replace('-3000', '-8000')}`
  }
  // Local development
  return 'http://localhost:8000'
}
```

### Sử dụng

```javascript
// Trong loadTeacherDetail()
if (data.avatar) {
  // getAPIBaseURL() trả về URL phù hợp với môi trường
  this.previewUrl = `${getAPIBaseURL()}/web/avatar/teacher/${data.avatar}`
  
  // Kết quả:
  // Localhost:   http://localhost:8000/web/avatar/teacher/teacher_xxx.png
  // Codespaces:  https://xxx-8000.app.github.dev/web/avatar/teacher/teacher_xxx.png
}
```

---

## 7. API Endpoints

### GET /api/teachers/:id

**Request:**
```http
GET /api/teachers/3 HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Nguyễn Văn A",
    "specialized": "001",
    "degree": "002",
    "description": "Giáo viên chuyên ngành Khoa học máy tính với 10 năm kinh nghiệm...",
    "avatar": "teacher_69679bebe85e8.png",
    "created": "2026-01-14 10:00:00",
    "updated": "2026-01-14 12:30:00"
  }
}
```

### POST /api/teachers/:id (Update)

**Request:**
```http
POST /api/teachers/3 HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="_method"

PUT
------WebKitFormBoundary
Content-Disposition: form-data; name="name"

Nguyễn Văn B
------WebKitFormBoundary
Content-Disposition: form-data; name="specialized"

001
------WebKitFormBoundary
Content-Disposition: form-data; name="degree"

003
------WebKitFormBoundary
Content-Disposition: form-data; name="description"

Mô tả cập nhật...
------WebKitFormBoundary
Content-Disposition: form-data; name="existing_avatar"

teacher_69679bebe85e8.png
------WebKitFormBoundary--
```

**Response:**
```json
{
  "success": true,
  "message": "Teacher updated successfully"
}
```

---

## Tổng kết

Nút "Sửa" thực hiện quy trình sau:

1. **TeachersList.vue**: User click → `editTeacher(id)` → Vue Router navigate
2. **Vue Router**: Match route `/teachers/edit` → Render `TeacherEdit.vue`
3. **TeacherEdit.vue**: 
   - `mounted()` → Parse URL lấy ID
   - `loadTeacherDetail(id)` → Gọi API
4. **api.js**: `teacherService.getById(id)` → HTTP GET request
5. **Backend**: Query database → Return JSON
6. **TeacherEdit.vue**: 
   - Populate form với dữ liệu
   - Build avatar URL với `getAPIBaseURL()`
7. **Browser**: Render form với avatar image

**Key Points:**
- Sử dụng `getAPIBaseURL()` để đảm bảo URL động phù hợp với môi trường
- Multi-step form: Input → Confirm → Complete
- File upload sử dụng `FormData` với `_method=PUT`
- Avatar được serve từ thư mục static `/web/avatar/teacher/`
