<?php
require_once __DIR__ . '/../db.php';

function json_response($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function get_json_body() {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);
    return $data ?: [];
}

function require_method($method) {
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
        json_response(['error' => 'Method not allowed'], 405);
    }
}

// Very small JWT implementation (HMAC256) for basic auth tokens
function jwt_encode($payload, $secret) {
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload64 = base64_encode(json_encode($payload));
    $signature = base64_encode(hash_hmac('sha256', $header . '.' . $payload64, $secret, true));
    return $header . '.' . $payload64 . '.' . $signature;
}

function jwt_decode($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header64, $payload64, $sig64] = $parts;
    $expectedSig = base64_encode(hash_hmac('sha256', $header64 . '.' . $payload64, $secret, true));
    if (!hash_equals($expectedSig, $sig64)) return null;
    $payload = json_decode(base64_decode($payload64), true);
    if (!is_array($payload)) return null;
    // check exp
    if (isset($payload['exp']) && time() > $payload['exp']) return null;
    return $payload;
}

function require_auth($roles = []) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (stripos($authHeader, 'Bearer ') !== 0) {
        json_response(['error' => 'Unauthorized'], 401);
    }
    $token = substr($authHeader, 7);
    $secret = getenv('JWT_SECRET') ?: 'change_this_secret';
    $payload = jwt_decode($token, $secret);
    if (!$payload) json_response(['error' => 'Unauthorized'], 401);
    if (!empty($roles) && !in_array($payload['role'] ?? '', $roles)) {
        json_response(['error' => 'Forbidden'], 403);
    }
    return $payload;
}

?>
