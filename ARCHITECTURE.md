# System Architecture

## Overview

The Retro Gaming Console is a serverless, browser-based gaming platform using WebRTC for peer-to-peer communication between devices.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                          │
│                  (Static File Hosting)                   │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS
                           ▼
        ┌──────────────────────────────────────┐
        │         TV Browser (Host)             │
        │  ┌────────────────────────────────┐  │
        │  │      TV Console UI             │  │
        │  │  - Game Library                │  │
        │  │  - Console Selection           │  │
        │  │  - QR Code Display             │  │
        │  └────────────────────────────────┘  │
        │  ┌────────────────────────────────┐  │
        │  │    EmulatorJS Engine           │  │
        │  │  - WebAssembly Cores           │  │
        │  │  - ROM Loading                 │  │
        │  │  - Game Rendering              │  │
        │  └────────────────────────────────┘  │
        │  ┌────────────────────────────────┐  │
        │  │   WebRTC Host Manager          │  │
        │  │  - Peer Connections (x4)       │  │
        │  │  - DataChannel Management      │  │
        │  │  - Input Routing               │  │
        │  └────────────────────────────────┘  │
        └──────────────────────────────────────┘
                    │         │
                    │ WebRTC  │ DataChannels
                    │ P2P     │
        ┌───────────┴─────────┴───────────┐
        │           │           │          │
        ▼           ▼           ▼          ▼
    ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
    │Phone1│   │Phone2│   │Phone3│   │Phone4│
    │  P1  │   │  P2  │   │  P3  │   │  P4  │
    └──────┘   └──────┘   └──────┘   └──────┘
```

## Component Architecture

### 1. TV Console Interface (index.html + tv.js)

**Responsibilities:**
- Render game library UI
- Load and run emulator
- Host WebRTC connections
- Generate QR codes
- Route controller inputs to emulator

**Key Classes:**
- `TVConsole`: Main orchestrator
- `WebRTCManager`: Connection management
- `SessionManager`: Player session handling

### 2. Mobile Controller (controller.html + controller.js)

**Responsibilities:**
- Display virtual controller UI
- Connect to TV via WebRTC
- Send button events
- Provide haptic feedback

**Key Classes:**
- `MobileController`: Controller logic
- `WebRTCManager`: Connection client

### 3. WebRTC Manager (webrtc-manager.js)

**Responsibilities:**
- Create peer connections
- Manage DataChannels
- Handle ICE candidates
- Send/receive messages

**API:**
```javascript
// Host side
const webrtc = new WebRTCManager(true);
await webrtc.createOffer(playerId);
webrtc.onMessage((peerId, data) => {...});

// Client side
const webrtc = new WebRTCManager(false);
await webrtc.createAnswer(offerData);
webrtc.send('host', { type: 'button', ... });
```

### 4. Session Manager (session-manager.js)

**Responsibilities:**
- Generate session IDs
- Track connected players
- Enforce player limits
- Manage game state

**API:**
```javascript
const session = new SessionManager();
session.createSession(game, console);
session.addPlayer(playerId);
session.getAllPlayers();
```

## Data Flow

### Connection Flow

```
1. TV: Generate session ID
2. TV: Create QR code with controller URL
3. Phone: Scan QR code
4. Phone: Open controller.html?session=SESSION_ID
5. Phone: Create WebRTC offer
6. TV: Receive offer, create answer
7. Phone: Receive answer
8. Both: Exchange ICE candidates
9. DataChannel: Established
10. Phone: Send join request
11. TV: Assign player number
12. Phone: Receive player assignment
```

### Input Flow

```
1. User: Press button on phone
2. Phone: Detect touch event
3. Phone: Send button event via DataChannel
   {
     type: 'button',
     button: 'a',
     pressed: true,
     player: 1
   }
4. TV: Receive button event
5. TV: Map button to keyboard code
6. TV: Dispatch keyboard event
7. Emulator: Process input
8. Emulator: Update game state
9. TV: Render frame
```

## Technology Stack

### Frontend
- **HTML5**: Structure
- **TailwindCSS**: Styling
- **Vanilla JavaScript**: Logic (ES6 modules)

### Communication
- **WebRTC**: Peer-to-peer connections
- **DataChannels**: Real-time messaging

### Emulation
- **EmulatorJS**: Multi-system emulator
- **WebAssembly**: High-performance cores

### Utilities
- **QRCode.js**: QR code generation

## Design Patterns

### Module Pattern
Each component is a self-contained ES6 module with clear interfaces.

### Observer Pattern
WebRTC and Session managers use callbacks for event handling.

### Singleton Pattern
TVConsole and MobileController are single instances per page.

### Factory Pattern
Emulator cores are loaded dynamically based on console type.

## Security Model

### Connection Security
- WebRTC encrypted by default (DTLS)
- Session IDs are temporary
- Max 4 connections enforced
- No external signaling server

### Input Validation
- Button names validated
- Player numbers verified
- Session IDs checked

### Content Security
- All assets served via HTTPS
- No eval() or inline scripts
- CSP headers recommended

## Performance Optimizations

### Lazy Loading
- Emulator cores loaded on demand
- ROMs loaded only when selected
- Images lazy loaded

### Efficient Communication
- Binary data for inputs (future)
- Batched messages
- Minimal payload size

### Rendering
- Hardware acceleration enabled
- 60 FPS target
- Canvas-based rendering

## Scalability

### Adding Consoles
1. Add entry to games.json
2. Specify EmulatorJS core
3. Add ROM files
4. No code changes needed

### Adding Games
1. Add ROM file
2. Update games.json
3. Add cover image
4. Deploy

### Adding Features
- Modular architecture allows easy extension
- Clear separation of concerns
- Well-defined interfaces

## Browser Compatibility

### Required Features
- WebRTC DataChannels
- ES6 Modules
- Canvas API
- WebAssembly
- LocalStorage

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment Architecture

```
GitHub Repository
    │
    ├── Push to main branch
    │
    ▼
GitHub Actions (optional)
    │
    ├── Build (none needed)
    ├── Test (optional)
    │
    ▼
GitHub Pages
    │
    ├── Serve static files
    ├── HTTPS enabled
    │
    ▼
CDN (GitHub's CDN)
    │
    ├── Global distribution
    ├── Caching
    │
    ▼
End Users
```

## Future Architecture Enhancements

### Cloud Save System
```
Browser → IndexedDB → Cloud Storage API → S3/Firebase
```

### Matchmaking
```
WebSocket Server → Room Management → Player Pairing
```

### Leaderboards
```
Game Events → API Gateway → DynamoDB → Leaderboard UI
```

### AI Recommendations
```
Play History → ML Model → Game Suggestions
```

## Limitations

### Current Limitations
- Same network required for best performance
- Max 4 players
- No save state sync
- No voice chat

### Technical Constraints
- Browser WebRTC limits
- GitHub Pages file size limits (100MB)
- No server-side logic
- CORS restrictions

## Monitoring & Debugging

### Browser DevTools
- Console: Error messages
- Network: Asset loading
- Application: LocalStorage

### WebRTC Internals
- Chrome: `chrome://webrtc-internals`
- Firefox: `about:webrtc`

### Performance Profiling
- Chrome DevTools Performance tab
- Frame rate monitoring
- Memory usage tracking
