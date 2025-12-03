#!/bin/bash

echo "🚀 GitHub Push Helper"
echo "===================="
echo ""

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "✅ Git remote 'origin' already configured"
    git remote -v
else
    echo "📝 Please enter your GitHub username:"
    read username
    
    if [ -z "$username" ]; then
        echo "❌ Username cannot be empty"
        exit 1
    fi
    
    echo ""
    echo "Adding remote: https://github.com/$username/rise-yahudim.git"
    git remote add origin "https://github.com/$username/rise-yahudim.git"
    
    echo "✅ Remote added!"
fi

echo ""
echo "📤 Pushing to GitHub..."
echo ""
echo "⚠️  You will be prompted for credentials:"
echo "   Username: Your GitHub username"
echo "   Password: Your Personal Access Token (NOT your password)"
echo ""
echo "   Need a token? Go to:"
echo "   https://github.com/settings/tokens"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Next step: Deploy to Render.com"
    echo "   See API_DEPLOYMENT.md for instructions"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   1. Repository doesn't exist on GitHub yet"
    echo "   2. Wrong credentials (use Personal Access Token)"
    echo "   3. Network connection issues"
    echo ""
    echo "   See GITHUB_SETUP.md for detailed help"
fi
