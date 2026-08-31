# Container für Upload-App (Host Europe / Docker)

Kurz: dieses Verzeichnis enthält eine Dockerfile und ein `docker-compose.yml`, um die `documents` App (Upload APIs) in einem Container zu betreiben.

Wichtig:
- Upload-Verzeichnis wird im Container unter `/data/upload-storage` erwartet.
- Auf dem Host legst du ein Verzeichnis `upload-storage` im selben Ordner wie `docker-compose.yml` an oder passe das Volume in `docker-compose.yml` an.

Build & Run (lokal):

```bash
cd documents
docker compose build
docker compose up -d
```

Logs:

```bash
docker compose logs -f
```

Wichtig: Setze ggf. Umgebungsvariablen (z. B. `UPLOAD_BASE_DIR`) in `docker-compose.yml` falls du einen anderen Pfad willst.

Plesk / Host Europe:
- Host Europe unterstützt Docker-Container; lade das Image zu deiner Registry (oder baue direkt auf dem Server) und starte es dort. Stelle sicher, dass das `upload-storage` Verzeichnis persistent gemountet ist.
