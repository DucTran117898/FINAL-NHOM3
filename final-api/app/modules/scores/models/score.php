<?php
require_once '../../common/db.php';

class Score {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function search($student_name = '', $subject_name = '', $teacher_name = '') {
        $sql = "SELECT s.*, st.name as student_name, sub.name as subject_name, t.name as teacher_name 
                FROM scores s 
                JOIN students st ON s.student_id = st.id 
                JOIN subjects sub ON s.subject_id = sub.id 
                JOIN teachers t ON s.teacher_id = t.id 
                WHERE 1=1";
        $params = [];

        if (!empty($student_name)) {
            $sql .= " AND st.name ILIKE ?";
            $params[] = '%' . $student_name . '%';
        }

        if (!empty($subject_name)) {
            $sql .= " AND sub.name ILIKE ?";
            $params[] = '%' . $subject_name . '%';
        }

        if (!empty($teacher_name)) {
            $sql .= " AND t.name ILIKE ?";
            $params[] = '%' . $teacher_name . '%';
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT s.*, st.name as student_name, sub.name as subject_name, t.name as teacher_name 
                                  FROM scores s 
                                  JOIN students st ON s.student_id = st.id 
                                  JOIN subjects sub ON s.subject_id = sub.id 
                                  JOIN teachers t ON s.teacher_id = t.id 
                                  ORDER BY s.id");
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT s.*, st.name as student_name, sub.name as subject_name, t.name as teacher_name 
                                    FROM scores s 
                                    JOIN students st ON s.student_id = st.id 
                                    JOIN subjects sub ON s.subject_id = sub.id 
                                    JOIN teachers t ON s.teacher_id = t.id 
                                    WHERE s.id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO scores (student_id, teacher_id, subject_id, score, description, updated, created) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
        return $stmt->execute([$data['student_id'], $data['teacher_id'], $data['subject_id'], $data['score'], $data['description']]);
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE scores SET score = ?, description = ?, updated = NOW() WHERE id = ?");
        return $stmt->execute([$data['score'], $data['description'], $id]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM scores WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function getStudents() {
        $stmt = $this->db->query("SELECT id, name FROM students ORDER BY name");
        return $stmt->fetchAll();
    }

    public function getTeachers() {
        $stmt = $this->db->query("SELECT id, name FROM teachers ORDER BY name");
        return $stmt->fetchAll();
    }

    public function getSubjects() {
        $stmt = $this->db->query("SELECT id, name FROM subjects ORDER BY name");
        return $stmt->fetchAll();
    }
}
?>