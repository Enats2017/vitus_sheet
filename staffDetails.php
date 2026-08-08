<?php
require_once 'config.php';

$env = parse_ini_file(__DIR__ . '/.env');

// Ensure session exists
if (!isset($_SESSION['user']) || !isset($_SESSION['centre'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$selectedCentre = trim($_SESSION['centre']);

// ----------- SHEET (Other Staff - Section C) -----------
$sheet_gid = "622063884"; // 🔴 update this

$url = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=$sheet_gid";

$csv = @file_get_contents($url);

if ($csv === false) {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to fetch other staff data"
    ]);
    exit;
}

// Convert CSV → array
$rows = array_map('str_getcsv', explode("\n", $csv));

// Remove header
array_shift($rows);

$staff = [];

foreach ($rows as $row) {

    if (count($row) < 2) continue;

    $centre = trim($row[0]);
    $name   = trim($row[1]);

    // ✅ Match logged-in centre
    if (strtolower($centre) !== strtolower($selectedCentre)) continue;

    if ($name === '') continue;

    // ✅ Treat full cell as ONE staff (same as technician fix)
    $staff[] = [
        "name" => $name
    ];
}

// ----------- RESPONSE -----------
echo json_encode([
    "status" => "success",
    "centre" => $selectedCentre,
    "totalStaff" => count($staff),
    "staff" => $staff
]);
