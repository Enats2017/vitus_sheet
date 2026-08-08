<?php
require_once 'config.php';

$env = parse_ini_file(__DIR__ . '/.env');

if (!isset($_SESSION['user'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$selectedCentre = $_SESSION['centre'];

// ----------- SHEET 1 -----------
$url1 = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=0";
$rows1 = array_map('str_getcsv', explode("\n", file_get_contents($url1)));
array_shift($rows1);

$currentMonth = date("F");
$currentYear  = date("Y");
$lastMonth    = date("F", strtotime("-1 month"));

$mtdSessions      = 0;
$lastMonthSessions = 0;
$currentPatients  = [];
$currentYearFromSheet = null;

// 👉 unique patient per date — ALL MONTHS
$datePatientMap = [];

foreach ($rows1 as $row) {
    if (count($row) < 5) continue;

    list($centre, $month, $year, $service, $patientId) = $row;
    $date = $row[5] ?? '';

    if (trim($centre) != $selectedCentre) continue;

    $month     = trim($month);
    $year      = trim($year);
    $patientId = trim($patientId);
    $date      = trim($date);

    if (empty($patientId)) continue;

    // -------- DATE RESOLUTION --------
    $timestamp = null;

    if (!empty($date)) {
        $dateObj = DateTime::createFromFormat('d/m/Y', $date);
        if (!$dateObj) $dateObj = DateTime::createFromFormat('d-m-Y', $date);
        if (!$dateObj) $dateObj = DateTime::createFromFormat('m/d/Y', $date);
        if ($dateObj) {
            $timestamp = $dateObj->getTimestamp();
        } else {
            $ts = strtotime($date);
            if ($ts !== false) $timestamp = $ts;
        }
    }

    // Fallback to month + year columns if date is empty
    if ($timestamp === null && !empty($month)) {
        $yearVal = !empty($year) ? $year : $currentYear;
        $ts      = strtotime("1 $month $yearVal");
        if ($ts !== false) $timestamp = $ts;
    }

    if ($timestamp === null) continue;

    $formattedDate = date("Y-m-d", $timestamp);

    // -------- ALL MONTHS TABLE DATA --------
    if (!isset($datePatientMap[$formattedDate])) {
        $datePatientMap[$formattedDate] = [];
    }
    $datePatientMap[$formattedDate][$patientId] = true;

    // -------- EXISTING MTD METRICS (unchanged) --------
    if ($month == $currentMonth) {
        $mtdSessions++;
        $currentPatients[$patientId] = true;
    }

    if ($month == $lastMonth) {
        $lastMonthSessions++;
    }

    if (!$currentYearFromSheet) {
        $currentYearFromSheet = $year;
    }
}

// ----------- SHEET 2 -----------
$url2 = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=1731105607";
$rows2 = array_map('str_getcsv', explode("\n", file_get_contents($url2)));
array_shift($rows2);

$activeMachines = [];
$inactiveMachines = [];

foreach ($rows2 as $row) {
    if (count($row) < 5) continue;

    list($centre, $machineNo, $status, $type, $date) = $row;

    if (trim($centre) != $selectedCentre) continue;

    $status = strtolower(trim($status));

    if ($status == 'active') {
        $activeMachines[$machineNo] = true;
    } elseif ($status == 'inactive') {
        $inactiveMachines[$machineNo] = true;
    }
}

// -------- BUILD DAILY DATA --------
$postedDates = [];
$totalUniquePatientsCurrentMonth = 0;

foreach ($datePatientMap as $date => $patients) {
    $count = count($patients);

    $postedDates[] = [
        "date"  => date("j F Y", strtotime($date)),
        "count" => $count
    ];

    // Sum unique per date for current month only
    $dateMonth = date("F", strtotime($date));
    $dateYear  = date("Y", strtotime($date));

    if ($dateMonth == $currentMonth && $dateYear == $currentYear) {
        $totalUniquePatientsCurrentMonth += $count;
    }
}

// -------- SORT (latest first) --------
usort($postedDates, function ($a, $b) {
    return strtotime($b['date']) - strtotime($a['date']);
});

// -------- RESPONSE --------
echo json_encode([
    "user"   => $_SESSION['user'],
    "centre" => $selectedCentre,
    "metrics" => [
        "mtdSessions"                      => $mtdSessions,
        "lastMonthSessions"                => $lastMonthSessions,
        "patients"                         => count($currentPatients),
        "activeMachines"                   => count($activeMachines),
        "inactiveMachines"                 => count($inactiveMachines),
        "year"                             => $currentYearFromSheet,
        "postedDates"                      => $postedDates,
        "totalUniquePatientsCurrentMonth"  => $totalUniquePatientsCurrentMonth
    ]
]);
