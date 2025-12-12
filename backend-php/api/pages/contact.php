<?php
require_once __DIR__ . '/../common.php';
$db = get_db_connection();
$stmt = $db->prepare('SELECT * FROM pages WHERE slug = :slug LIMIT 1');
$stmt->execute([':slug' => 'contact']);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$row) json_response(['error' => 'Not found'], 404);
json_response($row);
?>
