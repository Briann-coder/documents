#!/bin/bash
set -e
##!/bin/bash
set -e

# 1. Direkt in das korrekte documents-Verzeichnis wechseln
echo "Wechsle in das documents-Anwendungsverzeichnis..."
cd /var/www/vhosts/jnc.de/sample.jnc.de/httpdocs/documents

# 2. Umgebung auf Production setzen
export NODE_ENV=production

# 3. Abhängigkeiten sauber installieren (behebt die npm-Warnung)
if [ -f package-lock.json ]; then
  echo "package-lock.json gefunden – nutze npm ci..."
  npm ci --omit=dev
else
  echo "Keine package-lock.json gefunden – nutze npm install..."
  npm install --omit=dev
fi

# 4. Next.js App bauen
echo "Starte Next.js Build Prozess..."
npm run build

# 5. App mit PM2 oder im Hintergrund neu starten
if command -v pm2 >/dev/null 2>&1; then
  echo "Starte/Prüfe App mit PM2..."
  pm2 startOrRestart ecosystem.config.js --env production || pm2 start npm --name "next-app-documents" -- start
else
  echo "PM2 nicht gefunden – starte npm start im Hintergrund (nohup)..."
  nohup npm start >/dev/null 2>&1 &
fi

echo "Deploy erfolgreich beendet!"