<?php
// Get the request data
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data["path"])) {
    $filePath = urldecode($data["path"]);  // Decode the URL-encoded path

    // For debugging purposes, log the received file path
    error_log("Received file path: " . $filePath);  // Log the received path

    // Check if file exists
    if (file_exists($filePath)) {
        unlink($filePath); // Delete the file
        echo json_encode(["status" => "success", "message" => "Font deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "File not found"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}
?>