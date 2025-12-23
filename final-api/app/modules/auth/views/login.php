<?php
require_once '../../../common/define.php';
require_once '../models/admin.php';

session_start();

$errors = [];
$old_input = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login_id = trim($_POST['login_id'] ?? '');
    $password = trim($_POST['password'] ?? '');

    $old_input = ['login_id' => $login_id];

    // Validation
    if (empty($login_id)) {
        $errors['login_id'] = 'Login ID is required.';
    } elseif (strlen($login_id) < MIN_LOGIN_ID_LENGTH) {
        $errors['login_id'] = 'Login ID must be at least ' . MIN_LOGIN_ID_LENGTH . ' characters.';
    }

    if (empty($password)) {
        $errors['password'] = 'Password is required.';
    } elseif (strlen($password) < MIN_PASSWORD_LENGTH) {
        $errors['password'] = 'Password must be at least ' . MIN_PASSWORD_LENGTH . ' characters.';
    }

    if (empty($errors)) {
        $adminModel = new Admin();
        $admin = $adminModel->login($login_id, $password);

        if ($admin) {
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['login_time'] = date('Y-m-d H:i');
            $_SESSION['last_activity'] = time();
            header('Location: home.php');
            exit;
        } else {
            $errors['general'] = 'Invalid login credentials.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <div class="login-container">
        <h2>Login</h2>
        <form method="POST">
            <div class="form-group">
                <label for="login_id">Login ID:</label>
                <input type="text" id="login_id" name="login_id" value="<?php echo htmlspecialchars($old_input['login_id'] ?? ''); ?>" minlength="<?php echo MIN_LOGIN_ID_LENGTH; ?>">
                <?php if (isset($errors['login_id'])): ?>
                    <span class="error"><?php echo $errors['login_id']; ?></span>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" minlength="<?php echo MIN_PASSWORD_LENGTH; ?>">
                <?php if (isset($errors['password'])): ?>
                    <span class="error"><?php echo $errors['password']; ?></span>
                <?php endif; ?>
            </div>
            <?php if (isset($errors['general'])): ?>
                <div class="error"><?php echo $errors['general']; ?></div>
            <?php endif; ?>
            <button type="submit">Login</button>
        </form>
        <a href="reset-password.php">Forgot Password?</a>
    </div>
</body>
</html>