<?php
$uploadDir = "upload/";

if (!empty($_FILES["file"])) {
    $file = $_FILES["file"];
    $fileName = basename($file["name"]);
    $targetFile = $uploadDir . $fileName;

    // Ensure the folder exists
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Check if it's a TTF file
    if (pathinfo($fileName, PATHINFO_EXTENSION) !== "ttf") {
        echo json_encode(["status" => "error", "message" => "Only TTF fonts are allowed!"]);
        exit;
    }

    // Move uploaded file to 'upload' folder
    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        // Send both name (without extension) and path in the response
        echo json_encode([
            "status" => "success",
            "message" => "Font uploaded successfully!",
            "name" => pathinfo($fileName, PATHINFO_FILENAME), // Extract name without extension
            "path" => $targetFile
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error uploading file!"]);
    }
}
?>

