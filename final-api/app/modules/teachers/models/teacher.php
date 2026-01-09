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
            $sql .= " AND (LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))";
            $params[] = '%' . $keyword . '%';
            $params[] = '%' . $keyword . '%';
        }

        $sql .= " ORDER BY id";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM teachers ORDER BY id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM teachers WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO teachers (name, avatar, description, specialized, degree, updated, created) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
        $result = $stmt->execute([
            $data['name'] ?? '',
            $data['avatar'] ?? '',
            $data['description'] ?? '',
            $data['specialized'] ?? '',
            $data['degree'] ?? ''
        ]);
        
        if ($result) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE teachers SET name = ?, avatar = ?, description = ?, specialized = ?, degree = ?, updated = NOW() WHERE id = ?");
        return $stmt->execute([
            $data['name'] ?? '',
            $data['avatar'] ?? '',
            $data['description'] ?? '',
            $data['specialized'] ?? '',
            $data['degree'] ?? '',
            $id
        ]);
    }

    public function delete($id) {
        // Check if teacher is referenced in scores table
        $checkStmt = $this->db->prepare("SELECT COUNT(*) as count FROM scores WHERE teacher_id = ?");
        $checkStmt->execute([$id]);
        $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result && $result['count'] > 0) {
            throw new Exception('Cannot delete teacher: Teacher is referenced in scores table');
        }
        
        $stmt = $this->db->prepare("DELETE FROM teachers WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>