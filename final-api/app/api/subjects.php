<?php
// This file is included by api-router.php

require_once __DIR__ . '/../common/db.php';
require_once __DIR__ . '/../controller/common.php';
require_once __DIR__ . '/../modules/subjects/models/subject.php';

// Check Authentication
checkAuth();

// Parse JSON request body
$input = json_decode(file_get_contents('php://input'), true);

// Get the request method and path
$method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Extract the action from the URL
// /api/subjects -> list all
// /api/subjects/123 -> get by id
$parts = explode('/', trim($request_uri, '/'));
array_shift($parts); // remove 'api'
array_shift($parts); // remove 'subjects'
$action = array_shift($parts); // get action or id

// Log for debugging
error_log("Method: $method, Action: $action, URI: $request_uri");

try {
    $subjectModel = new Subject();

    if ($method === 'GET') {
        if ($action === null || $action === '') {
            // GET /api/subjects - list all or search
            $keyword = $_GET['keyword'] ?? '';
            $school_year = $_GET['school_year'] ?? '';
            if (!empty($keyword) || !empty($school_year)) {
                $subjects = $subjectModel->search($school_year, $keyword);
            } else {
                $subjects = $subjectModel->getAll();
            }
            echo json_encode([
                'success' => true,
                'data' => $subjects
            ]);
        } elseif (is_numeric($action)) {
            // GET /api/subjects/123 - get by id
            $subject = $subjectModel->getById($action);
            if ($subject) {
                echo json_encode([
                    'success' => true,
                    'data' => $subject
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Subject not found'
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid request'
            ]);
        }
    } elseif ($method === 'POST') {
        if ($action === null || $action === '') {
            // POST /api/subjects - create new

            // Check if request is multipart/form-data (has files)
            if (!empty($_FILES)) {
                $input = $_POST;
            }

            // Fallback: if using multipart/form-data without files, PHP will
            // populate $_POST but $input (from json_decode) will be empty.
            if (empty($input) && !empty($_POST)) {
                $input = $_POST;
            }

            if (empty($input) || !isset($input['name'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Name is required'
                ]);
                return;
            }

            // Handle Avatar Upload
            $avatarName = '';
            if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
                // Modified path to satisfy user requirement: ./final-api/web/avatar/subject
                // Current file is in app/api/, so allow going up two levels to final-api root
                $uploadDir = __DIR__ . '/../../web/avatar/subject/';

                // Create directory if not exists
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $extension = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
                // Simple validation for security (allow images only)
                $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                if (!in_array(strtolower($extension), $allowed)) {
                     http_response_code(400);
                     echo json_encode(['success' => false, 'message' => 'Invalid file type. Only images allowed.']);
                     return;
                }

                $avatarName = uniqid('subj_') . '.' . $extension;
                $targetFile = $uploadDir . $avatarName;

                if (!move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFile)) {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Failed to save uploaded file']);
                    return;
                }
            }

            $data = [
                'name' => $input['name'],
                'avatar' => $avatarName,
                'description' => $input['description'] ?? '',
                'school_year' => $input['school_year'] ?? ''
            ];
            $result = $subjectModel->create($data);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Subject created successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to create subject'
                ]);
            }
        } elseif (is_numeric($action)) {
            // POST /api/subjects/{id} - update (supports JSON and multipart with file upload)

            // If multipart/form-data, override $input with $_POST
            if (!empty($_FILES)) {
                $input = $_POST;
            }

            // Fallback: handle multipart/form-data without files (edit with no new avatar)
            if (empty($input) && !empty($_POST)) {
                $input = $_POST;
            }

            if (empty($input) || !isset($input['name'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Name is required'
                ]);
                return;
            }

            // Determine current avatar value
            $current = $subjectModel->getById($action);
            $currentAvatar = $current ? ($current['avatar'] ?? '') : '';

            $avatarName = $currentAvatar;

            // If a new avatar file is uploaded, replace it
            if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../../web/avatar/subject/';

                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $extension = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
                $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                if (!in_array(strtolower($extension), $allowed)) {
                     http_response_code(400);
                     echo json_encode(['success' => false, 'message' => 'Invalid file type. Only images allowed.']);
                     return;
                }

                $avatarName = uniqid('subj_') . '.' . $extension;
                $targetFile = $uploadDir . $avatarName;

                if (!move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFile)) {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Failed to save uploaded file']);
                    return;
                }
            } else {
                // If frontend sends existing_avatar explicitly, honor it
                if (isset($input['existing_avatar'])) {
                    $avatarName = $input['existing_avatar'];
                }
            }

            $data = [
                'name' => $input['name'],
                'avatar' => $avatarName,
                'description' => $input['description'] ?? '',
                'school_year' => $input['school_year'] ?? ''
            ];
            $result = $subjectModel->update($action, $data);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Subject updated successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to update subject'
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid request'
            ]);
        }
    } elseif ($method === 'PUT') {
        if (is_numeric($action)) {
            // PUT /api/subjects/123 - update
            if (!$input || !isset($input['name'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Name is required'
                ]);
                return;
            }
            $data = [
                'name' => $input['name'],
                'avatar' => $input['avatar'] ?? '',
                'description' => $input['description'] ?? '',
                'school_year' => $input['school_year'] ?? ''
            ];
            $result = $subjectModel->update($action, $data);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Subject updated successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to update subject'
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid request'
            ]);
        }
    } elseif ($method === 'DELETE') {
        if (is_numeric($action)) {
            // DELETE /api/subjects/123 - delete
            $result = $subjectModel->delete($action);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Subject deleted successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to delete subject'
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid request'
            ]);
        }
    } else {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>