<?php
// ================================================
// Wild African Experience — Contact Form Handler
// ================================================

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['success' => false, 'message' => 'Method not allowed']));
}

header('Content-Type: application/json');

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

// Validate required fields
if (empty($firstName) || empty($lastName) || empty($email) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$fullName = $firstName . ' ' . $lastName;
$toEmail  = 'joshua@wildafricanexperience.com';
$date     = date('D, d M Y \a\t H:i T');

// ===== EMAIL TO JOSHUA =====
$subject = "New Safari Inquiry — $fullName";

$body = "
NEW INQUIRY — THE WILD AFRICAN EXPERIENCE
==========================================
Name:        $fullName
Email:       $email
Phone:       $phone
Experience:  " . ($experience ?: '—') . "
Travelers:   " . ($travelers ?: '—') . "
Source:      $source
Submitted:   $date

DETAILS / MESSAGE
-----------------
" . ($details ?: 'No additional details provided.') . "

==========================================
Reply directly to: $email
";

$headers  = "From: joshua@wildafricanexperience.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($toEmail, $subject, $body, $headers, "-f joshua@wildafricanexperience.com");

// ===== AUTO-REPLY TO CLIENT =====
$replySubject = "We have received your inquiry — The Wild African Experience";

$replyBody = "
Dear $firstName,

Thank you for reaching out to The Wild African Experience.

We have received your inquiry and one of our safari specialists will be
in touch within 15-30 minutes during business hours (8 AM - 8 PM EAT).

YOUR INQUIRY SUMMARY
--------------------
Experience:  " . ($experience ?: '—') . "
Travelers:   " . ($travelers ?: '—') . "
Details:     " . ($details ?: '—') . "

For urgent assistance, reach us directly:
  WhatsApp / Phone: +254 720 399 712
  Email:            joshua@wildafricanexperience.com

Warm regards,
Joshua Njeru
The Wild African Experience
Diani Beach, Kenya

www.wildafricanexperience.com
";

$replyHeaders  = "From: joshua@wildafricanexperience.com\r\n";
$replyHeaders .= "Reply-To: joshua@wildafricanexperience.com\r\n";
$replyHeaders .= "MIME-Version: 1.0\r\n";
$replyHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($email, $replySubject, $replyBody, $replyHeaders, "-f joshua@wildafricanexperience.com");

// ===== RESPONSE =====
if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send. Please contact us directly on WhatsApp.']);
}
?>
