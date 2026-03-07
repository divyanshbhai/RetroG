import { WebRTCManager } from './webrtc-manager.js';

class MobileController {
    constructor() {
        this.webrtc = new WebRTCManager(false);
        this.sessionId = null;
        this.playerNumber = null;
        this.connected = false;
        
        this.init();
    }

    async init() {
        this.sessionId = new URLSearchParams(window.location.search).get('session');
        
        if (!this.sessionId) {
            this.showError('Invalid session');
            return;
        }

        this.updateStatus('Connecting...');
        await this.connect();
        this.setupButtons();
    }

    async connect() {
        setTimeout(() => {
            this.connected = true;
            this.playerNumber = Math.floor(Math.random() * 4) + 1;
            this.updateStatus('Connected');
            this.updatePlayerInfo();
        }, 1000);
    }

    setupButtons() {
        const buttons = document.querySelectorAll('[data-button]');
        
        buttons.forEach(btn => {
            const buttonName = btn.dataset.button;
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.sendInput(buttonName, true);
                this.vibrate();
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.sendInput(buttonName, false);
            });

            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.sendInput(buttonName, true);
            });
            
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.sendInput(buttonName, false);
            });
        });
    }

    sendInput(button, pressed) {
        if (!this.connected) return;

        this.webrtc.send('host', {
            type: 'button',
            button: button,
            pressed: pressed,
            player: this.playerNumber
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

    updatePlayerInfo() {
        document.getElementById('player-info').textContent = `Player ${this.playerNumber}`;
    }

    showError(message) {
        document.getElementById('status').textContent = `Error: ${message}`;
        document.getElementById('status').style.color = '#ef4444';
    }
}

new MobileController();
