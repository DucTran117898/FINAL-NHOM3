<?php
require_once '../../../controller/common.php';
checkAuth();

if (isset($_GET['logout'])) {
    logout();
}

$currentAdmin = getCurrentAdmin();
?>

<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trang chủ quản trị</title>
    <style>
        /* Thiết lập cơ bản */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #fff;
        }

        /* Khung bao ngoài (để tạo viền giống ảnh) */
        .main-container {
            border: 1px solid #3d68a1;
            /* Viền xanh */
            min-height: 500px;
            /* Chiều cao tối thiểu */
            padding: 30px;
            position: relative;
        }

        /* Phần thông tin Login (Góc trái trên) */
        .login-info {
            margin-bottom: 50px;
            font-size: 16px;
            line-height: 1.5;
            color: #000;
            display: flex;
            justify-content: space-between; /* Add logout button alignment */
        }
        
        .user-details {
             display: flex;
             flex-direction: column;
        }

        /* Container chứa các mục quản lý */
        .dashboard-menu {
            display: flex;
            justify-content: space-between;
            /* Dàn đều các cột ra chiều ngang */
            align-items: flex-start;
            padding: 0 20px;
        }

        /* Mỗi cột chức năng (Phòng học, Giáo viên...) */
        .menu-column {
            display: flex;
            flex-direction: column;
            /* Xếp tiêu đề và link theo chiều dọc */
            align-items: center;
            /* Căn giữa nội dung trong cột */
            min-width: 100px;
        }

        /* Tiêu đề mục (Phòng học, Giáo viên...) */
        .menu-title {
            font-size: 16px;
            color: #000;
            margin-bottom: 10px;
            font-weight: normal;
            /* Trong ảnh chữ không đậm */
        }

        /* Các đường link */
        .menu-column a {
            color: #0000EE;
            /* Màu xanh link mặc định */
            text-decoration: underline;
            margin-bottom: 5px;
            font-size: 16px;
            cursor: pointer;
        }

        .menu-column a:hover {
            color: #551a8b;
            /* Đổi màu khi di chuột */
        }
        
        .logout-link {
            color: red;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>

<body>

    <div class="main-container">
        <div class="login-info">
            <div class="user-details">
                <div>Tên login: <?php echo htmlspecialchars($currentAdmin['login_id']); ?></div>
                <div id="time-display">Thời gian login: <?php echo htmlspecialchars($_SESSION['login_time']); ?></div>
            </div>
            <div>
                <a href="?logout=1" class="logout-link">Logout</a>
            </div>
        </div>

        <div class="dashboard-menu">
            <div class="menu-column">
                <div class="menu-title">Phòng học</div>
                <a href="#">Tìm kiếm</a>
                <a href="#">Thêm mới</a>
            </div>

            <div class="menu-column">
                <div class="menu-title">Giáo viên</div>
                <a href="../../teachers/views/teachers.php">Tìm kiếm</a>
                <a href="../../teachers/views/teacher_add.php">Thêm mới</a>
            </div>

            <div class="menu-column">
                <div class="menu-title">Môn học</div>
                <a href="../../subjects/views/subjects.php">Tìm kiếm</a>
                <a href="../../subjects/views/subject_add.php">Thêm mới</a>
            </div>

            <div class="menu-column">
                <div class="menu-title">Sinh Viên</div>
                <a href="../../students/views/students.php">Tìm kiếm</a>
                <a href="../../students/views/student_add.php">Thêm mới</a>
            </div>

            <div class="menu-column">
                <div class="menu-title">Điểm</div>
                <a href="../../scores/views/scores.php">Tìm kiếm</a>
                <a href="../../scores/views/score_add.php">Thêm điểm</a>
            </div>
        </div>
    </div>

</body>

</html>

