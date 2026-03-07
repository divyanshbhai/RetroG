const socket = io();

class TVConsole {
    constructor() {
        this.games = null;
        this.focusedGame = null;
        this.focusedCard = null;
        this.sessionId = null;
        this.qrCode = null;
        this.mode = 'ui';
        
        this.init();
    }

    async init() {
        await this.loadGames();
        this.renderDashboard();
        this.setupSocketListeners();
        this.setupKeyboardNav();
        this.updateTime();
        this.focusFirstGame();
    }

    async loadGames() {
        const response = await fetch('/data/games.json');
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
                        ${allGames.map(game => `
                            <div class="game-card" data-console="${game.console.id}">
                                <div class="game-card-image">🎮</div>
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
        if (firstCard) this.focusGame(firstCard);
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
        
        document.getElementById('game-title').textContent = game.name;
        document.getElementById('game-meta').innerHTML = `
            <span class="meta-tag">${console.name}</span>
            <span class="meta-tag">${game.year}</span>
            <span class="meta-tag">${game.players} Players</span>
        `;
        document.getElementById('game-desc').textContent = game.description;
        document.getElementById('details-panel').classList.add('active');
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
        
        socket.emit('create-session', { game, console });
        socket.once('session-created', (data) => {
            this.sessionId = data.sessionId;
            this.startEmulator(console.core, game.rom);
            this.generateQRCode(data.sessionId);
            this.mode = 'game';
        });
    }

    startEmulator(core, rom) {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('emulator-screen').classList.remove('hidden');

        window.EJS_player = '#game-canvas';
        window.EJS_core = core;
        window.EJS_gameUrl = rom;
        window.EJS_pathtodata = 'https://cdn.jsdelivr.net/npm/emulatorjs@latest/data/';
        
        document.getElementById('exit-btn').onclick = () => this.exitGame();
    }

    generateQRCode(sessionId) {
        const qrContainer = document.getElementById('qr-code');
        qrContainer.innerHTML = '';
        
        const controllerUrl = `${window.location.origin}/controller?session=${sessionId}`;
        
        this.qrCode = new QRCode(qrContainer, {
            text: controllerUrl,
            width: 180,
            height: 180
        });
    }

    setupSocketListeners() {
        socket.on('game-input', (data) => {
            if (this.mode === 'game') {
                this.handleGameInput(data.button, data.pressed);
            }
        });

        socket.on('ui-action', (data) => {
            if (this.mode === 'ui') {
                this.handleUIAction(data.action);
            }
        });

        socket.on('player-joined', (data) => {
            this.updatePlayersList(data.players);
        });
    }

    handleUIAction(action) {
        if (['up', 'down', 'left', 'right'].includes(action)) {
            this.navigateUI(action);
        } else if (action === 'select') {
            this.launchGame();
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

    updatePlayersList(players) {
        const list = document.getElementById('players-list');
        list.innerHTML = players.map(p => `
            <div class="player-item">
                <span>Player ${p.playerNumber}</span>
                <span class="player-status"></span>
            </div>
        `).join('');
    }

    setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (this.mode === 'ui') {
                if (e.key === 'ArrowUp') this.navigateUI('up');
                else if (e.key === 'ArrowDown') this.navigateUI('down');
                else if (e.key === 'ArrowLeft') this.navigateUI('left');
                else if (e.key === 'ArrowRight') this.navigateUI('right');
                else if (e.key === 'Enter') this.launchGame();
                else if (e.key === 'Escape') document.getElementById('details-panel').classList.remove('active');
            }
        });
    }

    updateTime() {
        const updateClock = () => {
            document.getElementById('time').textContent = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit'
            });
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    exitGame() {
        this.mode = 'ui';
        document.getElementById('emulator-screen').classList.add('hidden');
        document.getElementById('dashboard').style.display = 'block';
    }
}

new TVConsole();
