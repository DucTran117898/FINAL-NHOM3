<?php
require_once '../../../common/define.php';
require_once '../models/admin.php';

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login_id = trim($_POST['login_id'] ?? '');

    if (empty($login_id)) {
        $errors['login_id'] = 'Login ID is required.';
    } elseif (strlen($login_id) < MIN_LOGIN_ID_LENGTH) {
        $errors['login_id'] = 'Login ID must be at least ' . MIN_LOGIN_ID_LENGTH . ' characters.';
    }

    if (empty($errors)) {
        $adminModel = new Admin();
        $admin = $adminModel->getByLoginId($login_id);

        if ($admin) {
            $token = microtime(true);
            $adminModel->updateResetToken($login_id, $token);
            $success = 'Reset request sent. Please contact admin.';
            header('Location: login.php');
            exit;
        } else {
            $errors['login_id'] = 'Login ID does not exist in the system.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reset Password Request</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <div class="reset-container">
        <h2>Reset Password Request</h2>
        <form method="POST">
            <div class="form-group">
                <label for="login_id">Login ID:</label>
                <input type="text" id="login_id" name="login_id" minlength="<?php echo MIN_LOGIN_ID_LENGTH; ?>">
                <?php if (isset($errors['login_id'])): ?>
                    <span class="error"><?php echo $errors['login_id']; ?></span>
                <?php endif; ?>
            </div>
            <button type="submit">Send Request</button>
        </form>
        <?php if ($success): ?>
            <div class="success"><?php echo $success; ?></div>
        <?php endif; ?>
        <a href="login.php">Back to Login</a>
    </div>
</body>
</html>