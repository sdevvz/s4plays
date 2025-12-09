#!/bin/bash

# Vercel Build Script for Statamic SSG
set -e

echo "🚀 Building for Vercel..."

# 1. Build assets
echo "📦 Building assets..."
npm run build

# 2. Setup environment
echo "⚙️ Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env 2>/dev/null || touch .env
fi

# Use Vercel environment variables
cat > .env << EOF
APP_NAME=AppVault
APP_ENV=production
APP_KEY=${APP_KEY}
APP_DEBUG=false
APP_URL=${VERCEL_URL:-https://appvault.vercel.app}
STATAMIC_LICENSE_KEY=${STATAMIC_LICENSE_KEY}
STATAMIC_STACHE_WATCHER=false
EOF

php artisan key:generate 2>/dev/null || true

# 3. Clear caches
echo "🧹 Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 4. Optimize
echo "⚡ Optimizing..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 5. Generate static site
echo "🎨 Generating static site..."
php please ssg:generate --workers=4

# 6. Verify
echo "✅ Verifying output..."
if [ -d "storage/app/static/build" ]; then
    echo "✅ Build directory exists"
    ls -la storage/app/static/build/ | head -5
else
    echo "⚠️ Copying build directory..."
    mkdir -p storage/app/static/build
    cp -r public/build/* storage/app/static/build/
fi

echo ""
echo "📊 Summary:"
echo "  HTML files: $(find storage/app/static -name '*.html' | wc -l)"
echo "  Total size: $(du -sh storage/app/static | cut -f1)"
echo ""
echo "✅ Build complete!"