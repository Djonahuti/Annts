<?php
require_once __DIR__ . '/../api/common.php';
require_once __DIR__ . '/../db.php';

require_method('POST');
$data = get_json_body();
$email = isset($data['email']) ? strtolower(trim($data['email'])) : null;
$password = $data['password'] ?? null;

if (!$email || !$password) json_response(['error' => 'Email and password required'], 400);

$db = get_db_connection();

try {
    // Look up in admins
    $stmt = $db->prepare('SELECT id, email, password, role, banned FROM admins WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($admin) {
        if ($admin['banned']) json_response(['error' => 'Account banned'], 403);
        if (password_verify($password, $admin['password'])) {
            $payload = ['id' => $admin['id'], 'email' => $admin['email'], 'role' => 'admin', 'exp' => time() + 60*60*24*7];
            $token = jwt_encode($payload, getenv('JWT_SECRET') ?: 'change_this_secret');
            json_response(['token' => $token, 'role' => 'admin']);
        }
    }

    // coordinators
    $stmt = $db->prepare('SELECT id, email, password, name, banned FROM coordinators WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $coord = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($coord) {
        if ($coord['banned']) json_response(['error' => 'Account banned'], 403);
        if (password_verify($password, $coord['password'])) {
            $payload = ['id' => $coord['id'], 'email' => $coord['email'], 'role' => 'coordinator', 'exp' => time() + 60*60*24*7];
            $token = jwt_encode($payload, getenv('JWT_SECRET') ?: 'change_this_secret');
            json_response(['token' => $token, 'role' => 'coordinator']);
        }
    }

    // drivers
    $stmt = $db->prepare('SELECT id, email, password, name, banned FROM driver WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $driver = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($driver) {
        if ($driver['banned']) json_response(['error' => 'Account banned'], 403);
        if (password_verify($password, $driver['password'])) {
            $payload = ['id' => $driver['id'], 'email' => $driver['email'], 'role' => 'driver', 'exp' => time() + 60*60*24*7];
            $token = jwt_encode($payload, getenv('JWT_SECRET') ?: 'change_this_secret');
            json_response(['token' => $token, 'role' => 'driver']);
        }
    }

    json_response(['error' => 'Invalid credentials'], 401);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
