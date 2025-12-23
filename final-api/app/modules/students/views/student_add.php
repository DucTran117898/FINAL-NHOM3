<?php
require_once '../../../controller/common.php';
checkAuth();

require_once '../models/student.php';

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $avatar = trim($_POST['avatar'] ?? '');
    $description = trim($_POST['description'] ?? '');

    // Basic validation
    if (empty($name)) {
        $errors['name'] = 'Name is required.';
    }

    if (empty($errors)) {
        $studentModel = new Student();
        $data = [
            'name' => $name,
            'avatar' => $avatar,
            'description' => $description
        ];

        if ($studentModel->create($data)) {
            $success = 'Student added successfully.';
            header('Location: students.php');
            exit;
        } else {
            $errors['general'] = 'Failed to add student.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Student</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <header>
        <div class="user-info">
            <span>Add Student</span>
            <a href="students.php">Back to Students</a>
            <a href="?logout=1">Logout</a>
        </div>
    </header>

    <div class="container">
        <h2>Add New Student</h2>
        <?php if ($success): ?>
            <div class="success"><?php echo $success; ?></div>
        <?php endif; ?>
        <form method="POST">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <?php if (isset($errors['name'])): ?>
                    <span class="error"><?php echo $errors['name']; ?></span>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="avatar">Avatar:</label>
                <input type="text" id="avatar" name="avatar">
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" name="description"></textarea>
            </div>
            <?php if (isset($errors['general'])): ?>
                <div class="error"><?php echo $errors['general']; ?></div>
            <?php endif; ?>
            <button type="submit">Add Student</button>
        </form>
    </div>
</body>
</html>

<?php
if (isset($_GET['logout'])) {
    logout();
}
?>