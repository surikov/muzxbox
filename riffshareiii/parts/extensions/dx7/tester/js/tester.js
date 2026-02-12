"use strict";
let matrixAlgorithmsDX7 = [
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], [5]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [1], [3], [4], [5], []] },
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [5]] },
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [3]] },
    { outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [5]] },
    { outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [4]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], [5]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [3], [5], []] },
    { outputMix: [0, 2], modulationMatrix: [[1], [1], [3, 4], [], [5], []] },
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [2], [4, 5], [], []] },
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4, 5], [], [5]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [1], [3, 4, 5], [], [], []] },
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4, 5], [], [], [5]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4, 5], [], [5]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [1], [3], [4, 5], [], []] },
    { outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], [5]] },
    { outputMix: [0], modulationMatrix: [[1, 2, 4], [1], [3], [], [5], []] },
    { outputMix: [0], modulationMatrix: [[1, 2, 3], [], [2], [4], [5], []] },
    { outputMix: [0, 3, 4], modulationMatrix: [[1], [2], [], [5], [5], [5]] },
    { outputMix: [0, 1, 3], modulationMatrix: [[2], [2], [2], [4, 5], [], []] },
    { outputMix: [0, 1, 3, 4], modulationMatrix: [[2], [2], [2], [5], [5], []] },
    { outputMix: [0, 2, 3, 4], modulationMatrix: [[1], [], [5], [5], [5], [5]] },
    { outputMix: [0, 1, 3, 4], modulationMatrix: [[], [2], [], [5], [5], [5]] },
    { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [5], [5], [5], [5]] },
    { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [5], [5], [5]] },
    { outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], [5]] },
    { outputMix: [0, 1, 3], modulationMatrix: [[], [2], [2], [4, 5], [], []] },
    { outputMix: [0, 2, 5], modulationMatrix: [[1], [], [3], [4], [4], []] },
    { outputMix: [0, 1, 2, 4], modulationMatrix: [[], [], [3], [], [5], [5]] },
    { outputMix: [0, 1, 2, 5], modulationMatrix: [[], [], [3], [4], [4], []] },
    { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [], [5], [5]] },
    { outputMix: [0, 1, 2, 3, 4, 5], modulationMatrix: [[], [], [], [], [], [5]] }
];
class SynthDX7 {
    constructor(audioContext) {
        this.testVox = null;
        console.log('new SynthDX7');
        this.moContext = audioContext;
        this.output = this.moContext.createGain();
        this.output.connect(this.moContext.destination);
    }
    test() {
        console.log('SynthDX7 test');
        if (this.testVox == null) {
            this.testVox = new VoiceDX7(this.output, this.moContext);
        }
        this.testVox.startPlayNote(this.moContext.currentTime + 0.1, 0.99, 61);
    }
}
class OperatorDX7 {
    constructor(cntxt) {
        this.outOperators = [];
        this.outDestination = null;
        this.onNotOff = false;
        this.osc = null;
        this.adsr = {
            attackDuration: 0.01,
            attackVolume: 1,
            decayDuration: 0.02,
            decayVolume: 0.5,
            releaseDuration: 0.03
        };
        this.freqRatio = 1;
        this.ocntxt = cntxt;
        this.oenvelope = this.ocntxt.createGain();
    }
    frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }
    ;
    startOperator(when, duration, pitch) {
        if (this.onNotOff) {
            console.log('startOperator', when, pitch);
            this.oenvelope.disconnect();
            this.oenvelope.gain.setValueAtTime(0, when);
            this.oenvelope.gain.linearRampToValueAtTime(this.adsr.attackVolume, when + this.adsr.attackDuration);
            this.oenvelope.gain.linearRampToValueAtTime(this.adsr.decayVolume, when + this.adsr.attackDuration + this.adsr.decayDuration);
            this.oenvelope.gain.linearRampToValueAtTime(this.adsr.decayVolume, when + duration);
            this.oenvelope.gain.linearRampToValueAtTime(0, when + duration + this.adsr.releaseDuration);
            if (this.outDestination) {
                this.oenvelope.connect(this.outDestination);
            }
            this.osc = this.ocntxt.createOscillator();
            this.osc.connect(this.oenvelope);
            this.osc.frequency.setValueAtTime(this.freqRatio * this.frequencyFromNoteNumber(pitch), when);
            this.osc.start(when);
            this.osc.stop(when + duration + this.adsr.releaseDuration);
        }
    }
}
class VoiceDX7 {
    constructor(destination, aContext) {
        console.log('new VoiceDX7');
        this.voContext = aContext;
        this.voxoutput = this.voContext.createGain();
        this.voxoutput.connect(destination);
        this.operators = [];
        this.operators[0] = new OperatorDX7(this.voContext);
        this.operators[1] = new OperatorDX7(this.voContext);
        this.operators[2] = new OperatorDX7(this.voContext);
        this.operators[3] = new OperatorDX7(this.voContext);
        this.operators[4] = new OperatorDX7(this.voContext);
        this.operators[5] = new OperatorDX7(this.voContext);
        this.operators[0].onNotOff = true;
        this.operators[0].outDestination = destination;
        this.operators[1].onNotOff = true;
        this.operators[1].freqRatio = 1.5;
        this.operators[1].outDestination = destination;
    }
    startPlayNote(when, duration, pitch) {
        console.log('startPlayNote', when, pitch);
        for (let ii = 0; ii < this.operators.length; ii++) {
            this.operators[ii].startOperator(when, duration, pitch);
        }
    }
    connectOperators(scheme) {
    }
}
let synth;
function initTester() {
    console.log('initTester');
    let audioContext = new window.AudioContext();
    synth = new SynthDX7(audioContext);
}
function testPlay() {
    console.log('testPlay');
    synth.test();
}
//# sourceMappingURL=tester.js.map