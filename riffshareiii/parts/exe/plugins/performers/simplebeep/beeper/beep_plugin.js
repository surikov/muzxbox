"use strict";
console.log('Simple beep plugin? build 1');
class SimpleBeepImplementation {
    constructor() {
        this.oscillators = [];
    }
    launch(context, parameters) {
        this.audioContext = context;
        this.volume = this.audioContext.createGain();
        this.volume.gain.setValueAtTime(0.7, 0);
    }
    busy() {
        return null;
    }
    clear() {
        this.oscillators = this.oscillators.filter((it) => {
            if (it.done < this.audioContext.currentTime) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    strum(when, pitches, tempo, slides) {
        if (this.audioContext) {
            if (this.volume) {
                this.clear();
                let duration = 0;
                for (let ss = 0; ss < slides.length; ss++) {
                    duration = duration + slides[ss].duration;
                }
                let A4frequency = 440.0;
                let A4half = 48;
                for (let ii = 0; ii < pitches.length; ii++) {
                    let currentWhen = when;
                    let oscillator = this.audioContext.createOscillator();
                    let currentPitch = pitches[ii];
                    let frequency = A4frequency * Math.pow(Math.pow(2, (1 / 12)), currentPitch - A4half);
                    oscillator.frequency.setValueAtTime(frequency, when);
                    for (let ss = 0; ss < slides.length; ss++) {
                        let bend = slides[ss];
                        currentWhen = currentWhen + bend.duration;
                        currentPitch = currentPitch + bend.delta;
                        frequency = A4frequency * Math.pow(Math.pow(2, (1 / 12)), currentPitch - A4half);
                        oscillator.frequency.linearRampToValueAtTime(frequency, currentWhen);
                    }
                    oscillator.connect(this.volume);
                    oscillator.start(when);
                    oscillator.stop(when + duration);
                    oscillator.done = when + duration;
                    this.oscillators.push(oscillator);
                }
            }
        }
    }
    cancel() {
        for (let ii = 0; ii < this.oscillators.length; ii++) {
            this.oscillators[ii].stop(0);
        }
        this.oscillators = [];
    }
    output() {
        if (this.volume) {
            return this.volume;
        }
        else {
            return null;
        }
    }
}
function newSimpleBeepImplementation() {
    return new SimpleBeepImplementation();
}
//# sourceMappingURL=beep_plugin.js.map