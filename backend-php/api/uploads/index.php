<?php
require_once __DIR__ . '/../common.php';
$baseDir = realpath(__DIR__ . '/../../');
$uploadsDir = $baseDir . '/public/uploads';

$requestUri = $_SERVER['REQUEST_URI'];
// Extract path after /api/uploads/
$prefix = 'api/uploads/';
$pos = strpos($requestUri, $prefix);
if ($pos === false) json_response(['error' => 'Invalid path'], 400);
$pathPart = substr($requestUri, $pos + strlen($prefix));
$pathPart = urldecode($pathPart);
$normalized = str_replace('..', '', $pathPart);
$filePath = realpath($uploadsDir . '/' . $normalized);
if (!$filePath || strpos($filePath, $uploadsDir) !== 0) json_response(['error' => 'Invalid file path'], 403);
if (!file_exists($filePath)) json_response(['error' => 'File not found'], 404);

$ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
$map = ['jpg'=>'image/jpeg','jpeg'=>'image/jpeg','png'=>'image/png','gif'=>'image/gif','pdf'=>'application/pdf','txt'=>'text/plain'];
$ctype = $map[$ext] ?? 'application/octet-stream';
header('Content-Type: '.$ctype);
header('Cache-Control: public, max-age=31536000, immutable');
readfile($filePath);
exit;
?>
