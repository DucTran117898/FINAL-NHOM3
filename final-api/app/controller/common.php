<?php
session_start();

require_once '../modules/auth/models/admin.php';

function checkAuth() {
    if (!isset($_SESSION['admin_id'])) {
        header('Location: ../../modules/auth/views/login.php');
        exit;
    }

    // Check session timeout
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT)) {
        session_unset();
        session_destroy();
        header('Location: ../../modules/auth/views/login.php');
        exit;
    }
    $_SESSION['last_activity'] = time();
}

function getCurrentAdmin() {
    if (!isset($_SESSION['admin_id'])) {
        return null;
    }
    $adminModel = new Admin();
    return $adminModel->getById($_SESSION['admin_id']);
}

function logout() {
    session_unset();
    session_destroy();
    header('Location: ../../modules/auth/views/login.php');
    exit;
}
?>