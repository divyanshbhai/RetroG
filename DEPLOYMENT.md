# Deployment Guide

## GitHub Pages Deployment

### Step 1: Create Repository

```bash
git init
git add .
git commit -m "Initial commit: Retro gaming console"
git branch -M main
git remote add origin https://github.com/username/retro-console.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to repository on GitHub
2. Click **Settings**
3. Scroll to **Pages** section
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for deployment

### Step 3: Access Your Site

Your site will be available at:
```
https://username.github.io/retro-console/
```

### Step 4: Add ROM Files

1. Add ROM files to appropriate folders:
   - `roms/nes/` for NES games
   - `roms/snes/` for SNES games
   - `roms/gba/` for GBA games
   - etc.

2. Update `games.json` with game metadata

3. Commit and push:
```bash
git add roms/ games.json
git commit -m "Add game ROMs"
git push
```

### Step 5: Test

1. Open site on TV/desktop browser
2. Select a game
3. Scan QR code with mobile phone
4. Test controller inputs

## Alternative Hosting Options

### Netlify

1. Create account at netlify.com
2. Drag and drop project folder
3. Site deployed instantly
4. Custom domain available

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Site deployed

### Cloudflare Pages

1. Create account at pages.cloudflare.com
2. Connect GitHub repository
3. Configure build settings (none needed)
4. Deploy

## Custom Domain Setup

### GitHub Pages

1. Add `CNAME` file with your domain:
```
retro.yourdomain.com
```

2. Configure DNS:
```
Type: CNAME
Name: retro
Value: username.github.io
```

3. Enable HTTPS in GitHub Pages settings

## Troubleshooting

**404 errors:**
- Check file paths are relative
- Ensure index.html is in root
- Wait for deployment to complete

**Assets not loading:**
- Check CORS settings
- Verify file paths
- Check browser console

**WebRTC not working:**
- Ensure HTTPS is enabled
- Check browser permissions
- Verify network connectivity

## Performance Optimization

### Enable Compression

Add `.htaccess` for Apache:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>
```

### Cache Control

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### CDN Integration

Use jsDelivr for libraries:
```html
<script src="https://cdn.jsdelivr.net/npm/emulatorjs@latest/data/loader.js"></script>
```

## Security Best Practices

1. **HTTPS Only**: Always use HTTPS
2. **Content Security Policy**: Add CSP headers
3. **ROM Licensing**: Only include legally owned ROMs
4. **Rate Limiting**: Implement connection limits
5. **Input Validation**: Sanitize all inputs

## Monitoring

### Analytics

Add Google Analytics:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

Add Sentry:
```html
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'YOUR_DSN' });
</script>
```

## Maintenance

### Update EmulatorJS

Check for updates:
```
https://github.com/EmulatorJS/EmulatorJS
```

### Update Dependencies

Update CDN links in HTML files to latest versions

### Backup

Regularly backup:
- ROM files
- games.json
- Custom configurations

## Support

For issues:
1. Check browser console
2. Verify network connectivity
3. Test on different devices
4. Review GitHub Issues
5. Check EmulatorJS documentation
