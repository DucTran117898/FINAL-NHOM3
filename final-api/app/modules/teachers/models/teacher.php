<?php
require_once __DIR__ . '/../../../common/db.php';

class Teacher {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function search($specialized = '', $keyword = '') {
        $sql = "SELECT * FROM teachers WHERE 1=1";
        $params = [];

        if (!empty($specialized)) {
            $sql .= " AND specialized = ?";
            $params[] = $specialized;
        }

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
        $stmt = $this->db->query("SELECT * FROM teachers ORDER BY id");
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM teachers WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO teachers (name, avatar, description, specialized, degree, updated, created) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
        return $stmt->execute([$data['name'], $data['avatar'], $data['description'], $data['specialized'], $data['degree']]);
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE teachers SET name = ?, avatar = ?, description = ?, specialized = ?, degree = ?, updated = NOW() WHERE id = ?");
        return $stmt->execute([$data['name'], $data['avatar'], $data['description'], $data['specialized'], $data['degree'], $id]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM teachers WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>