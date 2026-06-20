<?php
// ============================================================
// DGHM Contact Form - Mail Handler
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://dghm.tw');

require_once __DIR__ . '/dghm-config.php';
require_once __DIR__ . '/phpmailer/src/Exception.php';
require_once __DIR__ . '/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

$name      = clean($_POST['name']      ?? '');
$company   = clean($_POST['company']   ?? '');
$email     = clean($_POST['email']     ?? '');
$challenge = clean($_POST['challenge'] ?? '');

if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name and email are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

$subject = "New Inquiry from DGHM Website — {$name}";

$body = "
<html>
<body style='font-family: Arial, sans-serif; color: #1A1E2E; max-width: 600px;'>
  <div style='background: #0D2F6E; padding: 24px 32px; border-radius: 6px 6px 0 0;'>
    <h2 style='color: #ffffff; margin: 0; font-size: 18px;'>New Contact Form Submission</h2>
    <p style='color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 13px;'>From dghm.tw</p>
  </div>
  <div style='background: #F4F7FB; padding: 28px 32px; border-radius: 0 0 6px 6px; border: 1px solid #E8ECF5; border-top: none;'>
    <table style='width:100%; border-collapse: collapse;'>
      <tr>
        <td style='padding: 10px 0; border-bottom: 1px solid #E8ECF5; width: 130px; color: #5A6580; font-size: 13px;'>Name</td>
        <td style='padding: 10px 0; border-bottom: 1px solid #E8ECF5; font-weight: 600; font-size: 14px;'>" . ($name ?: '—') . "</td>
      </tr>
      <tr>
        <td style='padding: 10px 0; border-bottom: 1px solid #E8ECF5; color: #5A6580; font-size: 13px;'>Company</td>
        <td style='padding: 10px 0; border-bottom: 1px solid #E8ECF5; font-size: 14px;'>" . ($company ?: '—') . "</td>
      </tr>
      <tr>
        <td style='padding: 10px 0; border-bottom: 1px solid #E8ECF5; color: #5A6580; font-size: 13px;'>Email</td>
        <td style='padding: 10px 0; border-bottom: 1px solid #E8ECF5; font-size: 14px;'><a href='mailto:{$email}' style='color:#0D2F6E;'>{$email}</a></td>
      </tr>
      <tr>
        <td style='padding: 10px 0; color: #5A6580; font-size: 13px; vertical-align: top;'>Challenge</td>
        <td style='padding: 10px 0; font-size: 14px; line-height: 1.6;'>" . (nl2br($challenge) ?: '—') . "</td>
      </tr>
    </table>
    <div style='margin-top: 24px; padding: 14px 18px; background: #fff; border-radius: 4px; border-left: 3px solid #E5622A;'>
      <p style='margin: 0; font-size: 13px; color: #5A6580;'>Reply directly to this email to respond to <strong style='color:#1A1E2E;'>{$name}</strong>.</p>
    </div>
  </div>
</body>
</html>
";

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
    $mail->addAddress(MAIL_TO);
    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $body;
    $mail->AltBody = "Name: {$name}\nCompany: {$company}\nEmail: {$email}\n\nChallenge:\n{$challenge}";

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mailer error: ' . $mail->ErrorInfo]);
}
