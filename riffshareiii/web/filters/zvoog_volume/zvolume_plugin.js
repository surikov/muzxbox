"use strict";
console.log('zvolume');
class ZVolImplementation {
    launch(context, parameters) {
        console.log('ZVolImplementation launch', parameters);
        this.audioContext = context;
        this.volume = this.audioContext.createGain();
        this.num = parseInt(parameters);
        this.volume.gain.setValueAtTime(this.num / 100, 0);
    }
    busy() {
        return null;
    }
    schedule(when, parameters) {
        console.log('ZVolImplementation schedule', when, parameters);
        this.volume.gain.setValueAtTime(this.num / 100, when);
        this.num = parseInt(parameters);
        this.volume.gain.linearRampToValueAtTime(0.7 * this.num, when + 0.001);
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