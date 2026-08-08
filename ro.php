<?php
require_once 'config.php';

if (!isset($_SESSION['user']) || !isset($_SESSION['centre'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$selectedCentre = trim($_SESSION['centre']);

// ================= FETCH RO TAB =================
$ro_gid = "1213591010";

$url = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=$ro_gid";
$csv = @file_get_contents($url);

if ($csv === false) {
    echo json_encode([
        "status"  => "error",
        "message" => "Unable to fetch RO sheet"
    ]);
    exit;
}

$rows = array_map('str_getcsv', explode("\n", $csv));
array_shift($rows);

// Track latest separately for TDS and Chlorine
$latestTdsTimestamp      = null;
$latestTds               = null;
$latestChlorineTimestamp = null;
$latestChlorine          = null;
$latestAvgTdsTimestamp     = null;
$latestAvgTds              = null;
$latestWaterTestTimestamp  = null;
$latestWaterTestDate       = null;

foreach ($rows as $row) {
    if (count($row) < 4) continue;

    $centre   = trim($row[0]);
    $date     = trim($row[1]);
    $tds      = trim($row[2]);
    $chlorine = trim($row[3]);
    $avgTds      = trim($row[4] ?? '');
    $waterTestDate = trim($row[5] ?? '');

    if (empty($centre) || empty($date)) continue;

    // Match centre
    if (strtolower($centre) !== strtolower($selectedCentre)) continue;

    // Parse date
    $dateObj = DateTime::createFromFormat('d/m/Y', $date);
    if (!$dateObj) $dateObj = DateTime::createFromFormat('d-m-Y', $date);
    if (!$dateObj) {
        $ts = strtotime($date);
        if ($ts === false) continue;
        $timestamp = $ts;
    } else {
        $timestamp = $dateObj->getTimestamp();
    }

    // Track latest TDS independently
    if (!empty($tds) && ($latestTdsTimestamp === null || $timestamp > $latestTdsTimestamp)) {
        $latestTdsTimestamp = $timestamp;
        $latestTds          = $tds;
    }

    // Track latest Chlorine independently
    if (!empty($chlorine) && ($latestChlorineTimestamp === null || $timestamp > $latestChlorineTimestamp)) {
        $latestChlorineTimestamp = $timestamp;
        $latestChlorine          = $chlorine;
    }
    if (!empty($avgTds) && ($latestAvgTdsTimestamp === null || $timestamp > $latestAvgTdsTimestamp)) {
        $latestAvgTdsTimestamp = $timestamp;
        $latestAvgTds          = $avgTds;
    }
    if (!empty($waterTestDate) && ($latestWaterTestTimestamp === null || $timestamp > $latestWaterTestTimestamp)) {
        $latestWaterTestTimestamp = $timestamp;
        $latestWaterTestDate      = $waterTestDate;
    }
}

// ================= RESPONSE =================
if ($latestTdsTimestamp === null && $latestChlorineTimestamp === null) {
    echo json_encode([
        "status"  => "empty",
        "message" => "No RO records found for this centre"
    ]);
    exit;
}

echo json_encode([
    "status"         => "success",
    "centre"         => $selectedCentre,
    "tds"            => $latestTds ?? "NA",
    "tds_date"       => $latestTdsTimestamp ? date("j F Y", $latestTdsTimestamp) : "NA",
    "chlorine"       => $latestChlorine ?? "NA",
    "chlorine_date"  => $latestChlorineTimestamp ? date("j F Y", $latestChlorineTimestamp) : "NA",
    "avg_tds"          => $latestAvgTds ?? "NA",
    "water_test_date"  => $latestWaterTestDate ?? "NA",
]);
