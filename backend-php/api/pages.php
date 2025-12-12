<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        if ($id) {
            $stmt = $db->prepare('SELECT * FROM pages WHERE id = :id LIMIT 1');
            $stmt->execute([':id' => $id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) json_response(['error' => 'Not found'], 404);
            json_response($row);
        }
        $stmt = $db->prepare('SELECT * FROM pages ORDER BY created_at DESC');
        $stmt->execute([]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($rows);
    }
    if ($method === 'POST') {
        $data = get_json_body();
        // For simplicity, allow passing all fields, but ensure title and slug exist
        if (empty($data['title']) || empty($data['slug']) || !isset($data['text'])) json_response(['error' => 'title, slug and text are required'], 400);
        $stmt = $db->prepare('INSERT INTO pages (title, slug, text, meta_description, is_published, views, created_at, updated_at) VALUES (:title, :slug, :text, :meta_description, :is_published, :views, :created_at, :updated_at)');
        $now = date('Y-m-d H:i:s');
        $stmt->execute([
            ':title' => $data['title'],
            ':slug' => $data['slug'],
            ':text' => $data['text'],
            ':meta_description' => $data['meta_description'] ?? null,
            ':is_published' => isset($data['is_published']) && $data['is_published'] ? 1 : 0,
            ':views' => $data['views'] ?? 0,
            ':created_at' => $now,
            ':updated_at' => $now,
        ]);
        $id = $db->lastInsertId();
        $stmt = $db->prepare('SELECT * FROM pages WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response($row, 201);
    }
    if ($method === 'PATCH') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        if (!$id) json_response(['error' => 'ID required'], 400);
        $data = get_json_body();
        $fields = [];
        $params = [':id' => $id];
        foreach ($data as $k => $v) { $fields[] = "$k = :$k"; $params[':' . $k] = $v; }
        if (empty($fields)) json_response(['error' => 'No updates provided'], 400);
        $sql = 'UPDATE pages SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $stmt = $db->prepare('SELECT * FROM pages WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response($row);
    }
    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        if (!$id) json_response(['error' => 'ID required'], 400);
        $stmt = $db->prepare('DELETE FROM pages WHERE id = :id');
        $stmt->execute([':id' => $id]);
        json_response(['success' => true]);
    }
    json_response(['error' => 'Method not allowed'], 405);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
