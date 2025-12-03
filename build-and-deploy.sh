#!/bin/bash

# Always run from the script's directory (project root)
cd "$(dirname "$0")"

# Build and Deploy Script
# Clears old build files, builds new ones, deploys to server, then handles git operations

set -e  # Exit on error

echo "🚀 Build and Deploy Script"
echo "=========================="
echo ""

# Step 1: Clear old build cache
echo "🧹 Clearing build cache..."
rm -rf dist
rm -rf node_modules/.vite
echo "✅ Build cache cleared"
echo ""

# Step 2: Clear old deployed files in assets directory
echo "🧹 Clearing old deployed assets..."
rm -f assets/*.js assets/*.css 2>/dev/null
echo "✅ Old deployed assets cleared"
echo ""

# Step 3: Build new files
echo "🔨 Building new files..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Aborting deployment."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 4: Deploy to web server
echo "📦 Deploying to web server..."
cp -r dist/assets/* assets/ 2>/dev/null
cp dist/index.html . 2>/dev/null

# Fix ownership and permissions
echo "🔒 Setting permissions..."
chown -R ishaglcy:ishaglcy index.html assets .htaccess 2>/dev/null
chmod 644 index.html .htaccess 2>/dev/null
chmod 755 assets 2>/dev/null
chmod 644 assets/* 2>/dev/null

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is now live at: https://yahudim.app"
echo ""
echo "Backend API status:"
curl -s http://localhost:3001/health
echo ""

# Step 5: Git operations
echo "📝 Git operations..."
echo ""

# Check if there are changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️  No changes to commit"
else
    echo "📋 Staging changes..."
    git add .
    
    echo ""
    echo "💬 Enter commit message (or press Enter for default):"
    read -r commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Build and deploy: $(date +'%Y-%m-%d %H:%M:%S')"
    fi
    
    echo ""
    echo "📝 Committing changes..."
    git commit -m "$commit_message"
    
    if [ $? -ne 0 ]; then
        echo "❌ Commit failed. Aborting."
        exit 1
    fi
    
    echo "✅ Changes committed"
    echo ""
fi

# Step 6: Push to remote
echo "📤 Pushing to remote..."
if git remote | grep -q "origin"; then
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to remote"
    else
        echo "⚠️  Push failed or no changes to push"
    fi
else
    echo "ℹ️  No remote 'origin' configured. Skipping push."
    echo "   Run ./push-to-github.sh to set up remote"
fi

echo ""
echo "🎉 Build and deploy process complete!"
echo ""
echo "📁 Deployed files:"
echo "   - index.html (root)"
echo "   - assets/ ($(ls -1 assets/*.js assets/*.css 2>/dev/null | wc -l) files)"
