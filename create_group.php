<?php
$filename = "font_groups.json";

// Read existing font groups
function getFontGroups() {
    global $filename;
    if (file_exists($filename)) {
        $data = file_get_contents($filename);
        return json_decode($data, true) ?: [];
    }
    return [];
}

// Save font groups to the file
function saveFontGroups($groups) {
    global $filename;
    file_put_contents($filename, json_encode($groups, JSON_PRETTY_PRINT));
}

// Handle Requests
$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate input
    if (!isset($data["group_name"], $data["fonts"]) || count($data["fonts"]) < 2) {
        http_response_code(400);
        echo json_encode(["error" => "A group must have a name and at least two fonts."]);
        exit;
    }

    // Save the group
    $groups = getFontGroups();
    $groups[] = [
        "group_name" => $data["group_name"],
        "fonts" => $data["fonts"]
    ];
    saveFontGroups($groups);

    http_response_code(201);
    echo json_encode(["success" => "Font group created successfully"]);
} elseif ($requestMethod === "GET") {
    echo json_encode(getFontGroups());
} elseif ($requestMethod === "DELETE") {
    saveFontGroups([]); // Clear all groups
    echo json_encode(["success" => "All font groups deleted"]);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
