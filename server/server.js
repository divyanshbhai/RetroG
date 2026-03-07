const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const SessionManager = require('./sessionManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const sessionManager = new SessionManager();

app.use(express.static('public'));
app.use('/roms', express.static('roms'));
app.use('/data', express.static('data'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/tv/index.html'));
});

app.get('/controller', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/controller/controller.html'));
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('create-session', (data) => {
        const sessionId = sessionManager.createSession(data.game, data.console);
        socket.join(sessionId);
        socket.emit('session-created', { sessionId });
        console.log('Session created:', sessionId);
    });

    socket.on('join-session', (data) => {
        const result = sessionManager.addPlayer(data.sessionId, socket.id);
        
        if (result.success) {
            socket.join(data.sessionId);
            socket.emit('player-assigned', { playerNumber: result.playerNumber });
            io.to(data.sessionId).emit('player-joined', { 
                playerNumber: result.playerNumber,
                players: sessionManager.getPlayers(data.sessionId)
            });
            console.log(`Player ${result.playerNumber} joined session ${data.sessionId}`);
        } else {
            socket.emit('join-failed', { reason: result.reason });
        }
    });

    socket.on('controller-input', (data) => {
        io.to(data.sessionId).emit('game-input', {
            player: data.player,
            button: data.button,
            pressed: data.pressed
        });
    });

    socket.on('ui-command', (data) => {
        io.to(data.sessionId).emit('ui-action', {
            action: data.action
        });
    });

    socket.on('disconnect', () => {
        sessionManager.removePlayerBySocketId(socket.id);
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 RetroG Console Server running on port ${PORT}`);
    console.log(`📺 TV: http://localhost:${PORT}`);
    console.log(`📱 Controller: http://localhost:${PORT}/controller`);
});
