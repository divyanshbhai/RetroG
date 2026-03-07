export class SessionManager {
    constructor() {
        this.sessionId = null;
        this.maxPlayers = 4;
        this.players = new Map();
        this.currentGame = null;
    }

    generateSessionId() {
        this.sessionId = 'SESSION_' + Math.floor(Math.random() * 100000);
        return this.sessionId;
    }

    createSession(game, consoleType) {
        this.generateSessionId();
        this.currentGame = { game, consoleType };
        this.players.clear();
        return this.sessionId;
    }

    addPlayer(playerId) {
        if (this.players.size >= this.maxPlayers) {
            return { success: false, reason: 'Session full' };
        }

        const playerNumber = this.players.size + 1;
        this.players.set(playerId, {
            id: playerId,
            number: playerNumber,
            connected: true
        });

        return { success: true, playerNumber };
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
    }

    getPlayer(playerId) {
        return this.players.get(playerId);
    }

    getAllPlayers() {
        return Array.from(this.players.values());
    }

    isFull() {
        return this.players.size >= this.maxPlayers;
    }

    getSessionInfo() {
        return {
            sessionId: this.sessionId,
            game: this.currentGame,
            players: this.getAllPlayers(),
            maxPlayers: this.maxPlayers
        };
    }

    endSession() {
        this.sessionId = null;
        this.currentGame = null;
        this.players.clear();
    }
}
