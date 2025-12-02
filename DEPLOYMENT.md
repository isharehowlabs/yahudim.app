# Deployment Guide

This guide explains how to deploy the Children's Church application with the backend API.

## Architecture

- **Frontend**: React + Vite (served as static files)
- **Backend**: Node.js Express API (running on port 3001)
- **Database**: JSON file-based storage

## Backend Setup

1. Navigate to the API directory:
   ```bash
   cd /home/ishaglcy/public_html/yeladim.church/api
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file:
   ```env
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://yeladim.church
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
   pm2 start server.js --name yeladim-api
   pm2 save
   pm2 startup
   ```

## Frontend Build & Deployment

1. Navigate to the project root:
   ```bash
   cd /home/ishaglcy/public_html/yeladim.church
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
    ServerName yeladim.church
    DocumentRoot /home/ishaglcy/public_html/yeladim.church/dist

    # Proxy API requests to backend
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
    
    ProxyPass /health http://localhost:3001/health
    ProxyPassReverse /health http://localhost:3001/health

    # Serve React app for all other routes
    <Directory /home/ishaglcy/public_html/yeladim.church/dist>
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
    server_name yeladim.church;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /home/ishaglcy/public_html/yeladim.church/dist;
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
   https://yeladim.church
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
