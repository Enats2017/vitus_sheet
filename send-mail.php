<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/config.php';
require __DIR__ . '/vendor/autoload.php';  // after composer require phpmailer/phpmailer on server

$data = json_decode(file_get_contents("php://input"), true);
$feedback = htmlspecialchars($data['feedback'] ?? '');

if (empty($feedback)) {
    echo json_encode(["success" => false, "message" => "Feedback is empty"]);
    exit();
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'saumya.pokhariyal@vituscare.com';
    $mail->Password   = 'xhbygjkbrvfsbtzz';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom('saumya.pokhariyal@vituscare.com', 'Dashboard Feedforward');
    $mail->addAddress('saumya.pokhariyal@vituscare.com');
    $mail->addAddress('info@vituscare.com');

    $mail->isHTML(false);
    $mail->Subject = 'New Feedforward Submission';
    $mail->Body    = "A new feedforward has been submitted:\n\n" . $feedback;

    $mail->send();
    echo json_encode(["success" => true, "message" => "Email sent successfully"]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $mail->ErrorInfo]);
}