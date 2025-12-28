<?php
/**
 * Main API Router - Handle all incoming requests
 */

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

// Get the request path
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove any project-specific prefixes
$request_uri = str_replace('/final-api', '', $request_uri);
$request_uri = str_replace('/Cuoiky', '', $request_uri);

// For static files, let PHP's built-in server serve them
$file_path = __DIR__ . $request_uri;
if (is_file($file_path)) {
    return false; // Let the built-in server serve the file
}

// Route API requests
if (strpos($request_uri, '/api/') === 0) {
    require __DIR__ . '/app/api/auth.php';
} else {
    // Try to serve the file if it exists
    if (file_exists($file_path)) {
        return false;
    }
    
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Not found']);
}
?>
