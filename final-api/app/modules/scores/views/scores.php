<?php
require_once '../../../controller/common.php';
checkAuth();

require_once '../models/score.php';

$scoreModel = new Score();
$scores = [];
$searchPerformed = false;
$totalCount = 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST' || isset($_GET['student_name']) || isset($_GET['subject_name']) || isset($_GET['teacher_name'])) {
    $student_name = $_POST['student_name'] ?? $_GET['student_name'] ?? '';
    $subject_name = $_POST['subject_name'] ?? $_GET['subject_name'] ?? '';
    $teacher_name = $_POST['teacher_name'] ?? $_GET['teacher_name'] ?? '';

    $scores = $scoreModel->search($student_name, $subject_name, $teacher_name);
    $totalCount = count($scores);
    $searchPerformed = true;
} else {
    $scores = $scoreModel->getAll();
    $totalCount = count($scores);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Scores</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <header>
        <div class="user-info">
            <span>Scores Management</span>
            <a href="../../auth/views/home.php">Back to Home</a>
            <a href="?logout=1">Logout</a>
        </div>
    </header>

    <div class="container">
        <h2>Search Scores</h2>
        <form method="POST">
            <div class="form-group">
                <label for="student_name">Student Name:</label>
                <input type="text" id="student_name" name="student_name" value="<?php echo htmlspecialchars($_POST['student_name'] ?? ''); ?>">
            </div>
            <div class="form-group">
                <label for="subject_name">Subject Name:</label>
                <input type="text" id="subject_name" name="subject_name" value="<?php echo htmlspecialchars($_POST['subject_name'] ?? ''); ?>">
            </div>
            <div class="form-group">
                <label for="teacher_name">Teacher Name:</label>
                <input type="text" id="teacher_name" name="teacher_name" value="<?php echo htmlspecialchars($_POST['teacher_name'] ?? ''); ?>">
            </div>
            <button type="submit">Search</button>
        </form>

        <?php if ($searchPerformed): ?>
            <p>Number of scores found: <?php echo $totalCount; ?></p>
        <?php endif; ?>

        <?php if ($totalCount > 0): ?>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Student</th>
                        <th>Subject</th>
                        <th>Teacher</th>
                        <th>Score</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $no = 1; foreach ($scores as $score): ?>
                        <tr>
                            <td><?php echo $no++; ?></td>
                            <td><?php echo htmlspecialchars($score['student_name']); ?></td>
                            <td><?php echo htmlspecialchars($score['subject_name']); ?></td>
                            <td><?php echo htmlspecialchars($score['teacher_name']); ?></td>
                            <td><?php echo htmlspecialchars($score['score']); ?></td>
                            <td><?php echo htmlspecialchars($score['description']); ?></td>
                            <td>
                                <a href="score_edit.php?id=<?php echo $score['id']; ?>">Edit</a>
                                <a href="score_delete.php?id=<?php echo $score['id']; ?>" onclick="return confirm('Are you sure?')">Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>No scores found.</p>
        <?php endif; ?>
    </div>
</body>
</html>

<?php
if (isset($_GET['logout'])) {
    logout();
}
?>