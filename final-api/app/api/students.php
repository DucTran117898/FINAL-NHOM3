<?php
// This file is included by api-router.php

require_once __DIR__ . '/../common/db.php';
require_once __DIR__ . '/../controller/common.php';
require_once __DIR__ . '/../modules/students/models/student.php';

// Check Authentication
checkAuth();

// Parse JSON request body
$input = json_decode(file_get_contents('php://input'), true);

// Get the request method and path
$method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Extract the action from the URL
// /api/students -> list all
// /api/students/123 -> get by id
$parts = explode('/', trim($request_uri, '/'));
array_shift($parts); // remove 'api'
array_shift($parts); // remove 'students'
$action = array_shift($parts); // get action or id

// Log for debugging
error_log("Method: $method, Action: $action, URI: $request_uri");

try {
    $studentModel = new Student();

    if ($method === 'GET') {
        if ($action === null || $action === '') {
            // GET /api/students - list all or search
            $keyword = $_GET['keyword'] ?? '';
            if (!empty($keyword)) {
                $students = $studentModel->search($keyword);
            } else {
                $students = $studentModel->getAll();
            }
            echo json_encode([
                'success' => true,
                'data' => $students
            ]);
        } elseif (is_numeric($action)) {
            // GET /api/students/123 - get by id
            $student = $studentModel->getById($action);
            if ($student) {
                echo json_encode([
                    'success' => true,
                    'data' => $student
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Student not found'
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
            // POST /api/students - create new
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
                'description' => $input['description'] ?? ''
            ];
            $result = $studentModel->create($data);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Student created successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to create student'
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
            // PUT /api/students/123 - update
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
                'description' => $input['description'] ?? ''
            ];
            $result = $studentModel->update($action, $data);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Student updated successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to update student'
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
            // DELETE /api/students/123 - delete
            $result = $studentModel->delete($action);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Student deleted successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to delete student'
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
?></content>
<parameter name="filePath">d:\Last_Semester\Web\Cuoiky\final-api\app\api\students.php