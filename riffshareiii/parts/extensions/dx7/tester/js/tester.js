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
let defaultBrass1test = {
    algorithm: 22,
    feedback: 7,
    operators: [
        {
            rates: [
                72,
                76,
                99,
                71
            ],
            levels: [
                99,
                88,
                96,
                0
            ],
            keyScaleBreakpoint: 39,
            keyScaleDepthL: 0,
            keyScaleDepthR: 14,
            keyScaleCurveL: 3,
            keyScaleCurveR: 3,
            keyScaleRate: 0,
            detune: 7,
            lfoAmpModSens: 0,
            velocitySens: 0,
            volume: 98,
            oscMode: 0,
            freqCoarse: 0,
            freqFine: 0,
            pan: 0,
            idx: 0,
            enabled: true,
            outputLevel: 15.282672,
            freqRatio: 0.5,
            ampL: 0.7071067811865476,
            ampR: 0.7071067811865475,
            freqFixed: 0
        },
        {
            rates: [
                62,
                51,
                29,
                71
            ],
            levels: [
                82,
                95,
                96,
                0
            ],
            keyScaleBreakpoint: 27,
            keyScaleDepthL: 0,
            keyScaleDepthR: 7,
            keyScaleCurveL: 3,
            keyScaleCurveR: 1,
            keyScaleRate: 0,
            detune: 7,
            lfoAmpModSens: 0,
            velocitySens: 0,
            volume: 86,
            oscMode: 0,
            freqCoarse: 0,
            freqFine: 0,
            pan: 25,
            idx: 1,
            enabled: true,
            outputLevel: 5.40323913,
            freqRatio: 0.5,
            ampL: 0.38268343236508984,
            ampR: 0.9238795325112867,
            freqFixed: 0
        },
        {
            rates: [
                77,
                76,
                82,
                71
            ],
            levels: [
                99,
                98,
                98,
                0
            ],
            keyScaleBreakpoint: 39,
            keyScaleDepthL: 0,
            keyScaleDepthR: 0,
            keyScaleCurveL: 3,
            keyScaleCurveR: 3,
            keyScaleRate: 0,
            detune: -2,
            lfoAmpModSens: 0,
            velocitySens: 2,
            volume: 99,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            pan: -25,
            idx: 2,
            enabled: true,
            outputLevel: 16.6658671,
            freqRatio: 1,
            ampL: 0.9238795325112867,
            ampR: 0.3826834323650898,
            freqFixed: 0
        },
        {
            rates: [
                77,
                36,
                41,
                71
            ],
            levels: [
                99,
                98,
                98,
                0
            ],
            keyScaleBreakpoint: 39,
            keyScaleDepthL: 0,
            keyScaleDepthR: 0,
            keyScaleCurveL: 3,
            keyScaleCurveR: 3,
            keyScaleRate: 0,
            detune: 0,
            lfoAmpModSens: 0,
            velocitySens: 2,
            volume: 99,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            pan: 0,
            idx: 3,
            enabled: true,
            outputLevel: 16.6658671,
            freqRatio: 1,
            ampL: 0.7071067811865476,
            ampR: 0.7071067811865475,
            freqFixed: 0
        },
        {
            rates: [
                77,
                36,
                41,
                71
            ],
            levels: [
                99,
                98,
                98,
                0
            ],
            keyScaleBreakpoint: 39,
            keyScaleDepthL: 0,
            keyScaleDepthR: 0,
            keyScaleCurveL: 3,
            keyScaleCurveR: 3,
            keyScaleRate: 0,
            detune: 1,
            lfoAmpModSens: 0,
            velocitySens: 2,
            volume: 98,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            pan: 25,
            idx: 4,
            enabled: true,
            outputLevel: 15.282672,
            freqRatio: 1,
            ampL: 0.38268343236508984,
            ampR: 0.9238795325112867,
            freqFixed: 0
        },
        {
            rates: [
                49,
                99,
                28,
                68
            ],
            levels: [
                98,
                98,
                91,
                0
            ],
            keyScaleBreakpoint: 39,
            keyScaleDepthL: 54,
            keyScaleDepthR: 50,
            keyScaleCurveL: 1,
            keyScaleCurveR: 1,
            keyScaleRate: 4,
            detune: 0,
            lfoAmpModSens: 0,
            velocitySens: 2,
            volume: 82,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            pan: -25,
            idx: 5,
            enabled: true,
            outputLevel: 3.8206667299999997,
            freqRatio: 1,
            ampL: 0.9238795325112867,
            ampR: 0.3826834323650898,
            freqFixed: 0
        }
    ],
    name: "BRASS   1 ",
    lfoSpeed: 37,
    lfoDelay: 0,
    lfoPitchModDepth: 5,
    lfoAmpModDepth: 0,
    lfoPitchModSens: 3,
    lfoWaveform: 4,
    lfoSync: 0,
    pitchEnvelope: {
        rates: [
            84,
            95,
            95,
            60
        ],
        levels: [
            50,
            50,
            50,
            50
        ]
    },
    controllerModVal: 0,
    aftertouchEnabled: 0,
    fbRatio: 1
};
class EnvelopeNode {
    constructor(ctx) {
        this.minTimeDelta = 0.005;
        this.maxReleaseDelta = 0.5;
        this.envelopeContext = ctx;
        this.envelopeGain = this.envelopeContext.createGain();
    }
    down0now() {
        this.envelopeGain.gain.cancelScheduledValues(this.envelopeContext.currentTime);
        this.envelopeGain.gain.linearRampToValueAtTime(0, this.envelopeContext.currentTime + this.minTimeDelta);
    }
    slopeDuration(preLevel, nextLevel, rate) {
        let volDiff = Math.abs(preLevel - nextLevel) / 100;
        let radians = rate * ((Math.PI * 0.5) / 100);
        let timeDiff = volDiff / Math.tan(radians);
        return timeDiff;
    }
    setLevelRate(level1, rate1, level2, rate2, level3, rate3, level4, rate4, when, duration) {
        let whenLevel1 = when + this.slopeDuration(level4, level1, rate1);
        let whenLevel2 = whenLevel1 + this.slopeDuration(level1, level2, rate2);
        let whenLevel3 = whenLevel2 + this.slopeDuration(level2, level3, rate3);
        let whenLevel4 = when + duration + this.slopeDuration(level3, level4, rate4);
        this.down0now();
        this.envelopeGain.gain.linearRampToValueAtTime(level4 / 100, when);
        this.envelopeGain.gain.linearRampToValueAtTime(level1 / 100, whenLevel1);
        this.envelopeGain.gain.linearRampToValueAtTime(level2 / 100, whenLevel2);
        this.envelopeGain.gain.linearRampToValueAtTime(level3 / 100, whenLevel3);
        this.envelopeGain.gain.cancelAndHoldAtTime(when + duration);
        this.envelopeGain.gain.linearRampToValueAtTime(level4 / 100, whenLevel4);
        this.envelopeGain.gain.cancelAndHoldAtTime(when + duration + this.maxReleaseDelta);
        this.envelopeGain.gain.linearRampToValueAtTime(0, when + duration + this.maxReleaseDelta + this.minTimeDelta);
    }
}
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
        this.testVox.startPlayNote(this.moContext.currentTime + 0.3, 3, 69);
    }
}
class OperatorDX7 {
    constructor(cntxt) {
        this.minimalDelta = 0.001;
        this.onNotOff = false;
        this.adsr = {
            attackDuration: 0.01,
            attackVolume: 1,
            decayDuration: 0.02,
            decayVolume: 0.5,
            releaseDuration: 0.2
        };
        this.ocntxt = cntxt;
        this.envelope = new EnvelopeNode(this.ocntxt);
        this.osc = this.ocntxt.createOscillator();
        this.osc.connect(this.envelope.envelopeGain);
        this.outGain = this.ocntxt.createGain();
        this.envelope.envelopeGain.connect(this.outGain);
        this.envelope.down0now();
        this.osc.start(this.ocntxt.currentTime + this.envelope.minTimeDelta);
    }
    frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }
    ;
    startOperator(level1, rate1, level2, rate2, level3, rate3, level4, rate4, when, duration, pitch, oscMode, freqRatio, freqFixed) {
        if (this.onNotOff) {
            console.log('startOperator', when, pitch);
            this.envelope.setLevelRate(level1, rate1, level2, rate2, level3, rate3, level4, rate4, when, duration);
            let opefrequency = freqRatio * this.frequencyFromNoteNumber(pitch);
            if (oscMode > 0) {
                opefrequency = freqFixed;
            }
            this.osc.frequency.setValueAtTime(opefrequency, this.ocntxt.currentTime);
        }
    }
    connectToOutputNode(outNode) {
        this.outGain.connect(outNode);
    }
    connectSendToOperator(opDX7) {
        this.outGain.connect(opDX7.osc.detune);
    }
}
class VoiceDX7 {
    constructor(destination, aContext) {
        this.dx7voxData = defaultBrass1test;
        console.log('new VoiceDX7', aContext.currentTime);
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
        for (let ii = 0; ii < this.operators.length; ii++) {
            this.operators[ii].onNotOff = true;
        }
        this.connectMixOperators(matrixAlgorithmsDX7[defaultBrass1test.algorithm]);
    }
    startPlayNote(when, duration, pitch) {
        console.log('startPlayNote', when, pitch, this.voContext.currentTime);
        for (let ii = 0; ii < this.operators.length; ii++) {
            let operadata = this.dx7voxData.operators[ii];
            this.operators[ii].startOperator(operadata.levels[0], operadata.rates[0], operadata.levels[1], operadata.rates[1], operadata.levels[2], operadata.rates[2], operadata.levels[3], operadata.rates[3], when, duration, pitch, operadata.oscMode, operadata.freqRatio, operadata.freqFixed);
        }
    }
    connectMixOperators(scheme) {
        for (let ii = 0; ii < scheme.outputMix.length; ii++) {
            let outIdx = scheme.outputMix[ii];
            this.operators[outIdx].connectToOutputNode(this.voxoutput);
        }
        for (let ii = 0; ii < scheme.modulationMatrix.length; ii++) {
            let pars = scheme.modulationMatrix[ii];
            for (let pp = 0; pp < pars.length; pp++) {
                this.operators[pp].connectSendToOperator(this.operators[ii]);
            }
        }
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