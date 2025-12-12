<?php
require_once __DIR__ . '/../../api/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') json_response(['error' => 'Method not allowed'], 405);
$email = $_GET['email'] ?? null;
if (!$email) json_response(['error' => 'Email required'], 400);
try {
    $stmt = $db->prepare('SELECT id, name, email, phone FROM coordinators WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $coord = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$coord) json_response(['error' => 'Coordinator not found'], 404);
    $stmt = $db->prepare('SELECT b.id, b.bus_code, b.plate_no, b.e_payment, d.id as driver_id, d.name as driver_name, d.phone as driver_phone, (SELECT status FROM bus_status_history WHERE bus = b.id ORDER BY changed_at DESC LIMIT 1) as status FROM buses b LEFT JOIN driver d ON b.driver = d.id WHERE b.coordinator = :coord');
    $stmt->execute([':coord' => $coord['id']]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $filtered = array_filter($rows, function($b) { return ($b['status'] ?? 'Active') !== 'Completed'; });
    $mapped = array_map(function($b) {
        return [
            'id' => intval($b['id']),
            'bus_code' => $b['bus_code'],
            'plate_no' => $b['plate_no'],
            'e_payment' => $b['e_payment'] !== null ? strval($b['e_payment']) : null,
            'driver_id' => isset($b['driver_id']) ? intval($b['driver_id']) : null,
            'driver_name' => $b['driver_name'] ?? null,
            'driver_phone' => $b['driver_phone'] ?? null,
        ];
    }, $filtered);
    // Sort by bus_code
    usort($mapped, function($a, $b) {
        if (!$a['bus_code'] && !$b['bus_code']) return 0;
        if (!$a['bus_code']) return 1;
        if (!$b['bus_code']) return -1;
        return strcmp($a['bus_code'], $b['bus_code']);
    });
    json_response(['coordinator' => $coord, 'buses' => $mapped]);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
