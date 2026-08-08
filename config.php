<?php
$env = parse_ini_file(__DIR__ . '/.env');

$spreadsheetId = $env['SPREADSHEET_ID'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// session_set_cookie_params([
//   'secure'   => false, // set true only on HTTPS
//   'httponly' => true,
//   'samesite' => 'None'
// ]);
// config.php
session_set_cookie_params([
    'secure'   => false,
    'httponly' => true,
    'samesite' => 'Lax'   // ← works on HTTP
]);
session_start();

header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}