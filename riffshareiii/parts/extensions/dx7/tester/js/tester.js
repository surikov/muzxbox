"use strict";
let matrixConnectionAlgorithmsDX7 = [
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
let epiano1preset = {
    "algorithm": 5,
    "feedback": 6,
    "operators": [
        {
            rates: [
                96,
                25,
                25,
                67
            ],
            "levels": [
                99,
                75,
                0,
                0
            ],
            "detune": 3,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": true
        },
        {
            "rates": [
                95,
                50,
                35,
                78
            ],
            "levels": [
                99,
                75,
                0,
                0
            ],
            "detune": 0,
            "volume": 58,
            "oscMode": 0,
            "freqCoarse": 14,
            "freqFine": 0,
            "enabled": false
        },
        {
            rates: [
                95,
                20,
                20,
                50
            ],
            "levels": [
                99,
                95,
                0,
                0
            ],
            "detune": 0,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": false
        },
        {
            "rates": [
                95,
                29,
                20,
                50
            ],
            "levels": [
                99,
                95,
                0,
                0
            ],
            "detune": 0,
            "volume": 89,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": false
        },
        {
            "rates": [
                95,
                20,
                20,
                50
            ],
            "levels": [
                99,
                95,
                0,
                0
            ],
            "detune": -7,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": false
        },
        {
            "rates": [
                95,
                29,
                20,
                50
            ],
            "levels": [
                99,
                95,
                0,
                0
            ],
            "detune": 7,
            "volume": 79,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": false
        }
    ],
    "name": "E.PIANO 1 ",
};
let defaultBrass1test = {
    "algorithm": 22,
    "feedback": 7,
    "operators": [
        {
            "rates": [
                72,
                76,
                99,
                71
            ],
            "levels": [
                99,
                88,
                96,
                0
            ],
            "keyScaleBreakpoint": 39,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 14,
            "keyScaleCurveL": 3,
            "keyScaleCurveR": 3,
            "keyScaleRate": 0,
            "detune": 7,
            "lfoAmpModSens": 0,
            "velocitySens": 0,
            "volume": 98,
            "oscMode": 0,
            "freqCoarse": 0,
            "freqFine": 0,
            "pan": 0,
            "idx": 0,
            "enabled": true
        },
        {
            "rates": [
                62,
                51,
                29,
                71
            ],
            "levels": [
                82,
                95,
                96,
                0
            ],
            "keyScaleBreakpoint": 27,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 7,
            "keyScaleCurveL": 3,
            "keyScaleCurveR": 1,
            "keyScaleRate": 0,
            "detune": 7,
            "lfoAmpModSens": 0,
            "velocitySens": 0,
            "volume": 86,
            "oscMode": 0,
            "freqCoarse": 0,
            "freqFine": 0,
            "pan": 25,
            "idx": 1,
            "enabled": true
        },
        {
            "rates": [
                77,
                76,
                82,
                71
            ],
            "levels": [
                99,
                98,
                98,
                0
            ],
            "keyScaleBreakpoint": 39,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 3,
            "keyScaleCurveR": 3,
            "keyScaleRate": 0,
            "detune": -2,
            "lfoAmpModSens": 0,
            "velocitySens": 2,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": -25,
            "idx": 2,
            "enabled": true
        },
        {
            "rates": [
                77,
                36,
                41,
                71
            ],
            "levels": [
                99,
                98,
                98,
                0
            ],
            "keyScaleBreakpoint": 39,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 3,
            "keyScaleCurveR": 3,
            "keyScaleRate": 0,
            "detune": 0,
            "lfoAmpModSens": 0,
            "velocitySens": 2,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": 0,
            "idx": 3,
            "enabled": true
        },
        {
            "rates": [
                77,
                36,
                41,
                71
            ],
            "levels": [
                99,
                98,
                98,
                0
            ],
            "keyScaleBreakpoint": 39,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 3,
            "keyScaleCurveR": 3,
            "keyScaleRate": 0,
            "detune": 1,
            "lfoAmpModSens": 0,
            "velocitySens": 2,
            "volume": 98,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": 25,
            "idx": 4,
            "enabled": true
        },
        {
            "rates": [
                49,
                99,
                28,
                68
            ],
            "levels": [
                98,
                98,
                91,
                0
            ],
            "keyScaleBreakpoint": 39,
            "keyScaleDepthL": 54,
            "keyScaleDepthR": 50,
            "keyScaleCurveL": 1,
            "keyScaleCurveR": 1,
            "keyScaleRate": 4,
            "detune": 0,
            "lfoAmpModSens": 0,
            "velocitySens": 2,
            "volume": 82,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": -25,
            "idx": 5,
            "enabled": true
        }
    ],
    "name": "BRASS   1 ",
    "lfoSpeed": 37,
    "lfoDelay": 0,
    "lfoPitchModDepth": 5,
    "lfoAmpModDepth": 0,
    "lfoPitchModSens": 3,
    "lfoWaveform": 4,
    "lfoSync": 0,
    "pitchEnvelope": {
        "rates": [
            84,
            95,
            95,
            60
        ],
        "levels": [
            50,
            50,
            50,
            50
        ]
    },
    "controllerModVal": 0,
    "aftertouchEnabled": 0
};
let _defaultBrass1test = {
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
        this.slopes = [];
        this.volumes = [];
        this.doneTime = 0;
        this.envelopeContext = ctx;
        this.envelopeGain = this.envelopeContext.createGain();
        this.down0now();
    }
    rate99Duration(r99, from, to) {
        let duration = 3 / Math.pow(2, 16 * r99 / 100 - 7);
        if (from < to) {
            return duration * 0.5;
        }
        else {
            return duration;
        }
    }
    setupEnvelope(rates, levels) {
        this.slopes[0] = this.rate99Duration(rates[0], levels[3], levels[0]);
        this.slopes[1] = this.rate99Duration(rates[1], levels[0], levels[1]);
        this.slopes[2] = this.rate99Duration(rates[2], levels[1], levels[2]);
        this.slopes[3] = this.rate99Duration(rates[3], levels[2], levels[3]);
        this.volumes[0] = levels[0] / 100;
        this.volumes[1] = levels[1] / 100;
        this.volumes[2] = levels[2] / 100;
        this.volumes[3] = levels[3] / 100;
    }
    setupSlope(when, duration, from, to) {
        if (from < to) {
            this.envelopeGain.gain.linearRampToValueAtTime(to, when + duration);
        }
        else {
            this.envelopeGain.gain.linearRampToValueAtTime(to, when + duration);
        }
    }
    startEnvelope(when, wholeDuration) {
        console.log('volumes', this.volumes, 'slopes', this.slopes);
        this.envelopeGain.gain.linearRampToValueAtTime(this.volumes[3], when);
        let attackDuration = this.slopes[0] * Math.abs(this.volumes[3] - this.volumes[0]);
        this.setupSlope(when, attackDuration, this.volumes[3], this.volumes[0]);
        let decayDuration = this.slopes[1] * Math.abs(this.volumes[0] - this.volumes[1]);
        if (attackDuration + decayDuration < wholeDuration) {
            this.setupSlope(when + attackDuration, decayDuration, this.volumes[0], this.volumes[1]);
            let sustainDuration = this.slopes[2] * Math.abs(this.volumes[1] - this.volumes[2]);
            if (attackDuration + decayDuration + sustainDuration > wholeDuration) {
                this.envelopeGain.gain.cancelAndHoldAtTime(when + wholeDuration);
            }
        }
        else {
            this.envelopeGain.gain.cancelAndHoldAtTime(when + wholeDuration);
        }
        let releaseDuration = this.slopes[3] * Math.abs(this.volumes[2] - this.volumes[3]);
        if (releaseDuration > this.maxReleaseDelta) {
            releaseDuration = this.maxReleaseDelta;
        }
        this.envelopeGain.gain.linearRampToValueAtTime(0, when + wholeDuration + releaseDuration);
    }
    down0now() {
        this.envelopeGain.gain.cancelScheduledValues(this.envelopeContext.currentTime);
        this.envelopeGain.gain.value = 0;
    }
}
class SynthDX7 {
    constructor(audioContext) {
        console.log('new SynthDX7');
        this.audioContext = audioContext;
        this.output = this.audioContext.createGain();
        this.output.connect(this.audioContext.destination);
    }
    test() {
        console.log('SynthDX7 test');
        let testVox = new VoiceDX7(this.output, this.audioContext);
        testVox.setupVoice(epiano1preset);
        testVox.startPlayNote(this.audioContext.currentTime + 0.54321, 2, 12 * 5);
    }
}
var OCTAVE_1024 = 1.0006771307;
class BeepDX7 {
    constructor(cntxt) {
        this.ready = false;
        this.ocntxt = cntxt;
        this.envelopenode = new EnvelopeNode(this.ocntxt);
        this.outGain = this.ocntxt.createGain();
        this.envelopenode.envelopeGain.connect(this.outGain);
    }
    setupOperator(cfg) {
        this.envelopenode.setupEnvelope(cfg.rates, cfg.levels);
        this.ready = true;
        this.oscMode = cfg.oscMode;
        this.freqFine = cfg.freqFine;
        this.freqCoarse = cfg.freqCoarse;
        if (cfg.freqCoarse == 0) {
            this.freqCoarse = 0.5;
        }
        this.detune = cfg.detune;
    }
    startOperator(when, duration, note) {
        console.log('start at', when, 'duration', duration, 'note', note);
        if (this.osc) {
            this.osc.disconnect(this.envelopenode.envelopeGain);
        }
        this.osc = this.ocntxt.createOscillator();
        let detuneRatio = Math.pow(OCTAVE_1024, this.detune);
        let freqRatio = this.freqCoarse * (1 + this.freqFine / 100);
        let opefrequency = detuneRatio * freqRatio * this.frequencyFromNoteNumber(note);
        console.log('opefrequency', opefrequency);
        if (this.oscMode > 0) {
            opefrequency = Math.pow(10, this.freqCoarse % 4) * (1 + (this.freqFine / 99) * 8.772);
            ;
        }
        else {
        }
        this.osc.frequency.setValueAtTime(opefrequency, this.ocntxt.currentTime);
        this.osc.connect(this.envelopenode.envelopeGain);
        this.osc.start(this.ocntxt.currentTime);
        this.envelopenode.startEnvelope(when, duration);
    }
    frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }
    ;
    _____________startOperator(level1, rate1, level2, rate2, level3, rate3, level4, rate4, when, duration, pitch, oscMode, freqCoarse, freqFine, detune, volume) {
        let detuneRatio = Math.pow(OCTAVE_1024, detune);
        if (freqCoarse == 0)
            freqCoarse = 0.5;
        let freqRatio = freqCoarse * (1 + freqFine / 100);
        let opefrequency = detuneRatio * freqRatio * this.frequencyFromNoteNumber(pitch);
        console.log('opefrequency', opefrequency);
        if (oscMode > 0) {
            opefrequency = Math.pow(10, freqCoarse % 4) * (1 + (freqFine / 99) * 8.772);
            ;
        }
        this.osc.frequency.setValueAtTime(opefrequency, this.ocntxt.currentTime);
    }
    connectToOutputNode(outNode) {
        this.outGain.connect(outNode);
    }
    connectToCarrier(opDX7) {
    }
    connectToSelf() {
    }
}
class VoiceDX7 {
    constructor(destination, aContext) {
        this.voContext = aContext;
        this.voxoutput = this.voContext.createGain();
        this.voxoutput.connect(destination);
        this.beeps = [];
        this.beeps[0] = new BeepDX7(this.voContext);
        this.beeps[1] = new BeepDX7(this.voContext);
        this.beeps[2] = new BeepDX7(this.voContext);
        this.beeps[3] = new BeepDX7(this.voContext);
        this.beeps[4] = new BeepDX7(this.voContext);
        this.beeps[5] = new BeepDX7(this.voContext);
    }
    setupVoice(presetData) {
        console.log('setupVoice', presetData);
        let algIdx = presetData.algorithm - 1;
        let scheme = matrixConnectionAlgorithmsDX7[algIdx];
        this.connectMixOperators(scheme);
        for (let ii = 0; ii < 6; ii++) {
            if (presetData.operators[ii].enabled) {
                this.beeps[ii].setupOperator(presetData.operators[ii]);
            }
        }
    }
    startPlayNote(when, duration, note) {
        console.log('startPlayNote', when, 'duration', duration, 'note', note, 'now time', this.voContext.currentTime);
        for (let ii = 0; ii < this.beeps.length; ii++) {
            if (this.beeps[ii].ready) {
                this.beeps[ii].startOperator(when, duration, note);
            }
            else {
                console.log('beep', ii, 'skip');
            }
        }
    }
    connectMixOperators(scheme) {
        for (let ii = 0; ii < scheme.outputMix.length; ii++) {
            let outIdx = scheme.outputMix[ii];
            this.beeps[outIdx].connectToOutputNode(this.voxoutput);
            console.log('' + (1 + outIdx) + ' -> out');
        }
        for (let ii = 0; ii < scheme.modulationMatrix.length; ii++) {
            let carrier = this.beeps[ii];
            let modulators = scheme.modulationMatrix[ii];
            for (let mm = 0; mm < modulators.length; mm++) {
                let modulatorIdx = modulators[mm];
                if (modulatorIdx == ii) {
                    this.beeps[modulatorIdx].connectToSelf;
                }
                else {
                    this.beeps[modulatorIdx].connectToCarrier(carrier);
                }
                console.log('' + (modulatorIdx + 1) + ' -> ' + (ii + 1));
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
function testrate99Duration(r99) {
    let duration = 3 / Math.pow(2, 16 * r99 / 100 - 7);
    return duration;
}
console.log(0, testrate99Duration(0));
console.log(20, testrate99Duration(20));
console.log(50, testrate99Duration(50));
console.log(74, testrate99Duration(74));
console.log(84, testrate99Duration(84));
console.log(99, testrate99Duration(99));
//# sourceMappingURL=tester.js.map