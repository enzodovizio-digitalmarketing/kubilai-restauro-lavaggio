/* =========================================================================
   KUBILAI TAPPETI — Ponte form → Google Sheet + Email
   Da incollare in: Foglio Google → Estensioni → Apps Script
   Poi: Esegui il deployment → App web → "Chiunque" → copia l'URL /exec
   =========================================================================
   Il foglio collegato ha queste colonne (riga 1 = intestazioni):
   N | Nome | Telefono | Email | Messaggio | data | Contattato | Ha risposto | A cosa è interessato
*/

// === CONFIG =============================================================
var SHEET_ID     = '1uWSYQ1_z0yJB3wg4qIsH1zmBohVFt4DcvvCWszJCaFg';
var NOTIFY_EMAIL = 'kubilai.tappeti@gmail.com'; // destinatario delle richieste
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
      'Nuova richiesta di preventivo dal sito\n' +
      '----------------------------------------\n\n' +
      'Nome:      ' + (p.nome || '-') + '\n' +
      'Telefono:  ' + (p.telefono || '-') + '\n' +
      'Email:     ' + (p.email || '-') + '\n' +
      'Servizio:  ' + (p.servizio || '-') + '\n\n' +
      'Messaggio:\n' + (p.messaggio || '-') + '\n\n' +
      '----------------------------------------\n' +
      'Ricevuto il ' + dataStr + ' · salvato nel foglio contatti.';

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'Nuova richiesta di preventivo dal sito',
      body: body,
      replyTo: (p.email && p.email.indexOf('@') > -1) ? p.email : NOTIFY_EMAIL
    });

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
