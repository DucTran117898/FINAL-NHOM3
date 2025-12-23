<?php
require_once '../../../controller/common.php';
checkAuth();

require_once '../models/teacher.php';

$teacherModel = new Teacher();
$teachers = [];
$searchPerformed = false;
$totalCount = 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST' || isset($_GET['specialized']) || isset($_GET['keyword'])) {
    $specialized = $_POST['specialized'] ?? $_GET['specialized'] ?? '';
    $keyword = $_POST['keyword'] ?? $_GET['keyword'] ?? '';

    $teachers = $teacherModel->search($specialized, $keyword);
    $totalCount = count($teachers);
    $searchPerformed = true;
} else {
    $teachers = $teacherModel->getAll();
    $totalCount = count($teachers);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Teachers</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <header>
        <div class="user-info">
            <span>Teachers Management</span>
            <a href="../../auth/views/home.php">Back to Home</a>
            <a href="?logout=1">Logout</a>
        </div>
    </header>

    <div class="container">
        <h2>Search Teachers</h2>
        <form method="POST">
            <div class="form-group">
                <label for="specialized">Specialized:</label>
                <select id="specialized" name="specialized">
                    <option value="">All</option>
                    <option value="Math" <?php echo (isset($_POST['specialized']) && $_POST['specialized'] == 'Math') ? 'selected' : ''; ?>>Math</option>
                    <option value="Science" <?php echo (isset($_POST['specialized']) && $_POST['specialized'] == 'Science') ? 'selected' : ''; ?>>Science</option>
                    <!-- Add more options as needed -->
                </select>
            </div>
            <div class="form-group">
                <label for="keyword">Keyword:</label>
                <input type="text" id="keyword" name="keyword" value="<?php echo htmlspecialchars($_POST['keyword'] ?? ''); ?>">
            </div>
            <button type="submit">Search</button>
        </form>

        <?php if ($searchPerformed): ?>
            <p>Number of teachers found: <?php echo $totalCount; ?></p>
        <?php endif; ?>

        <?php if ($totalCount > 0): ?>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Specialized</th>
                        <th>Degree</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $no = 1; foreach ($teachers as $teacher): ?>
                        <tr>
                            <td><?php echo $no++; ?></td>
                            <td><?php echo htmlspecialchars($teacher['name']); ?></td>
                            <td><?php echo htmlspecialchars($teacher['specialized']); ?></td>
                            <td><?php echo htmlspecialchars($teacher['degree']); ?></td>
                            <td><?php echo htmlspecialchars($teacher['description']); ?></td>
                            <td>
                                <a href="teacher_edit.php?id=<?php echo $teacher['id']; ?>">Edit</a>
                                <a href="teacher_delete.php?id=<?php echo $teacher['id']; ?>" onclick="return confirm('Are you sure?')">Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>No teachers found.</p>
        <?php endif; ?>
    </div>
</body>
</html>

<?php
if (isset($_GET['logout'])) {
    logout();
}
?>