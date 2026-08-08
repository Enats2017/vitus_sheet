<?php
$env = parse_ini_file(__DIR__ . '/.env');

$allowed_origin = $env['ALLOWED_ORIGIN'];
$spreadsheetId  = $env['SPREADSHEET_ID'];

session_set_cookie_params([
  'secure'   => true,
  'httponly' => true,
  'samesite' => 'None'
]);
session_start();

header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}