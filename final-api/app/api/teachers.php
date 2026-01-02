<?php
// This file is included by api-router.php

require_once __DIR__ . '/../common/db.php';
require_once __DIR__ . '/../modules/teachers/models/teacher.php';

// Parse JSON request body
$input = json_decode(file_get_contents('php://input'), true);

// Get the request method and path
$method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Extract the action from the URL
// /api/teachers -> list all
// /api/teachers/123 -> get by id
$parts = explode('/', trim($request_uri, '/'));
array_shift($parts); // remove 'api'
array_shift($parts); // remove 'teachers'
$action = array_shift($parts); // get action or id

// Log for debugging
error_log("Method: $method, Action: $action, URI: $request_uri");

try {
    $teacherModel = new Teacher();

    if ($method === 'GET') {
        if ($action === null || $action === '') {
            // GET /api/teachers - list all or search
            $keyword = $_GET['keyword'] ?? '';
            $specialized = $_GET['specialized'] ?? '';
            if (!empty($keyword) || !empty($specialized)) {
                $teachers = $teacherModel->search($specialized, $keyword);
            } else {
                $teachers = $teacherModel->getAll();
            }
            echo json_encode([
                'success' => true,
                'data' => $teachers
            ]);
        } elseif (is_numeric($action)) {
            // GET /api/teachers/123 - get by id
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
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid request'
            ]);
        }
    } elseif ($method === 'POST') {
        if ($action === null || $action === '') {
            // POST /api/teachers - create new
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
                'specialized' => $input['specialized'] ?? '',
                'degree' => $input['degree'] ?? ''
            ];
            $result = $teacherModel->create($data);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Teacher created successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to create teacher'
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
            // PUT /api/teachers/123 - update
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
                'specialized' => $input['specialized'] ?? '',
                'degree' => $input['degree'] ?? ''
            ];
            $result = $teacherModel->update($action, $data);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Teacher updated successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to update teacher'
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
            // DELETE /api/teachers/123 - delete
            $result = $teacherModel->delete($action);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Teacher deleted successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to delete teacher'
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