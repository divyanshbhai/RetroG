# Quick Start Guide

Get your retro gaming console running in 5 minutes!

## Prerequisites

- TV or large monitor with web browser
- Mobile phone with camera
- WiFi network
- Game ROM files (legally owned)

## Step 1: Deploy to GitHub Pages

### Option A: Use Template (Easiest)

1. Click "Use this template" on GitHub
2. Name your repository (e.g., `my-retro-console`)
3. Go to Settings → Pages
4. Select branch: `main`, folder: `/ (root)`
5. Click Save
6. Wait 2 minutes

Your site: `https://yourusername.github.io/my-retro-console/`

### Option B: Clone and Deploy

```bash
git clone https://github.com/yourusername/retro-console.git
cd retro-console
git remote set-url origin https://github.com/yourusername/my-retro-console.git
git push -u origin main
```

Then enable GitHub Pages in repository settings.

## Step 2: Add Games

### Add ROM Files

```bash
# Copy your ROM files
cp ~/Downloads/mario.nes roms/nes/
cp ~/Downloads/sonic.bin roms/genesis/
```

### Update games.json

```json
{
  "consoles": [
    {
      "id": "nes",
      "name": "Nintendo Entertainment System",
      "category": "Nintendo",
      "core": "nes",
      "games": [
        {
          "name": "Super Mario Bros",
          "rom": "roms/nes/mario.nes",
          "image": "assets/covers/nes-mario.jpg"
        }
      ]
    }
  ]
}
```

### Commit and Push

```bash
git add roms/ games.json
git commit -m "Add games"
git push
```

Wait 1 minute for deployment.

## Step 3: Play on TV

### Open on TV Browser

1. Open browser on TV (Chrome, Firefox, or Edge)
2. Navigate to your GitHub Pages URL
3. You'll see the console interface

### Select Game

1. Browse console categories
2. Click on a console (e.g., Nintendo → NES)
3. Click on a game
4. Emulator loads with QR code on right side

## Step 4: Connect Controller

### Scan QR Code

1. Open camera app on phone
2. Point at QR code on TV screen
3. Tap notification to open link
4. Controller interface loads

### Alternative: Manual URL

If QR code doesn't work:
1. Type URL manually: `https://yourusername.github.io/my-retro-console/controller.html?session=SESSION_ID`
2. Session ID shown on TV screen

### Verify Connection

- Controller shows "Connected" at top
- Player number displayed (Player 1, 2, 3, or 4)
- TV shows player in "Connected Players" list

## Step 5: Play!

### Controller Layout

```
        SELECT    START

    ▲                   X
  ◀   ▶               Y   A
    ▼                   B

    L                   R
```

### Button Functions

- **D-Pad**: Movement (Up, Down, Left, Right)
- **A/B**: Primary action buttons
- **X/Y**: Secondary action buttons
- **Start**: Pause/Menu
- **Select**: Additional functions
- **L/R**: Shoulder buttons

### Tips

- Hold phone horizontally for better grip
- Buttons provide haptic feedback
- Keep phone screen on
- Stay within WiFi range

## Multiplayer

### Connect More Controllers

1. Scan QR code with second phone → Player 2
2. Scan with third phone → Player 3
3. Scan with fourth phone → Player 4

Maximum: 4 players

### Player Indicators

Each controller shows its player number at the top.

## Troubleshooting

### QR Code Won't Scan

- Increase TV brightness
- Move closer (6-12 inches)
- Try different QR scanner app
- Type URL manually

### Controller Won't Connect

- Ensure same WiFi network
- Refresh both pages
- Check WebRTC support in browser
- Try different browser

### Game Won't Load

- Verify ROM file exists
- Check file path in games.json
- Ensure correct file format
- Check browser console (F12)

### Input Lag

- Use 5GHz WiFi
- Move closer to router
- Close other apps
- Reduce network traffic

## Local Testing

Before deploying, test locally:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Open `http://localhost:8000` in browser.

## Next Steps

### Customize

- Add more games to games.json
- Add cover images to assets/covers/
- Modify UI colors in HTML files
- Add new console types

### Optimize

- Compress ROM files
- Optimize images
- Enable caching
- Use CDN for assets

### Share

Share your console URL with friends:
```
https://yourusername.github.io/my-retro-console/
```

## Common Commands

```bash
# Add new game
cp game.nes roms/nes/
git add roms/
git commit -m "Add new game"
git push

# Update games list
nano games.json
git add games.json
git commit -m "Update games"
git push

# View logs
git log --oneline

# Check status
git status
```

## Resources

- **EmulatorJS Docs**: https://emulatorjs.org/
- **WebRTC Guide**: https://webrtc.org/getting-started/overview
- **GitHub Pages**: https://pages.github.com/
- **TailwindCSS**: https://tailwindcss.com/

## Support

Need help?

1. Check TROUBLESHOOTING.md
2. Review browser console
3. Test on different device
4. Check GitHub Issues
5. Review documentation

## Legal Notice

Only use ROM files you legally own. This platform is for personal use only.

---

**Enjoy your retro gaming console! 🎮**
