<?php
require_once __DIR__ . '/../../api/common.php';
$db = get_db_connection();

function getMondayOfWeek($dateStr) {
    $d = new DateTime($dateStr, new DateTimeZone('UTC'));
    $dayOfWeek = intval($d->format('w')); // 0 (Sunday) - 6
    if ($dayOfWeek === 0) {
        $d->modify('-6 days');
    } else {
        $d->modify('+' . (1 - $dayOfWeek) . ' days');
    }
    $d->setTime(0,0,0);
    return $d->format('Y-m-d');
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
if (!$id) json_response(['error' => 'Bus ID is required'], 400);

try {
    if ($method === 'GET') {
        $payload = require_auth();
        $current = isset($_GET['current']) && $_GET['current'] === 'true';
        $week_start = $_GET['week_start'] ?? null;
        if ($week_start) {
            // normalize
            $normalized = getMondayOfWeek($week_start);
            $stmt = $db->prepare('SELECT * FROM expected_payment WHERE bus = :bus AND week_start = :week_start LIMIT 1');
            $stmt->execute([':bus' => $id, ':week_start' => $normalized]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $rows = $row ? [$row] : [];
            json_response($rows);
        }
        if ($current) {
            $stmt = $db->prepare('SELECT * FROM expected_payment WHERE bus = :bus ORDER BY week_start DESC LIMIT 1');
            $stmt->execute([':bus' => $id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $rows = $row ? [$row] : [];
            json_response($rows);
        }
        $stmt = $db->prepare('SELECT * FROM expected_payment WHERE bus = :bus ORDER BY week_start DESC LIMIT 100');
        $stmt->execute([':bus' => $id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($rows);
    }

    if ($method === 'POST') {
        $payload = require_auth(['admin']);
        $data = get_json_body();
        $week_start = $data['week_start'] ?? null;
        $amount = $data['amount'] ?? null;
        $reason = $data['reason'] ?? null;
        if (!$week_start || !$amount) json_response(['error' => 'week_start and amount are required'], 400);
        $normalized = getMondayOfWeek($week_start);
        // upsert
        $db->beginTransaction();
        try {
            $stmt = $db->prepare('SELECT id FROM expected_payment WHERE bus = :bus AND week_start = :week_start LIMIT 1');
            $stmt->execute([':bus' => $id, ':week_start' => $normalized]);
            $existing = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($existing) {
                $stmt = $db->prepare('UPDATE expected_payment SET amount = :amount, reason = :reason, created_by = :created_by WHERE id = :id');
                $stmt->execute([':amount' => $amount, ':reason' => $reason, ':created_by' => $payload['id'], ':id' => $existing['id']]);
                $resultId = $existing['id'];
            } else {
                $stmt = $db->prepare('INSERT INTO expected_payment (bus, week_start, amount, reason, created_by, created_at) VALUES (:bus, :week_start, :amount, :reason, :created_by, :created_at)');
                $stmt->execute([':bus' => $id, ':week_start' => $normalized, ':amount' => $amount, ':reason' => $reason, ':created_by' => $payload['id'], ':created_at' => date('Y-m-d H:i:s')]);
                $resultId = $db->lastInsertId();
            }
            $db->commit();
            $stmt = $db->prepare('SELECT * FROM expected_payment WHERE id = :id LIMIT 1');
            $stmt->execute([':id' => $resultId]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            json_response($row, 201);
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
