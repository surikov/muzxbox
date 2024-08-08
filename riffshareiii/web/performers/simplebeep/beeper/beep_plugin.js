"use strict";
var MZXBX_PluginKind;
(function (MZXBX_PluginKind) {
    MZXBX_PluginKind[MZXBX_PluginKind["Action"] = 0] = "Action";
    MZXBX_PluginKind[MZXBX_PluginKind["Filter"] = 1] = "Filter";
    MZXBX_PluginKind[MZXBX_PluginKind["Sampler"] = 2] = "Sampler";
    MZXBX_PluginKind[MZXBX_PluginKind["Performer"] = 3] = "Performer";
})(MZXBX_PluginKind || (MZXBX_PluginKind = {}));
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
    schedule(when, duraton, pitches, tempo, slides) {
        if (this.audioContext) {
            if (this.volume) {
                this.cancel();
                for (let ii = 0; ii < pitches.length; ii++) {
                    console.log('schedule', when, duraton, pitches[ii], tempo, slides);
                    let oscillator = this.audioContext.createOscillator();
                    let A4frequency = 440.0;
                    let A4half = 48;
                    let frequency = A4frequency * Math.pow(Math.pow(2, (1 / 12)), pitches[ii] - A4half);
                    oscillator.frequency.setValueAtTime(frequency, 0);
                    oscillator.connect(this.volume);
                    oscillator.start(when);
                    oscillator.stop(when + duraton);
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