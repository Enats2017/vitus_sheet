<?php
require_once 'config.php';

$env = parse_ini_file(__DIR__ . '/.env');

// Session check
if (!isset($_SESSION['user']) || !isset($_SESSION['centre'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$selectedCentre = trim($_SESSION['centre']);

// ✅ NAYA: query params se from/to lena
$fromMonth = $_GET['fromMonth'] ?? null;
$fromYear  = $_GET['fromYear'] ?? null;
$toMonth   = $_GET['toMonth'] ?? null;
$toYear    = $_GET['toYear'] ?? null;

$monthMap = [
    "january" => 1,
    "february" => 2,
    "march" => 3,
    "april" => 4,
    "may" => 5,
    "june" => 6,
    "july" => 7,
    "august" => 8,
    "september" => 9,
    "october" => 10,
    "november" => 11,
    "december" => 12
];

function toComparable($month, $year, $monthMap)
{
    $m = $monthMap[strtolower(trim($month))] ?? 0;
    return ((int)$year * 12) + $m;
}

$fromVal = ($fromMonth && $fromYear) ? toComparable($fromMonth, $fromYear, $monthMap) : null;
$toVal   = ($toMonth && $toYear) ? toComparable($toMonth, $toYear, $monthMap) : null;

// ================= SHEET (REVENUE DATA) =================
$revenue_gid = "1153758139";

$url = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=$revenue_gid";
$csv = @file_get_contents($url);

if ($csv === false) {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to fetch revenue data"
    ]);
    exit;
}

$rows = array_map('str_getcsv', explode("\n", $csv));
array_shift($rows); // remove header

$revenueData = [];
$totalRevenue = 0;

foreach ($rows as $row) {

    // Expected:
    // [0] Center, [1] Month, [2] Year, [3] Revenue
    if (count($row) < 4) continue;

    $centre = trim($row[0]);

    $centre_clean = strtolower(str_replace(['center', 'curasia'], '', $centre));
    $selected_clean = strtolower(str_replace(['center', 'curasia'], '', $selectedCentre));

    if (trim($centre_clean) !== trim($selected_clean)) continue;

    $month = trim($row[1]);
    $year = trim($row[2]);
    $revenue = (float) trim($row[3]);

    // ✅ NAYA: date range filter
    $rowVal = toComparable($month, $year, $monthMap);
    if ($fromVal !== null && $rowVal < $fromVal) continue;
    if ($toVal !== null && $rowVal > $toVal) continue;

    $totalRevenue += $revenue;

    $revenueData[] = [
        "month" => $month,
        "year" => $year,
        "revenue" => $revenue
    ];
}

// ================= RESPONSE =================
echo json_encode([
    "status" => "success",
    "centre" => $selectedCentre,
    "totalMonths" => count($revenueData),
    "totalRevenue" => $totalRevenue,
    "revenue" => $revenueData
]);
