# Retro Gaming Console Platform

A serverless browser-based retro gaming console that runs entirely on static files. Play classic games on your TV using mobile phones as controllers via WebRTC.

## Features

- 🎮 Multiple console support (NES, SNES, GBA, PlayStation, Genesis)
- 📱 Mobile phones as wireless controllers
- 🔗 WebRTC peer-to-peer connections
- 👥 Up to 4 players multiplayer
- 📺 TV-optimized interface
- 🚀 Deployable on GitHub Pages
- ⚡ No backend required

## Quick Start

### Local Development

1. Clone the repository
2. Serve files using any static server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

### GitHub Pages Deployment

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch (main) and root folder
4. Save and wait for deployment
5. Access at `https://username.github.io/retro-console/`

## Project Structure

```
retro-console/
├── index.html              # TV console interface
├── controller.html         # Mobile controller interface
├── tv.js                   # TV console logic
├── controller.js           # Controller logic
├── webrtc-manager.js       # WebRTC communication
├── session-manager.js      # Session management
├── games.json              # Game metadata
├── roms/                   # ROM files
│   ├── nes/
│   ├── snes/
│   ├── gba/
│   ├── psx/
│   └── genesis/
└── assets/
    └── covers/             # Game cover images
```

## How It Works

### TV Console Flow

1. User opens website on TV browser
2. Selects console category
3. Selects game
4. Emulator loads
5. QR code appears
6. Waits for controller connections

### Mobile Controller Flow

1. User scans QR code with phone
2. Controller page opens
3. WebRTC connection established
4. Player number assigned
5. Button presses sent to TV
6. Game responds to inputs

## Adding Games

Edit `games.json`:

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
          "name": "Your Game",
          "rom": "roms/nes/yourgame.nes",
          "image": "assets/covers/nes-yourgame.jpg"
        }
      ]
    }
  ]
}
```

Add ROM file to `roms/nes/yourgame.nes`

## Supported Consoles

| Console | Core ID | Extensions |
|---------|---------|------------|
| NES | nes | .nes |
| SNES | snes | .sfc, .smc |
| Game Boy Advance | gba | .gba |
| PlayStation | psx | .bin, .cue |
| Genesis | segaMD | .bin, .md |
| Nintendo 64 | n64 | .n64, .z64 |
| Game Boy | gb | .gb |
| Game Boy Color | gbc | .gbc |

## Controller Button Mapping

| Controller | Keyboard | Emulator |
|------------|----------|----------|
| D-Pad Up | ↑ | Up |
| D-Pad Down | ↓ | Down |
| D-Pad Left | ← | Left |
| D-Pad Right | → | Right |
| A Button | X | A |
| B Button | Z | B |
| X Button | A | X |
| Y Button | S | Y |
| Start | Enter | Start |
| Select | Shift | Select |
| L Button | Q | L |
| R Button | W | R |

## WebRTC Connection

The system uses WebRTC DataChannels for real-time communication:

1. TV creates RTCPeerConnection as host
2. Generates offer with ICE candidates
3. Encodes connection data in QR code
4. Mobile scans and creates answer
5. DataChannel established
6. Button events flow through channel

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with WebRTC support

## Performance Tips

- Use WiFi for best connection
- Keep devices on same network
- Close other browser tabs
- Use modern browsers
- Enable hardware acceleration

## Troubleshooting

**QR code not scanning:**
- Increase brightness
- Move closer to screen
- Try different QR scanner app

**Controller not connecting:**
- Check same network
- Refresh both pages
- Clear browser cache
- Check WebRTC support

**Game not loading:**
- Verify ROM file exists
- Check file path in games.json
- Ensure correct core type
- Check browser console

**Input lag:**
- Reduce network traffic
- Use 5GHz WiFi
- Close background apps
- Try wired connection for TV

## Security Notes

- All connections are peer-to-peer
- No data sent to external servers
- ROMs stored locally
- Session IDs are temporary
- Max 4 players enforced

## Future Enhancements

- [ ] Save states
- [ ] Cloud save sync
- [ ] Leaderboards
- [ ] Achievements
- [ ] Game search
- [ ] Bluetooth controller support
- [ ] Voice chat
- [ ] Screen recording
- [ ] Replay system

## License

MIT License - Use freely for personal projects

## Credits

- EmulatorJS for emulation engine
- QRCode.js for QR generation
- TailwindCSS for styling
- WebRTC for P2P communication

## Legal Notice

This platform is for educational purposes. Users must own physical copies of games they play. ROM distribution is not included.
