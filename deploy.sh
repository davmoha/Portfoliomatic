#!/bin/bash
# =============================================================================
# Mo-Blind Portfoliomatic - Fast VPS Deploy Script
# Pulls latest code from GitHub, installs dependencies, builds, & reloads PM2
# =============================================================================

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting Mo-Blind Portfoliomatic VPS Deployment..."

# 1. Pull latest code from GitHub
echo "📦 Pulling latest commits from GitHub (branch: main)..."
git pull origin main

# 2. Install production dependencies
echo "⚙️  Installing dependencies..."
npm install --legacy-peer-deps

# 3. Build frontend bundle for production
echo "🔨 Compiling frontend production bundle..."
npm run build

# 4. Restart or start server via PM2
echo "🔄 Reloading Node.js process via PM2..."
if pm2 describe auto-portfolio > /dev/null 2>&1; then
    pm2 reload auto-portfolio --update-env
elif pm2 describe portfoliomatic > /dev/null 2>&1; then
    pm2 reload portfoliomatic --update-env
else
    pm2 start server.ts --name "auto-portfolio" --interpreter ./node_modules/.bin/tsx --time
    pm2 save
fi

echo "✅ Deployment completed successfully! Your VPS is running the latest build."
