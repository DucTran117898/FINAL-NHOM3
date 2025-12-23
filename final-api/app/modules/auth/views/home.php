<?php
require_once '../../../controller/common.php';
checkAuth();

$currentAdmin = getCurrentAdmin();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Home</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <header>
        <div class="user-info">
            <span>Welcome, <?php echo htmlspecialchars($currentAdmin['login_id']); ?></span>
            <span>Login Time: <?php echo $_SESSION['login_time']; ?></span>
            <a href="?logout=1">Logout</a>
        </div>
    </header>

    <div class="container">
        <h2>School Management System</h2>
        <div class="menu-grid">
            <div class="module">
                <h3>Classrooms</h3>
                <a href="../../subjects/views/subjects.php">Search</a>
                <a href="../../subjects/views/subject_add.php">Add New</a>
            </div>
            <div class="module">
                <h3>Teachers</h3>
                <a href="../../teachers/views/teachers.php">Search</a>
                <a href="../../teachers/views/teacher_add.php">Add New</a>
            </div>
            <div class="module">
                <h3>Subjects</h3>
                <a href="../../subjects/views/subjects.php">Search</a>
                <a href="../../subjects/views/subject_add.php">Add New</a>
            </div>
            <div class="module">
                <h3>Students</h3>
                <a href="../../students/views/students.php">Search</a>
                <a href="../../students/views/student_add.php">Add New</a>
            </div>
            <div class="module">
                <h3>Scores</h3>
                <a href="../../scores/views/scores.php">Search</a>
                <a href="../../scores/views/score_add.php">Add Score</a>
            </div>
        </div>
    </div>
</body>
</html>

<?php
if (isset($_GET['logout'])) {
    logout();
}
?>