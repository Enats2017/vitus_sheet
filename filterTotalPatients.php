<?php
require_once 'config.php';

$env = parse_ini_file(__DIR__ . '/.env');
date_default_timezone_set('Asia/Kolkata');

if (!isset($_SESSION['user'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$selectedCentre = $_SESSION['centre'];

$startDate = $_GET['startDate'] ?? null;
$endDate   = $_GET['endDate'] ?? null;

if (!$startDate || !$endDate) {
    echo json_encode([
        "status" => "error",
        "message" => "Start date and End date required"
    ]);
    exit;
}

$startObj = DateTime::createFromFormat('Y-m-d', $startDate);
$endObj   = DateTime::createFromFormat('Y-m-d', $endDate);

if (!$startObj || !$endObj) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid date format"
    ]);
    exit;
}

$startTimestamp = $startObj->setTime(0, 0, 0)->getTimestamp();
$endTimestamp   = $endObj->setTime(23, 59, 59)->getTimestamp();

// ----------- FETCH SHEET -----------
$url = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=0";
$rows = array_map('str_getcsv', explode("\n", file_get_contents($url)));
array_shift($rows);

// 👉 patient uniqueness per date
$dailyPatients = [];

foreach ($rows as $row) {
    if (count($row) < 6) continue;

    list($centre, $month, $year, $service, $patientId, $date) = $row;

    if (trim($centre) != $selectedCentre) continue;
    if (empty($date)) continue;

    $dateObj = DateTime::createFromFormat('d/m/Y', $date);

    if (!$dateObj) {
        $timestamp = strtotime($date);
        if ($timestamp === false) continue;
    } else {
        $timestamp = $dateObj->getTimestamp();
    }

    if ($timestamp < $startTimestamp || $timestamp > $endTimestamp) continue;

    $formattedDate = date("Y-m-d", $timestamp); // better for uniqueness

    if (!isset($dailyPatients[$formattedDate])) {
        $dailyPatients[$formattedDate] = [];
    }

    // 👉 unique patient per date
    $dailyPatients[$formattedDate][$patientId] = true;
}

// 👉 build response
$dailyData = [];
$totalPatients = 0;

foreach ($dailyPatients as $date => $patients) {
    $count = count($patients);

    $dailyData[] = [
        "date" => date("j F Y", strtotime($date)),
        "count" => $count
    ];

    // 👉 sum of unique per day
    $totalPatients += $count;
}

// 👉 sort latest first
usort($dailyData, function ($a, $b) {
    return strtotime($b['date']) - strtotime($a['date']);
});

// ----------- RESPONSE -----------

if ($totalPatients === 0) {
    echo json_encode([
        "status" => "empty",
        "message" => "No data found",
        "totalPatients" => 0,
        "dailyData" => []
    ]);
    exit;
}

echo json_encode([
    "status" => "success",
    "startDate" => $startObj->format("j F Y"),
    "endDate"   => $endObj->format("j F Y"),
    "totalPatients" => $totalPatients, // ✅ sum of daily unique
    "dailyData" => $dailyData
]);