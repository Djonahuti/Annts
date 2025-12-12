<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $email = $_GET['email'] ?? null;
        if ($email) {
            $stmt = $db->prepare('SELECT * FROM coordinators WHERE email = :email LIMIT 1');
            $stmt->execute([':email' => $email]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) json_response(['error' => 'Coordinator not found'], 404);
            json_response($row);
        }
        $stmt = $db->prepare('SELECT id, name, email, phone, banned FROM coordinators');
        $stmt->execute([]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($rows);
    }

    if ($method === 'POST') {
        $data = get_json_body();
        $name = $data['name'] ?? null;
        $email = isset($data['email']) ? strtolower(trim($data['email'])) : null;
        $password = $data['password'] ?? null;
        $phone = isset($data['phone']) ? $data['phone'] : [];
        if (!$name || !$email || !$password) json_response(['error' => 'Name, email, and password required'], 400);
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $db->prepare('INSERT INTO coordinators (name, email, password, phone, banned, created_at) VALUES (:name, :email, :password, :phone, :banned, :created_at)');
        $stmt->execute([':name' => $name, ':email' => $email, ':password' => $hashed, ':phone' => json_encode($phone), ':banned' => 0, ':created_at' => date('Y-m-d H:i:s')]);
        $id = $db->lastInsertId();
        $stmt = $db->prepare('SELECT id, name, email, phone, banned FROM coordinators WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response(['message' => 'Coordinator created successfully', 'coordinator' => $row], 201);
    }

    if ($method === 'PUT') {
        $data = get_json_body();
        $id = $data['id'] ?? null;
        $banned = isset($data['banned']) ? ($data['banned'] ? 1 : 0) : null;
        if (!$id || $banned === null) json_response(['error' => 'ID and banned required'], 400);
        $stmt = $db->prepare('UPDATE coordinators SET banned = :banned WHERE id = :id');
        $stmt->execute([':banned' => $banned, ':id' => $id]);
        $stmt = $db->prepare('SELECT id, name, email, phone, banned FROM coordinators WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response(['message' => 'Coordinator updated', 'coordinator' => $row]);
    }
    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}
?>
