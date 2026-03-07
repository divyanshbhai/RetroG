export class WebRTCManager {
    constructor(isHost = false) {
        this.isHost = isHost;
        this.peers = new Map();
        this.dataChannels = new Map();
        this.onMessageCallback = null;
        this.onConnectionCallback = null;
        this.config = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
    }

    async createOffer(playerId) {
        const pc = new RTCPeerConnection(this.config);
        this.peers.set(playerId, pc);

        const channel = pc.createDataChannel('controller');
        this.setupDataChannel(channel, playerId);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        return { offer, playerId };
    }

    async createAnswer(offerData) {
        const pc = new RTCPeerConnection(this.config);
        this.peers.set('host', pc);

        pc.ondatachannel = (event) => {
            this.setupDataChannel(event.channel, 'host');
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offerData.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        return { answer, playerId: offerData.playerId };
    }

    setupDataChannel(channel, peerId) {
        this.dataChannels.set(peerId, channel);

        channel.onopen = () => {
            this.onConnectionCallback?.(peerId, true);
        };

        channel.onclose = () => {
            this.onConnectionCallback?.(peerId, false);
        };

        channel.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.onMessageCallback?.(peerId, data);
        };
    }

    send(peerId, data) {
        const channel = this.dataChannels.get(peerId);
        if (channel && channel.readyState === 'open') {
            channel.send(JSON.stringify(data));
        }
    }

    onMessage(callback) {
        this.onMessageCallback = callback;
    }

    onConnection(callback) {
        this.onConnectionCallback = callback;
    }

    closeAll() {
        this.dataChannels.forEach(channel => channel.close());
        this.peers.forEach(pc => pc.close());
        this.dataChannels.clear();
        this.peers.clear();
    }
}
