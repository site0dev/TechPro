<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . (getenv('TECHPRO_ALLOWED_ORIGIN') ?: '*'));
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'Méthode non autorisée']); exit; }
require __DIR__ . '/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
try {
  $input=json_decode(file_get_contents('php://input'),true,512,JSON_THROW_ON_ERROR);
  $to=filter_var($input['to'] ?? '', FILTER_VALIDATE_EMAIL);
  $subject=trim((string)($input['subject'] ?? ''));
  $body=trim((string)($input['message'] ?? ''));
  if (!$to || $subject==='' || $body==='') throw new RuntimeException('Destinataire, sujet et message sont requis.');
  if (strlen($subject)>200 || strlen($body)>30000) throw new RuntimeException('Message trop long.');
  $mail=new PHPMailer(true);
  $mail->isSMTP(); $mail->Host=getenv('SMTP_HOST') ?: 'mail.phenixconnect.online';
  $mail->SMTPAuth=true; $mail->Username=getenv('SMTP_USER') ?: 'contact@phenixconnect.online';
  $mail->Password=getenv('SMTP_PASSWORD') ?: '';
  $mail->Port=(int)(getenv('SMTP_PORT') ?: 587);
  $mail->SMTPSecure=PHPMailer::ENCRYPTION_STARTTLS;
  $mail->CharSet='UTF-8'; $mail->setFrom('contact@phenixconnect.online','TechPro');
  $mail->addAddress($to); $mail->Subject=$subject; $mail->Body=$body; $mail->isHTML(false);
  if (!$mail->send()) throw new RuntimeException('Échec SMTP.');
  echo json_encode(['ok'=>true]);
} catch (Throwable $e) {
  http_response_code(400);
  error_log('TechPro mail: '.$e->getMessage());
  echo json_encode(['error'=>'Envoi impossible. Vérifiez la configuration SMTP côté serveur.']);
}
