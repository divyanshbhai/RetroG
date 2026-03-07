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

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.onIceCandidate?.(playerId, event.candidate);
            }
        };

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

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.onIceCandidate?.('host', event.candidate);
            }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offerData.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        return { answer, playerId: offerData.playerId };
    }

    async addIceCandidate(peerId, candidate) {
        const pc = this.peers.get(peerId);
        if (pc) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }

    async setRemoteAnswer(playerId, answer) {
        const pc = this.peers.get(playerId);
        if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }

    setupDataChannel(channel, peerId) {
        this.dataChannels.set(peerId, channel);

        channel.onopen = () => {
            console.log(`DataChannel opened with ${peerId}`);
            this.onConnectionCallback?.(peerId, true);
        };

        channel.onclose = () => {
            console.log(`DataChannel closed with ${peerId}`);
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

    broadcast(data) {
        this.dataChannels.forEach((channel, peerId) => {
            if (channel.readyState === 'open') {
                channel.send(JSON.stringify(data));
            }
        });
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
