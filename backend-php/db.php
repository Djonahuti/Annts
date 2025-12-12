<?php
// Minimal PDO MySQL DB connection helper
// Read configuration from environment variables for security
function get_db_connection() {
    $host = getenv('DB_HOST') ?: 'localhost';
    $db   = getenv('DB_NAME') ?: 'myczroxg_annhurst';
    $user = getenv('DB_USER') ?: 'myczroxg_david';
    $pass = getenv('DB_PASS') ?: 'AnnhurstDavid123#';
    $port = getenv('DB_PORT') ?: '3306';
    $charset = 'utf8mb4';

    $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    try {
        return new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'DB connection failed', 'message' => $e->getMessage()]);
        exit;
    }
}

function send_json($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
}

?>
