"use strict";
class DefaultBaseOscillatorPlayer {
    constructor() {
        this.velocityRatio = 0.33;
        this.preRamp = 0.01;
        this.afterRamp = 0.05;
        this.rampZero = 0.000001;
    }
    setup(context) {
        if (!(this.audioContext)) {
            this.audioContext = context;
            this.poll = [];
        }
    }
    send(when, pitch, slides, target, type) {
        let volume = 0.95;
        let it = this.takePollItem(target);
        it.oscillatorNode = this.audioContext.createOscillator();
        it.oscillatorNode.type = type;
        it.oscillatorNode.frequency.setValueAtTime(this.freq(pitch), when - this.preRamp);
        let duration = 0;
        for (let i = 0; i < slides.length; i++) {
            duration = duration + slides[i].duration;
        }
        let nextPointSeconds = when + slides[0].duration;
        for (let i = 0; i < slides.length; i++) {
            it.oscillatorNode.frequency.linearRampToValueAtTime(this.freq(slides[i].delta + pitch), nextPointSeconds);
            nextPointSeconds = nextPointSeconds + slides[i].duration;
        }
        it.oscillatorNode.connect(it.gainNode);
        it.oscillatorNode.start(when - this.preRamp);
        it.oscillatorNode.stop(when + duration + this.afterRamp);
        it.gainNode.gain.cancelScheduledValues(when - this.preRamp);
        it.gainNode.gain.exponentialRampToValueAtTime(this.rampZero, when - this.preRamp);
        it.gainNode.gain.exponentialRampToValueAtTime(volume * this.velocityRatio, when);
        it.gainNode.gain.exponentialRampToValueAtTime(volume * this.velocityRatio, when + duration);
        it.gainNode.gain.exponentialRampToValueAtTime(this.rampZero, when + duration + this.afterRamp);
        it.end = when + duration + this.preRamp + this.afterRamp;
    }
    freq(key) {
        let O4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
        let half = Math.floor(key % 12);
        let octave = Math.floor(key / 12);
        let freq0 = O4[half] / (2 * 2 * 2 * 2);
        return freq0 * Math.pow(2, octave);
    }
    cancel() {
        for (let i = 0; i < this.poll.length; i++) {
            let o = this.poll[i].oscillatorNode;
            if (o) {
                o.stop();
                o.disconnect(this.poll[i].gainNode);
            }
        }
    }
    takePollItem(target) {
        for (let i = 0; i < this.poll.length; i++) {
            if (this.poll[i].end < this.audioContext.currentTime && this.poll[i].end > -1) {
                let o = this.poll[i].oscillatorNode;
                if (o) {
                    o.disconnect(this.poll[i].gainNode);
                }
                return this.poll[i];
            }
        }
        let it = { gainNode: this.audioContext.createGain(), oscillatorNode: null, end: -1 };
        it.gainNode.connect(target);
        this.poll.push(it);
        return it;
    }
}
class SimpleSinePerformer {
    constructor() {
        this.type = 'sine';
    }
    launch(context, parameters) {
        if (this.player) {
        }
        else {
            this.player = new DefaultBaseOscillatorPlayer();
            this.player.setup(context);
            this.out = context.createGain();
        }
        if (parameters == 'sine')
            this.type = 'sine';
        if (parameters == 'square')
            this.type = 'square';
        if (parameters == 'sawtooth')
            this.type = 'sawtooth';
        if (parameters == 'triangle')
            this.type = 'triangle';
    }
    busy() {
        return null;
    }
    schedule(when, pitch, slides) {
        this.player.send(when, pitch, slides, this.out, this.type);
    }
    output() {
        return this.out;
    }
    cancel() {
        this.player.cancel();
    }
}
function testPluginSingleWave() {
    return new SimpleSinePerformer();
}
//# sourceMappingURL=testsinewave.js.map