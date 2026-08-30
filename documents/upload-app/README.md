# Upload App

Kleine Express-App zum Hochladen von Dateien in einen konfigurierbaren Basisordner, Download-Endpoint und QR-Code-Generator für den Download-Link.

Installation:

```bash
cd documents/upload-app
npm install
```

Starten:

```bash
# optional: UPLOAD_BASE_DIR=/absoluter/pfad node server.js
npm start
```

Standardmäßig speichert die App unter `documents/upload-app/storage`.

Endpunkte:
- GET `/` – einfache Upload-Seite
- POST `/upload` – form-data: `file`, optional `subpath` (Unterordner)
- GET `/download?path=<rel-path>` – lädt die Datei herunter
- GET `/qrcode?path=<rel-path>` – gibt einen PNG-QR-Code mit dem Download-URL zurück
