<?php
require_once '../../../controller/common.php';
checkAuth();

require_once '../models/score.php';

$scoreModel = new Score();
$students = $scoreModel->getStudents();
$teachers = $scoreModel->getTeachers();
$subjects = $scoreModel->getSubjects();

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $student_id = $_POST['student_id'] ?? '';
    $teacher_id = $_POST['teacher_id'] ?? '';
    $subject_id = $_POST['subject_id'] ?? '';
    $score = $_POST['score'] ?? '';
    $description = trim($_POST['description'] ?? '');

    // Basic validation
    if (empty($student_id)) {
        $errors['student_id'] = 'Student is required.';
    }

    if (empty($teacher_id)) {
        $errors['teacher_id'] = 'Teacher is required.';
    }

    if (empty($subject_id)) {
        $errors['subject_id'] = 'Subject is required.';
    }

    if ($score === '' || !is_numeric($score) || $score < 0 || $score > 100) {
        $errors['score'] = 'Score must be a number between 0 and 100.';
    }

    if (empty($errors)) {
        $data = [
            'student_id' => $student_id,
            'teacher_id' => $teacher_id,
            'subject_id' => $subject_id,
            'score' => $score,
            'description' => $description
        ];

        if ($scoreModel->create($data)) {
            $success = 'Score added successfully.';
            header('Location: scores.php');
            exit;
        } else {
            $errors['general'] = 'Failed to add score.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Score</title>
    <link rel="stylesheet" href="../../../web/css/style.css">
</head>
<body>
    <header>
        <div class="user-info">
            <span>Add Score</span>
            <a href="scores.php">Back to Scores</a>
            <a href="?logout=1">Logout</a>
        </div>
    </header>

    <div class="container">
        <h2>Add New Score</h2>
        <?php if ($success): ?>
            <div class="success"><?php echo $success; ?></div>
        <?php endif; ?>
        <form method="POST">
            <div class="form-group">
                <label for="student_id">Student:</label>
                <select id="student_id" name="student_id" required>
                    <option value="">Select Student</option>
                    <?php foreach ($students as $student): ?>
                        <option value="<?php echo $student['id']; ?>" <?php echo (isset($_POST['student_id']) && $_POST['student_id'] == $student['id']) ? 'selected' : ''; ?>><?php echo htmlspecialchars($student['name']); ?></option>
                    <?php endforeach; ?>
                </select>
                <?php if (isset($errors['student_id'])): ?>
                    <span class="error"><?php echo $errors['student_id']; ?></span>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="teacher_id">Teacher:</label>
                <select id="teacher_id" name="teacher_id" required>
                    <option value="">Select Teacher</option>
                    <?php foreach ($teachers as $teacher): ?>
                        <option value="<?php echo $teacher['id']; ?>" <?php echo (isset($_POST['teacher_id']) && $_POST['teacher_id'] == $teacher['id']) ? 'selected' : ''; ?>><?php echo htmlspecialchars($teacher['name']); ?></option>
                    <?php endforeach; ?>
                </select>
                <?php if (isset($errors['teacher_id'])): ?>
                    <span class="error"><?php echo $errors['teacher_id']; ?></span>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="subject_id">Subject:</label>
                <select id="subject_id" name="subject_id" required>
                    <option value="">Select Subject</option>
                    <?php foreach ($subjects as $subject): ?>
                        <option value="<?php echo $subject['id']; ?>" <?php echo (isset($_POST['subject_id']) && $_POST['subject_id'] == $subject['id']) ? 'selected' : ''; ?>><?php echo htmlspecialchars($subject['name']); ?></option>
                    <?php endforeach; ?>
                </select>
                <?php if (isset($errors['subject_id'])): ?>
                    <span class="error"><?php echo $errors['subject_id']; ?></span>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="score">Score:</label>
                <input type="number" id="score" name="score" min="0" max="100" required value="<?php echo htmlspecialchars($_POST['score'] ?? ''); ?>">
                <?php if (isset($errors['score'])): ?>
                    <span class="error"><?php echo $errors['score']; ?></span>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" name="description"><?php echo htmlspecialchars($_POST['description'] ?? ''); ?></textarea>
            </div>
            <?php if (isset($errors['general'])): ?>
                <div class="error"><?php echo $errors['general']; ?></div>
            <?php endif; ?>
            <button type="submit">Add Score</button>
        </form>
    </div>
</body>
</html>

<?php
if (isset($_GET['logout'])) {
    logout();
}
?>