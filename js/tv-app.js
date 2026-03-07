import { SessionManager } from './session-manager.js';
import { EmulatorLoader } from './emulator-loader.js';

class TVConsole {
    constructor() {
        this.session = new SessionManager();
        this.emulator = new EmulatorLoader();
        this.games = null;
        this.focusedGame = null;
        this.focusedCard = null;
        this.qrCode = null;
        this.controllerMode = 'ui';
        
        this.init();
    }

    async init() {
        await this.loadGames();
        this.renderDashboard();
        this.setupControllerListener();
        this.setupKeyboardNav();
        this.updateTime();
        this.focusFirstGame();
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
                            <div class="game-card" data-console="${game.console.id}">
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
        });
    }

    focusFirstGame() {
        const firstCard = document.querySelector('.game-card');
        if (firstCard) {
            this.focusGame(firstCard);
        }
    }

    focusGame(card) {
        document.querySelectorAll('.game-card').forEach(c => c.classList.remove('focused'));
        card.classList.add('focused');
        this.focusedCard = card;
        
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

    navigateUI(direction) {
        if (!this.focusedCard) {
            this.focusFirstGame();
            return;
        }

        const cards = Array.from(document.querySelectorAll('.game-card'));
        const currentIndex = cards.indexOf(this.focusedCard);

        let nextIndex = currentIndex;
        if (direction === 'right') nextIndex++;
        else if (direction === 'left') nextIndex--;
        else if (direction === 'down') nextIndex += 4;
        else if (direction === 'up') nextIndex -= 4;

        if (nextIndex >= 0 && nextIndex < cards.length) {
            this.focusGame(cards[nextIndex]);
            cards[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    launchGame() {
        if (!this.focusedGame) return;

        const { game, console } = this.focusedGame;
        const sessionId = this.session.createSession(game, console);

        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('emulator-screen').classList.remove('hidden');

        this.emulator.load(console.core, game.rom);
        this.generateQRCode(sessionId);
        this.controllerMode = 'game';
        this.notifyControllerMode('game');
        
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

    setupControllerListener() {
        let lastTimestamp = 0;
        
        setInterval(() => {
            const sessionId = this.session.sessionId || 'default';
            const data = localStorage.getItem(`tv_${sessionId}`);
            
            if (data) {
                const message = JSON.parse(data);
                
                if (message.timestamp > lastTimestamp) {
                    lastTimestamp = message.timestamp;
                    this.handleControllerMessage(message);
                }
            }
        }, 50);
    }

    handleControllerMessage(data) {
        if (data.type === 'ui') {
            this.handleUICommand(data.action);
        } else if (data.type === 'button') {
            this.handleGameInput(data.button, data.pressed);
        } else if (data.type === 'connect') {
            console.log('Controller connected');
        }
    }

    handleUICommand(action) {
        if (action === 'up' || action === 'down' || action === 'left' || action === 'right') {
            this.navigateUI(action);
        } else if (action === 'select') {
            if (this.focusedCard) {
                this.launchGame();
            }
        } else if (action === 'back') {
            document.getElementById('details-panel').classList.remove('active');
        }
    }

    handleGameInput(button, pressed) {
        const keyMap = {
            'up': 38, 'down': 40, 'left': 37, 'right': 39,
            'a': 88, 'b': 90, 'x': 65, 'y': 83,
            'start': 13, 'select': 16, 'l': 81, 'r': 87
        };

        const keyCode = keyMap[button];
        if (!keyCode) return;

        const event = new KeyboardEvent(pressed ? 'keydown' : 'keyup', {
            keyCode, which: keyCode, bubbles: true
        });
        document.dispatchEvent(event);
    }

    notifyControllerMode(mode) {
        const sessionId = this.session.sessionId || 'default';
        localStorage.setItem(`controller_${sessionId}`, JSON.stringify({
            type: 'mode',
            mode: mode
        }));
    }

    setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('details-panel').classList.remove('active');
            } else if (e.key === 'ArrowUp') {
                this.navigateUI('up');
            } else if (e.key === 'ArrowDown') {
                this.navigateUI('down');
            } else if (e.key === 'ArrowLeft') {
                this.navigateUI('left');
            } else if (e.key === 'ArrowRight') {
                this.navigateUI('right');
            } else if (e.key === 'Enter') {
                if (this.focusedCard) {
                    this.launchGame();
                }
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
        this.emulator.unload();
        this.controllerMode = 'ui';
        this.notifyControllerMode('ui');
        
        document.getElementById('emulator-screen').classList.add('hidden');
        document.getElementById('dashboard').style.display = 'block';
    }
}

new TVConsole();
