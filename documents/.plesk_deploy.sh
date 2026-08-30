#!/bin/bash
set -e

# In das richtige Verzeichnis wechseln
cd /var/www/vhosts/jnc.de/sample.jnc.de/httpdocs/documents

# Verwaiste Lockfiles im Oberordner löschen
rm -f ../package-lock.json

# Cache bereinigen
rm -rf .next node_modules package-lock.json

# Im Entwicklungsmodus installieren (Sicherheitsnetz für CSS)
export NODE_ENV=development
npm install
npm install --save @tailwindcss/postcss postcss tailwindcss

# Next.js 16 Produktion-Build starten
export NODE_ENV=production
npm run build

# Start/Restart der App
if command -v pm2 >/dev/null 2>&1; then
  pm2 startOrRestart ecosystem.config.js --env production || pm2 start npm --name "next-app-documents" -- start
else
  pkill -f "next-start" || true
  nohup npm start >/dev/null 2>&1 &
fi

echo "--- DEPLOYMENT ERFOLGREICH ---"
