<?php

header("Content-Type: application/json");

$user = $_GET["user"];
$group = $_GET["group"];

$path = "../logs/game.log";

if (!file_exists($path)) {
    echo json_encode([]);
    exit;
}

$lines = file($path, FILE_IGNORE_NEW_LINES);

$filtered = [];

foreach ($lines as $line) {

    if (stripos($line, "[user: $user]") !== false) {

        preg_match("/^\[(.*?)\]/", $line, $matches);

        $date = new DateTime($matches[1]);

        if ($group === "week") {
            $key = $date->format("o-\WW");
        }
        else if ($group === "month") {
            $key = $date->format("Y-m");
        }
        else {
            $key = "All Time";
        }

        if (!isset($filtered[$key])) {
            $filtered[$key] = [];
        }

        $filtered[$key][] = $line;
    }
}

echo json_encode($filtered);