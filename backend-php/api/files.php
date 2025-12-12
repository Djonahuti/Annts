<?php
require_once __DIR__ . '/common.php';
$db = get_db_connection();
$payload = require_auth();
$method = $_SERVER['REQUEST_METHOD'];

// Only GET supported in original
if ($method !== 'GET') json_response(['error' => 'Method not allowed'], 405);

$adminEmail = $payload['email'] ?? null;
// Check admin's adminRole (viewer limitation)
$isViewer = false;
if ($payload['role'] === 'admin' && $adminEmail) {
    $stmt = $db->prepare('SELECT role FROM admins WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $adminEmail]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row && ($row['role'] === 'viewer')) $isViewer = true;
}
if ($isViewer) json_response(['error' => 'Access denied. Viewers cannot access file manager.'], 403);

$dirPath = $_GET['path'] ?? 'public';
$baseDir = realpath(__DIR__ . '/../../');
$requestedPath = realpath($baseDir . DIRECTORY_SEPARATOR . $dirPath);
if (!$requestedPath || strpos($requestedPath, $baseDir) !== 0) json_response(['error' => 'Invalid path'], 400);
if (!is_dir($requestedPath)) json_response(['error' => 'Directory not found'], 404);

$items = scandir($requestedPath);
$files = [];
foreach ($items as $item) {
    if ($item === '.' || $item === '..') continue;
    $itemPath = $requestedPath . DIRECTORY_SEPARATOR . $item;
    $relativePath = ltrim(str_replace($baseDir, '', $itemPath), DIRECTORY_SEPARATOR);
    $stats = stat($itemPath);
    $files[] = [
        'name' => $item,
        'type' => is_dir($itemPath) ? 'directory' : 'file',
        'size' => is_file($itemPath) ? $stats['size'] : null,
        'modified' => date('c', $stats['mtime']),
        'path' => str_replace('\\', '/', $relativePath),
    ];
}
// sort directories first
usort($files, function($a, $b) {
    if ($a['type'] !== $b['type']) return $a['type'] === 'directory' ? -1 : 1;
    return strcasecmp($a['name'], $b['name']);
});
json_response(['currentPath' => $dirPath, 'files' => $files]);

?>
