<?php
require_once __DIR__ . '/../../../common/db.php';

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
            $sql .= " AND LOWER(st.name) LIKE LOWER(?)";
            $params[] = '%' . $student_name . '%';
        }

        if (!empty($subject_name)) {
            $sql .= " AND LOWER(sub.name) LIKE LOWER(?)";
            $params[] = '%' . $subject_name . '%';
        }

        if (!empty($teacher_name)) {
            $sql .= " AND LOWER(t.name) LIKE LOWER(?)";
            $params[] = '%' . $teacher_name . '%';
        }

        $sql .= " ORDER BY s.id DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getAll() {
        $sql = "
            SELECT 
                s.id,
                s.student_id,
                s.subject_id,
                s.teacher_id,
                s.score,
                s.description,
                t.name AS teacher_name,
                st.name AS student_name,
                sub.name AS subject_name,
                s.created AS created_at
            FROM scores s
            JOIN students st ON s.student_id = st.id
            JOIN subjects sub ON s.subject_id = sub.id
            JOIN teachers t ON s.teacher_id = t.id
            ORDER BY s.id DESC
        ";

        $stmt = $this->db->query($sql);
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT student_id, subject_id, score, description
            FROM scores
            WHERE id = ?
        ");
        $stmt->execute([$id]);
        $base = $stmt->fetch();

        if (!$base) {
            return null;
        }

        // Lấy tất cả giáo viên cùng nhóm
        $stmt = $this->db->prepare("
            SELECT teacher_id
            FROM scores
            WHERE student_id = ?
            AND subject_id = ?
            AND score = ?
        ");
        $stmt->execute([
            $base['student_id'],
            $base['subject_id'],
            $base['score']
        ]);

        $teacherIds = array_column($stmt->fetchAll(), 'teacher_id');

        return [
            'student_id'   => $base['student_id'],
            'subject_id'   => $base['subject_id'],
            'score'        => $base['score'],
            'description'  => $base['description'],
            'teacher_ids'  => $teacherIds
        ];
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

    public function deleteByGroup($id) {
        // Lấy thông tin dòng gốc
        $stmt = $this->db->prepare("
            SELECT student_id, subject_id, score 
            FROM scores 
            WHERE id = ?
        ");
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        if (!$row) {
            return false;
        }

        // Xóa tất cả score cùng nhóm
        $stmt = $this->db->prepare("
            DELETE FROM scores 
            WHERE student_id = ? 
            AND subject_id = ? 
            AND score = ?
        ");

        return $stmt->execute([
            $row['student_id'],
            $row['subject_id'],
            $row['score']
        ]);
    }

    public function updateFull($id, $data) {
        $stmt = $this->db->prepare("
            UPDATE scores
            SET student_id = ?, subject_id = ?, teacher_id = ?, score = ?, description = ?, updated = NOW()
            WHERE id = ?
        ");

        return $stmt->execute([
            $data['student_id'],
            $data['subject_id'],
            $data['teacher_id'],
            $data['score'],
            $data['description'],
            $id
        ]);
    }
}
?>