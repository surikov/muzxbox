"use strict";
console.log('test volume plugin v1.01');
class SimpleSinePerformer {
    reset(context, parameters) {
        console.log('reset', this);
        if (this.out) {
        }
        else {
            this.audioContext = context;
            this.out = this.audioContext.createGain();
            this.poll = [];
        }
        return true;
    }
    schedule(when, pitch, slides) {
        console.log('schedule', this);
        this.cleanup();
        let oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(this.freq(pitch), when);
        let duration = 0;
        for (let i = 1; i < slides.length; i++) {
            duration = duration + slides[i].duration;
        }
        let nextPointSeconds = when + slides[0].duration;
        for (let i = 1; i < slides.length; i++) {
            oscillator.frequency.linearRampToValueAtTime(this.freq(slides[i].delta + pitch), nextPointSeconds);
            nextPointSeconds = nextPointSeconds + slides[i].duration;
        }
        oscillator.connect(this.out);
        oscillator.start(when);
        oscillator.stop(nextPointSeconds);
        this.poll.push({ node: oscillator, end: nextPointSeconds });
    }
    cancel() {
        console.log('cancel', this);
    }
    output() {
        return this.out;
    }
    freq(key) {
        let O4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
        let half = Math.floor(key % 12);
        let octave = Math.floor(key / 12);
        let freq0 = O4[half] / (2 * 2 * 2 * 2);
        return freq0 * Math.pow(2, octave);
    }
    cancelSchedule() {
        for (let i = 0; i < this.poll.length; i++) {
            this.poll[i].node.stop();
        }
    }
    nextClear() {
        for (let i = 0; i < this.poll.length; i++) {
            if (this.poll[i].end < this.audioContext.currentTime) {
                try {
                    this.poll[i].node.stop();
                    this.poll[i].node.disconnect();
                }
                catch (x) {
                    console.log(x);
                }
                this.poll.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    cleanup() {
        while (this.nextClear()) {
        }
        ;
    }
}
function testPluginSingleWave() {
    console.log('new testPluginSingleWave');
    return new SimpleSinePerformer();
}
//# sourceMappingURL=testsinewave.js.map