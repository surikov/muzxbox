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
let brass1preset = {
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
            "detune": 7,
            "volume": 98,
            "oscMode": 0,
            "freqCoarse": 0,
            "freqFine": 0,
            "enabled": true,
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
            "detune": 7,
            "volume": 86,
            "oscMode": 0,
            "freqCoarse": 0,
            "freqFine": 0,
            "enabled": true,
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
            "detune": -2,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": true,
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
            "detune": 0,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": true,
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
            "detune": 1,
            "volume": 98,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": true,
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
            "detune": 0,
            "volume": 82,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": true,
        }
    ],
    "name": "BRASS   1 ",
};
let epiano1preset = {
    "algorithm": 5,
    "feedback": 6,
    "operators": [{
            rates: [96, 25, 25, 67],
            "levels": [99, 75, 0, 0],
            "detune": 3,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": true
        }, {
            "rates": [95, 50, 35, 78],
            "levels": [99, 75, 0, 0],
            "detune": 0,
            "volume": 58,
            "oscMode": 0,
            "freqCoarse": 14,
            "freqFine": 0,
            "enabled": true
        }, {
            rates: [95, 20, 20, 50],
            "levels": [99, 95, 0, 0],
            "detune": 0,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": true
        }, {
            "rates": [95, 29, 20, 50],
            "levels": [99, 95, 0, 0],
            "detune": 0,
            "volume": 89,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": true
        }, {
            "rates": [95, 20, 20, 50],
            "levels": [99, 95, 0, 0],
            "detune": -7,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": true
        }, {
            "rates": [95, 29, 20, 50],
            "levels": [99, 95, 0, 0],
            "detune": 7,
            "volume": 79,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "enabled": true
        }],
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
        this.doneTime = 0;
        this.envelopeContext = ctx;
        this.envelopeGain = this.envelopeContext.createGain();
        this.down0now();
    }
    scale99(nn) {
        let speed = Math.pow(2, nn * 0.16 - 11);
        return speed;
    }
    durationDown(nn) {
        let ss = this.scale99(nn);
        return 0.095 / ss;
    }
    durationUp(nn) {
        return this.durationDown(nn) / 4;
    }
    levelRatio(nn) {
        let ratio = Math.log(nn + 1) * 14 + nn;
        return ratio;
    }
    slopeDuration(r99, from99, to99) {
        let fromRatio = this.levelRatio(from99);
        let toRatio = this.levelRatio(to99);
        let fullRatio = this.levelRatio(100);
        let partDuration = Math.abs(fromRatio - toRatio) / fullRatio;
        let fullDuration = this.durationDown(r99);
        if (from99 < to99) {
            fullDuration = this.durationUp(r99);
        }
        return { duration: partDuration * fullDuration, from: this.scale99(from99) / 32, to: this.scale99(to99) / 32 };
    }
    setupEnvelope(rates99, levels99) {
        this.attack = this.slopeDuration(rates99[0], levels99[3], levels99[0]);
        this.decay = this.slopeDuration(rates99[1], levels99[0], levels99[1]);
        this.sustain = this.slopeDuration(rates99[2], levels99[1], levels99[2]);
        this.release = this.slopeDuration(rates99[3], levels99[2], levels99[3]);
    }
    startEnvelope(when, wholeDuration) {
        this.envelopeGain.gain.setValueAtTime(this.attack.from, when);
        this.envelopeGain.gain.linearRampToValueAtTime(this.attack.to, when + this.attack.duration);
        this.envelopeGain.gain.linearRampToValueAtTime(this.decay.to, when + this.attack.duration + this.decay.duration);
        this.envelopeGain.gain.linearRampToValueAtTime(this.sustain.to, when + this.attack.duration + this.decay.duration + this.sustain.duration);
        this.envelopeGain.gain.cancelAndHoldAtTime(when + wholeDuration);
        this.envelopeGain.gain.exponentialRampToValueAtTime(this.release.from, 0.003 + when + wholeDuration);
        this.envelopeGain.gain.linearRampToValueAtTime(this.release.to, 0.003 + when + wholeDuration + this.release.duration);
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
    resetPreset(newpreset) {
        this.preset = newpreset;
    }
    scheduleStrum(when, pitches, slides) {
        console.log('SynthDX7 schedule');
        if (this.audioContext.state === "suspended") {
            this.audioContext.resume();
        }
        let testVox = new VoiceDX7(this.output, this.audioContext);
        testVox.setupVoice(this.preset);
        testVox.startPlayNote(when, slides.reduce((sm, cur) => sm + cur.duration, 0), pitches[0]);
    }
}
class BeepDX7 {
    constructor(cntxt) {
        this.ready = false;
        this.oscMode = 0;
        this.audioContext = cntxt;
        this.output = this.audioContext.createGain();
        this.input = this.audioContext.createGain();
        this.envelope = new EnvelopeNode(this.audioContext);
        this.envelope.envelopeGain.connect(this.output);
        this.phaseNode = new PhaseNode(this.audioContext);
        this.input.connect(this.phaseNode.carrier);
    }
    scale99(nn) {
        let speed = Math.pow(2, nn * 0.16 - 11);
        return speed;
    }
    setupOperator(cfg, fb) {
        this.envelope.setupEnvelope(cfg.rates, cfg.levels);
        this.ready = true;
        this.oscMode = cfg.oscMode;
        this.freqFine = cfg.freqFine;
        this.freqCoarse = cfg.freqCoarse;
        if (cfg.freqCoarse == 0) {
            this.freqCoarse = 0.5;
        }
        this.detune = cfg.detune;
        let fbRatio = Math.pow(2, (fb - 7));
        this.output.gain.value = this.scale99(cfg.volume) / 32;
        console.log('setupOperator', cfg.volume, '->', this.output.gain.value, cfg.volume);
    }
    startOperator(when, duration, note) {
        var OCTAVE_1024 = 1.0006771307;
        let detuneRatio = Math.pow(OCTAVE_1024, this.detune);
        let freqRatio = this.freqCoarse * (1 + this.freqFine / 100);
        let carrierFrequency = detuneRatio * freqRatio * this.frequencyFromNoteNumber(note);
        if (this.oscMode > 0) {
            carrierFrequency = Math.pow(10, this.freqCoarse % 4) * (1 + (this.freqFine / 99) * 8.772);
            ;
        }
        else {
        }
        if (this.phaseNode.carrierFrequency) {
            this.phaseNode.carrierFrequency.value = carrierFrequency;
        }
        if (this.phaseNode.modulationLevel) {
            this.phaseNode.modulationLevel.value = 38;
        }
        this.phaseNode.carrier.connect(this.envelope.envelopeGain);
        this.envelope.startEnvelope(when, duration);
    }
    frequencyFromNoteNumber(note) {
        let ff = 440 * Math.pow(2, (note - 69) / 12);
        return ff;
    }
    ;
    connectToOutputNode(outNode) {
        this.output.connect(outNode);
        this.output.gain.value = 0.25;
    }
    connectToCarrier(opDX7) {
        this.output.connect(opDX7.input);
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
                console.log('setupVoice, operator', ii);
                this.beeps[ii].setupOperator(presetData.operators[ii], presetData.feedback);
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
                console.log('operator', (1 + ii), 'skip');
            }
        }
    }
    connectMixOperators(scheme) {
        for (let ii = 0; ii < scheme.outputMix.length; ii++) {
            let outIdx = scheme.outputMix[ii];
            this.beeps[outIdx].connectToOutputNode(this.voxoutput);
        }
        for (let ii = 0; ii < scheme.modulationMatrix.length; ii++) {
            let carrier = this.beeps[ii];
            let modulators = scheme.modulationMatrix[ii];
            for (let mm = 0; mm < modulators.length; mm++) {
                let modulatorIdx = modulators[mm];
                if (modulatorIdx == ii) {
                    this.beeps[modulatorIdx].connectToSelf();
                }
                else {
                    this.beeps[modulatorIdx].connectToCarrier(carrier);
                }
            }
        }
    }
}
let skipLoadPhaseWorkletSource = false;
function loadPhaseWorkletSource(audioContext, onDone) {
    if (skipLoadPhaseWorkletSource) {
        onDone();
    }
    else {
        loadAudioWorkletCode(phaseWorkletSource, audioContext, () => {
            skipLoadPhaseWorkletSource = true;
            onDone();
        });
    }
}
let phaseWorkletSource = `
class PhaseSineAudioWorkletProcessor extends AudioWorkletProcessor {
	phase = 0;
	cntr = 0;
	constructor() {
		super();
	}
	static get parameterDescriptors() {
		return [
			{ name: "carrierFrequency", automationRate: "a-rate" }
			, { name: "modulationLevel", automationRate: "a-rate" }
		];
	}
	readSample(inputs, xx) {
		let inputSumm = 0;
		for (let ii = 0; ii < inputs.length; ii++) {
			let singleInput = inputs[ii];
			let channelCount = singleInput.length;
			if (channelCount) {
				let channelSumm = 0;
				for (let ch = 0; ch < singleInput.length; ch++) {
					let singleChannel = singleInput[ch];
					channelSumm = channelSumm + singleChannel[xx];
				}
				inputSumm = inputSumm + channelSumm / channelCount;
			}
		}
		return inputSumm;
	}
	writeSample(outputs, xx, value) {
		for (let oo = 0; oo < outputs.length; oo++) {
			let singleOutput = outputs[oo];
			for (let ch = 0; ch < singleOutput.length; ch++) {
				let singleChannel = singleOutput[ch];
				singleChannel[xx] = value;
			}
		}
	}
	process(inputs, outputs, parameters) {
		let outSampleCount = outputs[0][0].length;
		let frequency = parameters["carrierFrequency"][0];
		let level = parameters["modulationLevel"][0];
		let incrementBySample = Math.PI * 2 * frequency / sampleRate;

		for (let xx = 0; xx < outSampleCount; xx++) {
			let inputSumm = this.readSample(inputs, xx);
			let resultValue = Math.sin(this.phase + level * inputSumm);
			this.writeSample(outputs, xx, resultValue);
			this.phase = this.phase + incrementBySample;
			if (this.phase >= Math.PI * 2) {
				this.phase = this.phase - Math.PI * 2;
			}
		}
		return true;
	}
}
registerProcessor("sinePhaseModuleID", PhaseSineAudioWorkletProcessor);
`;
class PhaseNode {
    constructor(audioContext) {
        this.carrier = new AudioWorkletNode(audioContext, 'sinePhaseModuleID');
        let descriptors = this.carrier.parameters;
        this.carrierFrequency = descriptors.get('carrierFrequency');
        this.modulationLevel = descriptors.get('modulationLevel');
    }
}
function loadAudioWorkletCode(audioworkletcode, audioContext, onDone) {
    let blob = new Blob([audioworkletcode], { type: 'application/javascript' });
    let reader = new FileReader();
    reader.onloadend = function () {
        let blobURL = reader.result;
        audioContext.audioWorklet.addModule(blobURL)
            .then((vv) => {
            onDone();
        });
    };
    reader.readAsDataURL(blob);
}
let synthPiano;
let synthBrass;
let acx;
function initTester() {
    console.log('initTester');
    acx = new window.AudioContext();
    loadPhaseWorkletSource(acx, () => {
        console.log('skipLoadPhaseWorkletSource', skipLoadPhaseWorkletSource);
        synthPiano = new SynthDX7(acx);
        synthPiano.resetPreset(epiano1preset);
        synthBrass = new SynthDX7(acx);
        synthBrass.resetPreset(brass1preset);
    });
}
function testPlay(isPiano, nn) {
    console.log('testPlay', isPiano, nn);
    if (isPiano) {
        synthPiano.scheduleStrum(acx.currentTime + 0.1, [nn], [{ duration: 4.3, delta: 0 }]);
    }
    else {
        synthBrass.scheduleStrum(acx.currentTime + 0.1, [nn], [{ duration: 4.3, delta: 0 }]);
    }
}
function speedRatio(nn) {
    let speed = Math.pow(2, nn * 0.16 - 11);
    return speed;
}
function dumpTest() {
    for (let nn = 0; nn <= 100; nn++) {
    }
}
dumpTest();
//# sourceMappingURL=tester.js.map