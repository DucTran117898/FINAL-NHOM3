<?php
require_once __DIR__ . '/../../../common/db.php';

class Admin {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function login($login_id, $password) {
        $stmt = $this->db->prepare("SELECT * FROM admins WHERE login_id = ? AND password = ? AND actived_flag = ?");
        $stmt->execute([$login_id, md5($password), ACTIVE]);
        return $stmt->fetch();
    }

    public function getByLoginId($login_id) {
        $stmt = $this->db->prepare("SELECT * FROM admins WHERE login_id = ?");
        $stmt->execute([$login_id]);
        return $stmt->fetch();
    }

    public function updateResetToken($login_id, $token) {
        $stmt = $this->db->prepare("UPDATE admins SET reset_password_token = ? WHERE login_id = ?");
        return $stmt->execute([$token, $login_id]);
    }

    public function getPendingResets() {
        $stmt = $this->db->query("SELECT * FROM admins WHERE reset_password_token != ''");
        return $stmt->fetchAll();
    }

    public function resetPassword($id, $new_password) {
        $stmt = $this->db->prepare("UPDATE admins SET password = ?, reset_password_token = '' WHERE id = ?");
        return $stmt->execute([md5($new_password), $id]);
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM admins WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
}
