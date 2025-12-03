# Deployment Guide

**Important:** Always run build and deploy commands from the project root directory:

```sh
cd /home/ishaglcy/public_html/yahudim.app
```

To build the frontend, use:

```sh
npm run build
```

To deploy, use:

```sh
npm run deploy
```

If deploying on a platform (e.g., Render), set the working directory to `/home/ishaglcy/public_html/yahudim.app` and the build command to `npm run build`.

Your `index.html` must be present in the project root for Vite to build successfully.

This guide explains how to deploy the Rise Yahudim application with the backend API.

## Architecture

- **Frontend**: React + Vite (served as static files)
- **Backend**: Node.js Express API (running on port 3001)
- **Database**: JSON file-based storage

## Backend Setup

1. Navigate to the API directory:
   ```bash
   cd /home/ishaglcy/public_html/yahudim.app/api
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file:
   ```env
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://yahudim.app
   ```

4. Install dependencies (if not already done):
   ```bash
   npm install
   ```

5. Start the backend server:
   ```bash
   node server.js
   ```

   Or use a process manager like PM2 for production:
   ```bash
   pm2 start server.js --name rise-yahudim-api
   pm2 save
   pm2 startup
   ```

## Frontend Build & Deployment

1. Navigate to the project root:
   ```bash
   cd /home/ishaglcy/public_html/yahudim.app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. The production files will be in the `dist` directory. Deploy these to your web server.

## Web Server Configuration

### For Apache (if using):

Add to your virtual host configuration:

```apache
<VirtualHost *:443>
    ServerName yahudim.app
    DocumentRoot /home/ishaglcy/public_html/yahudim.app/dist

    # Proxy API requests to backend
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
    
    ProxyPass /health http://localhost:3001/health
    ProxyPassReverse /health http://localhost:3001/health

    # Serve React app for all other routes
    <Directory /home/ishaglcy/public_html/yahudim.app/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # React Router support
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>
```

### For Nginx (if using):

```nginx
server {
    listen 443 ssl http2;
    server_name yahudim.app;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /home/ishaglcy/public_html/yahudim.app/dist;
    index index.html;

    # API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        proxy_pass http://localhost:3001;
    }

    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Verification

1. Check backend health:
   ```bash
   curl http://localhost:3001/health
   ```

2. Test API endpoints:
   ```bash
   curl http://localhost:3001/api/quiz/questions
   curl http://localhost:3001/api/notes
   ```

3. Visit the site:
   ```
   https://yahudim.app
   ```

## Development Mode

To run in development mode:

1. Start the backend:
   ```bash
   cd api
   node server.js
   ```

2. Start the frontend (in a new terminal):
   ```bash
   npm run dev
   ```

The Vite dev server will proxy API requests to the backend automatically.
