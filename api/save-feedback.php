<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataFile = __DIR__ . '/../public/feedbacks.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get POST data
    $input = file_get_contents('php://input');
    $newFeedback = json_decode($input, true);
    
    if (!$newFeedback) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        exit;
    }
    
    // Read existing feedbacks
    $feedbacks = [];
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        $feedbacks = json_decode($content, true) ?: [];
    }
    
    // Add new feedback
    $feedbacks[] = $newFeedback;
    
    // Save to file
    if (file_put_contents($dataFile, json_encode($feedbacks, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Feedback saved successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save feedback']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
