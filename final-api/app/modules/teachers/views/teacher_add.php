<?php
require_once '../../../controller/common.php';
checkAuth();

require_once '../models/teacher.php';

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $avatar = trim($_POST['avatar'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $specialized = trim($_POST['specialized'] ?? '');
    $degree = trim($_POST['degree'] ?? '');

    // Basic validation
    if (empty($name)) {
        $errors['name'] = 'Name is required.';
    }

    if (empty($specialized)) {
        $errors['specialized'] = 'Specialized is required.';
    }

    if (empty($degree)) {
        $errors['degree'] = 'Degree is required.';
    }

    if (empty($errors)) {
        $teacherModel = new Teacher();
        $data = [
            'name' => $name,
            'avatar' => $avatar,
            'description' => $description,
            'specialized' => $specialized,
            'degree' => $degree
        ];

        if ($teacherModel->create($data)) {
            $success = 'Teacher added successfully.';
            header('Location: teachers.php');
            exit;
        } else {
            $errors['general'] = 'Failed to add teacher.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Teacher</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <header>
        <div class="user-info">
            <span>Add Teacher</span>
            <a href="teachers.php">Back to Teachers</a>
            <a href="?logout=1">Logout</a>
        </div>
    </header>

    <div class="container">
        <h2>Add New Teacher</h2>
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
            <div class="form-group">
                <label for="specialized">Specialized:</label>
                <input type="text" id="specialized" name="specialized" required>
                <?php if (isset($errors['specialized'])): ?>
                    <span class="error"><?php echo $errors['specialized']; ?></span>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="degree">Degree:</label>
                <input type="text" id="degree" name="degree" required>
                <?php if (isset($errors['degree'])): ?>
                    <span class="error"><?php echo $errors['degree']; ?></span>
                <?php endif; ?>
            </div>
            <?php if (isset($errors['general'])): ?>
                <div class="error"><?php echo $errors['general']; ?></div>
            <?php endif; ?>
            <button type="submit">Add Teacher</button>
        </form>
    </div>
</body>
</html>

<?php
if (isset($_GET['logout'])) {
    logout();
}
?>