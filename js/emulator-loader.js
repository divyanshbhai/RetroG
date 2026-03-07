export class EmulatorLoader {
    constructor() {
        this.currentEmulator = null;
    }

    load(core, romPath) {
        window.EJS_player = '#game-canvas';
        window.EJS_core = core;
        window.EJS_gameUrl = romPath;
        window.EJS_pathtodata = 'https://cdn.jsdelivr.net/npm/emulatorjs@latest/data/';
        
        if (window.EJS_emulator) {
            window.EJS_emulator.destroy?.();
        }
    }

    unload() {
        if (window.EJS_emulator) {
            window.EJS_emulator.destroy?.();
        }
    }
}
