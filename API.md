# API Documentation

## WebRTCManager

Manages WebRTC peer connections and DataChannels.

### Constructor

```javascript
new WebRTCManager(isHost)
```

**Parameters:**
- `isHost` (boolean): True for TV (host), false for controller (client)

### Methods

#### createOffer(playerId)

Creates WebRTC offer for new controller connection.

```javascript
const offerData = await webrtc.createOffer('player_123');
// Returns: { offer: RTCSessionDescription, playerId: string }
```

#### createAnswer(offerData)

Creates answer to host's offer.

```javascript
const answerData = await webrtc.createAnswer(offerData);
// Returns: { answer: RTCSessionDescription, playerId: string }
```

#### addIceCandidate(peerId, candidate)

Adds ICE candidate to peer connection.

```javascript
await webrtc.addIceCandidate('player_123', candidate);
```

#### send(peerId, data)

Sends data through DataChannel.

```javascript
webrtc.send('player_123', {
    type: 'button',
    button: 'a',
    pressed: true
});
```

#### broadcast(data)

Sends data to all connected peers.

```javascript
webrtc.broadcast({ type: 'game_state', state: {...} });
```

#### onMessage(callback)

Sets message handler.

```javascript
webrtc.onMessage((peerId, data) => {
    console.log(`Message from ${peerId}:`, data);
});
```

#### onConnection(callback)

Sets connection state handler.

```javascript
webrtc.onConnection((peerId, connected) => {
    console.log(`${peerId} ${connected ? 'connected' : 'disconnected'}`);
});
```

#### closeAll()

Closes all connections.

```javascript
webrtc.closeAll();
```

---

## SessionManager

Manages game sessions and player connections.

### Constructor

```javascript
new SessionManager()
```

### Properties

- `sessionId` (string): Current session ID
- `maxPlayers` (number): Maximum players (default: 4)
- `players` (Map): Connected players
- `currentGame` (object): Current game info

### Methods

#### generateSessionId()

Generates unique session ID.

```javascript
const sessionId = session.generateSessionId();
// Returns: "SESSION_12345"
```

#### createSession(game, consoleType)

Creates new game session.

```javascript
const sessionId = session.createSession(
    { name: 'Mario', rom: 'roms/nes/mario.nes' },
    { id: 'nes', core: 'nes' }
);
```

#### addPlayer(playerId)

Adds player to session.

```javascript
const result = session.addPlayer('player_123');
// Returns: { success: true, playerNumber: 1 }
// Or: { success: false, reason: 'Session full' }
```

#### removePlayer(playerId)

Removes player from session.

```javascript
session.removePlayer('player_123');
```

#### getPlayer(playerId)

Gets player info.

```javascript
const player = session.getPlayer('player_123');
// Returns: { id: string, number: number, connected: boolean }
```

#### getAllPlayers()

Gets all players.

```javascript
const players = session.getAllPlayers();
// Returns: Array of player objects
```

#### isFull()

Checks if session is full.

```javascript
if (session.isFull()) {
    console.log('No more players allowed');
}
```

#### getSessionInfo()

Gets complete session info.

```javascript
const info = session.getSessionInfo();
// Returns: { sessionId, game, players, maxPlayers }
```

#### endSession()

Ends current session.

```javascript
session.endSession();
```

---

## Message Protocol

### Button Event

Sent from controller to TV when button is pressed/released.

```javascript
{
    type: 'button',
    button: 'a' | 'b' | 'x' | 'y' | 'up' | 'down' | 'left' | 'right' | 'start' | 'select' | 'l' | 'r',
    pressed: boolean,
    player: number
}
```

### Join Request

Sent from controller to TV to join session.

```javascript
{
    type: 'join',
    sessionId: string
}
```

### Join Response

Sent from TV to controller after join request.

```javascript
// Success
{
    type: 'joined',
    playerNumber: number
}

// Failure
{
    type: 'rejected',
    reason: string
}
```

### Game State (Future)

```javascript
{
    type: 'game_state',
    state: {
        score: number,
        lives: number,
        level: number
    }
}
```

---

## Button Mapping

### Controller to Keyboard

```javascript
const keyMap = {
    'up': 38,      // Arrow Up
    'down': 40,    // Arrow Down
    'left': 37,    // Arrow Left
    'right': 39,   // Arrow Right
    'a': 88,       // X key
    'b': 90,       // Z key
    'x': 65,       // A key
    'y': 83,       // S key
    'start': 13,   // Enter
    'select': 16,  // Shift
    'l': 81,       // Q key
    'r': 87        // W key
};
```

### Emulator Mapping

Different emulators may use different key mappings. Adjust as needed.

---

## Games JSON Schema

```json
{
    "consoles": [
        {
            "id": "string",           // Unique console ID
            "name": "string",         // Display name
            "category": "string",     // Category (Nintendo, Sony, etc.)
            "core": "string",         // EmulatorJS core name
            "games": [
                {
                    "name": "string",     // Game name
                    "rom": "string",      // Path to ROM file
                    "image": "string"     // Path to cover image
                }
            ]
        }
    ]
}
```

### Supported Cores

- `nes` - Nintendo Entertainment System
- `snes` - Super Nintendo
- `n64` - Nintendo 64
- `gba` - Game Boy Advance
- `gb` - Game Boy
- `gbc` - Game Boy Color
- `psx` - PlayStation
- `segaMD` - Sega Genesis/Mega Drive
- `segaMS` - Sega Master System
- `segaGG` - Sega Game Gear
- `atari2600` - Atari 2600
- `mame` - MAME Arcade

---

## Events

### Custom Events

You can dispatch custom events for additional functionality:

```javascript
// Dispatch custom event
document.dispatchEvent(new CustomEvent('gameStarted', {
    detail: { game: 'Mario', console: 'NES' }
}));

// Listen for custom event
document.addEventListener('gameStarted', (e) => {
    console.log('Game started:', e.detail);
});
```

### Useful Events

- `gameStarted`: When game begins
- `playerConnected`: When controller connects
- `playerDisconnected`: When controller disconnects
- `gameEnded`: When game exits

---

## Error Handling

### WebRTC Errors

```javascript
try {
    await webrtc.createOffer(playerId);
} catch (error) {
    if (error.name === 'NotAllowedError') {
        console.error('Permissions denied');
    } else if (error.name === 'NotFoundError') {
        console.error('No devices found');
    }
}
```

### Session Errors

```javascript
const result = session.addPlayer(playerId);
if (!result.success) {
    switch (result.reason) {
        case 'Session full':
            // Handle full session
            break;
        case 'Invalid session':
            // Handle invalid session
            break;
    }
}
```

---

## Extending the System

### Adding New Console

1. Add to games.json:
```json
{
    "id": "dreamcast",
    "name": "Sega Dreamcast",
    "category": "Sega",
    "core": "dreamcast",
    "games": []
}
```

2. Ensure EmulatorJS supports the core

### Custom Controller Layout

Modify controller.html and add new buttons:

```html
<button class="btn" data-button="custom">Custom</button>
```

Update controller.js to handle new button:

```javascript
const keyMap = {
    ...existingMappings,
    'custom': 67  // C key
};
```

### Save States

```javascript
// Save state
const state = emulator.saveState();
localStorage.setItem('save_' + gameId, state);

// Load state
const state = localStorage.getItem('save_' + gameId);
emulator.loadState(state);
```

---

## Testing

### Unit Testing

```javascript
// Test session manager
const session = new SessionManager();
session.createSession(game, console);
assert(session.sessionId !== null);

const result = session.addPlayer('p1');
assert(result.success === true);
assert(result.playerNumber === 1);
```

### Integration Testing

```javascript
// Test WebRTC connection
const host = new WebRTCManager(true);
const client = new WebRTCManager(false);

const offer = await host.createOffer('client1');
const answer = await client.createAnswer(offer);
await host.setRemoteAnswer('client1', answer.answer);

// Test message passing
host.onMessage((peerId, data) => {
    assert(data.type === 'test');
});

client.send('host', { type: 'test' });
```

---

## Performance Tips

### Optimize Message Frequency

```javascript
// Throttle button events
let lastSent = 0;
const throttle = 16; // ~60fps

function sendButton(button, pressed) {
    const now = Date.now();
    if (now - lastSent < throttle) return;
    
    webrtc.send('host', { type: 'button', button, pressed });
    lastSent = now;
}
```

### Batch Messages

```javascript
// Collect multiple inputs
const inputBuffer = [];

function bufferInput(button, pressed) {
    inputBuffer.push({ button, pressed });
}

// Send batch every frame
setInterval(() => {
    if (inputBuffer.length > 0) {
        webrtc.send('host', { type: 'batch', inputs: inputBuffer });
        inputBuffer.length = 0;
    }
}, 16);
```
