<?php
require_once '../../../controller/common.php';
checkAuth();

require_once '../models/subject.php';

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $avatar = trim($_POST['avatar'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $school_year = trim($_POST['school_year'] ?? '');

    // Basic validation
    if (empty($name)) {
        $errors['name'] = 'Name is required.';
    }

    if (empty($school_year)) {
        $errors['school_year'] = 'School year is required.';
    }

    if (empty($errors)) {
        $subjectModel = new Subject();
        $data = [
            'name' => $name,
            'avatar' => $avatar,
            'description' => $description,
            'school_year' => $school_year
        ];

        if ($subjectModel->create($data)) {
            $success = 'Subject added successfully.';
            // Redirect or clear form
            header('Location: subjects.php');
            exit;
        } else {
            $errors['general'] = 'Failed to add subject.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Subject</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <header>
        <div class="user-info">
            <span>Add Subject</span>
            <a href="subjects.php">Back to Subjects</a>
            <a href="?logout=1">Logout</a>
        </div>
    </header>

    <div class="container">
        <h2>Add New Subject</h2>
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
                <label for="school_year">School Year:</label>
                <select id="school_year" name="school_year" required>
                    <option value="">Select Year</option>
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                </select>
                <?php if (isset($errors['school_year'])): ?>
                    <span class="error"><?php echo $errors['school_year']; ?></span>
                <?php endif; ?>
            </div>
            <?php if (isset($errors['general'])): ?>
                <div class="error"><?php echo $errors['general']; ?></div>
            <?php endif; ?>
            <button type="submit">Add Subject</button>
        </form>
    </div>
</body>
</html>

<?php
if (isset($_GET['logout'])) {
    logout();
}
?>