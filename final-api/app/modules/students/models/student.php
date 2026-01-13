<?php
require_once __DIR__ . '/../../../common/db.php';

class Student {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
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
        try {
            // Start transaction to safely delete related data
            $this->db->beginTransaction();

            // Delete related scores first to satisfy foreign key constraints
            $stmtScore = $this->db->prepare("DELETE FROM scores WHERE student_id = ?");
            $stmtScore->execute([$id]);

            // Then delete the student record itself
            $stmt = $this->db->prepare("DELETE FROM students WHERE id = ?");
            $stmt->execute([$id]);

            $this->db->commit();
            return $stmt->rowCount() > 0;
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            error_log('Failed to delete student: ' . $e->getMessage());
            return false;
        }
    }

    public function getAll($limit = 10, $offset = 0) {
        $stmt = $this->db->prepare("SELECT * FROM students ORDER BY id DESC LIMIT ? OFFSET ?");
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->bindValue(2, $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function countAll() {
    $stmt = $this->db->query("SELECT COUNT(*) as cnt FROM students");
    return $stmt->fetch(PDO::FETCH_ASSOC)['cnt'];
    }


    public function search($keyword, $limit = 10, $offset = 0) {
        $sql = "SELECT * FROM students 
            WHERE name LIKE ? OR description LIKE ? 
            ORDER BY id DESC 
            LIMIT ? OFFSET ?";
        $stmt = $this->db->prepare($sql);

        $like = '%' . $keyword . '%';
        $stmt->bindValue(1, $like, PDO::PARAM_STR);
        $stmt->bindValue(2, $like, PDO::PARAM_STR);
        $stmt->bindValue(3, (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(4, (int)$offset, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function countSearch($keyword) {
        $sql = "SELECT COUNT(*) as cnt 
            FROM students 
            WHERE name LIKE ? OR description LIKE ?";
        $stmt = $this->db->prepare($sql);

        $like = '%' . $keyword . '%';
        $stmt->execute([$like, $like]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['cnt'];
    }


    

}
?>