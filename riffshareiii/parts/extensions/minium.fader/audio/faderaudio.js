"use strict";
console.log('Fader v1.0');
class FaderImplementation {
    constructor() {
        this.volVal = 0;
    }
    launch(context, parameters) {
        this.audioContext = context;
        this.volumeNode = this.audioContext.createGain();
        this.schedule(this.audioContext.currentTime + 0.001, 120, parameters);
    }
    busy() {
        return null;
    }
    schedule(when, tempo, parameters) {
        this.parseParameters(parameters);
        this.volumeNode.gain.setValueAtTime(this.volVal / 100, when);
        this.volumeNode.gain.linearRampToValueAtTime(this.volVal / 100, when + 0.001);
    }
    input() {
        return this.volumeNode;
    }
    output() {
        return this.volumeNode;
    }
    parseParameters(parameters) {
        this.volVal = parseInt(parameters);
        this.volVal = (this.volVal) ? this.volVal : 0;
        this.volVal = 1 * this.volVal;
        this.volVal = (this.volVal < 0) ? 0 : this.volVal;
        this.volVal = (this.volVal > 150) ? 150 : this.volVal;
    }
}
function newBaseFader() {
    return new FaderImplementation();
}
//# sourceMappingURL=faderaudio.js.map