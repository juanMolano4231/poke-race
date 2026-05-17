<?php

require_once "../db.php";

header("Content-Type: application/json");

$result = $conn->query("
    SELECT id, name
    FROM user
    ORDER BY name
");

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);