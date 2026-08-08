<?php
require_once 'config.php';

$env = parse_ini_file(__DIR__ . '/.env');

// Session check
if (!isset($_SESSION['user']) || !isset($_SESSION['centre'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$selectedCentre = trim($_SESSION['centre']);

// ================= SHEET (UPDATES DATA) =================
$updates_gid = "431960958";

$url = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=$updates_gid";
$csv = @file_get_contents($url);

if ($csv === false) {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to fetch updates"
    ]);
    exit;
}

$rows = array_map('str_getcsv', explode("\n", $csv));
array_shift($rows); // remove header

$updates = [];

foreach ($rows as $row) {

    if (count($row) < 4) continue;

    $centre = trim($row[0]);

    $centre_clean = strtolower(str_replace(['center', 'curasia'], '', $centre));
    $selected_clean = strtolower(str_replace(['center', 'curasia'], '', $selectedCentre));

    if (trim($centre_clean) !== trim($selected_clean)) continue;

    $updates[] = [
        "month" => trim($row[1]),
        "department" => trim($row[2]),
        "update" => trim($row[3])
    ];
}

// 🔥 REVERSE ORDER (latest first)
$updates = array_reverse($updates);

// ================= RESPONSE =================
echo json_encode([
    "status" => "success",
    "centre" => $selectedCentre,
    "totalUpdates" => count($updates),
    "updates" => $updates
]);
