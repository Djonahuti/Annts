<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $busId = isset($_GET['busId']) ? intval($_GET['busId']) : null;
        if ($busId) {
            $stmt = $db->prepare('SELECT p.*, b.bus_code, b.plate_no, b.e_payment FROM payment p LEFT JOIN buses b ON p.bus = b.id WHERE p.bus = :bus ORDER BY p.created_at DESC');
            $stmt->execute([':bus' => $busId]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            json_response($rows);
        }
        $stmt = $db->prepare('SELECT p.id, p.amount, p.pay_type, p.pay_complete, p.created_at, p.coordinator, b.id as bus_id, b.bus_code, b.plate_no, b.e_payment FROM payment p LEFT JOIN buses b ON p.bus = b.id ORDER BY p.created_at DESC');
        $stmt->execute([]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($rows);
    }

    if ($method === 'POST') {
        $data = get_json_body();
        $required = ['week', 'completed_by', 'coordinator', 'bus', 'p_week', 'receipt', 'payment_day', 'payment_date', 'pay_type', 'pay_complete', 'issue', 'inspection'];
        foreach ($required as $r) {
            if (!isset($data[$r]) || $data[$r] === '') json_response(['error' => "{$r} is required"], 400);
        }
        $week = $data['week'];
        $completed_by = $data['completed_by'];
        $coordinator = $data['coordinator'];
        $bus = intval($data['bus']);
        $p_week = $data['p_week'];
        $receipt = $data['receipt'];
        $amount = isset($data['amount']) ? floatval($data['amount']) : null;
        $sender = $data['sender'] ?? null;
        $payment_day = $data['payment_day'];
        $payment_date = $data['payment_date'];
        $pay_type = $data['pay_type'];
        $pay_complete = $data['pay_complete'];
        $issue = $data['issue'];
        $inspection = $data['inspection'];

        // Transaction: insert payment and update bus t_income
        $db->beginTransaction();
        try {
            $stmt = $db->prepare('INSERT INTO payment (week, completed_by, coordinator, bus, p_week, receipt, amount, sender, payment_day, payment_date, pay_type, pay_complete, issue, inspection, created_at) VALUES (:week, :completed_by, :coordinator, :bus, :p_week, :receipt, :amount, :sender, :payment_day, :payment_date, :pay_type, :pay_complete, :issue, :inspection, :created_at)');
            $stmt->execute([
                ':week' => $week,
                ':completed_by' => $completed_by,
                ':coordinator' => $coordinator,
                ':bus' => $bus,
                ':p_week' => $p_week,
                ':receipt' => $receipt,
                ':amount' => $amount,
                ':sender' => $sender,
                ':payment_day' => $payment_day,
                ':payment_date' => $payment_date,
                ':pay_type' => $pay_type,
                ':pay_complete' => $pay_complete,
                ':issue' => $issue,
                ':inspection' => $inspection,
                ':created_at' => date('Y-m-d H:i:s'),
            ]);
            $paymentId = $db->lastInsertId();
            if ($amount !== null && $amount > 0 && $bus) {
                $stmt = $db->prepare('SELECT t_income FROM buses WHERE id = :id LIMIT 1');
                $stmt->execute([':id' => $bus]);
                $b = $stmt->fetch(PDO::FETCH_ASSOC);
                $current = $b && isset($b['t_income']) ? intval($b['t_income']) : 0;
                $newIncome = $current + intval($amount);
                $stmt = $db->prepare('UPDATE buses SET t_income = :t_income WHERE id = :id');
                $stmt->execute([':t_income' => $newIncome, ':id' => $bus]);
            }
            $db->commit();
            json_response(['message' => 'Payment submitted successfully'], 201);
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    if ($method === 'PATCH') {
        // update pay_complete via id
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        if (!$id) json_response(['error' => 'Payment ID required'], 400);
        $data = get_json_body();
        if (!isset($data['pay_complete'])) json_response(['error' => 'pay_complete is required'], 400);
        $stmt = $db->prepare('UPDATE payment SET pay_complete = :pay_complete WHERE id = :id');
        $stmt->execute([':pay_complete' => $data['pay_complete'], ':id' => $id]);
        json_response(['message' => 'Payment updated']);
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        if (!$id) json_response(['error' => 'Payment ID required'], 400);
        $stmt = $db->prepare('DELETE FROM payment WHERE id = :id');
        $stmt->execute([':id' => $id]);
        json_response(['message' => 'Payment deleted']);
    }

    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
