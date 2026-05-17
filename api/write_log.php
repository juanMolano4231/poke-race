<?php

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$user = $data["user"] ?? "unknown";
$action = $data["action"] ?? "unknown";
$streak = $data["streak"] ?? 0;
$pokemon = $data["pokemon"] ?? "unknown";

$date = date("Y-m-d H:i:s");

$line =
    "[$date] " .
    "[user: $user] " .
    "[$action] " .
    "[streak: $streak] " .
    "[pokemon: $pokemon]" .
    PHP_EOL;

$logPath = __DIR__ . "/../logs/game.log";

$result = file_put_contents(
    $logPath,
    $line,
    FILE_APPEND
);

echo json_encode([
    "success" => $result !== false
]);