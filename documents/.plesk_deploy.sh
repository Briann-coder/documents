#!/bin/bash
set -e
# Plesk runs this script in the repository root after pulling changes.
# Adjust paths if your app is in a subfolder.

# Move into `documents` subfolder if present (useful when repo root holds multiple projects)
if [ -d documents ]; then
  echo "Found 'documents' subfolder — switching into documents/"
  cd documents
else
  echo "No documents subfolder found — running in repository root: $(pwd)"
fi

export NODE_ENV=production

# Install dependencies: prefer `npm ci` when lockfile exists in current folder, otherwise `npm install`.
# Use `--omit=dev` for production installs.
if [ -f package-lock.json ]; then
  npm ci --omit=dev
else
  npm install --omit=dev
fi

# Build Next app
npm run build

# Start / restart with pm2 if available
if command -v pm2 >/dev/null 2>&1; then
  echo "Restarting with pm2..."
  pm2 startOrRestart ecosystem.config.js --env production || pm2 start npm --name documents -- start
else
  echo "pm2 not found — starting npm start in background"
  nohup npm start >/dev/null 2>&1 &
fi

echo "Deploy finished"
