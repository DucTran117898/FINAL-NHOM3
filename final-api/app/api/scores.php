<?php
// This file is included by api-router.php

require_once __DIR__ . '/../common/db.php';
require_once __DIR__ . '/../controller/common.php';
require_once __DIR__ . '/../modules/scores/models/score.php';

// Check Authentication
checkAuth();

// Parse JSON request body
$input = json_decode(file_get_contents('php://input'), true);

// Get the request method and path
$method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Extract the action from the URL
// /api/scores -> list all
// /api/scores/123 -> get by id
$parts = explode('/', trim($request_uri, '/'));
array_shift($parts); // remove 'api'
array_shift($parts); // remove 'scores'
$action = array_shift($parts); // get action or id

// Log for debugging
error_log("Method: $method, Action: $action, URI: $request_uri");

try {
    $scoreModel = new Score();

    if ($method === 'GET') {
        if ($action === null || $action === '') {
            // GET /api/scores - list all or search
            $student_name = $_GET['student_name'] ?? '';
            $subject_name = $_GET['subject_name'] ?? '';
            $teacher_name = $_GET['teacher_name'] ?? '';
            if (!empty($student_name) || !empty($subject_name) || !empty($teacher_name)) {
                $scores = $scoreModel->search($student_name, $subject_name, $teacher_name);
            } else {
                $scores = $scoreModel->getAll();
            }
            echo json_encode([
                'success' => true,
                'data' => $scores
            ]);
        } elseif (is_numeric($action)) {
            // GET /api/scores/123 - get by id
            $score = $scoreModel->getById($action);
            if ($score) {
                echo json_encode([
                    'success' => true,
                    'data' => $score
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Score not found'
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
            // POST /api/scores - create new
            if (!$input || !isset($input['student_id']) || !isset($input['subject_id']) || !isset($input['teacher_id']) || !isset($input['score'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Student ID, Subject ID, Teacher ID, and Score are required'
                ]);
                return;
            }
            $data = [
                'student_id' => $input['student_id'],
                'subject_id' => $input['subject_id'],
                'teacher_id' => $input['teacher_id'],
                'score' => $input['score'],
                'description' => $input['description'] ?? ''
            ];
            $result = $scoreModel->create($data);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Score created successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to create score'
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
            // PUT /api/scores/123 - update
            if (!$input || !isset($input['student_id']) || !isset($input['subject_id']) || !isset($input['teacher_id']) || !isset($input['score'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Student ID, Subject ID, Teacher ID, and Score are required'
                ]);
                return;
            }
            $data = [
                'student_id' => $input['student_id'],
                'subject_id' => $input['subject_id'],
                'teacher_id' => $input['teacher_id'],
                'score' => $input['score'],
                'description' => $input['description'] ?? ''
            ];
            $result = $scoreModel->update($action, $data);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Score updated successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to update score'
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
            // DELETE /api/scores/123 - delete
            $result = $scoreModel->delete($action);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Score deleted successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to delete score'
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