# Troubleshooting Guide

## Issue: "Failed to load module script" Error

### Problem
When accessing the site, you see an error like:
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of ""
```

### Root Cause
- You're accessing the site through Apache (https://yahudim.app) but haven't deployed the production build
- OR the JavaScript files don't have proper MIME type configuration

### Solution

1. **Deploy the production build** (if not done):
   ```bash
   cd /home/ishaglcy/public_html/yahudim.app
   ./deploy.sh
   ```

2. **Verify .htaccess is in place**:
   ```bash
   ls -la /home/ishaglcy/public_html/yahudim.app/.htaccess
   ```

3. **Check file permissions**:
   ```bash
   ls -la /home/ishaglcy/public_html/yahudim.app/index.html
   ls -la /home/ishaglcy/public_html/yahudim.app/assets/
   ```
   
   Files should be owned by `ishaglcy:ishaglcy` with:
   - `index.html`: 644 permissions
   - `assets/`: 755 permissions
   - `assets/*.js`: 644 permissions

4. **Fix permissions if needed**:
   ```bash
   cd /home/ishaglcy/public_html/yahudim.app
   chown -R ishaglcy:ishaglcy index.html assets .htaccess vite.svg
   chmod 644 index.html .htaccess vite.svg
   chmod 755 assets
   chmod 644 assets/*
   ```

5. **Clear browser cache** and reload

---

## Development vs Production

### For Development (Local Testing)
```bash
npm run dev
# Access at: http://localhost:5173
```

### For Production (Live Site)
```bash
./deploy.sh
# Access at: https://yahudim.app
```

**Important**: Don't access the live site URL while running `npm run dev` - they serve different things!

---

## Other Common Issues

### Port 5173 Already in Use
```bash
# Find and kill the process
lsof -ti:5173 | xargs kill -9
```

### Build Fails
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Assets Not Loading (404 errors)
```bash
# Verify files exist
ls -la /home/ishaglcy/public_html/yahudim.app/assets/

# Redeploy
./deploy.sh
```

### .htaccess Not Working
Ensure mod_rewrite is enabled on Apache:
```bash
a2enmod rewrite
systemctl restart httpd
# OR on some systems:
systemctl restart apache2
```

---

## Verification Commands

### Check if site is accessible:
```bash
curl -I https://yahudim.app/
```

### Check JavaScript MIME type:
```bash
curl -I https://yahudim.app/assets/index-*.js | grep Content-Type
```

Should return: `Content-Type: application/javascript`

### Check deployment structure:
```bash
ls -la /home/ishaglcy/public_html/yahudim.app/ | grep -E '(index|assets|htaccess)'
```

---

## Quick Redeploy

If anything goes wrong, you can always redeploy:
```bash
cd /home/ishaglcy/public_html/yahudim.app
./deploy.sh
```

This will:
1. Rebuild the app
2. Copy files to web root
3. Fix permissions automatically
