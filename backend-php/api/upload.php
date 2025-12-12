<?php
require_once __DIR__ . '/common.php';
// store uploads in public/uploads
$uploadDir = __DIR__ . '/../../public/uploads';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

if (empty($_FILES['file'])) {
    json_response(['error' => 'No file provided'], 400);
}
$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    json_response(['error' => 'Upload error', 'code' => $file['error']], 400);
}
$origName = basename($file['name']);
$unique = bin2hex(random_bytes(8)) . '-' . $origName;
$destination = $uploadDir . DIRECTORY_SEPARATOR . $unique;
if (!move_uploaded_file($file['tmp_name'], $destination)) {
    json_response(['error' => 'Failed to save file'], 500);
}
$url = '/uploads/' . $unique;
json_response(['success' => true, 'url' => $url, 'filename' => $unique, 'originalName' => $origName, 'size' => $file['size']]);

?>
