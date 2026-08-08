<?php
require_once 'config.php';

$env = parse_ini_file(__DIR__ . '/.env');

// Session check
if (!isset($_SESSION['user']) || !isset($_SESSION['centre'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$selectedCentre = trim($_SESSION['centre']);

// ================= SHEET 1 (CONTACT DETAILS) =================
$sheet_gid = "1863267025";
$url = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=$sheet_gid";
$csv = @file_get_contents($url);

if ($csv === false) {
    echo json_encode(["status" => "error", "message" => "Unable to fetch contact details"]);
    exit;
}

$rows = array_map('str_getcsv', explode("\n", $csv));
array_shift($rows); // Remove header row

$contactDetails = null;

foreach ($rows as $row) {
    if (count($row) < 14) continue; // Need all 13 columns (0–12)

    $centre = trim($row[0]);
    $centre_clean   = strtolower(trim(str_replace(['center', 'curasia'], '', $centre)));
    $selected_clean = strtolower(trim(str_replace(['center', 'curasia'], '', $selectedCentre)));

    if ($centre_clean !== $selected_clean) continue;

    $contactDetails = [
        // Staff names (cols 1–6)
        "operations"            => trim($row[1]),
        "biomedical"            => trim($row[2]),
        "clinical"              => trim($row[3]),
        "partnership"           => trim($row[4]),
        "finance"               => trim($row[5]),
        "patient_engagement"    => trim($row[6]),

        // Phone numbers (cols 7–12)
        "operations_no"         => trim($row[7]),
        "biomedical_no"         => trim($row[8]),
        "clinical_no"           => trim($row[9]),
        "partnership_no"        => trim($row[10]),
        "finance_no"            => trim($row[11]),
        "patient_engagement_no" => trim($row[12]),
        "whatsapp_no"            => trim($row[13]),
    ];

    break;
}

// ================= COUNT NON-EMPTY NUMBERS =================
$totalFields = 0;
$numbers = [];

if ($contactDetails !== null) {
    $numbers = [
        "operations_no"         => $contactDetails["operations_no"],
        "biomedical_no"         => $contactDetails["biomedical_no"],
        "clinical_no"           => $contactDetails["clinical_no"],
        "partnership_no"        => $contactDetails["partnership_no"],
        "finance_no"            => $contactDetails["finance_no"],
        "patient_engagement_no" => $contactDetails["patient_engagement_no"],
        "whatsapp_no"            => $contactDetails["whatsapp_no"],
    ];

    $totalFields = count(array_filter($numbers, fn($v) => trim($v) !== ''));
}

// ================= RESPONSE =================
echo json_encode([
    "status"          => "success",
    "centre"          => $selectedCentre,
    "totalFields"     => $totalFields,
    "contact_details" => $contactDetails
]);