<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
if (!$id) json_response(['error' => 'Bus ID is required'], 400);

try {
    if ($method === 'GET') {
        $payload = require_auth();
        $stmt = $db->prepare('SELECT * FROM bus_status_history WHERE bus = :bus ORDER BY changed_at DESC LIMIT 100');
        $stmt->execute([':bus' => $id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($rows);
    }

    if ($method === 'POST') {
        $payload = require_auth(['admin']);
        $data = get_json_body();
        $status = $data['status'] ?? null;
        $note = $data['note'] ?? null;
        if (!$status) json_response(['error' => 'Status is required'], 400);
        // find admin id by email (payload contains id)
        $adminId = $payload['id'];
        $stmt = $db->prepare('INSERT INTO bus_status_history (bus, status, note, changed_by, changed_at) VALUES (:bus, :status, :note, :changed_by, :changed_at)');
        $stmt->execute([':bus' => $id, ':status' => $status, ':note' => $note, ':changed_by' => $adminId, ':changed_at' => date('Y-m-d H:i:s')]);
        $rowId = $db->lastInsertId();
        $stmt = $db->prepare('SELECT * FROM bus_status_history WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $rowId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response($row, 201);
    }
    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
