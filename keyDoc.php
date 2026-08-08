<?php
require_once 'config.php';

// session_start();

// ================= GOOGLE SHEET CONFIG =================
$sheetUrl = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=344365617";

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

// ================= FETCH DOCUMENTS =================
$documents = [];

foreach ($rows as $row) {

    // Skip invalid rows
    if (count($row) < 3) continue;

    // Columns:
    // Center | Text | Link

    list($centre, $text, $link) = $row;
    $validUpto = trim($row[3] ?? '');

    $centre = trim($centre);
    $text   = trim($text);
    $link   = trim($link);

    // Filter by centre
    if (strtolower($centre) !== strtolower($sessionCentre)) {
        continue;
    }

    // Skip empty text/link
    if (empty($text) || empty($link)) {
        continue;
    }

    $documents[] = [
        "text" => $text,
        "link" => $link,
        "valid_upto" => !empty($validUpto) ? $validUpto : null
    ];
}

// ================= RESPONSE =================
if (!empty($documents)) {

    echo json_encode([
        "status" => "success",
        "centre" => $sessionCentre,
        "documents" => $documents
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "No documents found for this centre"
    ]);
}
?>