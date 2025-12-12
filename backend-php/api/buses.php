<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        if ($id) {
            // Return single bus (bus_code)
            $stmt = $db->prepare('SELECT * FROM buses WHERE id = :id LIMIT 1');
            $stmt->execute([':id' => $id]);
            $bus = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$bus) json_response(['error' => 'Bus not found'], 404);
            $bus['id'] = intval($bus['id']);
            json_response($bus);
        }

        $driverId = $_GET['driverId'] ?? null;
        $unassigned = isset($_GET['unassigned']) && $_GET['unassigned'] === 'true';

        $where = [];
        $params = [];
        if ($driverId !== null) { $where[] = 'b.driver = :driver'; $params[':driver'] = $driverId; }
        if ($unassigned) { $where[] = 'b.driver IS NULL'; }

        $whereSql = '';
        if (!empty($where)) $whereSql = 'WHERE ' . implode(' AND ', $where);

        // Use subquery to get latest status
        $sql = "SELECT b.*, co.name as coordinator_name, co.email as coordinator_email, co.phone as coordinator_phone, d.name as driver_name, d.email as driver_email, (SELECT status FROM bus_status_history WHERE bus = b.id ORDER BY changed_at DESC LIMIT 1) as status FROM buses b LEFT JOIN coordinators co ON b.coordinator = co.id LEFT JOIN driver d ON b.driver = d.id $whereSql ORDER BY b.created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // Format numbers and dates similar to original
        foreach ($rows as &$r) {
            $r['id'] = intval($r['id']);
            $r['driver'] = $r['driver'] !== null ? intval($r['driver']) : null;
        }
        json_response($rows);
    }

    if ($method === 'POST') {
        $data = get_json_body();
        $fields = [
            'bus_code', 'plate_no', 'driver', 'coordinator', 'letter', 'e_payment', 'contract_date', 'agreed_date', 'date_collected', 'start_date', 'first_pay', 'initial_owe', 'deposited', 't_income'
        ];
        $cols = [];
        $params = [];
        foreach ($fields as $f) {
            if (array_key_exists($f, $data)) {
                $cols[] = $f;
                $params[':' . $f] = $data[$f] === null ? null : $data[$f];
            }
        }
        if (empty($cols)) json_response(['error' => 'No fields provided'], 400);
        $sql = 'INSERT INTO buses (' . implode(', ', $cols) . ', created_at) VALUES (' . implode(', ', array_map(fn($c) => ':' . $c, $cols)) . ', :created_at)';
        $params[':created_at'] = date('Y-m-d H:i:s');
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        json_response(['message' => 'Bus added successfully'], 201);
    }

    if ($method === 'PATCH') {
        // Update single bus by id
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        if (!$id) json_response(['error' => 'ID is required'], 400);
        $data = get_json_body();
        $fields = [
            'bus_code', 'plate_no', 'driver', 'coordinator', 'letter', 'e_payment', 'contract_date', 'agreed_date', 'date_collected', 'start_date', 'first_pay', 'initial_owe', 'deposited', 't_income'
        ];
        $updates = [];
        $params = [':id' => $id];
        foreach ($fields as $f) {
            if (array_key_exists($f, $data)) {
                $updates[] = "$f = :$f";
                $params[':' . $f] = $data[$f] === null ? null : $data[$f];
            }
        }
        if (empty($updates)) json_response(['error' => 'No fields to update'], 400);
        $sql = 'UPDATE buses SET ' . implode(', ', $updates) . ' WHERE id = :id';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $stmt = $db->prepare('SELECT id, bus_code, plate_no FROM buses WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response(['message' => 'Bus updated', 'bus' => $row]);
    }

    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
