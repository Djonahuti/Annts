<?php
// Simple router for the PHP backend; deploy in docroot or public_html
// Routes: /api/<resource>[/id][/sub] -> backend-php/api/<resource>[/sub].php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($uri, '/');

if ($path === '' || $path === 'index.php') {
    echo "PHP backend index. Use /api/ endpoints (e.g., /api/contacts).";
    exit;
}

// Only serve /api/*
if (strpos($path, 'api/') !== 0) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Not found']);
    exit;
}

// Remove prefix
$relative = substr($path, 4); // remove 'api/'
$segments = array_values(array_filter(explode('/', $relative)));

// Identify numeric id segments and set $_GET['id']
$nonNumericParts = [];
foreach ($segments as $segment) {
    if (is_numeric($segment)) {
        // map to id param
        if (!isset($_GET['id'])) $_GET['id'] = intval($segment);
        continue;
    }
    $nonNumericParts[] = $segment;
}

// Try to include the most specific matching file in api/ folder
$candidates = [];
$tryPathBase = __DIR__ . '/api/' . implode('/', $nonNumericParts);
// try exact file with .php
$candidates[] = $tryPathBase . '.php';
// try folder with index.php
$candidates[] = $tryPathBase . '/index.php';
// if no nonNumericParts (e.g., /api/contacts/123) then try resource file
if (count($nonNumericParts) === 1) {
    $candidates[] = __DIR__ . '/api/' . $nonNumericParts[0] . '.php';
}

foreach ($candidates as $file) {
    if (file_exists($file)) {
        require $file;
        exit;
    }
}

// fallback 404
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not found']);

?>
