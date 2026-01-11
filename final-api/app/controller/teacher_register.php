<?php
/**
 * Teacher Register Controller
 * Endpoint: /api/teacher_register.php [POST]
 */

// Allow from any origin - for development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../common/db.php';
require_once __DIR__ . '/../controller/common.php';
require_once __DIR__ . '/../modules/teachers/models/teacher.php';

// Check Authentication
checkAuth();

// Debug logging
error_log("=== TEACHER REGISTER DEBUG ===");
error_log("POST data: " . print_r($_POST, true));
error_log("FILES data: " . print_r($_FILES, true));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit();
}

$errors = [];

// Validate input
$name = $_POST['name'] ?? '';
$specialized = $_POST['specialized'] ?? '';
$degree = $_POST['degree'] ?? '';
$description = $_POST['description'] ?? '';

if (empty($name)) {
    $errors['name'] = 'Hãy nhập tên giáo viên.';
} elseif (strlen($name) > 100) {
    $errors['name'] = 'Không nhập quá 100 ký tự.';
}

if (empty($specialized)) {
    $errors['specialized'] = 'Hãy chọn bộ môn.';
}

if (empty($degree)) {
    $errors['degree'] = 'Hãy chọn bằng cấp.';
}

if (empty($description)) {
    $errors['description'] = 'Hãy nhập mô tả chi tiết';
} elseif (strlen($description) > 1000) {
    $errors['description'] = 'Không nhập quá 1000 ký tự';
}

// Handle File Upload
$avatar_filename = '';

if (!isset($_FILES['avatar'])) {
    $errors['avatar'] = 'Hãy chọn avatar (File not sent).';
} elseif ($_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    // Map error codes to messages
    $upload_errors = [
        UPLOAD_ERR_INI_SIZE => 'File quá lớn (vượt quá upload_max_filesize).',
        UPLOAD_ERR_FORM_SIZE => 'File quá lớn (vượt quá MAX_FILE_SIZE).',
        UPLOAD_ERR_PARTIAL => 'File chỉ được upload một phần.',
        UPLOAD_ERR_NO_FILE => 'Chưa chọn file avatar.',
        UPLOAD_ERR_NO_TMP_DIR => 'Thiếu thư mục tạm.',
        UPLOAD_ERR_CANT_WRITE => 'Không thể ghi file ra đĩa.',
        UPLOAD_ERR_EXTENSION => 'Upload bị chặn bởi extension.'
    ];
    $error_code = $_FILES['avatar']['error'];
    $errors['avatar'] = $upload_errors[$error_code] ?? "Lỗi upload không xác định (Code: $error_code)";
} else {
    $file_info = pathinfo($_FILES['avatar']['name']);
    $extension = strtolower($file_info['extension']);
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
    
    if (!in_array($extension, $allowed_extensions)) {
        $errors['avatar'] = 'Định dạng file không hợp lệ (JPG, JPEG, PNG, GIF).';
    } else {
        // Create unique filename (matching subjects.php pattern)
        $avatar_filename = uniqid('teacher_') . '.' . $extension;
        $upload_dir = __DIR__ . '/../../web/avatar/teacher/';
        
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $upload_path = $upload_dir . $avatar_filename;
        
        if (!move_uploaded_file($_FILES['avatar']['tmp_name'], $upload_path)) {
            $errors['avatar'] = 'Không thể lưu file avatar.';
        }
    }
}

if (!empty($errors)) {
    error_log("=== VALIDATION ERRORS ===");
    error_log(print_r($errors, true));
    http_response_code(400);
    echo json_encode(['errors' => $errors]);
    exit();
}

try {
    $teacherModel = new Teacher();
    $data = [
        'name' => $name,
        'avatar' => $avatar_filename,
        'description' => $description,
        'specialized' => $specialized,
        'degree' => $degree
    ];

    if ($teacherModel->create($data)) {
        http_response_code(201);
        echo json_encode(['message' => 'Teacher registered successfully', 'filename' => $avatar_filename]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to register teacher in database.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>
