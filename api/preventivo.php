<?php
/* =========================================================================
   KUBILAI TAPPETI — Gestione form preventivo (da attivare ONLINE su Aruba)
   Riceve i dati del form, valida, allega le foto e invia una email al negozio.
   In LOCALE questo file non viene eseguito: la landing mostra una conferma demo.

   PRIMA DI ANDARE ONLINE:
   - Imposta $TO con l'indirizzo email dove vuoi ricevere le richieste.
   - Aruba supporta PHP e la funzione mail(): di norma funziona così com'è.
   - (Opzionale) per maggiore affidabilità si può usare SMTP autenticato di Aruba.
   ========================================================================= */

header('Content-Type: application/json; charset=utf-8');

// ---- Configurazione ----
$TO       = 'kubilai.tappeti@gmail.com';          // <-- destinatario richieste
$SUBJECT  = 'Nuova richiesta di preventivo dal sito';
$MAX_FILE = 6 * 1024 * 1024;                       // 6 MB per foto
$MAX_N    = 5;
$ALLOWED  = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Metodo non consentito']);
    exit;
}

// ---- Helper ----
function clean($v) { return trim(filter_var($v ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS)); }

$nome     = clean($_POST['nome']     ?? '');
$telefono = clean($_POST['telefono'] ?? '');
$email    = clean($_POST['email']    ?? '');
$servizio = clean($_POST['servizio'] ?? '');
$dettagli = clean($_POST['dettagli'] ?? '');
$messaggio= clean($_POST['messaggio']?? '');
$privacy  = isset($_POST['privacy']);

// ---- Validazione minima ----
$errors = [];
if ($nome === '')                  $errors[] = 'nome';
if (strlen($telefono) < 5)         $errors[] = 'telefono';
if ($servizio === '')              $errors[] = 'servizio';
if (!$privacy)                     $errors[] = 'privacy';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';

if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Dati non validi', 'fields' => $errors]);
    exit;
}

// ---- Corpo email ----
$body  = "Nuova richiesta di preventivo dal sito\n";
$body .= "----------------------------------------\n\n";
$body .= "Nome:      $nome\n";
$body .= "Telefono:  $telefono\n";
$body .= "Email:     " . ($email ?: '—') . "\n";
$body .= "Servizio:  $servizio\n";
$body .= "Tappeti:   " . ($dettagli ?: '—') . "\n\n";
$body .= "Messaggio:\n" . ($messaggio ?: '—') . "\n\n";
$body .= "----------------------------------------\n";
$body .= "Inviato il " . date('d/m/Y H:i') . " da " . ($_SERVER['HTTP_HOST'] ?? '') . "\n";

// ---- Allegati (foto) ----
$boundary = '==KUBILAI_' . md5(uniqid('', true)) . '==';
$attachments = [];
if (!empty($_FILES['attachment']) && is_array($_FILES['attachment']['name'])) {
    $n = min(count($_FILES['attachment']['name']), $MAX_N);
    for ($i = 0; $i < $n; $i++) {
        if ($_FILES['attachment']['error'][$i] !== UPLOAD_ERR_OK) continue;
        if ($_FILES['attachment']['size'][$i] > $MAX_FILE)        continue;
        $type = mime_content_type($_FILES['attachment']['tmp_name'][$i]);
        if (!in_array($type, $ALLOWED, true))               continue;
        $attachments[] = [
            'name' => preg_replace('/[^\w.\-]/', '_', $_FILES['attachment']['name'][$i]),
            'type' => $type,
            'data' => file_get_contents($_FILES['attachment']['tmp_name'][$i]),
        ];
    }
}

// ---- Headers ----
$fromDomain = $_SERVER['HTTP_HOST'] ?? 'kubilaitappeti.it';
$fromDomain = preg_replace('/^www\./', '', $fromDomain);
$headers  = "From: Sito Kubilai <noreply@$fromDomain>\r\n";
if ($email) $headers .= "Reply-To: $nome <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";

if ($attachments) {
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
    $msg  = "--$boundary\r\n";
    $msg .= "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n";
    $msg .= $body . "\r\n";
    foreach ($attachments as $a) {
        $msg .= "--$boundary\r\n";
        $msg .= "Content-Type: {$a['type']}; name=\"{$a['name']}\"\r\n";
        $msg .= "Content-Transfer-Encoding: base64\r\n";
        $msg .= "Content-Disposition: attachment; filename=\"{$a['name']}\"\r\n\r\n";
        $msg .= chunk_split(base64_encode($a['data'])) . "\r\n";
    }
    $msg .= "--$boundary--";
} else {
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $msg = $body;
}

$sent = @mail($TO, '=?UTF-8?B?' . base64_encode($SUBJECT) . '?=', $msg, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Invio email non riuscito']);
}
