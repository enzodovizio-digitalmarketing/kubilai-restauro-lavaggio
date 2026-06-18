/* =========================================================================
   KUBILAI TAPPETI — Ponte form → Google Sheet + Email
   Da incollare in: Foglio Google → Estensioni → Apps Script
   Poi: Esegui il deployment → App web → "Chiunque" → copia l'URL /exec
   =========================================================================
   ⚠️ IMPORTANTE — IL MITTENTE = IL PROPRIETARIO DELLO SCRIPT
   MailApp.sendEmail() spedisce SEMPRE dall'account Google che possiede
   questo script (non dall'indirizzo nel codice). Perché la mail PARTA da
   kubilai, questo script + il Foglio devono stare nell'account
   kubilai.tappeti@gmail.com (creato/autorizzato con quel login).
   Se lo crei con un altro account, la mail partirà da quell'account.
   =========================================================================
   Il foglio collegato ha queste colonne (riga 1 = intestazioni):
   N | Nome | Telefono | Email | Messaggio | data | Contattato | Ha risposto | A cosa è interessato
*/

// === CONFIG =============================================================
var SHEET_ID     = '1uWSYQ1_z0yJB3wg4qIsH1zmBohVFt4DcvvCWszJCaFg';
var NOTIFY_EMAIL = 'kubilai.tappeti@gmail.com';          // destinatario (TO) — il cliente
var CC_EMAIL     = 'enzo.dovizio@safemarketing.it';      // copia per monitoraggio (CC) — '' per disattivarla
// ========================================================================

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // anti-spam (honeypot): se compilato, ignora
    if (p._honey) {
      return _json({ ok: true, skipped: true });
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheets()[0];

    var now = new Date();
    var dataStr = Utilities.formatDate(now, ss.getSpreadsheetTimeZone() || 'Europe/Rome', 'dd/MM/yyyy HH:mm');
    var progressivo = Math.max(sh.getLastRow() - 1, 0) + 1; // N progressivo (riga 1 = intestazioni)

    // ordine colonne: N | Nome | Telefono | Email | Messaggio | data | Contattato | Ha risposto | A cosa è interessato
    sh.appendRow([
      progressivo,
      p.nome || '',
      p.telefono || '',
      p.email || '',
      p.messaggio || '',
      dataStr,
      false,
      false,
      p.servizio || ''
    ]);

    // email di notifica
    var body =
      'Nuovo contatto dalla Landing Lavaggio/Restauro\n' +
      '----------------------------------------\n\n' +
      'Nome:      ' + (p.nome || '-') + '\n' +
      'Telefono:  ' + (p.telefono || '-') + '\n' +
      'Email:     ' + (p.email || '-') + '\n' +
      'Servizio:  ' + (p.servizio || '-') + '\n\n' +
      'Messaggio:\n' + (p.messaggio || '-') + '\n\n' +
      '----------------------------------------\n' +
      'Ricevuto il ' + dataStr + ' · salvato nel foglio contatti.';

    var opts = {
      to: NOTIFY_EMAIL,
      subject: 'Nuovo Contatto Landing Lavaggio/Restauro',
      body: body,
      name: 'Sito Kubilai Tappeti', // nome mostrato come mittente
      replyTo: (p.email && p.email.indexOf('@') > -1) ? p.email : NOTIFY_EMAIL
    };
    if (CC_EMAIL) opts.cc = CC_EMAIL; // copia per monitoraggio
    MailApp.sendEmail(opts);

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput('OK');
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
