# API Deployment Guide

The Rise Yahudim app now has a backend API that you can deploy to Render.com.

## What the API Does

- Stores quiz questions (accessible from all devices)
- Tracks the current active question for students
- Stores scripture lesson notes
- Synchronizes data across multiple browsers/devices

## Deploying to Render.com

### Step 1: Prepare Your Repository

1. Initialize git (if not already done):
```bash
cd /home/ishaglcy/public_html/yahudim.app
git init
git add .
git commit -m "Initial commit with API"
```

2. Push to GitHub:
```bash
# Create a repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/rise-yahudim.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render.com

1. Go to [https://render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub account and select your repository
4. Configure the service:
   - **Name**: rise-yahudim-api
   - **Root Directory**: api
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Plan**: Free

5. Add environment variables:
   - `NODE_ENV`: production
   - `CORS_ORIGIN`: https://yahudim.app

6. Click "Create Web Service"

### Step 3: Get Your API URL

Once deployed, Render will give you a URL like:
```
https://rise-yahudim-api.onrender.com
```

### Step 4: Update Frontend

Update the frontend to use your API. Create an `.env` file in the root:

```bash
VITE_API_URL=https://rise-yahudim-api.onrender.com
```

Then rebuild and redeploy your frontend:
```bash
npm run build
./deploy.sh
```

## Local Development with API

1. Start the API:
```bash
cd api
npm run dev
```

2. Start the frontend (in another terminal):
```bash
npm run dev
```

3. The frontend will be at `http://localhost:5173`
4. The API will be at `http://localhost:3001`

## Testing the API

Test with curl:
```bash
# Health check
curl https://your-api-url.onrender.com/health

# Get all questions
curl https://your-api-url.onrender.com/api/quiz/questions

# Get all notes
curl https://your-api-url.onrender.com/api/notes
```

## Important Notes

### Free Tier Limitations

Render.com's free tier has these limitations:
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- Storage is ephemeral (data lost on service restart)

### Persistent Storage Solutions

For production use, consider:

1. **Render Persistent Disk** (Paid plan - $7/month)
   - Adds persistent storage to your service
   - Data survives restarts

2. **External Database** (Free options available)
   - MongoDB Atlas (Free tier: 512MB)
   - Supabase PostgreSQL (Free tier: 500MB)
   - Update `database.js` to use the database

3. **Upgrade to Paid Plan** ($7/month)
   - No sleep time
   - Persistent disk included
   - Better performance

## Troubleshooting

### API Not Responding
- Check Render.com dashboard for errors
- View logs in Render dashboard
- Ensure environment variables are set correctly

### CORS Errors
- Make sure `CORS_ORIGIN` includes your frontend URL
- Check that the frontend is using the correct API URL

### Data Lost After Restart
- This is expected on free tier
- Upgrade to paid plan or use external database
- For testing, data loss is acceptable

## Next Steps

After deploying to Render:
1. Test all API endpoints
2. Update frontend with API URL
3. Test quiz and notes features
4. Consider upgrading for persistent storage if needed
