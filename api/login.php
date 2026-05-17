<?php

require_once "../db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"]);

$stmt = $conn->prepare("SELECT id FROM user WHERE name = ?");
$stmt->bind_param("s", $name);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    echo json_encode([
        "id" => $user["id"],
        "name" => $name
    ]);

} else {

    $insert = $conn->prepare("INSERT INTO user(name) VALUES(?)");
    $insert->bind_param("s", $name);
    $insert->execute();

    echo json_encode([
        "id" => $insert->insert_id,
        "name" => $name
    ]);
}