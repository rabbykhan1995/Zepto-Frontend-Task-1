<?php
$uploadDir = "upload/";
$fonts = [];

if (!is_dir($uploadDir)) {
    echo json_encode(["error" => "Upload directory does not exist!"]);
    exit;
}

$files = glob($uploadDir . "*.ttf");

if (!$files) {
    echo json_encode(["error" => "No font files found in the upload folder."]);
    exit;
}

foreach ($files as $file) {
    $fonts[] = [
        "name" => pathinfo($file, PATHINFO_FILENAME),
        "path" => $file
    ];
}

header("Content-Type: application/json");
echo json_encode($fonts);
?>
