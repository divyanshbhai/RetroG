# RetroG Console - Node.js Version

Browser-based retro gaming console with mobile phone controllers using WebSockets.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Server

```bash
npm start
```

### 3. Open on TV/Laptop

```
http://localhost:3000
```

### 4. Connect Phone

Scan QR code that appears when you start a game.

## 📱 Mobile Controller

The phone has two modes:

- **UI Mode**: Navigate game library, select games
- **Game Mode**: Play the actual game

Switch modes using buttons at the top.

## 🎮 Features

- ✅ Real-time WebSocket communication
- ✅ Up to 4 players
- ✅ Dual-mode controller (UI + Game)
- ✅ Modern console UI
- ✅ EmulatorJS integration
- ✅ QR code connection

## 🌐 Network Setup

### Local Network

Find your laptop's IP address:

```bash
# macOS/Linux
ifconfig | grep inet

# Windows
ipconfig
```

Then open on phone:
```
http://YOUR-IP:3000/controller
```

Example:
```
http://192.168.1.45:3000/controller
```

## 🎯 Adding Games

1. Add ROM file to `roms/nes/` (or appropriate folder)
2. Update `data/games.json`:

```json
{
  "name": "Your Game",
  "rom": "roms/nes/yourgame.nes",
  "image": "assets/images/yourgame.jpg",
  "description": "Game description",
  "year": 1985,
  "players": "1-2"
}
```

3. Restart server

## 🚢 Deployment

### Runway/Cloud Hosting

1. Set PORT environment variable
2. Ensure `0.0.0.0` binding (already configured)
3. Deploy with:

```bash
npm start
```

### Environment Variables

```
PORT=3000
```

## 📂 Project Structure

```
retro-console/
├── server/
│   ├── server.js           # Express + Socket.io server
│   └── sessionManager.js   # Session management
├── public/
│   ├── tv/
│   │   ├── index.html      # TV interface
│   │   └── tv.js           # TV logic
│   ├── controller/
│   │   ├── controller.html # Mobile controller
│   │   └── controller.js   # Controller logic
│   └── assets/
│       └── css/            # Stylesheets
├── roms/                   # ROM files
├── data/
│   └── games.json          # Game metadata
└── package.json
```

## 🎮 Controls

### UI Mode (Navigate Library)
- D-Pad: Navigate games
- SELECT: Launch game
- BACK: Close details

### Game Mode (Play Game)
- D-Pad: Movement
- A/B/X/Y: Action buttons
- START/SELECT: Menu buttons
- L/R: Shoulder buttons

## 🔧 Troubleshooting

**Phone can't connect:**
- Ensure both devices on same WiFi
- Use laptop's IP address, not localhost
- Check firewall settings

**Game won't load:**
- Verify ROM file exists
- Check path in games.json
- Ensure ROM file name has no spaces

**Input lag:**
- Use 5GHz WiFi
- Reduce distance to router
- Close other apps

## 📝 License

MIT License
