<?php
require_once 'config.php';

$env = parse_ini_file(__DIR__ . '/.env');

if (!isset($_SESSION['user']) || !isset($_SESSION['centre'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$selectedCentre = trim($_SESSION['centre']);

$url = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=0";
$csv = @file_get_contents($url);

if ($csv === false) {
    echo json_encode(["status" => "error", "message" => "Unable to fetch sheet"]);
    exit;
}

$rows = array_map('str_getcsv', explode("\n", $csv));
array_shift($rows);

$currentMonthName = date("F");
$currentYear      = (int)date("Y"); 

$monthlyPatients = [];
$overallPatients = [];

foreach ($rows as $row) {
    if (count($row) < 5) continue;

    list($centre, $month, $year, $service, $patientId) = $row;

    if (trim($centre) != $selectedCentre) continue;
    if (empty(trim($patientId))) continue;

    $pid = trim($patientId);

    $overallPatients[$pid] = true;

    if (trim($month) === $currentMonthName && (int)trim($year) === $currentYear) {
        $monthlyPatients[$pid] = true;
    }
}

echo json_encode([
    "status"       => "success",
    "centre"       => $selectedCentre,
    "month"        => date("F"),
    "count"        => count($monthlyPatients),  // June = 13
    "overallCount" => count($overallPatients)   // All time = 38
]);
?>