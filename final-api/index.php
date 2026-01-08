<?php
/**
 * Main Entry Point - Handle both API routes and redirects
 */

// Get the request path
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove project prefixes
$request_uri = str_replace('/final-api', '', $request_uri);
$request_uri = str_replace('/Cuoiky', '', $request_uri);

// Debug
error_log("REQUEST_URI: " . $_SERVER['REQUEST_URI']);
error_log("request_uri after: " . $request_uri);
// For static files in /web/ directory


// For other static files, let PHP's built-in server serve them if they exist
$file_path = __DIR__ . $request_uri;
if (is_file($file_path)) {
    return false; // Let the built-in server serve the file
}

// Route API requests
if (strpos($request_uri, '/api/') === 0) {
    // Set headers for CORS and JSON responses
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    // Handle CORS preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    $parts = explode('/', trim($request_uri, '/'));

    $api_part = $parts[0] ?? '';
    $module   = $parts[1] ?? '';
    $action   = $parts[2] ?? '';

    if ($api_part !== 'api') {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Invalid API path']);
        exit;
    }

    // Handle Swagger docs
    if ($module === 'docs') {
        if ($action === 'swagger.json' || $action === '') {
            header('Content-Type: application/json');
            readfile(__DIR__ . '/docs/swagger.json');
            exit;
        } else {
            header('Content-Type: text/html');
            include __DIR__ . '/docs/index.html';
            exit;
        }
    }

    switch ($module) {
        case 'auth':
            require __DIR__ . '/app/api/auth.php';
            break;

        case 'students':
            require __DIR__ . '/app/api/students.php';
            break;

        case 'teachers':
            require __DIR__ . '/app/api/teachers.php';
            break;

        case 'subjects':
            require __DIR__ . '/app/api/subjects.php';
            break;

        case 'scores':
            require __DIR__ . '/app/api/scores.php';
            break;

        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'API module not found'
            ]);
            break;
    }
} else {
    // Debug
    error_log("Not API request: " . $request_uri);
    // For non-API requests, return a message instead of redirecting to avoid loops
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'This is the API server. For frontend, please run the frontend server separately.',
        'frontend_url' => 'http://localhost:5500' // Adjust as needed
    ]);
    exit;
}
?>