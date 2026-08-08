<?php
require_once 'config.php';

// session_start();

// ================= GOOGLE SHEET CONFIG =================
$sheetUrl = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=1731105607";

// Fetch CSV
$csvData = @file_get_contents($sheetUrl);

if ($csvData === false) {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to fetch Google Sheet data"
    ]);
    exit;
}

// Convert CSV to array
$rows = array_map('str_getcsv', explode("\n", $csvData));

// Remove header row
array_shift($rows);

// ================= GET SESSION CENTRE =================
$sessionCentre = trim($_SESSION['centre'] ?? '');

if (empty($sessionCentre)) {
    echo json_encode([
        "status" => "error",
        "message" => "Centre session not found"
    ]);
    exit;
}

// ================= STORE MACHINE DATA =================
$machines = [];

foreach ($rows as $row) {

    // Skip invalid rows
    if (count($row) < 5) continue;

    // Columns:
    // Centre | Machine number | Status | Type | Date

    list($centre, $machine, $status, $type, $date) = $row;

    $centre  = trim($centre);
    $machine = trim($machine);
    $status  = strtolower(trim($status));
    $type    = strtolower(trim($type));
    $date    = trim($date);

    // ================= FILTER BY CENTRE =================
    if (strtolower($centre) !== strtolower($sessionCentre)) {
        continue;
    }

    // Only active machines
    if ($status !== 'active') {
        continue;
    }

    // Create machine array if not exists
    if (!isset($machines[$machine])) {

        $machines[$machine] = [
            "machine_number" => $machine,
            "maintenance_date" => null,
            "repair_date" => null
        ];
    }

    // Store maintenance date
    if ($type === 'maintenance') {
        $machines[$machine]['maintenance_date'] = $date;
    }

    // Store repair date
    if ($type === 'repair') {
        $machines[$machine]['repair_date'] = $date;
    }
}

// ================= FINAL RESPONSE =================
$response = array_values($machines);

if (!empty($response)) {

    echo json_encode([
        "status" => "success",
        "centre" => $sessionCentre,
        "records" => $response
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "No active records found for this centre"
    ]);
}
?>