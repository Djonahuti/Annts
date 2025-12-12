<?php
require_once __DIR__ . '/../../api/common.php';
$db = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') json_response(['error' => 'Method not allowed'], 405);

function formatDateLabel($d) {
    return date('j M Y', strtotime($d));
}

// Get current week (Monday - Saturday)
$today = new DateTime('now', new DateTimeZone('UTC'));
$sunday = clone $today; $sunday->modify('-' . $today->format('w') . ' days');
$monday = clone $sunday; $monday->modify('+1 day');
$saturday = clone $monday; $saturday->modify('+5 days');
$mondayString = $monday->format('Y-m-d');
$weekLabel = formatDateLabel($monday->format('Y-m-d')) . ' - ' . formatDateLabel($saturday->format('Y-m-d'));

try {
    $pagesStmt = $db->prepare('SELECT id, title, slug, is_published, updated_at, views FROM pages ORDER BY updated_at DESC');
    $pagesStmt->execute([]);
    $pages = $pagesStmt->fetchAll(PDO::FETCH_ASSOC);

    $admins = $db->query('SELECT COUNT(*) FROM admins')->fetchColumn();
    $coordinators = $db->query('SELECT COUNT(*) FROM coordinators')->fetchColumn();
    $drivers = $db->query('SELECT COUNT(*) FROM driver')->fetchColumn();
    $totalUsers = intval($admins) + intval($coordinators) + intval($drivers);
    $buses = $db->query('SELECT COUNT(*) FROM buses')->fetchColumn();

    $paymentsStmt = $db->prepare('SELECT amount, week FROM payment');
    $paymentsStmt->execute([]);
    $payments = $paymentsStmt->fetchAll(PDO::FETCH_ASSOC);
    $totalRevenue = 0;
    foreach ($payments as $p) {
        if (!empty($p['week'])) {
            $weekDate = date('Y-m-d', strtotime($p['week']));
            if ($weekDate === $mondayString) {
                $totalRevenue += intval($p['amount'] ?? 0);
            }
        }
    }

    $stats = [
        'totalPages' => count($pages),
        'publishedPages' => count(array_filter($pages, fn($p) => $p['is_published'])),
        'totalUsers' => $totalUsers,
        'totalBuses' => intval($buses),
        'totalRevenue' => $totalRevenue,
        'revenueWeekLabel' => $weekLabel,
    ];

    $recentPages = array_slice($pages, 0, 3);
    $recentPagesFormatted = array_map(function($p) {
        return [
            'id' => strval($p['id']),
            'title' => $p['title'],
            'slug' => $p['slug'],
            'status' => $p['is_published'] ? 'published' : 'draft',
            'lastModified' => $p['updated_at'] ? date('Y-m-d', strtotime($p['updated_at'])) : '',
            'views' => $p['views'] ?? 0,
        ];
    }, $recentPages);

    json_response(['stats' => $stats, 'recentPages' => $recentPagesFormatted]);
} catch (Exception $e) {
    json_response(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}

?>
