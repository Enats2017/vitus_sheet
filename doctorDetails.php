<?php
require_once 'config.php';

$env = parse_ini_file(__DIR__ . '/.env');

if (!isset($_SESSION['user']) || !isset($_SESSION['centre'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$selectedCentre = trim($_SESSION['centre']);

// ----------- SHEET 4 (Centre Personnel) -----------
$sheet4_gid = "156993214";

$url = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=$sheet4_gid";

$csv = @file_get_contents($url);

if ($csv === false) {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to fetch doctor data"
    ]);
    exit;
}

// Convert CSV → array
$rows = array_map('str_getcsv', explode("\n", $csv));

// Remove header row
array_shift($rows);

$doctors = [];

foreach ($rows as $row) {

    if (count($row) < 4) continue; // ✅ now requires 4 columns

    $centre   = trim($row[0]);
    $doctor   = trim($row[1]);
    $visiting = trim($row[2]);
    $phone    = trim($row[3]); // ✅ added phone number

    if (strtolower($centre) !== strtolower($selectedCentre)) continue;

    if ($doctor === '') continue;

    $doctors[] = [
        "name"    => $doctor,
        "visiting" => $visiting,
        "phone"   => $phone // ✅ included in response
    ];
}

// ----------- RESPONSE -----------
echo json_encode([
    "status"       => "success",
    "centre"       => $selectedCentre,
    "totalDoctors" => count($doctors),
    "doctors"      => $doctors
]);