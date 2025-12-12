<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];
try {
    if ($method === 'GET') {
        $stmt = $db->prepare('SELECT * FROM settings LIMIT 1');
        $stmt->execute([]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response($row ?: []);
    }
    if ($method === 'PUT' || $method === 'PATCH') {
        $data = get_json_body();
        // For simplicity, update specified keys only
        if (empty($data)) json_response(['error' => 'No data provided'], 400);
        $pairs = [];
        $params = [];
        foreach ($data as $k => $v) { $pairs[] = "$k = :$k"; $params[':' . $k] = is_array($v) ? json_encode($v) : $v; }
        $sql = 'UPDATE settings SET ' . implode(', ', $pairs) . ' WHERE id = 1';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $stmt = $db->prepare('SELECT * FROM settings WHERE id = 1 LIMIT 1');
        $stmt->execute([]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response($row);
    }
    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}
?>
