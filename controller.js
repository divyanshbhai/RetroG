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
        await this.connectToHost();
        this.setupButtons();
    }

    async connectToHost() {
        const playerId = 'player_' + Math.random().toString(36).substr(2, 9);
        
        // Create offer
        const offerData = await this.webrtc.createOffer(playerId);
        offerData.playerId = playerId;
        
        // Send offer via URL hash
        const hostUrl = window.location.origin + window.location.pathname.replace('controller.html', 'index.html');
        window.opener?.postMessage({ type: 'offer', data: offerData }, '*');
        
        // Setup message handlers
        this.webrtc.onMessage((peerId, data) => {
            this.handleMessage(data);
        });

        this.webrtc.onConnection((peerId, connected) => {
            this.connected = connected;
            if (connected) {
                this.updateStatus('Connected');
                this.sendJoinRequest();
            } else {
                this.updateStatus('Disconnected');
            }
        });

        // Simplified connection for demo
        setTimeout(() => {
            this.connected = true;
            this.playerNumber = Math.floor(Math.random() * 4) + 1;
            this.updateStatus('Connected');
            this.updatePlayerInfo();
        }, 1000);
    }

    sendJoinRequest() {
        this.webrtc.send('host', {
            type: 'join',
            sessionId: this.sessionId
        });
    }

    handleMessage(data) {
        if (data.type === 'joined') {
            this.playerNumber = data.playerNumber;
            this.updatePlayerInfo();
        } else if (data.type === 'rejected') {
            this.showError(data.reason);
        }
    }

    setupButtons() {
        const buttons = document.querySelectorAll('[data-button]');
        
        buttons.forEach(btn => {
            const buttonName = btn.dataset.button;
            
            // Touch events
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.sendButtonEvent(buttonName, true);
                this.vibrate();
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.sendButtonEvent(buttonName, false);
            });

            // Mouse events for testing
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.sendButtonEvent(buttonName, true);
            });
            
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.sendButtonEvent(buttonName, false);
            });
        });
    }

    sendButtonEvent(button, pressed) {
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
        document.getElementById('status').className = 'text-xl font-bold text-red-500';
    }
}

new MobileController();
