<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $email = $_GET['email'] ?? null;
        if ($email) {
            $stmt = $db->prepare('SELECT * FROM admins WHERE email = :email LIMIT 1');
            $stmt->execute([':email' => $email]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) json_response(['error' => 'Admin not found'], 404);
            json_response($row);
        }
        $stmt = $db->prepare('SELECT id, name, email, role, banned, created_at FROM admins ORDER BY created_at DESC');
        $stmt->execute([]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($rows);
    }
    if ($method === 'POST') {
        $data = get_json_body();
        $name = $data['name'] ?? null;
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $role = $data['role'] ?? 'editor';
        if (!$name || !$email || !$password) json_response(['error' => 'Name, email, and password are required'], 400);
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $db->prepare('INSERT INTO admins (name, email, password, role, banned, created_at) VALUES (:name, :email, :password, :role, :banned, :created_at)');
        $stmt->execute([':name' => $name, ':email' => $email, ':password' => $hashed, ':role' => $role, ':banned' => 0, ':created_at' => date('Y-m-d H:i:s')]);
        $id = $db->lastInsertId();
        $stmt = $db->prepare('SELECT id, name, email, role, banned FROM admins WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response(['message' => 'Admin created successfully', 'admin' => $row], 201);
    }
    if ($method === 'PUT') {
        $data = get_json_body();
        $id = $data['id'] ?? null;
        $banned = isset($data['banned']) ? ($data['banned'] ? 1 : 0) : null;
        if (!$id || $banned === null) json_response(['error' => 'ID and banned status required'], 400);
        $stmt = $db->prepare('UPDATE admins SET banned = :banned WHERE id = :id');
        $stmt->execute([':banned' => $banned, ':id' => $id]);
        $stmt = $db->prepare('SELECT id, name, email, role, banned FROM admins WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response(['message' => 'Admin updated successfully', 'admin' => $row]);
    }
    if ($method === 'PATCH') {
        // Update admin role when id param provided
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        if (!$id) json_response(['error' => 'Admin ID required'], 400);
        $data = get_json_body();
        $role = $data['role'] ?? null;
        if ($role === null) json_response(['error' => 'role is required'], 400);
        $stmt = $db->prepare('UPDATE admins SET role = :role WHERE id = :id');
        $stmt->execute([':role' => $role, ':id' => $id]);
        $stmt = $db->prepare('SELECT id, name, email, role FROM admins WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response(['message' => 'Admin role updated successfully', 'admin' => $row]);
    }
    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
