#!/bin/bash
set -e

# 1. Bereinige die alte Lockfile im Hauptverzeichnis (wichtig für Next.js Workspace-Erkennung)
cd /var/www/vhosts/jnc.de/sample.jnc.de/httpdocs
if [ -f package-lock.json ]; then
  rm -f package-lock.json
fi

# 2. In das korrekte documents-Verzeichnis wechseln
cd /var/www/vhosts/jnc.de/sample.jnc.de/httpdocs/documents

# 3. Cache und vorherige Fehlversuche löschen
echo "Bereinige vorherige Build-Reste..."
rm -rf .next node_modules package-lock.json

# 4. Umgebung für Installation auf development setzen (damit alle Plugins geladen werden)
export NODE_ENV=development

echo "Führe frische npm-Installation durch..."
npm install

# 5. NEXT.JS 16 PRODUCTION BUILD STARTER
echo "Starte Next.js 16 Produktion-Build..."
export NODE_ENV=production
npm run build

# 6. App mit PM2 oder im Hintergrund starten
if command -v pm2 >/dev/null 2>&1; then
  echo "Starte mit PM2..."
  pm2 startOrRestart ecosystem.config.js --env production || pm2 start npm --name "next-app-documents" -- start
else
  echo "Starte mit nohup..."
  nohup npm start >/dev/null 2>&1 &
fi

echo "Deploy erfolgreich beendet!"
