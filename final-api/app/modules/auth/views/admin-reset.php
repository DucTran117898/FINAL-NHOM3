<?php
require_once '../../../controller/common.php';
checkAuth();

require_once '../models/admin.php';

$adminModel = new Admin();
$pendingResets = $adminModel->getPendingResets();

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['reset'])) {
    $id = $_POST['id'];
    $new_password = trim($_POST['new_password']);

    if (empty($new_password)) {
        $errors[$id] = 'New password is required.';
    } elseif (strlen($new_password) < MIN_PASSWORD_LENGTH) {
        $errors[$id] = 'Password must be at least ' . MIN_PASSWORD_LENGTH . ' characters.';
    }

    if (empty($errors[$id])) {
        if ($adminModel->resetPassword($id, $new_password)) {
            $success = 'Password reset successfully.';
            header('Location: admin-reset.php');
            exit;
        } else {
            $errors[$id] = 'Failed to reset password.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Reset Password</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <header>
        <div class="user-info">
            <span>Admin Panel</span>
            <a href="home.php">Back to Home</a>
            <a href="?logout=1">Logout</a>
        </div>
    </header>

    <div class="container">
        <h2>Pending Password Resets</h2>
        <?php if ($success): ?>
            <div class="success"><?php echo $success; ?></div>
        <?php endif; ?>

        <table>
            <thead>
                <tr>
                    <th>User</th>
                    <th>New Password</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($pendingResets as $admin): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($admin['login_id']); ?></td>
                        <td>
                            <form method="POST" style="display: inline;">
                                <input type="hidden" name="id" value="<?php echo $admin['id']; ?>">
                                <input type="password" name="new_password" minlength="<?php echo MIN_PASSWORD_LENGTH; ?>" required>
                                <?php if (isset($errors[$admin['id']])): ?>
                                    <span class="error"><?php echo $errors[$admin['id']]; ?></span>
                                <?php endif; ?>
                        </td>
                        <td>
                                <button type="submit" name="reset">Reset</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>

<?php
if (isset($_GET['logout'])) {
    logout();
}
?>