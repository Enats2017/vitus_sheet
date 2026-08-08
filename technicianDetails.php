<?php
require_once 'config.php';

$env = parse_ini_file(__DIR__ . '/.env');

// Ensure session exists
if (!isset($_SESSION['user']) || !isset($_SESSION['centre'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$selectedCentre = trim($_SESSION['centre']);

// ----------- SHEET (Technicians - Section 2) -----------
$sheet_gid = "2146587859"; // 🔴 update this

$url = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=$sheet_gid";

$csv = @file_get_contents($url);

if ($csv === false) {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to fetch technician data"
    ]);
    exit;
}

// Convert CSV → array
$rows = array_map('str_getcsv', explode("\n", $csv));

// Remove header
array_shift($rows);

$technicians = [];

foreach ($rows as $row) {

    if (count($row) < 2) continue;

    $centre = trim($row[0]);
    $tech   = trim($row[1]);

    // ✅ Match logged-in centre
    if (strtolower($centre) !== strtolower($selectedCentre)) continue;

    if ($tech === '') continue;

    // ✅ Treat full cell as ONE technician (FIXED)
    $technicians[] = [
        "name" => $tech
    ];
}

// ----------- RESPONSE -----------
echo json_encode([
    "status" => "success",
    "centre" => $selectedCentre,
    "totalTechnicians" => count($technicians),
    "technicians" => $technicians
]);
