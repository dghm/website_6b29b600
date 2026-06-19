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

// ── Renter fields ────────────────────────────────────────────
$name      = htmlspecialchars(strip_tags($_POST['name']      ?? ''));
$email     = htmlspecialchars(strip_tags($_POST['email']     ?? ''));
$phone     = htmlspecialchars(strip_tags($_POST['phone']     ?? ''));
$tourType  = htmlspecialchars(strip_tags($_POST['tourType']  ?? ''));
$date1     = htmlspecialchars(strip_tags($_POST['date1']     ?? ''));
$time1     = htmlspecialchars(strip_tags($_POST['time1']     ?? ''));
$message   = htmlspecialchars(strip_tags($_POST['message']   ?? ''));

// ── Property fields ──────────────────────────────────────────
$prop_address = htmlspecialchars(strip_tags($_POST['prop_address'] ?? ''));
$prop_type    = htmlspecialchars(strip_tags($_POST['prop_type']    ?? ''));
$prop_price   = htmlspecialchars(strip_tags($_POST['prop_price']   ?? ''));
$prop_beds    = htmlspecialchars(strip_tags($_POST['prop_beds']    ?? ''));
$prop_baths   = htmlspecialchars(strip_tags($_POST['prop_baths']   ?? ''));
$prop_area    = htmlspecialchars(strip_tags($_POST['prop_area']    ?? ''));
$prop_image   = htmlspecialchars(strip_tags($_POST['prop_image']   ?? ''));

// ── Validation ───────────────────────────────────────────────
if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(array('success' => false, 'error' => 'Missing required fields'));
    exit;
}

// ── Display helpers ──────────────────────────────────────────
$datetime_display = ($date1 && $time1) ? $date1 . ' at ' . $time1 : ($date1 ? $date1 : '-');
$phone_display    = $phone   ? $phone   : '-';
$message_display  = $message ? $message : '-';
$tourType_display = $tourType ? $tourType : 'In-Person';
$is_rent          = ($prop_type === 'For Rent');

// ── HTML email ───────────────────────────────────────────────
// meta 標籤格式對齊真實 StreetEasy，Make Text Parser 可直接解析
$lead_type = $is_rent ? 'Renter' : 'Buyer';
$html  = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Tour Request</title>';
$html .= '<meta name="lead_source" content="Streeteasy">';
$html .= '<meta name="lead_name" content="' . $name . '">';
$html .= '<meta name="lead_email" content="' . $email . '">';
$html .= '<meta name="lead_phone" content="' . $phone . '">';
$html .= '<meta name="lead_message" content="' . $message . '">';
$html .= '<meta name="lead_property_address" content="' . $prop_address . '">';
$html .= '<meta name="lead_property_type" content="' . $lead_type . '">';
$html .= '<meta name="lead_property_price" content="' . $prop_price . '">';
$html .= '<meta name="lead_property_bedrooms" content="' . $prop_beds . '">';
$html .= '<meta name="lead_property_bathrooms" content="' . $prop_baths . '">';
$html .= '</head>';
$html .= '<body style="margin:0;padding:0;background:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;">';

// 1. LOGO BAR
$html .= '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f2f5;padding:24px 0 40px"><tr><td align="center">';
$html .= '<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%">';
$html .= '<tr><td style="background:#1b3a6b;padding:14px 24px;border-radius:8px 8px 0 0">';
$html .= '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>';
$html .= '<td style="vertical-align:middle"><span style="color:#ffffff;font-size:17px;font-weight:700;letter-spacing:0.2px">StreetEasy</span><span style="color:#ffffff;font-size:17px;font-weight:400">-DEMO</span></td>';
$html .= '<td align="right" style="vertical-align:middle"><span style="color:rgba(255,255,255,0.75);font-size:13px;font-weight:500">Industry Hub</span></td>';
$html .= '</tr></table></td></tr>';

// 2. HERO — For Rent vs For Sale
$html .= '<tr><td style="background:#ffffff;padding:32px 32px 24px;text-align:center;border-left:1px solid #e2e5ea;border-right:1px solid #e2e5ea">';
if ($is_rent) {
    $html .= '<p style="margin:0 0 10px;font-size:22px;font-weight:400;color:#1a1a1a;line-height:1.3"><strong>' . $name . '</strong> Has Requested a Tour for</p>';
    $html .= '<p style="margin:0 0 12px"><a href="#" style="font-size:22px;font-weight:700;color:#0053d4;text-decoration:underline">' . $prop_address . '</a></p>';
    $html .= '<p style="margin:0;font-size:14px;color:#555555">Renter\'s Preferred Tour: <strong>' . $tourType_display . '</strong></p>';
} else {
    $html .= '<p style="margin:0 0 10px;font-size:22px;font-weight:400;color:#1a1a1a;line-height:1.3"><strong>' . $name . '</strong> sent you a message about</p>';
    $html .= '<p style="margin:0 0 12px"><a href="#" style="font-size:22px;font-weight:700;color:#0053d4;text-decoration:underline">' . $prop_address . '</a></p>';
}
$html .= '</td></tr>';

// 3. RENTER / BUYER BOX
$html .= '<tr><td style="background:#ffffff;padding:0 32px 28px;border-left:1px solid #e2e5ea;border-right:1px solid #e2e5ea">';
$html .= '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dde1e7;border-radius:6px;overflow:hidden">';

// Message row (For Sale shows message first, like StreetEasy style)
if (!$is_rent && $message) {
    $html .= '<tr><td colspan="3" style="padding:16px 20px;border-bottom:1px solid #dde1e7">';
    $html .= '<p style="margin:0;font-size:14px;color:#333;line-height:1.6">' . $message_display . '</p>';
    $html .= '</td></tr>';
}

// Contact row
$html .= '<tr>';
$html .= '<td style="padding:16px 20px;border-right:1px solid #dde1e7;vertical-align:top;width:30%">';
$html .= '<p style="margin:0;font-size:15px;font-weight:700;color:#1a1a1a;line-height:1.4">' . $name . '</p></td>';
$html .= '<td style="padding:16px 20px;border-right:1px solid #dde1e7;vertical-align:middle;width:35%">';
$html .= '<a href="mailto:' . $email . '" style="font-size:13px;color:#0053d4;text-decoration:none;word-break:break-all">' . $email . '</a></td>';
$html .= '<td style="padding:16px 20px;vertical-align:middle;width:35%">';
$html .= '<span style="font-size:13px;color:#0053d4">' . $phone_display . '</span></td>';
$html .= '</tr>';

// Date row — For Rent only
if ($is_rent && $date1) {
    $html .= '<tr><td colspan="3" style="padding:10px 20px;background:#f7f8fa;border-top:1px solid #dde1e7">';
    $html .= '<span style="font-size:13px;color:#555">Preferred Date &amp; Time: <strong>' . $datetime_display . '</strong></span>';
    $html .= '</td></tr>';
}

// Message row — For Rent shows message below contact
if ($is_rent && $message) {
    $html .= '<tr><td colspan="3" style="padding:10px 20px;background:#f7f8fa;border-top:1px solid #dde1e7">';
    $html .= '<span style="font-size:13px;color:#555">Message: <em>' . $message_display . '</em></span>';
    $html .= '</td></tr>';
}

// REPLY button
$html .= '<tr><td colspan="3" style="padding:16px 20px;border-top:1px solid #dde1e7">';
$html .= '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center">';
$html .= '<a href="mailto:' . $email . '" style="display:inline-block;width:100%;max-width:480px;padding:14px 0;background:#0053d4;color:#ffffff;font-size:14px;font-weight:700;text-align:center;text-decoration:none;text-transform:uppercase;letter-spacing:0.8px;border-radius:4px">REPLY</a>';
$html .= '</td></tr></table></td></tr>';
$html .= '</table></td></tr>';

// 4. PROPERTY BOX
$html .= '<tr><td style="background:#ffffff;padding:0 32px 32px;border-left:1px solid #e2e5ea;border-right:1px solid #e2e5ea">';
$html .= '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dde1e7;border-radius:6px;overflow:hidden"><tr>';
$html .= '<td width="160" style="vertical-align:top;padding:0">';
$html .= '<img src="' . $prop_image . '" width="160" height="120" alt="' . $prop_address . '" style="display:block;width:160px;height:120px;object-fit:cover"></td>';
$html .= '<td style="padding:16px 18px;vertical-align:top">';
$html .= '<p style="margin:0 0 4px;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:0.8px;font-weight:600">' . $prop_type . ' in ' . $prop_area . '</p>';
$html .= '<p style="margin:0 0 8px"><a href="#" style="font-size:16px;font-weight:700;color:#0053d4;text-decoration:none">' . $prop_address . '</a></p>';
$html .= '<p style="margin:0 0 10px;font-size:20px;font-weight:700;color:#1a1a1a">' . $prop_price . '</p>';
$html .= '<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px"><tr>';
$html .= '<td style="font-size:13px;color:#444;padding-right:16px">&#x1F6CF; ' . $prop_beds . '</td>';
$html .= '<td style="font-size:13px;color:#444">&#x1F6C1; ' . $prop_baths . '</td></tr></table>';
$html .= '<p style="margin:0;font-size:12px;color:#888888">Listing by <a href="#" style="color:#0053d4;text-decoration:none">Compass (90 5th Avenue, New York, NY 10011-7624)</a></p>';
$html .= '</td></tr></table></td></tr>';

// 5. SECURITY FOOTER
$html .= '<tr><td style="background:#fafafa;padding:20px 32px;border:1px solid #e2e5ea;border-top:none;border-radius:0 0 8px 8px">';
$html .= '<p style="margin:0 0 8px;font-size:12px;color:#666666;line-height:1.6">Keep your StreetEasy account secure by using a strong, unique password, changing your password regularly, and being cautious of suspicious emails, messages, or links. <strong>Never share your password or one-time access code.</strong> Visit <a href="https://streeteasy.com" style="color:#0053d4">Keeping Your StreetEasy Account Secure: Tips for Agents</a> for more information.</p>';
$html .= '<p style="margin:12px 0 0;font-size:11px;color:#aaaaaa">Sent via <strong>StreetEasy-DEMO</strong> &mdash; Powered by <a href="https://dghm.tw" style="color:#0053d4;text-decoration:none">DiGi-HandyMan LTD.</a></p>';
$html .= '</td></tr>';
$html .= '</table></td></tr></table></body></html>';

// ── Plain text ───────────────────────────────────────────────
$plain = $name . ($is_rent ? " Has Requested a Tour for " : " sent you a message about ") . $prop_address . "\n\n";
if ($is_rent) {
    $plain .= "Preferred Tour: " . $tourType_display . "\n";
    $plain .= "Date/Time:      " . $datetime_display . "\n";
}
$plain .= "\n--- Contact ---\n";
$plain .= "Name:   " . $name . "\n";
$plain .= "Email:  " . $email . "\n";
$plain .= "Phone:  " . $phone_display . "\n";
if ($message) { $plain .= "Message: " . $message_display . "\n"; }
$plain .= "\n--- Property ---\n";
$plain .= $prop_address . " | " . $prop_type . " | " . $prop_price . " | " . $prop_beds . " / " . $prop_baths . "\n\n";
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

    // Subject 格式對齊真實 StreetEasy
    $mail->Subject = $prop_address . ' StreetEasy Inquiry From ' . $name;
    $mail->isHTML(true);
    $mail->Body    = $html;
    $mail->AltBody = $plain;

    $mail->send();
    echo json_encode(array('success' => true));

} catch (Exception $e) {
    echo json_encode(array('success' => false, 'error' => $mail->ErrorInfo));
}