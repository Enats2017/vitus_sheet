<?php
require_once 'config.php';

// $env = parse_ini_file(__DIR__ . '/.env');

// $allowed_origin = $env['ALLOWED_ORIGIN'];
// $spreadsheetId  = $env['SPREADSHEET_ID'];
// session_start();

// ================= CORS HEADERS =================


// header("Access-Control-Allow-Origin: $allowed_origin");
// header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Access-Control-Allow-Credentials: true");
// header("Content-Type: application/json");

// Handle preflight (OPTIONS request)
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit();
// }

// ================= GOOGLE SHEET CONFIG =================
// $spreadsheetId = $env['SPREADSHEET_ID'];

$loginUrl = "https://docs.google.com/spreadsheets/d/$spreadsheetId/export?format=csv&gid=876331731";

// Fetch CSV data
$loginCsv = @file_get_contents($loginUrl);

if ($loginCsv === false) {
    $err = error_get_last();
    echo json_encode([
        "status" => "error",
        "message" => "Unable to fetch Google Sheet data",
        "debug" => $err
    ]);
    exit;
}

if ($loginCsv === false) {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to fetch Google Sheet data"
    ]);
    exit;
}

// Convert CSV to array
$rows = array_map('str_getcsv', explode("\n", $loginCsv));

// Remove header row
array_shift($rows);

// ================= GET INPUT =================
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

// Validate input
if (!$username || !$password) {
    echo json_encode([
        "status" => "error",
        "message" => "Username and password required"
    ]);
    exit;
}

// ================= LOGIN CHECK =================
// foreach ($rows as $row) {

//     if (count($row) < 3) continue;

//     list($centre, $user, $pass) = $row;

//     if ($user === $username && $pass === $password) {

//         $_SESSION['user'] = $user;
//         $_SESSION['centre'] = $centre;

//         echo json_encode([
//             "status" => "success",
//             "user" => $user,
//             "centre" => $centre
//         ]);
//         exit;
//     }
// }

foreach ($rows as $row) {

    if (count($row) < 4) continue;

    list($centre, $user, $pass, $phone) = $row;

    if ($user === $username && $pass === $password) {

        $_SESSION['user'] = $user;
        $_SESSION['centre'] = $centre;

        echo json_encode([
            "status" => "success",
            "user" => $user,
            "centre" => $centre,
            "phone" => $phone
        ]);
        exit;
    }
}

// ================= INVALID =================
echo json_encode([
    "status" => "error",
    "message" => "Invalid credentials"
]);