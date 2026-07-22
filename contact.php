<?php
// ================================================
// Wild African Experience — Contact Form Handler
// ================================================

// Enable error logging
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Log helper
function log_event($msg) {
    $file = __DIR__ . '/mail_log.txt';
    $time = date('Y-m-d H:i:s');
    @file_put_contents($file, "[$time] $msg\n", FILE_APPEND);
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    log_event("REJECTED: Method was " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    die(json_encode(['success' => false, 'message' => 'Method not allowed']));
}

// Sanitize helper
function clean($val) {
    return htmlspecialchars(strip_tags(trim($val ?? '')), ENT_QUOTES, 'UTF-8');
}

// Read fields
$firstName  = clean($_POST['firstName'] ?? '');
$lastName   = clean($_POST['lastName'] ?? '');
$email      = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone      = clean($_POST['phone'] ?? '');
$experience = clean($_POST['experience'] ?? '');
$travelers  = clean($_POST['travelers'] ?? '');
$details    = clean($_POST['details'] ?? '');
$source     = clean($_POST['source'] ?? 'Website');

log_event("INQUIRY RECEIVED: $firstName $lastName <$email> ($phone)");

// Validate required fields
if (empty($firstName) || empty($lastName) || empty($email) || empty($phone)) {
    log_event("VALIDATION FAILED: missing required fields");
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    log_event("VALIDATION FAILED: invalid email $email");
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$fullName = $firstName . ' ' . $lastName;
$toEmail  = 'joshua@wildafricanexperience.com';
$date     = date('D, d M Y \a\t H:i T');

// ===== EMAIL TO JOSHUA =====
$subject = "New Safari Inquiry — $fullName";

$body = "NEW INQUIRY — THE WILD AFRICAN EXPERIENCE\n"
      . "==========================================\n"
      . "Name:        $fullName\n"
      . "Email:       $email\n"
      . "Phone:       $phone\n"
      . "Experience:  " . ($experience ?: '—') . "\n"
      . "Travelers:   " . ($travelers ?: '—') . "\n"
      . "Source:      $source\n"
      . "Submitted:   $date\n\n"
      . "DETAILS / MESSAGE\n"
      . "-----------------\n"
      . ($details ?: 'No additional details provided.') . "\n\n"
      . "==========================================\n"
      . "Reply directly to: $email\n";

$headers  = "From: joshua@wildafricanexperience.com\n";
$headers .= "Reply-To: $email\n";
$headers .= "MIME-Version: 1.0\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\n";

$sent = @mail($toEmail, $subject, $body, $headers, "-f joshua@wildafricanexperience.com");

log_event("MAIL DISPATCH TO JOSHUA RESULT: " . ($sent ? "SUCCESS" : "FAILED"));

// ===== AUTO-REPLY TO CLIENT =====
$replySubject = "We have received your inquiry — The Wild African Experience";

$replyBody = "Dear $firstName,\n\n"
           . "Thank you for reaching out to The Wild African Experience.\n\n"
           . "We have received your inquiry and one of our safari specialists will be\n"
           . "in touch within 15-30 minutes during business hours (8 AM - 8 PM EAT).\n\n"
           . "YOUR INQUIRY SUMMARY\n"
           . "--------------------\n"
           . "Experience:  " . ($experience ?: '—') . "\n"
           . "Travelers:   " . ($travelers ?: '—') . "\n"
           . "Details:     " . ($details ?: '—') . "\n\n"
           . "For urgent assistance, reach us directly:\n"
           . "  WhatsApp / Phone: +254 720 399 712\n"
           . "  Email:            joshua@wildafricanexperience.com\n\n"
           . "Warm regards,\n"
           . "Joshua Njeru\n"
           . "The Wild African Experience\n"
           . "Diani Beach, Kenya\n\n"
           . "www.wildafricanexperience.com\n";

$replyHeaders  = "From: joshua@wildafricanexperience.com\n";
$replyHeaders .= "Reply-To: joshua@wildafricanexperience.com\n";
$replyHeaders .= "MIME-Version: 1.0\n";
$replyHeaders .= "Content-Type: text/plain; charset=UTF-8\n";

@mail($email, $replySubject, $replyBody, $replyHeaders, "-f joshua@wildafricanexperience.com");

// ===== RESPONSE =====
if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send via server mailer. Please contact us via WhatsApp.']);
}
?>
