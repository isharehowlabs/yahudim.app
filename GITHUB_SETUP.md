# GitHub Setup Guide

Your git repository is initialized and ready to push! Follow these steps to get it on GitHub and deploy to Render.com.

## Step 1: Create GitHub Repository

1. Go to [https://github.com](https://github.com)
2. Sign in (or create an account if you don't have one)
3. Click the "+" icon in the top right
4. Select "New repository"
5. Fill in the details:
   - **Repository name**: `rise-yahudim`
   - **Description**: "Rise Yahudim streaming app with interactive features"
   - **Visibility**: Choose Public or Private (your choice)
   - **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /home/ishaglcy/public_html/yahudim.app

# Add the GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/rise-yahudim.git

# Push your code
git push -u origin main
```

**Note**: You may be prompted for your GitHub credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your account password)

### Creating a Personal Access Token

If you need to create a token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Rise Yahudim Deploy"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. Use this token as your password when pushing

## Step 3: Verify Upload

After pushing, refresh your GitHub repository page. You should see:
- All your source code
- README.md displayed
- 34 files in the repository

## Step 4: Deploy Backend to Render.com

Now that your code is on GitHub:

1. Go to [https://render.com](https://render.com)
2. Sign up/login (can use GitHub account)
3. Click "New +" → "Web Service"
4. Click "Connect account" to link GitHub
5. Find and select your `rise-yahudim` repository
6. Configure the service:
   - **Name**: `rise-yahudim-api`
   - **Root Directory**: `api`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

7. Add environment variables:
   - Click "Advanced" → "Add Environment Variable"
   - Add these variables:
     - `NODE_ENV` = `production`
     - `CORS_ORIGIN` = `https://yahudim.app`

8. Click "Create Web Service"

## Step 5: Wait for Deployment

Render will:
1. Clone your repository
2. Install dependencies
3. Start the server
4. Give you a URL like: `https://rise-yahudim-api.onrender.com`

This takes 2-5 minutes. Watch the logs in the Render dashboard.

## Step 6: Test Your API

Once deployed, test it:

```bash
# Health check
curl https://your-api-url.onrender.com/health

# Should return: {"status":"ok","message":"Rise Yahudim API is running"}
```

## Step 7: Update Frontend (Next)

Once your API is deployed, we'll need to:
1. Update the React components to use the API instead of localStorage
2. Add API URL configuration
3. Rebuild and redeploy the frontend

I can help you with this after the API is deployed!

## Troubleshooting

### Authentication Failed
- Make sure you're using a Personal Access Token, not your password
- Token needs `repo` scope

### Repository Already Exists
- Use a different name or delete the existing repository

### Push Rejected
- Make sure you created an empty repository (no README)
- If not, pull first: `git pull origin main --allow-unrelated-histories`

## Current Status

✅ Git repository initialized  
✅ Initial commit created (34 files)  
✅ Ready to push to GitHub  
⏳ Waiting for you to create GitHub repository  
⏳ Then deploy to Render.com  
⏳ Then update frontend to use API  

## Next Steps Summary

1. Create GitHub repository (5 minutes)
2. Push code with commands above (1 minute)
3. Deploy to Render.com (5 minutes)
4. Test API (1 minute)
5. Update frontend components (I'll help)

Let me know when you've pushed to GitHub and I'll help with the next steps!
