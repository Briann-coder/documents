#!/bin/bash
set -e
# Plesk runs this script in the repository root after pulling changes.
# Adjust paths if your app is in a subfolder.

echo "Running Plesk deploy script in $(pwd)"
export NODE_ENV=production

# Install dependencies
if [ -f package-lock.json ]; then
  npm ci --production
else
  npm install --production
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
