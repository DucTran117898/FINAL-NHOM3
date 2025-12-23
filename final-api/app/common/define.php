<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'school_management');
define('DB_USER', 'root');
define('DB_PASS', '');

// Other constants
define('SITE_URL', 'http://localhost/final-api/');
define('SESSION_TIMEOUT', 3600); // 1 hour

// Password requirements
define('MIN_LOGIN_ID_LENGTH', 4);
define('MIN_PASSWORD_LENGTH', 6);

// Status codes
define('ACTIVE', 1);
define('INACTIVE', 0);

// Google reCAPTCHA
define('RECAPTCHA_SITE_KEY', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'); // Google Test Site Key
define('RECAPTCHA_SECRET_KEY', '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'); // Google Test Secret Key

// Timezone
date_default_timezone_set('Asia/Ho_Chi_Minh');
