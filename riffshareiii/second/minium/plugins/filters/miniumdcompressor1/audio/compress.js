"use strict";
console.log('Compressor v1.0');
class CompressorImplementation {
    constructor() {
        this.num = 100;
    }
    launch(context, parameters) {
        if (this.audioContext) {
        }
        else {
            this.audioContext = context;
            this.inputNode = this.audioContext.createGain();
            this.outputNode = this.audioContext.createGain();
            this.compressor = this.audioContext.createDynamicsCompressor();
            var threshold = -40;
            var knee = 35;
            var ratio = 15;
            var attack = 0.02;
            var release = 0.91;
            this.compressor.threshold.setValueAtTime(threshold, this.audioContext.currentTime + 0.0001);
            this.compressor.knee.setValueAtTime(knee, this.audioContext.currentTime + 0.0001);
            this.compressor.ratio.setValueAtTime(ratio, this.audioContext.currentTime + 0.0001);
            this.compressor.attack.setValueAtTime(attack, this.audioContext.currentTime + 0.0001);
            this.compressor.release.setValueAtTime(release, this.audioContext.currentTime + 0.0001);
            this.dry = this.audioContext.createGain();
            this.wet = this.audioContext.createGain();
            this.dry.gain.setTargetAtTime(0.001, 0, 0.0001);
            this.wet.gain.setTargetAtTime(0.999, 0, 0.0001);
            this.inputNode.connect(this.dry);
            this.inputNode.connect(this.compressor);
            this.compressor.connect(this.wet);
            this.dry.connect(this.outputNode);
            this.wet.connect(this.outputNode);
        }
        this.schedule(this.audioContext.currentTime + 0.0001, 120, parameters);
    }
    busy() {
        return null;
    }
    schedule(when, tempo, parameters) {
        this.parseParameters(parameters);
        this.wet.gain.setValueAtTime(this.num, when);
        this.dry.gain.setValueAtTime(1 - this.num, when);
        this.wet.gain.linearRampToValueAtTime(this.num / 100, when + 0.001);
        this.dry.gain.linearRampToValueAtTime(1 - this.num / 100, when + 0.001);
    }
    input() {
        return this.inputNode;
    }
    output() {
        return this.outputNode;
    }
    parseParameters(parameters) {
        this.num = parseInt(parameters);
        this.num = (this.num) ? this.num : 0;
        this.num = 1 * this.num;
        this.num = (this.num < 0) ? 0 : this.num;
        this.num = (this.num > 100) ? 100 : this.num;
    }
}
function newBaseCompressor() {
    return new CompressorImplementation();
}
//# sourceMappingURL=compress.js.map