# Zareipour Kubilai Tappeti — Landing Restauro & Lavaggio

Landing page moderna dedicata ai servizi di **lavaggio** e **restauro** tappeti, con
form "Richiedi preventivo gratuito" + telefono + WhatsApp. Logo ufficiale Zareipour
Kubilai e foto reali dello showroom; coerente con i colori del sito kubilaitappeti.it.

## 🌐 Online (GitHub Pages)
**https://enzodovizio-digitalmarketing.github.io/kubilai-restauro-lavaggio/**
Repo GitHub: `enzodovizio-digitalmarketing/kubilai-restauro-lavaggio` (branch `main`).

## 📁 Struttura
```
Kubilai-Landing/
├── index.html              ← la pagina
├── assets/
│   ├── css/style.css       ← stile (design system: rosso #970000, font Encode Sans + Playfair)
│   ├── js/main.js          ← interazioni (menu, animazioni, galleria, form)
│   └── img/                ← logo ufficiale + foto showroom + immagini servizi
├── google-apps-script.gs   ← codice del "ponte" form → Foglio Google + email
└── LEGGIMI.md
```

## 📧 Form → Foglio Google + Email
Ogni invio del form passa da un **Google Apps Script** (collegato al Foglio contatti) che:
1. **aggiunge una riga** nel Foglio Google (colonne N · Nome · Telefono · Email · Messaggio · data · Contattato · Ha risposto · A cosa è interessato),
2. **invia un'email** di notifica.

- Foglio: `1uWSYQ1_z0yJB3wg4qIsH1zmBohVFt4DcvvCWszJCaFg`
- Codice dello script: `google-apps-script.gs` (incollato in *Foglio → Estensioni → Apps Script*, pubblicato come **App web → Chiunque**).
- L'URL dell'app web (`/exec`) è impostato come `action` del form in `index.html`.

### Per cambiare il destinatario dell'email / il foglio
Apri lo script (Foglio → Estensioni → Apps Script), modifica le due righe in alto:
```javascript
var SHEET_ID     = '...';                       // ID del foglio
var NOTIFY_EMAIL = 'kubilai.tappeti@gmail.com'; // destinatario delle richieste
```
poi **Esegui il deployment → Gestisci deployment → (matita) → Esegui di nuovo** (l'URL resta lo stesso).

> Destinatario richieste: **kubilai.tappeti@gmail.com**.

## 👀 Vedere la landing in locale
Apri `index.html` con doppio clic, oppure:
```
cd "Kubilai-Landing"
python3 -m http.server 8080   # poi http://localhost:8080
```

## 🔄 Aggiornare il sito online
```
cd "Kubilai-Landing"
git add -A && git commit -m "aggiornamento" && git push
```
GitHub Pages ripubblica in 1–2 minuti.

## ✏️ Modificare i contenuti
- **Testi:** dentro `index.html`, in chiaro (italiano).
- **Colori/font:** in cima a `assets/css/style.css`, sezione `:root` (variabili `--red`, ecc.).
- **Immagini:** sostituisci i file in `assets/img/` mantenendo lo stesso nome.
- **Telefono/indirizzo:** cerca `0432471047` / `Tricesimo` in `index.html`.

## 🔧 Note
- Nessun framework, nessuna build: file statici.
- Le recensioni clienti non sono incluse (per non inventarle): si possono aggiungere le recensioni Google reali.
- (Alternativa futura) la pagina può essere spostata su Aruba in `/restauro-lavaggio/`.
