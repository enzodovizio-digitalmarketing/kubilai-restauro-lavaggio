# Kubilai Tappeti — Landing Restauro & Lavaggio

Landing page moderna dedicata ai servizi di **lavaggio** e **restauro** tappeti, con
form "Richiedi preventivo gratuito" (foto incluse) + telefono + WhatsApp. Logo ufficiale
Zareipour Kubilai e foto reali dello showroom; coerente con i colori del sito kubilaitappeti.it.

## 📁 Struttura
```
Kubilai-Landing/
├── index.html              ← la pagina
├── assets/
│   ├── css/style.css       ← stile (design system: rosso #970000, font Encode Sans + Playfair)
│   ├── js/main.js          ← interazioni (menu, animazioni, galleria, form)
│   └── img/                ← logo ufficiale + foto showroom + immagini servizi
├── api/
│   └── preventivo.php      ← invio email ALTERNATIVO via PHP (opzionale, vedi sotto)
└── LEGGIMI.md
```

## 📧 Email del form (IMPORTANTE)
Il form invia ogni richiesta a **kubilai.tappeti@gmail.com** tramite **FormSubmit.co**
(servizio gratuito, nessuna registrazione). Le foto del tappeto vengono allegate alla mail.

⚠️ **Attivazione (una sola volta):** alla **prima** richiesta inviata, FormSubmit manda
un'email di conferma a kubilai.tappeti@gmail.com con un pulsante **"Activate Form"**.
Va cliccato una volta: da quel momento **tutte** le richieste arrivano in casella.
(Finché non si attiva, le richieste non vengono inoltrate.)

## 👀 Vedere la landing in locale
Apri direttamente `index.html` con doppio clic, oppure avvia un server:
```
cd "Kubilai-Landing"
python3 -m http.server 8080
```
poi vai su http://localhost:8080

> Nota: l'invio del form funziona anche in locale se c'è connessione internet
> (passa da FormSubmit). Per provarlo senza spedire davvero, apri
> `http://localhost:8080/?sent=1` per vedere la schermata di conferma.

## 🚀 Mettere online su Aruba (quando vuoi)
1. Carica la cartella in una sottocartella dell'hosting, es. `/restauro-lavaggio/`
   (via **Pannello Aruba → Gestione File**, oppure via **FTP**).
2. La landing sarà su `https://www.kubilaitappeti.it/restauro-lavaggio/`
3. Il form funziona già così (FormSubmit). **In alternativa**, per non usare servizi
   esterni, puoi far inviare l'email dal tuo hosting: cambia `action` del form in
   `api/preventivo.php` (Aruba supporta PHP e `mail()`; il destinatario è già impostato).
4. (Opzionale) aggiungi il link alla landing nel menu del sito principale.

## ✏️ Come modificare i contenuti
- **Testi:** sono tutti dentro `index.html`, in chiaro (italiano).
- **Colori/font:** in cima a `assets/css/style.css`, sezione `:root` (variabili `--red`, ecc.).
- **Immagini:** sostituisci i file in `assets/img/` mantenendo lo stesso nome.
- **Telefono/email/indirizzo:** cerca `0432471047` / `kubilai.tappeti@gmail.com` in `index.html`.

## 🔧 Note
- Nessun framework, nessuna build: sono file statici, si caricano e basta.
- Le recensioni clienti non sono incluse (per non inventarle): possiamo aggiungere
  le recensioni Google reali quando vuoi.
