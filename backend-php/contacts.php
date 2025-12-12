<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = get_db_connection();

switch ($method) {
    case 'GET':
        // simple list
        $stmt = $db->query('SELECT id, name, email, phone FROM contacts ORDER BY id DESC LIMIT 100');
        $rows = $stmt->fetchAll();
        send_json($rows);
        break;
    case 'POST':
        $payload = json_decode(file_get_contents('php://input'), true);
        if (!$payload) {
            http_response_code(400);
            send_json(['error' => 'Invalid JSON']);
            break;
        }
        $stmt = $db->prepare('INSERT INTO contacts (name, email, phone) VALUES (:name, :email, :phone)');
        $stmt->execute([
            ':name' => $payload['name'] ?? null,
            ':email' => $payload['email'] ?? null,
            ':phone' => $payload['phone'] ?? null,
        ]);
        http_response_code(201);
        send_json(['ok' => true, 'id' => $db->lastInsertId()]);
        break;
    default:
        http_response_code(405);
        send_json(['error' => 'Method not allowed']);
}

?>
