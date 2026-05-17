<?php

require_once "../db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$userId = $data["user_id"];
$score = $data["score"];

$stmt = $conn->prepare("
    INSERT INTO score(user_id, score)
    VALUES(?, ?)
");

$stmt->bind_param("ii", $userId, $score);
$stmt->execute();

echo json_encode([
    "success" => true
]);