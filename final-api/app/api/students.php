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
            if (!$input || !isset($input['name'])|| trim($input['name']) === '') {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Name is required'
                ], JSON_UNESCAPED_UNICODE);
                exit;
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
                ], JSON_UNESCAPED_UNICODE);
                exit;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to update student'
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
