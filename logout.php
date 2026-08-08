<?php
require_once 'config.php';

session_unset();
session_destroy();

setcookie(session_name(), '', [
    'expires'  => time() - 3600,
    'secure'   => false,   // ← change this
    'httponly' => true,
    'samesite' => 'None',
    'path'     => '/'
]);

echo json_encode(["status" => "success", "message" => "Logged out"]);