import { WebRTCManager } from './webrtc-manager.js';
import { SessionManager } from './session-manager.js';
import { EmulatorLoader } from './emulator-loader.js';

class TVConsole {
    constructor() {
        this.webrtc = new WebRTCManager(true);
        this.session = new SessionManager();
        this.emulator = new EmulatorLoader();
        this.games = null;
        this.focusedGame = null;
        this.qrCode = null;
        
        this.init();
    }

    async init() {
        await this.loadGames();
        this.renderDashboard();
        this.setupWebRTC();
        this.setupKeyboardNav();
        this.updateTime();
    }

    async loadGames() {
        const response = await fetch('data/games.json');
        this.games = await response.json();
    }

    renderDashboard() {
        const content = document.getElementById('content');
        const categories = [...new Set(this.games.consoles.map(c => c.category))];

        content.innerHTML = categories.map(category => {
            const consoles = this.games.consoles.filter(c => c.category === category);
            const allGames = consoles.flatMap(c => c.games.map(g => ({...g, console: c})));

            return `
                <div class="section">
                    <h2 class="section-title">${category}</h2>
                    <div class="games-row">
                        ${allGames.map((game, idx) => `
                            <div class="game-card" data-game-id="${idx}" data-console="${game.console.id}">
                                <div class="game-card-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 4rem; width: 100%; height: 100%;">
                                    🎮
                                </div>
                                <div class="game-card-overlay">
                                    <div class="game-card-title">${game.name}</div>
                                    <div class="game-card-console">${game.console.name}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => this.selectGame(card));
            card.addEventListener('mouseenter', () => this.focusGame(card));
        });
    }

    focusGame(card) {
        document.querySelectorAll('.game-card').forEach(c => c.classList.remove('focused'));
        card.classList.add('focused');
        
        const consoleId = card.dataset.console;
        const console = this.games.consoles.find(c => c.id === consoleId);
        const gameName = card.querySelector('.game-card-title').textContent;
        const game = console.games.find(g => g.name === gameName);
        
        this.showGameDetails(game, console);
    }

    showGameDetails(game, console) {
        this.focusedGame = { game, console };
        
        const panel = document.getElementById('details-panel');
        document.getElementById('game-title').textContent = game.name;
        document.getElementById('game-meta').innerHTML = `
            <span class="meta-tag">${console.name}</span>
            <span class="meta-tag">${game.year}</span>
            <span class="meta-tag">${game.players} Players</span>
        `;
        document.getElementById('game-desc').textContent = game.description;
        
        panel.classList.add('active');
        
        document.getElementById('play-btn').onclick = () => this.launchGame();
    }

    selectGame(card) {
        this.focusGame(card);
    }

    launchGame() {
        if (!this.focusedGame) return;

        const { game, console } = this.focusedGame;
        const sessionId = this.session.createSession(game, console);

        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('emulator-screen').classList.remove('hidden');

        this.emulator.load(console.core, game.rom);
        this.generateQRCode(sessionId);
        
        document.getElementById('exit-btn').onclick = () => this.exitGame();
    }

    generateQRCode(sessionId) {
        const qrContainer = document.getElementById('qr-code');
        qrContainer.innerHTML = '';
        
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
        const controllerUrl = `${baseUrl}controller.html?session=${sessionId}`;
        
        this.qrCode = new QRCode(qrContainer, {
            text: controllerUrl,
            width: 180,
            height: 180
        });
    }

    setupWebRTC() {
        this.webrtc.onMessage((playerId, data) => {
            if (data.type === 'button') {
                this.handleInput(playerId, data);
            } else if (data.type === 'join') {
                this.handlePlayerJoin(playerId);
            }
        });

        this.webrtc.onConnection((playerId, connected) => {
            if (!connected) {
                this.session.removePlayer(playerId);
                this.updatePlayersList();
            }
        });
    }

    handlePlayerJoin(playerId) {
        const result = this.session.addPlayer(playerId);
        
        if (result.success) {
            this.webrtc.send(playerId, {
                type: 'joined',
                playerNumber: result.playerNumber
            });
            this.updatePlayersList();
        } else {
            this.webrtc.send(playerId, {
                type: 'rejected',
                reason: result.reason
            });
        }
    }

    handleInput(playerId, data) {
        const keyMap = {
            'up': 38, 'down': 40, 'left': 37, 'right': 39,
            'a': 88, 'b': 90, 'x': 65, 'y': 83,
            'start': 13, 'select': 16, 'l': 81, 'r': 87
        };

        const keyCode = keyMap[data.button];
        if (!keyCode) return;

        const event = new KeyboardEvent(data.pressed ? 'keydown' : 'keyup', {
            keyCode, which: keyCode, bubbles: true
        });
        document.dispatchEvent(event);
    }

    updatePlayersList() {
        const list = document.getElementById('players-list');
        const players = this.session.getAllPlayers();
        
        list.innerHTML = players.map(p => `
            <div class="player-item">
                <span>Player ${p.number}</span>
                <span class="player-status"></span>
            </div>
        `).join('');
    }

    setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('details-panel').classList.remove('active');
            }
        });
    }

    updateTime() {
        const updateClock = () => {
            const now = new Date();
            document.getElementById('time').textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    exitGame() {
        this.session.endSession();
        this.webrtc.closeAll();
        this.emulator.unload();
        
        document.getElementById('emulator-screen').classList.add('hidden');
        document.getElementById('dashboard').style.display = 'block';
    }
}

new TVConsole();
