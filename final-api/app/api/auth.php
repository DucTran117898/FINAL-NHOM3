<?php
// This file is included by api-router.php

require_once __DIR__ . '/../common/db.php';
require_once __DIR__ . '/../controller/common.php'; // Include shared auth logic
require_once __DIR__ . '/../modules/auth/models/user.php';

// Parse JSON request body
$input = json_decode(file_get_contents('php://input'), true);

// Get the request method and path
$method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Extract the action from the URL
// /api/auth/login -> login
$parts = explode('/', trim($request_uri, '/'));
$action = array_pop($parts); // Get last part

// Log for debugging
error_log("Method: $method, Action: $action, URI: $request_uri");

try {
    // Handle login request
    if ($action === 'login' && $method === 'POST') {
        handleLogin($input);
    }
    // Handle login GET (for testing)
    elseif ($action === 'login' && $method === 'GET') {
        echo json_encode(['message' => 'Login endpoint requires POST method with login_id and password']);
    }
    // Handle logout request
    elseif ($action === 'logout' && $method === 'POST') {
        handleLogout();
    }
    // Handle get current user
    elseif ($action === 'me' && $method === 'GET') {
        handleGetCurrentUser();
    }
    // 4. Gửi yêu cầu Reset (User)
    elseif ($action === 'reset-request' && $method === 'POST') {
        handleResetRequest($input);
    }
    // 5. Lấy danh sách chờ (Admin)
    elseif ($action === 'reset-list' && $method === 'GET') {
        handleGetPendingResets();
    }
    // 6. Duyệt Reset (Admin)
    elseif ($action === 'reset-approve' && $method === 'POST') {
        handleApproveReset($input);
    }
    else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => "Endpoint not found: $action"
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

/**
 * Handle login request
 */
function handleLogin($input) {
    $errors = [];
    
    // Validate login_id
    $login_id = isset($input['login_id']) ? trim($input['login_id']) : '';
    if (empty($login_id)) {
        $errors['login_id'] = 'Hãy nhập login id';
    } elseif (strlen($login_id) < 4) {
        $errors['login_id'] = 'Hãy nhập login id tối thiểu 4 ký tự';
    }
    
    // Validate password
    $password = isset($input['password']) ? trim($input['password']) : '';
    if (empty($password)) {
        $errors['password'] = 'Hãy nhập password';
    } elseif (strlen($password) < 6) {
        $errors['password'] = 'Hãy nhập password tối thiểu 6 ký tự';
    }
    
    // If validation errors exist, return them
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $errors
        ]);
        return;
    }
    
    // Check if login_id and password exist in database
    $userModel = new User();
    $user = $userModel->login($login_id, $password);

    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Login error',
            'errors' => [
                'login_id' => 'Login id và password không đúng'
            ]
        ]);
        return;
    }

    // Get current datetime in Y-m-d H:i format
    $loginTime = date('Y-m-d H:i');

    // Get user details
    $userDetails = $userModel->getUserWithDetails($user['id']);

    // Generate JWT token
    $payload = [
        'sub' => $user['id'],
        'login_id' => $user['login_id'],
        'role' => $user['role'],
        'login_time' => $loginTime,
        'iat' => time(),
        'exp' => time() + SESSION_TIMEOUT // Token expiration
    ];
    // generateJWT is now available from common.php
    $token = generateJWT($payload);
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'login_id' => $user['login_id'],
            'role' => $user['role'],
            'reference_id' => $user['reference_id'],
            'details' => $userDetails['details'],
            'login_time' => $loginTime
        ]
    ]);
}

/**
 * Handle logout request
 */
function handleLogout() {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Logout successful'
    ]);
}

/**
 * Handle get current user request
 */
function handleGetCurrentUser() {
    // Check for Authorization header
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

    if (!$token) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized'
        ]);
        return;
    }

    // Validate JWT using function from common.php
    $payload = validateJWT($token);
    if (!$payload) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid or expired token'
        ]);
        return;
    }

    // Get user from database to ensure they still exist and are active
    $userModel = new User();
    $user = $userModel->getById($payload['sub']);

    if (!$user || $user['actived_flag'] != ACTIVE) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'User not found or inactive'
        ]);
        return;
    }

    // Get user details
    $userDetails = $userModel->getUserWithDetails($user['id']);

    // Use login_time from token if available, otherwise current time
    $loginTime = isset($payload['login_time']) ? $payload['login_time'] : date('Y-m-d H:i');

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'login_id' => $user['login_id'],
            'role' => $user['role'],
            'reference_id' => $user['reference_id'],
            'details' => $userDetails['details'],
            'login_time' => $loginTime
        ]
    ]);
}
function handleResetRequest($input) {
    $login_id = isset($input['login_id']) ? trim($input['login_id']) : '';

    // Validate Required
    if (empty($login_id)) {
        http_response_code(400); 
        echo json_encode(['success'=>false, 'message'=>'Hãy nhập login id']); 
        return;
    }

    // Validate Minlength: 4 (Theo ảnh 1)
    if (strlen($login_id) < 4) {
        http_response_code(400); 
        echo json_encode(['success'=>false, 'message'=>'Hãy nhập login id tối thiểu 4 ký tự']); 
        return;
    }

    $model = new User();
    
    // Validate Exists (Theo ảnh 1)
    if (!$model->getByLoginId($login_id)) {
        http_response_code(400); 
        // SỬA CÂU NÀY CHO KHỚP 100% ẢNH YÊU CẦU
        echo json_encode(['success'=>false, 'message'=>'login id không tồn tại trong hệ thống']); 
        return;
    }

    // Update Token = microtime (Theo ảnh 2)
    $token = (string)microtime(true);
    
    if ($model->updateResetToken($login_id, $token)) {
        echo json_encode(['success'=>true, 'message'=>'Gửi yêu cầu thành công']);
    } else {
        http_response_code(500); 
        echo json_encode(['success'=>false, 'message'=>'Lỗi Database']);
    }
}

function handleGetPendingResets() {
    $model = new User();
    // Cần đảm bảo Model Admin đã có hàm getPendingResets
    $data = $model->getPendingResets();
    echo json_encode(['success' => true, 'data' => $data]);
}

function handleApproveReset($input) {
    $id = $input['id'] ?? '';
    $new_pass = isset($input['new_password']) ? trim($input['new_password']) : '';

    if (empty($new_pass) || strlen($new_pass) < 6) {
        http_response_code(400); echo json_encode(['success'=>false, 'message'=>'Mật khẩu mới phải >= 6 ký tự']); return;
    }

    $model = new User();
    // Cần đảm bảo Model Admin đã có hàm resetPassword
    if ($model->resetPassword($id, $new_pass)) {
        echo json_encode(['success'=>true, 'message'=>'Reset thành công']);
    } else {
        http_response_code(500); echo json_encode(['success'=>false, 'message'=>'Lỗi cập nhật']);
    }
}
?>
