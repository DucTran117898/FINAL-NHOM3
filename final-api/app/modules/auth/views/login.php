<?php
require_once '../../../common/define.php';
require_once '../models/admin.php';

session_start();

$errors = [];
$old_input = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login_id = trim($_POST['login_id'] ?? '');
    $password = trim($_POST['password'] ?? '');

    $old_input = ['login_id' => $login_id];

    // Validation
    // User ID
    if ($login_id === '') {
        $errors['login_id'] = "Please enter login ID";
    } elseif (strlen($login_id) < 4) {
        $errors['login_id'] = "Please enter a login ID with at least 4 characters";
    }

    // Password
    if ($password === '') {
        $errors['password'] = "Please enter password";
    } elseif (strlen($password) < 6) {
        $errors['password'] = "Please enter a password with at least 6 characters";
    }

    // reCAPTCHA Verification
    if (defined('RECAPTCHA_SECRET_KEY') && RECAPTCHA_SECRET_KEY !== '') {
        $recaptcha_response = $_POST['g-recaptcha-response'] ?? '';
        if (empty($recaptcha_response)) {
             $errors['general'] = "Please complete the CAPTCHA.";
        } else {
            $verify_url = 'https://www.google.com/recaptcha/api/siteverify';
            $data = [
                'secret' => RECAPTCHA_SECRET_KEY,
                'response' => $recaptcha_response
            ];
            
            $options = [
                'http' => [
                    'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                    'method' => 'POST',
                    'content' => http_build_query($data)
                ]
            ];
            
            $context = stream_context_create($options);
            $verify_result = file_get_contents($verify_url, false, $context);
            $json_result = json_decode($verify_result);
            
            if (!$json_result->success) {
                $errors['general'] = "CAPTCHA verification failed. Please try again.";
            }
        }
    }

    if (empty($errors)) {
        $adminModel = new Admin();
        // Check if exists in admins table with actived_flag (handled in model 'login' or needs separate check?)
        // Requirement says "exists: Check whether the login ID and password exist in the admins table"
        // And error "Login ID or password is incorrect"
        
        $admin = $adminModel->login($login_id, $password);

        if ($admin) {
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['login_time'] = date('Y-m-d H:i');
            $_SESSION['last_activity'] = time();
            header('Location: home.php');
            exit;
        } else {
            $errors['login_id'] = "Login ID or password is incorrect"; 
            // The requirement lists "exists" under User ID field with that message. 
            // So I will put it there.
        }
    }
}
?>

<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập</title>
    <style>
        /* Thiết lập cơ bản */
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #fff;
            margin: 0;
        }

        /* Khung bao ngoài */
        .login-container {
            width: 400px;
            padding: 40px;
            border: 1px solid #ddd;
            background-color: white;
        }

        /* Dòng chứa Label và Input */
        .form-group {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            position: relative; /* For error positioning if needed */
            flex-wrap: wrap;
        }

        /* Nhãn (Người dùng, Password) */
        .form-group label {
            width: 120px;
            font-size: 16px;
            color: #000;
        }

        /* Ô nhập liệu */
        .form-group input {
            flex: 1;
            padding: 8px;
            background-color: #e3eff9;
            border: 1px solid #7f9db9;
            outline: none;
            font-size: 14px;
        }

        /* Error message style */
        .error-message {
            color: red;
            font-size: 12px;
            width: 100%;
            margin-left: 120px; /* Align with input */
            margin-bottom: 5px;
            display: block;
        }

        /* Link Quên password */
        .forgot-password {
            text-align: center;
            margin-top: 10px;
            margin-bottom: 20px;
        }

        .forgot-password a {
            color: #000;
            font-style: italic;
            text-decoration: underline;
            font-size: 15px;
        }

        /* Nút Đăng nhập */
        .btn-container {
            display: flex;
            justify-content: center;
        }

        button {
            background-color: #4a79b5;
            color: white;
            border: 1px solid #2f5bb7;
            padding: 10px 25px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
        }

        button:hover {
            background-color: #3d68a1;
        }
    </style>
</head>

<body>

    <div class="login-container">
        
        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST">
            
            <?php if (isset($errors['login_id'])): ?>
                <div class="form-group" style="margin-bottom: 0;">
                     <div class="error-message"><?php echo $errors['login_id']; ?></div>
                </div>
            <?php endif; ?>

            <div class="form-group">
                <label for="login_id">User ID</label>
                <!-- Changed id/name to login_id to match backend -->
                <input type="text" id="login_id" name="login_id" value="<?php echo htmlspecialchars($old_input['login_id'] ?? ''); ?>">
            </div>

            <?php if (isset($errors['password'])): ?>
                <div class="form-group" style="margin-bottom: 0;">
                     <div class="error-message"><?php echo $errors['password']; ?></div>
                </div>
            <?php endif; ?>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password">
            </div>

            <?php if (defined('RECAPTCHA_SITE_KEY') && RECAPTCHA_SITE_KEY !== ''): ?>
                <div class="form-group" style="justify-content: center;">
                    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
                    <div class="g-recaptcha" data-sitekey="<?php echo RECAPTCHA_SITE_KEY; ?>"></div>
                </div>
            <?php endif; ?>

            <?php if (isset($errors['general'])): ?>
                <div class="form-group" style="margin-bottom: 0;">
                     <div class="error-message" style="margin-left: 0; text-align: center;"><?php echo $errors['general']; ?></div>
                </div>
            <?php endif; ?>

            <div class="forgot-password">
                <a href="reset-password.php">Forgot Password?</a>
            </div>

            <div class="btn-container">
                <button type="submit">Login</button>
            </div>
        </form>
    </div>

</body>

</html>