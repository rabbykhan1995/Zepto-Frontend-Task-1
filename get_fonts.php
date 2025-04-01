<?php
$uploadDir = "upload/";
$fonts = [];

// Check if the directory exists
if (!is_dir($uploadDir)) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Upload directory does not exist!"]);
    exit;
}

// Get all .ttf font files in the directory
$files = glob($uploadDir . "*.ttf");

// If no font files are found, return 404
if (!$files || empty($files)) {
    http_response_code(404); // Not Found
    echo json_encode(["error" => "No font files found in the upload folder."]);
    exit;
}

// Process each font file
foreach ($files as $file) {
    $fonts[] = [
        "name" => htmlspecialchars(pathinfo($file, PATHINFO_FILENAME)), // Prevent XSS
        "path" => htmlspecialchars($file)
    ];
}

// Set JSON response header and return fonts
header("Content-Type: application/json");
http_response_code(200); // OK
echo json_encode($fonts, JSON_PRETTY_PRINT);
?>
