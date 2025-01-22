"use strict";
console.log('zvolume');
class ZVolImplementation {
    launch(context, parameters) {
        this.audioContext = context;
        this.volume = this.audioContext.createGain();
        this.num = parseInt(parameters);
        this.volume.gain.setValueAtTime(this.num / 100, 0);
    }
    busy() {
        return null;
    }
    schedule(when, parameters) {
        this.volume.gain.setValueAtTime(this.num / 100, when);
        this.num = parseInt(parameters);
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
class ZVUI {
    init() {
        console.log('ZVUI init');
    }
}
function initZVUI() {
    let zz = new ZVUI();
    zz.init();
}
//# sourceMappingURL=zvolume_plugin.js.map