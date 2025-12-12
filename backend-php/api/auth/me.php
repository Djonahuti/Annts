<?php
require_once __DIR__ . '/../common.php';
require_once __DIR__ . '/../db.php';

// require auth and return the user row for the token's id/role
try {
    $payload = require_auth();
    $db = get_db_connection();
    $role = $payload['role'] ?? null;
    $id = isset($payload['id']) ? intval($payload['id']) : null;
    if (!$role || !$id) json_response(['error' => 'Invalid token'], 401);
    if ($role === 'admin') {
        $stmt = $db->prepare('SELECT id, name, email, role, banned, created_at FROM admins WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) json_response(['error' => 'User not found'], 404);
        json_response($row);
    } elseif ($role === 'coordinator') {
        $stmt = $db->prepare('SELECT id, name, email, phone, created_at FROM coordinators WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) json_response(['error' => 'User not found'], 404);
        json_response($row);
    } elseif ($role === 'driver') {
        $stmt = $db->prepare('SELECT id, name, email, phone, created_at, avatar FROM driver WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) json_response(['error' => 'User not found'], 404);
        json_response($row);
    } else {
        json_response(['error' => 'Unsupported role'], 400);
    }
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
