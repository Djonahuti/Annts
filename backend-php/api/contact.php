<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $db->prepare('SELECT * FROM contact_us ORDER BY created_at DESC');
        $stmt->execute([]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($rows);
    }
    if ($method === 'POST') {
        $data = get_json_body();
        $name = $data['name'] ?? null;
        $email = $data['email'] ?? null;
        $message = $data['message'] ?? null;
        if (!$name || !$email || !$message) json_response(['error' => 'Name, email, and message are required'], 400);
        $stmt = $db->prepare('INSERT INTO contact_us (name, email, phone, company, subject, message, created_at) VALUES (:name, :email, :phone, :company, :subject, :message, :created_at)');
        $stmt->execute([':name' => $name, ':email' => $email, ':phone' => $data['phone'] ?? null, ':company' => $data['company'] ?? null, ':subject' => $data['subject'] ?? null, ':message' => $message, ':created_at' => date('Y-m-d H:i:s')]);
        json_response(['message' => 'Contact message submitted successfully'], 200);
    }
    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}
?>
