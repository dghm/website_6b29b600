<?php
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');
error_reporting(E_ALL);

header('Content-Type: application/json');

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/phpmailer/src/SMTP.php';
require_once __DIR__ . '/phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$name      = htmlspecialchars(strip_tags($_POST['name']      ?? ''));
$email     = htmlspecialchars(strip_tags($_POST['email']     ?? ''));
$phone     = htmlspecialchars(strip_tags($_POST['phone']     ?? ''));
$tourType  = htmlspecialchars(strip_tags($_POST['tourType']  ?? ''));
$date1     = htmlspecialchars(strip_tags($_POST['date1']     ?? ''));
$time1     = htmlspecialchars(strip_tags($_POST['time1']     ?? ''));
$message   = htmlspecialchars(strip_tags($_POST['message']   ?? ''));

if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(array('success' => false, 'error' => 'Missing required fields'));
    exit;
}

$datetime_display = ($date1 && $time1) ? $date1 . ' at ' . $time1 : ($date1 ? $date1 : '-');
$phone_display    = $phone    ? $phone    : '-';
$message_display  = $message  ? $message  : '-';
$tourType_display = $tourType ? $tourType : 'In-Person';

// ── Property constants (Demo fixed values) ──────────────────
$prop_address   = '1260 Broadway #3A';
$prop_area      = 'STUYVESANT HEIGHTS';
$prop_rent      = '$3,050';
$prop_beds      = '2 Bed';
$prop_baths     = '1 Bath';
$prop_listing   = 'Compass (90 5th Avenue, New York, NY 10011-7624)';
$prop_image_url = 'https://dghm.tw/compass-streeteasy/livingroom.webp';

// ── HTML Email ───────────────────────────────────────────────
$html  = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Tour Request</title></head>';
$html .= '<body style="margin:0;padding:0;background:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;">';
$html .= '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f2f5;padding:24px 0 40px;">';
$html .= '<tr><td align="center">';
$html .= '<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">';

// ── 1. LOGO BAR ──────────────────────────────────────────────
$html .= '<tr><td style="background:#1b3a6b;padding:14px 24px;border-radius:8px 8px 0 0;">';
$html .= '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>';
$html .= '<td style="vertical-align:middle;">';
// House icon SVG inline
$html .= '<table cellpadding="0" cellspacing="0" border="0"><tr>';
$html .= '<td style="vertical-align:middle;">';
$html .= '<span style="color:#ffffff;font-size:17px;font-weight:700;letter-spacing:0.2px;">StreetEasy</span>';
$html .= '<span style="color:#ffffff;font-size:17px;font-weight:400;">-DEMO</span>';
$html .= '</td></tr></table>';
$html .= '</td>';
$html .= '<td align="right" style="vertical-align:middle;">';
$html .= '<span style="color:rgba(255,255,255,0.75);font-size:13px;font-weight:500;">Industry Hub</span>';
$html .= '</td></tr></table>';
$html .= '</td></tr>';

// ── 2. HERO ──────────────────────────────────────────────────
$html .= '<tr><td style="background:#ffffff;padding:32px 32px 24px;text-align:center;border-left:1px solid #e2e5ea;border-right:1px solid #e2e5ea;">';
$html .= '<p style="margin:0 0 10px;font-size:22px;font-weight:400;color:#1a1a1a;line-height:1.3;">';
$html .= '<strong>' . $name . '</strong> Has Requested a Tour for</p>';
$html .= '<p style="margin:0 0 12px;">';
$html .= '<a href="#" style="font-size:22px;font-weight:700;color:#0053d4;text-decoration:underline;">' . $prop_address . '</a>';
$html .= '</p>';
$html .= '<p style="margin:0;font-size:14px;color:#555555;">Renter\'s Preferred Tour: <strong>' . $tourType_display . '</strong></p>';
$html .= '</td></tr>';

// ── 3. RENTER BOX ────────────────────────────────────────────
$html .= '<tr><td style="background:#ffffff;padding:0 32px 28px;border-left:1px solid #e2e5ea;border-right:1px solid #e2e5ea;">';
$html .= '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dde1e7;border-radius:6px;overflow:hidden;">';

// Renter info row
$html .= '<tr>';
$html .= '<td style="padding:16px 20px;border-right:1px solid #dde1e7;vertical-align:top;width:30%;">';
$html .= '<p style="margin:0;font-size:15px;font-weight:700;color:#1a1a1a;line-height:1.4;">' . $name . '</p>';
$html .= '</td>';
$html .= '<td style="padding:16px 20px;border-right:1px solid #dde1e7;vertical-align:middle;width:35%;">';
$html .= '<a href="mailto:' . $email . '" style="font-size:13px;color:#0053d4;text-decoration:none;word-break:break-all;">' . $email . '</a>';
$html .= '</td>';
$html .= '<td style="padding:16px 20px;vertical-align:middle;width:35%;">';
$html .= '<span style="font-size:13px;color:#0053d4;">' . $phone_display . '</span>';
$html .= '</td>';
$html .= '</tr>';

// Date row (if present)
if ($date1) {
    $html .= '<tr><td colspan="3" style="padding:10px 20px;background:#f7f8fa;border-top:1px solid #dde1e7;">';
    $html .= '<span style="font-size:13px;color:#555;">Preferred Date &amp; Time: <strong>' . $datetime_display . '</strong></span>';
    $html .= '</td></tr>';
}

// Message row (if present)
if ($message) {
    $html .= '<tr><td colspan="3" style="padding:10px 20px;background:#f7f8fa;border-top:1px solid #dde1e7;">';
    $html .= '<span style="font-size:13px;color:#555;">Message: <em>' . $message_display . '</em></span>';
    $html .= '</td></tr>';
}

// REPLY button row
$html .= '<tr><td colspan="3" style="padding:16px 20px;border-top:1px solid #dde1e7;">';
$html .= '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>';
$html .= '<td align="center">';
$html .= '<a href="mailto:' . $email . '" style="display:inline-block;width:100%;max-width:480px;padding:14px 0;background:#0053d4;color:#ffffff;font-size:14px;font-weight:700;text-align:center;text-decoration:none;text-transform:uppercase;letter-spacing:0.8px;border-radius:4px;">REPLY</a>';
$html .= '</td></tr></table>';
$html .= '</td></tr>';
$html .= '</table>';
$html .= '</td></tr>';

// ── 4. PROPERTY BOX ─────────────────────────────────────────
$html .= '<tr><td style="background:#ffffff;padding:0 32px 32px;border-left:1px solid #e2e5ea;border-right:1px solid #e2e5ea;">';
$html .= '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dde1e7;border-radius:6px;overflow:hidden;">';
$html .= '<tr>';

// Property image
$html .= '<td width="160" style="vertical-align:top;padding:0;">';
$html .= '<img src="' . $prop_image_url . '" width="160" height="120" alt="' . $prop_address . '" style="display:block;width:160px;height:120px;object-fit:cover;">';
$html .= '</td>';

// Property details
$html .= '<td style="padding:16px 18px;vertical-align:top;">';
$html .= '<p style="margin:0 0 4px;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Rental in ' . $prop_area . '</p>';
$html .= '<p style="margin:0 0 8px;"><a href="#" style="font-size:16px;font-weight:700;color:#0053d4;text-decoration:none;">' . $prop_address . '</a></p>';
$html .= '<p style="margin:0 0 10px;font-size:20px;font-weight:700;color:#1a1a1a;">' . $prop_rent . ' <span style="font-size:13px;font-weight:400;color:#666;">base rent</span></p>';
$html .= '<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;"><tr>';
$html .= '<td style="font-size:13px;color:#444;padding-right:16px;">&#x1F6CF; ' . $prop_beds . '</td>';
$html .= '<td style="font-size:13px;color:#444;">&#x1F6C1; ' . $prop_baths . '</td>';
$html .= '</tr></table>';
$html .= '<p style="margin:0;font-size:12px;color:#888888;">Listing by <a href="#" style="color:#0053d4;text-decoration:none;">' . $prop_listing . '</a></p>';
$html .= '</td>';
$html .= '</tr></table>';
$html .= '</td></tr>';

// ── 5. SECURITY INFO ─────────────────────────────────────────
$html .= '<tr><td style="background:#fafafa;padding:20px 32px;border:1px solid #e2e5ea;border-top:none;border-radius:0 0 8px 8px;">';
$html .= '<p style="margin:0 0 8px;font-size:12px;color:#666666;line-height:1.6;">';
$html .= 'Keep your StreetEasy account secure by using a strong, unique password, changing your password regularly, and being cautious of suspicious emails, messages, or links. ';
$html .= '<strong>Never share your password or one-time access code.</strong> ';
$html .= 'Visit <a href="https://streeteasy.com" style="color:#0053d4;">Keeping Your StreetEasy Account Secure: Tips for Agents</a> for more information.';
$html .= '</p>';
$html .= '<p style="margin:12px 0 0;font-size:11px;color:#aaaaaa;">Sent via <strong>StreetEasy-DEMO</strong> &mdash; Powered by <a href="https://dghm.tw" style="color:#0053d4;text-decoration:none;">DiGi-HandyMan LTD.</a></p>';
$html .= '</td></tr>';

$html .= '</table></td></tr></table></body></html>';

// ── Plain text fallback ──────────────────────────────────────
$plain  = $name . " Has Requested a Tour for " . $prop_address . "\n\n";
$plain .= "Renter's Preferred Tour: " . $tourType_display . "\n\n";
$plain .= "--- Contact ---\n";
$plain .= "Name:      " . $name . "\n";
$plain .= "Email:     " . $email . "\n";
$plain .= "Phone:     " . $phone_display . "\n";
$plain .= "Date/Time: " . $datetime_display . "\n";
if ($message) { $plain .= "Message:   " . $message_display . "\n"; }
$plain .= "\n--- Property ---\n";
$plain .= $prop_address . " | " . $prop_rent . " | " . $prop_beds . " / " . $prop_baths . "\n";
$plain .= "Listing by " . $prop_listing . "\n\n";
$plain .= "---\nSent via StreetEasy-DEMO / DiGi-HandyMan LTD.";

// ── Send ─────────────────────────────────────────────────────
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = 'tls';
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
    $mail->addAddress('defaultsite1979@gmail.com', 'Agent (Demo)');
    $mail->addReplyTo($email, $name);

    $mail->Subject = '[StreetEasy] ' . $prop_address . ' Inquiry From ' . $name;
    $mail->isHTML(true);
    $mail->Body    = $html;
    $mail->AltBody = $plain;

    $mail->send();
    echo json_encode(array('success' => true));

} catch (Exception $e) {
    echo json_encode(array('success' => false, 'error' => $mail->ErrorInfo));
}