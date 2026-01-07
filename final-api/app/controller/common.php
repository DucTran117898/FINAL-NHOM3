<?php
// Middleware for authentication
// Included by API endpoints

require_once __DIR__ . '/../modules/auth/models/admin.php';

/**
 * Check if the request is authenticated
 */
function checkAuth() {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $payload = validateJWT($token);
    
    if (!$payload) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
        exit;
    }
    
    // Optionally check if user still exists/active (cached check or db check)
    // For critical operations, we might want to do a DB check here.
    // For now, if the token is valid, we proceed.
    return $payload;
}

/**
 * Generate JWT token
 */
function generateJWT($payload) {
    if (!defined('JWT_SECRET')) {
       // Should be defined in define.php
       define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your-secret-key-change-in-production');
    }

    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode($payload);
    
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

/**
 * Validate JWT token
 */
function validateJWT($token) {
    if (!defined('JWT_SECRET')) {
        define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your-secret-key-change-in-production');
    }

    if (!$token) return false;
    
    $parts = explode('.', $token);
    if (count($parts) != 3) return false;
    
    $header = $parts[0];
    $payload = $parts[1];
    $signatureProvided = $parts[2];
    
    // Check signature
    $signature = hash_hmac('sha256', $header . "." . $payload, JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    if ($base64UrlSignature !== $signatureProvided) {
        return false;
    }
    
    // Decode payload
    $payloadData = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
    
    // Check expiration
    if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
        return false;
    }
    
    return $payloadData;
}
?>
