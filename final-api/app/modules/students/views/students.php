<?php
require_once '../../../controller/common.php';
checkAuth();

require_once '../models/student.php';

$studentModel = new Student();
$students = [];
$searchPerformed = false;
$totalCount = 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST' || isset($_GET['keyword'])) {
    $keyword = $_POST['keyword'] ?? $_GET['keyword'] ?? '';

    $students = $studentModel->search($keyword);
    $totalCount = count($students);
    $searchPerformed = true;
} else {
    $students = $studentModel->getAll();
    $totalCount = count($students);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Students</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <header>
        <div class="user-info">
            <span>Students Management</span>
            <a href="../../auth/views/home.php">Back to Home</a>
            <a href="?logout=1">Logout</a>
        </div>
    </header>

    <div class="container">
        <h2>Search Students</h2>
        <form method="POST">
            <div class="form-group">
                <label for="keyword">Keyword:</label>
                <input type="text" id="keyword" name="keyword" value="<?php echo htmlspecialchars($_POST['keyword'] ?? ''); ?>">
            </div>
            <button type="submit">Search</button>
        </form>

        <?php if ($searchPerformed): ?>
            <p>Number of students found: <?php echo $totalCount; ?></p>
        <?php endif; ?>

        <?php if ($totalCount > 0): ?>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $no = 1; foreach ($students as $student): ?>
                        <tr>
                            <td><?php echo $no++; ?></td>
                            <td><?php echo htmlspecialchars($student['name']); ?></td>
                            <td><?php echo htmlspecialchars($student['description']); ?></td>
                            <td>
                                <a href="student_edit.php?id=<?php echo $student['id']; ?>">Edit</a>
                                <a href="student_delete.php?id=<?php echo $student['id']; ?>" onclick="return confirm('Are you sure?')">Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>No students found.</p>
        <?php endif; ?>
    </div>
</body>
</html>

<?php
if (isset($_GET['logout'])) {
    logout();
}
?>