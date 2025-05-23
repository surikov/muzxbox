"use strict";
console.log('zvolume v1.0');
class ZVolImplementation {
    constructor() {
        this.num = 0;
    }
    launch(context, parameters) {
        this.audioContext = context;
        this.volume = this.audioContext.createGain();
        this.schedule(this.audioContext.currentTime + 0.001, 120, parameters);
    }
    busy() {
        return null;
    }
    schedule(when, tempo, parameters) {
        this.volume.gain.setValueAtTime(this.num / 100, when);
        this.num = parseInt(parameters);
        this.num = (this.num) ? this.num : 0;
        if (this.num < 0)
            this.num = 0;
        if (this.num > 100)
            this.num = 100;
        this.volume.gain.linearRampToValueAtTime(this.num / 100, when + 0.001);
    }
    input() {
        return this.volume;
    }
    output() {
        return this.volume;
    }
}
function newZvoogVolumeImplementation() {
    return new ZVolImplementation();
}
//# sourceMappingURL=zvolume_plugin.js.map