class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.maxPlayers = 4;
    }

    generateSessionId() {
        return 'SESSION_' + Math.floor(Math.random() * 100000);
    }

    createSession(game, console) {
        const sessionId = this.generateSessionId();
        this.sessions.set(sessionId, {
            id: sessionId,
            game,
            console,
            players: [],
            createdAt: Date.now()
        });
        return sessionId;
    }

    addPlayer(sessionId, socketId) {
        const session = this.sessions.get(sessionId);
        
        if (!session) {
            return { success: false, reason: 'Session not found' };
        }

        if (session.players.length >= this.maxPlayers) {
            return { success: false, reason: 'Session full' };
        }

        const playerNumber = session.players.length + 1;
        session.players.push({ socketId, playerNumber });

        return { success: true, playerNumber };
    }

    removePlayerBySocketId(socketId) {
        this.sessions.forEach((session) => {
            session.players = session.players.filter(p => p.socketId !== socketId);
        });
    }

    getPlayers(sessionId) {
        const session = this.sessions.get(sessionId);
        return session ? session.players : [];
    }

    endSession(sessionId) {
        this.sessions.delete(sessionId);
    }
}

module.exports = SessionManager;
