import { WebRTCManager } from './webrtc-manager.js';
import { SessionManager } from './session-manager.js';

class TVConsole {
    constructor() {
        this.webrtc = new WebRTCManager(true);
        this.session = new SessionManager();
        this.games = null;
        this.qrCode = null;
        
        this.init();
    }

    async init() {
        await this.loadGames();
        this.renderConsoleUI();
        this.setupWebRTC();
        this.setupEventListeners();
    }

    async loadGames() {
        const response = await fetch('games.json');
        this.games = await response.json();
    }

    renderConsoleUI() {
        const container = document.getElementById('console-categories');
        const categories = [...new Set(this.games.consoles.map(c => c.category))];

        categories.forEach(category => {
            const consoles = this.games.consoles.filter(c => c.category === category);
            
            const section = document.createElement('div');
            section.className = 'mb-12';
            section.innerHTML = `
                <h2 class="text-4xl font-bold mb-6 px-4">${category}</h2>
                <div class="flex gap-6 overflow-x-auto console-row px-4 pb-4">
                    ${consoles.map(console => `
                        <div class="flex-shrink-0 w-64 cursor-pointer" data-console="${console.id}">
                            <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition">
                                <h3 class="text-2xl font-bold mb-4">${console.name}</h3>
                                <p class="text-gray-400">${console.games.length} games</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(section);
        });

        document.querySelectorAll('[data-console]').forEach(el => {
            el.addEventListener('click', () => {
                this.showGames(el.dataset.console);
            });
        });
    }

    showGames(consoleId) {
        const console = this.games.consoles.find(c => c.id === consoleId);
        const container = document.getElementById('console-categories');
        
        container.innerHTML = `
            <button id="back-btn" class="mb-6 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-xl">
                ← Back
            </button>
            <h2 class="text-5xl font-bold mb-8">${console.name}</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                ${console.games.map((game, idx) => `
                    <div class="game-card cursor-pointer bg-gray-800 rounded-lg overflow-hidden" data-game-idx="${idx}" data-console="${consoleId}">
                        <div class="aspect-[3/4] bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                            <span class="text-6xl">🎮</span>
                        </div>
                        <div class="p-4">
                            <h3 class="text-xl font-bold">${game.name}</h3>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        document.getElementById('back-btn').addEventListener('click', () => {
            this.renderConsoleUI();
        });

        document.querySelectorAll('.game-card').forEach(el => {
            el.addEventListener('click', () => {
                this.startGame(el.dataset.console, parseInt(el.dataset.gameIdx));
            });
        });
    }

    startGame(consoleId, gameIdx) {
        const console = this.games.consoles.find(c => c.id === consoleId);
        const game = console.games[gameIdx];
        
        const sessionId = this.session.createSession(game, console);
        
        document.getElementById('console-ui').style.display = 'none';
        document.getElementById('emulator-container').classList.add('active');
        
        this.loadEmulator(console.core, game.rom);
        this.generateQRCode(sessionId);
    }

    loadEmulator(core, rom) {
        window.EJS_player = '#game';
        window.EJS_core = core;
        window.EJS_gameUrl = rom;
        window.EJS_pathtodata = 'https://cdn.jsdelivr.net/npm/emulatorjs@latest/data/';
    }

    generateQRCode(sessionId) {
        const qrContainer = document.getElementById('qr-code');
        qrContainer.innerHTML = '';
        
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
        const controllerUrl = `${baseUrl}controller.html?session=${sessionId}`;
        
        this.qrCode = new QRCode(qrContainer, {
            text: controllerUrl,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff'
        });
    }

    setupWebRTC() {
        this.webrtc.onMessage((playerId, data) => {
            if (data.type === 'button') {
                this.handleControllerInput(playerId, data);
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

    handleControllerInput(playerId, data) {
        const player = this.session.getPlayer(playerId);
        if (!player) return;

        const keyMap = {
            'up': 38, 'down': 40, 'left': 37, 'right': 39,
            'a': 88, 'b': 90, 'x': 65, 'y': 83,
            'start': 13, 'select': 16, 'l': 81, 'r': 87
        };

        const keyCode = keyMap[data.button];
        if (!keyCode) return;

        const event = new KeyboardEvent(data.pressed ? 'keydown' : 'keyup', {
            keyCode: keyCode,
            which: keyCode,
            bubbles: true
        });
        
        document.dispatchEvent(event);
    }

    updatePlayersList() {
        const list = document.getElementById('players-list');
        const players = this.session.getAllPlayers();
        
        list.innerHTML = players.map(p => `
            <div class="bg-gray-800 p-3 rounded-lg">
                <span class="font-bold">Player ${p.number}</span>
                <span class="ml-2 text-green-400">●</span>
            </div>
        `).join('');
    }

    setupEventListeners() {
        document.getElementById('exit-game').addEventListener('click', () => {
            this.exitGame();
        });
    }

    exitGame() {
        this.session.endSession();
        this.webrtc.closeAll();
        
        document.getElementById('emulator-container').classList.remove('active');
        document.getElementById('console-ui').style.display = 'block';
        this.renderConsoleUI();
    }
}

new TVConsole();
