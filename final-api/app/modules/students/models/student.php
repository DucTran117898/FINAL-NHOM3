<?php
require_once __DIR__ . '/../../../common/db.php';

class Student {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function search($keyword = '') {
        $sql = "SELECT * FROM students WHERE 1=1";
        $params = [];

        if (!empty($keyword)) {
            $sql .= " AND (name ILIKE ? OR description ILIKE ?)";
            $params[] = '%' . $keyword . '%';
            $params[] = '%' . $keyword . '%';
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM students ORDER BY id");
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM students WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO students (name, avatar, description, updated, created) VALUES (?, ?, ?, NOW(), NOW())");
        return $stmt->execute([$data['name'], $data['avatar'], $data['description']]);
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE students SET name = ?, avatar = ?, description = ?, updated = NOW() WHERE id = ?");
        return $stmt->execute([$data['name'], $data['avatar'], $data['description'], $id]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM students WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>