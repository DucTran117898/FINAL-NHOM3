<?php
// Load environment variables
function loadEnv($filePath = __DIR__ . '/../../.env') {
    if (!file_exists($filePath)) {
        $filePath = __DIR__ . '/../../.env.example';
    }
    
    if (file_exists($filePath)) {
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            if (strpos($line, '=') === false) continue;
            
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            putenv("$key=$value");
        }
    }
}

loadEnv();

// Database configuration (from .env file)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'school_management');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

// Site configuration (from .env file)
define('SITE_URL', getenv('SITE_URL') ?: 'http://localhost:8000/');
define('SESSION_TIMEOUT', getenv('SESSION_TIMEOUT') ?: 3600);

// Password requirements
define('MIN_LOGIN_ID_LENGTH', getenv('MIN_LOGIN_ID_LENGTH') ?: 4);
define('MIN_PASSWORD_LENGTH', getenv('MIN_PASSWORD_LENGTH') ?: 6);

// Status codes
define('ACTIVE', 1);
define('INACTIVE', 0);

// Google reCAPTCHA (from .env file)
define('RECAPTCHA_SITE_KEY', getenv('RECAPTCHA_SITE_KEY') ?: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
define('RECAPTCHA_SECRET_KEY', getenv('RECAPTCHA_SECRET_KEY') ?: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe');

// Timezone (from .env file)
date_default_timezone_set(getenv('TIMEZONE') ?: 'Asia/Ho_Chi_Minh');
