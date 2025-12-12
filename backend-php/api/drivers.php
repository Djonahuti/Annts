<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        $email = $_GET['email'] ?? null;
        if ($id) {
            $stmt = $db->prepare('SELECT * FROM driver WHERE id = :id LIMIT 1');
            $stmt->execute([':id' => $id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) json_response(['error' => 'Driver not found'], 404);
            json_response($row);
        }
        if ($email) {
            $stmt = $db->prepare('SELECT * FROM driver WHERE email = :email LIMIT 1');
            $stmt->execute([':email' => $email]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) json_response(['error' => 'Driver not found'], 404);
            json_response($row);
        }
        $stmt = $db->prepare('SELECT d.*, b.id as bus_id, b.bus_code, b.plate_no, c.id as coordinator_id, c.name as coordinator_name FROM driver d LEFT JOIN buses b ON b.driver = d.id LEFT JOIN coordinators c ON b.coordinator = c.id');
        $stmt->execute([]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($rows);
    }

    if ($method === 'POST') {
        $data = get_json_body();
        $name = $data['name'] ?? null;
        $email = isset($data['email']) ? strtolower(trim($data['email'])) : null;
        $password = $data['password'] ?? null;
        $dob = $data['dob'] ?? null;
        $nin = isset($data['nin']) ? $data['nin'] : null;
        $phones = isset($data['phones']) ? $data['phones'] : [];
        $addresses = isset($data['addresses']) ? $data['addresses'] : [];
        if (!$email || !$password) json_response(['error' => 'Email and password are required'], 400);
        if (count($phones) === 0) json_response(['error' => 'At least one phone number required'], 400);
        if (count($addresses) === 0) json_response(['error' => 'At least one address required'], 400);
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $db->prepare('INSERT INTO driver (name, email, password, dob, nin, phone, address, kyc, created_at) VALUES (:name, :email, :password, :dob, :nin, :phone_json, :address_json, :kyc, :created_at)');
        $stmt->execute([':name' => $name, ':email' => $email, ':password' => $hashedPassword, ':dob' => $dob, ':nin' => $nin, ':phone_json' => json_encode($phones), ':address_json' => json_encode($addresses), ':kyc' => 0, ':created_at' => date('Y-m-d H:i:s')]);
        json_response(['message' => 'Driver registered successfully'], 201);
    }

    if ($method === 'PUT') {
        $data = get_json_body();
        $id = $data['id'] ?? null;
        $banned = isset($data['banned']) ? ($data['banned'] ? 1 : 0) : null;
        if (!$id || $banned === null) json_response(['error' => 'ID and banned are required'], 400);
        $stmt = $db->prepare('UPDATE driver SET banned = :banned WHERE id = :id');
        $stmt->execute([':banned' => $banned, ':id' => $id]);
        $stmt = $db->prepare('SELECT id, name, email, banned FROM driver WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response($row);
    }

    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
