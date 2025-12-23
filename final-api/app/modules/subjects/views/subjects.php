<?php
require_once '../../../controller/common.php';
checkAuth();

require_once '../models/subject.php';

$subjectModel = new Subject();
$subjects = [];
$searchPerformed = false;
$totalCount = 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST' || isset($_GET['school_year']) || isset($_GET['keyword'])) {
    $school_year = $_POST['school_year'] ?? $_GET['school_year'] ?? '';
    $keyword = $_POST['keyword'] ?? $_GET['keyword'] ?? '';

    $subjects = $subjectModel->search($school_year, $keyword);
    $totalCount = count($subjects);
    $searchPerformed = true;
} else {
    $subjects = $subjectModel->getAll();
    $totalCount = count($subjects);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Subjects</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <header>
        <div class="user-info">
            <span>Subjects Management</span>
            <a href="../../auth/views/home.php">Back to Home</a>
            <a href="?logout=1">Logout</a>
        </div>
    </header>

    <div class="container">
        <h2>Search Subjects</h2>
        <form method="POST">
            <div class="form-group">
                <label for="school_year">School Year:</label>
                <select id="school_year" name="school_year">
                    <option value="">All</option>
                    <option value="Year 1" <?php echo (isset($_POST['school_year']) && $_POST['school_year'] == 'Year 1') ? 'selected' : ''; ?>>Year 1</option>
                    <option value="Year 2" <?php echo (isset($_POST['school_year']) && $_POST['school_year'] == 'Year 2') ? 'selected' : ''; ?>>Year 2</option>
                    <option value="Year 3" <?php echo (isset($_POST['school_year']) && $_POST['school_year'] == 'Year 3') ? 'selected' : ''; ?>>Year 3</option>
                    <option value="Year 4" <?php echo (isset($_POST['school_year']) && $_POST['school_year'] == 'Year 4') ? 'selected' : ''; ?>>Year 4</option>
                </select>
            </div>
            <div class="form-group">
                <label for="keyword">Keyword:</label>
                <input type="text" id="keyword" name="keyword" value="<?php echo htmlspecialchars($_POST['keyword'] ?? ''); ?>">
            </div>
            <button type="submit">Search</button>
        </form>

        <?php if ($searchPerformed): ?>
            <p>Number of subjects found: <?php echo $totalCount; ?></p>
        <?php endif; ?>

        <?php if ($totalCount > 0): ?>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Subject Name</th>
                        <th>School Year</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $no = 1; foreach ($subjects as $subject): ?>
                        <tr>
                            <td><?php echo $no++; ?></td>
                            <td><?php echo htmlspecialchars($subject['name']); ?></td>
                            <td><?php echo htmlspecialchars($subject['school_year']); ?></td>
                            <td><?php echo htmlspecialchars($subject['description']); ?></td>
                            <td>
                                <a href="subject_edit.php?id=<?php echo $subject['id']; ?>">Edit</a>
                                <a href="subject_delete.php?id=<?php echo $subject['id']; ?>" onclick="return confirm('Are you sure?')">Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>No subjects found.</p>
        <?php endif; ?>
    </div>
</body>
</html>

<?php
if (isset($_GET['logout'])) {
    logout();
}
?>