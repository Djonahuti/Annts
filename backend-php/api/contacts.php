<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Parse filters
        $coordinator = $_GET['coordinatorId'] ?? null;
        $driver = $_GET['driverId'] ?? null;
        $is_read = isset($_GET['is_read']) ? ($_GET['is_read'] === 'true' ? 1 : 0) : null;
        $sender_email = $_GET['sender_email'] ?? null;
        $receiver_email = $_GET['receiver_email'] ?? null;
        $exclude_sender_email = $_GET['exclude_sender_email'] ?? null;
        $is_starred = isset($_GET['is_starred']) ? ($_GET['is_starred'] === 'true' ? 1 : 0) : null;

        $where = [];
        $params = [];
        if ($coordinator !== null) { $where[] = 'coordinator = :coordinator'; $params[':coordinator'] = $coordinator; }
        if ($driver !== null) { $where[] = 'driver = :driver'; $params[':driver'] = $driver; }
        if ($is_read !== null) { $where[] = 'is_read = :is_read'; $params[':is_read'] = $is_read; }
        if ($sender_email !== null) { $where[] = 'sender_email = :sender_email'; $params[':sender_email'] = $sender_email; }
        if ($receiver_email !== null) { $where[] = 'receiver_email = :receiver_email'; $params[':receiver_email'] = $receiver_email; }
        if ($is_starred !== null) { $where[] = 'is_starred = :is_starred'; $params[':is_starred'] = $is_starred; }
        if ($exclude_sender_email !== null) { $where[] = 'sender_email != :exclude_sender_email'; $params[':exclude_sender_email'] = $exclude_sender_email; }

        $whereSql = '';
        if (!empty($where)) $whereSql = 'WHERE ' . implode(' AND ', $where);

        $sql = "SELECT c.*, co.id as coordinator_id, co.name as coordinator_name, co.email as coordinator_email, d.id as driver_id, d.name as driver_name, d.email as driver_email, s.id as subject_id, s.subject as subject_text, s.created_at as subject_created_at FROM contact c LEFT JOIN coordinators co ON c.coordinator = co.id LEFT JOIN driver d ON c.driver = d.id LEFT JOIN subject s ON c.subject = s.id $whereSql ORDER BY c.created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($rows);
    }

    if ($method === 'POST') {
        $data = get_json_body();
        if (empty($data['message'])) json_response(['error' => 'Message is required'], 400);
        $coordinator = $data['coordinator'] ?? null;
        $driver = $data['driver'] ?? null;
        $subject = $data['subject'] ?? null;
        $message = $data['message'];
        $attachment = $data['attachment'] ?? null;
        $sender = $data['sender'] ?? null;
        $receiver = $data['receiver'] ?? null;
        $sender_email = $data['sender_email'] ?? null;
        $receiver_email = $data['receiver_email'] ?? null;
        $is_starred = isset($data['is_starred']) ? ($data['is_starred'] ? 1 : 0) : 0;
        $is_read = 0;
        $transaction_date = date('Y-m-d H:i:s');

        $sql = 'INSERT INTO contact (coordinator, driver, subject, message, attachment, sender, receiver, sender_email, receiver_email, is_starred, is_read, transaction_date, created_at) VALUES (:coordinator, :driver, :subject, :message, :attachment, :sender, :receiver, :sender_email, :receiver_email, :is_starred, :is_read, :transaction_date, :created_at)';
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':coordinator' => $coordinator,
            ':driver' => $driver,
            ':subject' => $subject,
            ':message' => $message,
            ':attachment' => $attachment,
            ':sender' => $sender,
            ':receiver' => $receiver,
            ':sender_email' => $sender_email,
            ':receiver_email' => $receiver_email,
            ':is_starred' => $is_starred,
            ':is_read' => $is_read,
            ':transaction_date' => $transaction_date,
            ':created_at' => $transaction_date,
        ]);

        $id = $db->lastInsertId();
        json_response(['message' => 'Contact created successfully', 'contact' => ['id' => intval($id)] ], 201);
    }

    if ($method === 'PUT') {
        $data = get_json_body();
        if (isset($data['ids']) && is_array($data['ids'])) {
            // Bulk update
            $is_read = isset($data['is_read']) ? ($data['is_read'] ? 1 : 0) : null;
            $is_starred = isset($data['is_starred']) ? ($data['is_starred'] ? 1 : 0) : null;
            if ($is_read === null && $is_starred === null) json_response(['error' => 'No update field provided'], 400);
            $ids = array_map('intval', $data['ids']);
            $setParts = [];
            $params = [];
            if ($is_read !== null) { $setParts[] = 'is_read = :is_read'; $params[':is_read'] = $is_read; }
            if ($is_starred !== null) { $setParts[] = 'is_starred = :is_starred'; $params[':is_starred'] = $is_starred; }
            $sql = 'UPDATE contact SET ' . implode(', ', $setParts) . ' WHERE id IN (' . implode(',', $ids) . ')';
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            json_response(['success' => true]);
        }

        $id = $data['id'] ?? null;
        if (!$id) json_response(['error' => 'ID is required'], 400);
        $updateParts = [];
        $params = [':id' => $id];
        if (array_key_exists('is_read', $data)) { $updateParts[] = 'is_read = :is_read'; $params[':is_read'] = $data['is_read'] ? 1 : 0; }
        if (array_key_exists('is_starred', $data)) { $updateParts[] = 'is_starred = :is_starred'; $params[':is_starred'] = $data['is_starred'] ? 1 : 0; }
        if (empty($updateParts)) json_response(['error' => 'Nothing to update'], 400);
        $sql = 'UPDATE contact SET ' . implode(', ', $updateParts) . ' WHERE id = :id';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        // Return updated row
        $stmt = $db->prepare('SELECT * FROM contact WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response(['message' => 'Updated', 'contact' => $row]);
    }

    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
