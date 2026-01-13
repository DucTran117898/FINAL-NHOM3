<?php
require_once __DIR__ . '/../../../common/db.php';

class Subject {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function search($school_year = '', $keyword = '') {
        $sql = "SELECT * FROM subjects WHERE 1=1";
        $params = [];

        if (!empty($school_year)) {
            $sql .= " AND school_year = ?";
            $params[] = $school_year;
        }

        if (!empty($keyword)) {
            // Use LIKE for broader DB compatibility (MySQL/PostgreSQL)
            $sql .= " AND (name LIKE ? OR description LIKE ?)";
            $params[] = '%' . $keyword . '%';
            $params[] = '%' . $keyword . '%';
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getAll() {
        // Requirement: order by ID in descending order for initial display
        $stmt = $this->db->query("SELECT * FROM subjects ORDER BY id DESC");
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM subjects WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO subjects (name, avatar, description, school_year, updated, created) VALUES (?, ?, ?, ?, NOW(), NOW())");
        return $stmt->execute([$data['name'], $data['avatar'], $data['description'], $data['school_year']]);
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE subjects SET name = ?, avatar = ?, description = ?, school_year = ?, updated = NOW() WHERE id = ?");
        return $stmt->execute([$data['name'], $data['avatar'], $data['description'], $data['school_year'], $id]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM subjects WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>