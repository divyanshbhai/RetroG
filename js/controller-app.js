class MobileController {
    constructor() {
        this.ws = null;
        this.sessionId = null;
        this.mode = 'ui';
        this.connected = false;
        
        this.init();
    }

    async init() {
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
        const tvUrl = window.location.origin + window.location.pathname.replace('controller.html', '');
        
        window.addEventListener('storage', (e) => {
            if (e.key === `controller_${this.sessionId}`) {
                const data = JSON.parse(e.newValue);
                this.handleMessage(data);
            }
        });

        setTimeout(() => {
            this.connected = true;
            this.updateStatus('Connected');
            this.sendMessage({ type: 'connect', sessionId: this.sessionId });
        }, 500);
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
        const buttons = document.querySelectorAll('[data-ui]');
        
        buttons.forEach(btn => {
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
        const buttons = document.querySelectorAll('[data-button]');
        
        buttons.forEach(btn => {
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
        if (!this.connected) return;
        this.sendMessage({ type: 'ui', action });
    }

    sendGameInput(button, pressed) {
        if (!this.connected) return;
        this.sendMessage({ type: 'button', button, pressed });
    }

    sendMessage(data) {
        localStorage.setItem(`tv_${this.sessionId}`, JSON.stringify({
            ...data,
            timestamp: Date.now()
        }));
    }

    handleMessage(data) {
        if (data.type === 'mode') {
            this.switchMode(data.mode);
        }
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
