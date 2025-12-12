<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];
try {
    if ($method === 'GET') {
        $stmt = $db->prepare('SELECT * FROM co_subject ORDER BY created_at DESC');
        $stmt->execute([]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($rows);
    }
    if ($method === 'POST') {
        $data = get_json_body();
        $subject = $data['subject'] ?? null;
        if (!$subject) json_response(['error' => 'subject is required'], 400);
        $stmt = $db->prepare('INSERT INTO co_subject (subject, created_at) VALUES (:subject, :created_at)');
        $stmt->execute([':subject' => $subject, ':created_at' => date('Y-m-d H:i:s')]);
        $id = $db->lastInsertId();
        $stmt = $db->prepare('SELECT * FROM co_subject WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response($row, 201);
    }
    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}
?>
