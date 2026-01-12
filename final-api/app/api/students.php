<?php
// This file is included by api-router.php

require_once __DIR__ . '/../common/db.php';
require_once __DIR__ . '/../controller/common.php';
require_once __DIR__ . '/../modules/students/models/student.php';

// Check Authentication
checkAuth();

// Parse request body - support both JSON and multipart/form-data
$input = json_decode(file_get_contents('php://input'), true);
// If multipart/form-data (has files), use $_POST instead
if (!empty($_FILES)) {
    $input = $_POST;
}

// Get the request method and path
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
}
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Extract the action from the URL
$parts = explode('/', trim($request_uri, '/'));
array_shift($parts); // remove 'api'
array_shift($parts); // remove 'students'
$action = array_shift($parts);

// Log for debugging
error_log("Method: $method, Action: $action, URI: $request_uri");

// Luôn set header JSON
header('Content-Type: application/json; charset=utf-8');

try {
    $studentModel = new Student();

    if ($method === 'GET') {
        if ($action === null || $action === '') {
            $keyword = $_GET['keyword'] ?? '';
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $offset = ($page - 1) * $limit;

            if (!empty($keyword)) {
                $students = $studentModel->search($keyword, $limit, $offset);
                $total = $studentModel->countSearch($keyword);
            } else {
                $students = $studentModel->getAll($limit, $offset);
                $total = $studentModel->countAll();
            }
            error_log("Students: " . json_encode($students));
            error_log("Total: " . $total);


            echo json_encode([
                'success' => true,
                'data' => $students,
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => ceil($total / $limit),
                    'total_records' => $total
                ]
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } elseif (is_numeric($action)) {
            $student = $studentModel->getById($action);
            if ($student) {
                echo json_encode([
                    'success' => true,
                    'data' => $student
                ], JSON_UNESCAPED_UNICODE);
                exit;
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Student not found'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid request'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    } elseif ($method === 'POST') {
        if ($action === null || $action === '') {
            if (!$input || !isset($input['name'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Name is required'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            // Handle Avatar Upload
            $avatarPath = '';
            if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
                // Path: ./final-api/web/avatar
                $uploadDir = __DIR__ . '/../../web/avatar/';

                // Create directory if not exists
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $extension = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
                // Simple validation for security (allow images only)
                $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                if (!in_array(strtolower($extension), $allowed)) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only images allowed.'], JSON_UNESCAPED_UNICODE);
                    exit;
                }

                $avatarFileName = uniqid('stu_') . '.' . $extension;
                $targetFile = $uploadDir . $avatarFileName;

                if (!move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFile)) {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Failed to save uploaded file'], JSON_UNESCAPED_UNICODE);
                    exit;
                }

                // Lưu đường dẫn tương đối vào database: avatar/filename.jpg
                $avatarPath = 'avatar/' . $avatarFileName;
            } elseif (isset($input['avatar']) && !empty($input['avatar'])) {
                // If avatar is provided as string (from JSON), use it directly
                $avatarPath = $input['avatar'];
            }

            $data = [
                'name' => $input['name'],
                'avatar' => $avatarPath,
                'description' => $input['description'] ?? ''
            ];
            $result = $studentModel->create($data);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Student created successfully'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to create student'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid request'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    } elseif ($method === 'PUT') {
        if (is_numeric($action)) {
            $studentId = (int)$action;

            // Parse multipart/form-data
            $input = $_POST;

            if (empty($input['name'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Name is required'
                ]);
                return;
            }

            // ===== LẤY STUDENT CŨ =====
            $oldStudent = $studentModel->getById($studentId);
            if (!$oldStudent) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Student not found'
                ]);
                return;
            }

            // ===== AVATAR =====
            $avatarPath = $oldStudent['avatar'];

            if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {

                $uploadDir = __DIR__ . '/../../web/avatar/student/';

                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $extension = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
                $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

                if (!in_array(strtolower($extension), $allowed)) {
                    http_response_code(400);
                    echo json_encode([
                        'success' => false,
                        'message' => 'Invalid file type'
                    ]);
                    return;
                }

                $fileName = uniqid('stu_') . '.' . $extension;
                $targetFile = $uploadDir . $fileName;

                if (!move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFile)) {
                    http_response_code(500);
                    echo json_encode([
                        'success' => false,
                        'message' => 'Failed to upload avatar'
                    ]);
                    return;
                }

                // Xóa avatar cũ (nếu có)
                if (!empty($oldStudent['avatar'])) {
                    $oldFile = __DIR__ . '/../../web/avatar/student/' . $oldStudent['avatar'];
                    if (file_exists($oldFile)) {
                        unlink($oldFile);
                    }
                }

                // PATH public trả về cho frontend
                $avatarPath = $fileName;
            }

            // ===== UPDATE DATA =====
            $data = [
                'name'        => $input['name'],
                'description' => $input['description'] ?? '',
                'avatar'      => $avatarPath
            ];

            $result = $studentModel->update($studentId, $data);

            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Student updated successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Update failed'
                ]);
            }

            exit;
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid request'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    } elseif ($method === 'DELETE') {
        if (is_numeric($action)) {
            $result = $studentModel->delete($action);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Student deleted successfully'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to delete student'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid request'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    } else {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
