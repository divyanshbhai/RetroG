const socket = io();

class MobileController {
    constructor() {
        this.sessionId = null;
        this.playerNumber = null;
        this.mode = 'ui';
        
        this.init();
    }

    init() {
        this.sessionId = new URLSearchParams(window.location.search).get('session');
        
        if (!this.sessionId) {
            this.showError('Invalid session');
            return;
        }

        this.connect();
        this.setupModeSwitch();
        this.setupUIControls();
        this.setupGameControls();
    }

    connect() {
        socket.emit('join-session', { sessionId: this.sessionId });

        socket.on('player-assigned', (data) => {
            this.playerNumber = data.playerNumber;
            this.updateStatus(`Connected - Player ${this.playerNumber}`);
        });

        socket.on('join-failed', (data) => {
            this.showError(data.reason);
        });
    }

    setupModeSwitch() {
        document.getElementById('ui-mode-btn').onclick = () => this.switchMode('ui');
        document.getElementById('game-mode-btn').onclick = () => this.switchMode('game');
    }

    switchMode(mode) {
        this.mode = mode;
        
        if (mode === 'ui') {
            document.getElementById('ui-controller').classList.remove('hidden');
            document.getElementById('game-controller').classList.add('hidden');
            document.getElementById('ui-mode-btn').classList.add('active');
            document.getElementById('game-mode-btn').classList.remove('active');
            document.getElementById('mode-indicator').textContent = 'UI Mode';
        } else {
            document.getElementById('ui-controller').classList.add('hidden');
            document.getElementById('game-controller').classList.remove('hidden');
            document.getElementById('ui-mode-btn').classList.remove('active');
            document.getElementById('game-mode-btn').classList.add('active');
            document.getElementById('mode-indicator').textContent = 'Game Mode';
        }
    }

    setupUIControls() {
        document.querySelectorAll('[data-ui]').forEach(btn => {
            const action = btn.dataset.ui;
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.sendUICommand(action);
                this.vibrate();
            });
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendUICommand(action);
            });
        });
    }

    setupGameControls() {
        document.querySelectorAll('[data-button]').forEach(btn => {
            const buttonName = btn.dataset.button;
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.sendGameInput(buttonName, true);
                this.vibrate();
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.sendGameInput(buttonName, false);
            });

            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.sendGameInput(buttonName, true);
            });
            
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.sendGameInput(buttonName, false);
            });
        });
    }

    sendUICommand(action) {
        socket.emit('ui-command', {
            sessionId: this.sessionId,
            action
        });
    }

    sendGameInput(button, pressed) {
        socket.emit('controller-input', {
            sessionId: this.sessionId,
            player: this.playerNumber,
            button,
            pressed
        });
    }

    vibrate() {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    updateStatus(status) {
        document.getElementById('status').textContent = status;
    }

    showError(message) {
        document.getElementById('status').textContent = `Error: ${message}`;
        document.getElementById('status').style.color = '#ef4444';
    }
}

new MobileController();
