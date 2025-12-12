<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $payload = require_auth();
        $coordinatorId = $_GET['coordinatorId'] ?? null;
        $busId = isset($_GET['busId']) ? intval($_GET['busId']) : null;
        $month = $_GET['month'] ?? null;

        $where = [];
        $params = [];
        if ($payload['role'] === 'coordinator') {
            // find coordinator name
            $stmt = $db->prepare('SELECT name FROM coordinators WHERE email = :email LIMIT 1');
            $stmt->execute([':email' => $payload['email']]);
            $coord = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($coord && $coord['name']) { $where[] = 'coordinator = :coordinator'; $params[':coordinator'] = $coord['name']; }
        } elseif ($coordinatorId) {
            $where[] = 'coordinator = :coordinator'; $params[':coordinator'] = $coordinatorId;
        }
        if ($busId) { $where[] = 'bus = :bus'; $params[':bus'] = $busId; }
        if ($month) {
            $start = (new DateTime($month))->format('Y-m-01');
            $end = (new DateTime($month))->modify('+1 month')->format('Y-m-01');
            $where[] = 'month >= :start AND month < :end';
            $params[':start'] = $start; $params[':end'] = $end;
        }
        $whereSql = '';
        if (!empty($where)) $whereSql = 'WHERE ' . implode(' AND ', $where);
        $sql = "SELECT i.*, b.bus_code, b.plate_no FROM inspection i LEFT JOIN buses b ON i.bus = b.id $whereSql ORDER BY i.created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($rows);
    }

    if ($method === 'POST') {
        $payload = require_auth(['coordinator']);
        // find coordinator id and name
        $stmt = $db->prepare('SELECT id, name FROM coordinators WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => $payload['email']]);
        $coord = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$coord) json_response(['error' => 'Coordinator not found'], 404);
        $data = get_json_body();
        $month = $data['month'] ?? null;
        $bus = isset($data['bus']) ? intval($data['bus']) : null;
        if (!$month || !$bus) json_response(['error' => 'Bus and month are required'], 400);
        // Normalize to first of month
        $d = new DateTime($month);
        $firstDay = $d->format('Y-m-01');
        $stmt = $db->prepare('INSERT INTO inspection (month, coordinator, bus, pdf, video, code, d_uploaded, video_gp, plate_number, bus_uploaded, issue, both_vid_pdf, inspection_completed_by, issues, created_at) VALUES (:month, :coordinator_name, :bus, :pdf, :video, :code, :d_uploaded, :video_gp, :plate_number, :bus_uploaded, :issue, :both_vid_pdf, :inspection_completed_by, :issues, :created_at)');
        $stmt->execute([
            ':month' => $firstDay,
            ':coordinator_name' => $coord['name'],
            ':bus' => $bus,
            ':pdf' => $data['pdf'] ?? null,
            ':video' => $data['video'] ?? null,
            ':code' => $data['code'] ?? null,
            ':d_uploaded' => date('Y-m-d H:i:s'),
            ':video_gp' => $data['video_gp'] ?? null,
            ':plate_number' => $data['plate_number'] ?? null,
            ':bus_uploaded' => $data['bus_uploaded'] ?? null,
            ':issue' => $data['issue'] ?? null,
            ':both_vid_pdf' => $data['both_vid_pdf'] ?? null,
            ':inspection_completed_by' => $data['inspection_completed_by'] ?? null,
            ':issues' => $data['issues'] ?? null,
            ':created_at' => date('Y-m-d H:i:s'),
        ]);
        $id = $db->lastInsertId();
        $stmt = $db->prepare('SELECT i.*, b.bus_code, b.plate_no FROM inspection i LEFT JOIN buses b ON i.bus = b.id WHERE i.id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response($row, 201);
    }
    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
