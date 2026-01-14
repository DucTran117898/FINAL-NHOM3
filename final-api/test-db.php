<?php
require_once 'app/common/db.php';

try {
    $db = Database::getInstance();
    echo "✅ Database connected successfully!\n";
    
    $conn = $db->getConnection();
    $stmt = $conn->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch();
    echo "User count: " . $result['count'] . "\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
