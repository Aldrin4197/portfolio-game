<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataFile = __DIR__ . '/../public/feedbacks.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Read feedbacks
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        $feedbacks = json_decode($content, true) ?: [];
        echo json_encode($feedbacks);
    } else {
        // Return empty array if file doesn't exist yet
        echo json_encode([]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
