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
        this.destination = this.audioContext.createGain();
        this.modulate = this.audioContext.createGain();
        this.feedback = this.audioContext.createGain();
        this.input = this.audioContext.createGain();
        this.envelope = new EnvelopeNode(this.audioContext);
        this.phaseNode = new PhaseNode(this.audioContext);
        this.feedback.connect(this.phaseNode.carrier);
        this.input.connect(this.phaseNode.carrier);
        this.phaseNode.carrier.connect(this.envelope.envelopeGain);
        this.envelope.envelopeGain.connect(this.destination);
        this.envelope.envelopeGain.connect(this.modulate);
    }
    volume99scale(nn) {
        return Math.pow(2, nn * 0.125) / Math.pow(2, 99 * 0.125);
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
        console.log(fb, fbRatio);
        this.feedback.gain.value = fbRatio * 0.6;
        this.destination.gain.value = 1 / 6;
        this.modulate.gain.value = this.volume99scale(cfg.volume);
        console.log('setupOperator', cfg.volume, '->', this.modulate.gain.value, cfg.volume);
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
            this.phaseNode.modulationLevel.value = 14;
        }
        this.envelope.startEnvelope(when, duration);
    }
    frequencyFromNoteNumber(note) {
        let ff = 440 * Math.pow(2, (note - 69) / 12);
        return ff;
    }
    ;
    connectToOutputNode(outNode) {
        this.destination.connect(outNode);
    }
    connectToCarrier(opDX7) {
        this.modulate.connect(opDX7.input);
    }
    connectToSelf() {
        this.modulate.connect(this.feedback);
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
function _Y(t, ay, by, cy) {
    return ((ay * t + 3 * by) * t + cy) * t;
}
function _x2t(xx, aa, bb, cc, dd) {
    let qq = aa + bb * xx;
    let ss = Math.pow(qq, 2) + cc;
    if (ss > 0) {
        let root = Math.sqrt(ss);
        return Math.cbrt(qq + root) + Math.cbrt(qq - root) - dd;
    }
    let ll = Math.cbrt(Math.sqrt(qq * qq - ss));
    let angle = qq ? Math.atan(Math.sqrt(-ss) / qq) : -Math.PI / 2;
    let ff;
    if (bb < 0) {
        if (qq > 0) {
            ff = 2 * Math.PI - angle;
        }
        else {
            ff = Math.PI - angle;
        }
    }
    else {
        if (dd < 0) {
            if (qq > 0) {
                ff = 2 * Math.PI + angle;
            }
            else {
                ff = -3 * Math.PI + angle;
            }
        }
        else {
            if (qq > 0) {
                ff = angle;
            }
            else {
                ff = Math.PI + angle;
            }
        }
    }
    return 2 * ll * Math.cos(ff / 3) - dd;
}
;
function yBezier(xx, mX1, mY1, mX2, mY2) {
    if (xx === 0 || xx === 1) {
        return xx;
    }
    if (mX1 === mY1 && mX2 === mY2) {
        return xx;
    }
    let aa = 6 * (3 * mX1 - 3 * mX2 + 1);
    let bb = 6 * (mX2 - 2 * mX1);
    let cc = 3 * mX1;
    let a2 = aa * aa;
    let b2 = bb * bb;
    let dd = bb / aa;
    let ee = (3 * bb * cc) / a2 - (b2 * bb) / (a2 * aa);
    let w1 = (2 * cc) / aa - b2 / a2;
    let ww = w1 * w1 * w1;
    let oo = 3 / aa;
    let ay = 3 * mY1 - 3 * mY2 + 1;
    let by = mY2 - 2 * mY1;
    let cy = 3 * mY1;
    if (aa) {
        return _Y(_x2t(xx, ee, oo, ww, dd), ay, by, cy);
    }
    else {
        return _Y(xx, ay, by, cy);
    }
}
;
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
let customPresets;
var selectedPresetData = null;
function loadPresetNum(ii) {
    console.log('loadPresetNum', ii, customPresets[ii].name);
    selectedPresetData = customPresets[ii];
}
function loadSysexFile(fileList) {
    let numFiles = fileList.length;
    console.log(fileList[0]);
    let reader = new FileReader();
    reader.onload = () => {
        let result = reader.result;
        console.log(fileList[0].name);
        customPresets = [];
        for (let ii = 0; ii < 32; ii++) {
            let one = parseSysexFile(result, ii);
            console.log(ii, one);
            customPresets.push(one);
        }
    };
    reader.onerror = (error) => {
        console.log('error', error);
    };
    reader.readAsText(fileList[0]);
}
function parseSysexFile(bankData, patchId) {
    var dataStart = 128 * patchId + 6;
    var dataEnd = dataStart + 128;
    var voiceData = bankData.substring(dataStart, dataEnd);
    var operators = [];
    for (var i = 5; i >= 0; --i) {
        var oscStart = (5 - i) * 17;
        var oscEnd = oscStart + 17;
        var oscData = voiceData.substring(oscStart, oscEnd);
        var operator = {
            rates: [oscData.charCodeAt(0), oscData.charCodeAt(1), oscData.charCodeAt(2), oscData.charCodeAt(3)],
            levels: [oscData.charCodeAt(4), oscData.charCodeAt(5), oscData.charCodeAt(6), oscData.charCodeAt(7)],
            detune: Math.floor(oscData.charCodeAt(12) >> 3) - 7,
            volume: oscData.charCodeAt(14),
            oscMode: oscData.charCodeAt(15) & 1,
            freqCoarse: Math.floor(oscData.charCodeAt(15) >> 1),
            freqFine: oscData.charCodeAt(16),
            enabled: true
        };
        operators.push(operator);
    }
    let preset = {
        algorithm: voiceData.charCodeAt(110) + 1,
        feedback: voiceData.charCodeAt(111) & 7,
        operators: operators,
        name: voiceData.substring(118, 128),
    };
    return preset;
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
function customPlay(isPiano, nn) {
    if (selectedPresetData) {
        console.log('customPlay', nn);
        let cusPres;
        cusPres = new SynthDX7(acx);
        cusPres.resetPreset(selectedPresetData);
        cusPres.scheduleStrum(acx.currentTime + 0.1, [nn], [{ duration: 4.3, delta: 0 }]);
    }
    else {
        console.log('no data', nn);
    }
}
function speedRatio(nn) {
    let speed = Math.pow(2, nn * 0.16 - 11);
    return speed;
}
function rate2(nn) {
    let ss = Math.pow(2, nn * 0.16 - 11);
    return ss;
}
function level2(nn) {
    let ratio = Math.log(nn + 1) * 14 + nn;
    return ratio;
}
function test2(rr) {
    return Math.pow(2, rr * 0.16 - 11);
}
function test5889(kk) {
    let a58 = ((99 - 58) * kk / 1000) * test2(58) / test2(99);
    let a89 = ((99 - 89) * kk / 1000) * +test2(89) / test2(99);
    console.log(kk, a58, a89, a89 / a58);
}
function bezier99(nn) {
    let t = nn;
    let p1 = { x: 0.95, y: 0.1 };
    let p2 = { x: 0.9, y: 0.7 };
    let cX = 3 * p1.x;
    let bX = 3 * (p2.x - p1.x) - cX;
    let aX = 1 - cX - bX;
    let cY = 3 * p1.y;
    let bY = 3 * (p2.y - p1.y) - cY;
    let aY = 1 - cY - bY;
    let x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t);
    let y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t);
    return { x: x, y: y };
}
function bezierO(nn) {
    let t = nn;
    let p0 = { x: 10, y: 10 };
    let p1 = { x: 50, y: 100 };
    let p2 = { x: 150, y: 200 };
    let p3 = { x: 200, y: 75 };
    let cX = 3 * (p1.x - p0.x);
    let bX = 3 * (p2.x - p1.x) - cX;
    let aX = p3.x - p0.x - cX - bX;
    let cY = 3 * (p1.y - p0.y);
    let bY = 3 * (p2.y - p1.y) - cY;
    let aY = p3.y - p0.y - cY - bY;
    let x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
    let y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
    return { x: x, y: y };
}
var OUTPUT_LEVEL_TABLE = [
    0.000000, 0.000337, 0.000476, 0.000674, 0.000952, 0.001235, 0.001602, 0.001905, 0.002265, 0.002694,
    0.003204, 0.003810, 0.004531, 0.005388, 0.006408, 0.007620, 0.008310, 0.009062, 0.010776, 0.011752,
    0.013975, 0.015240, 0.016619, 0.018123, 0.019764, 0.021552, 0.023503, 0.025630, 0.027950, 0.030480,
    0.033238, 0.036247, 0.039527, 0.043105, 0.047006, 0.051261, 0.055900, 0.060960, 0.066477, 0.072494,
    0.079055, 0.086210, 0.094012, 0.102521, 0.111800, 0.121919, 0.132954, 0.144987, 0.158110, 0.172420,
    0.188025, 0.205043, 0.223601, 0.243838, 0.265907, 0.289974, 0.316219, 0.344839, 0.376050, 0.410085,
    0.447201, 0.487676, 0.531815, 0.579948, 0.632438, 0.689679, 0.752100, 0.820171, 0.894403, 0.975353,
    1.063630, 1.159897, 1.264876, 1.379357, 1.504200, 1.640341, 1.788805, 1.950706, 2.127260, 2.319793,
    2.529752, 2.758714, 3.008399, 3.280683, 3.577610, 3.901411, 4.254519, 4.639586, 5.059505, 5.517429,
    6.016799, 6.561366, 7.155220, 7.802823, 8.509039, 9.279172, 10.11901, 11.03486, 12.03360, 13.12273
];
function scaleA(nn) {
    return Math.pow(2, nn * 0.16 - 11);
}
function scaleB(nn) {
    return Math.pow(2, nn * 0.126);
}
function scaleC(nn) {
    return Math.pow(2, nn * 0.125);
}
function dumpTest() {
    for (let ii = 0; ii < 100; ii++) {
        console.log('n' + ii, Math.floor(10000 * OUTPUT_LEVEL_TABLE[ii] / OUTPUT_LEVEL_TABLE[99]), ':', Math.floor(10000 * scaleA(ii) / scaleA(99)), ' - ', Math.floor(10000 * scaleB(ii)), '/', Math.floor(10000 * scaleC(ii) / scaleC(99)));
    }
    console.log(OUTPUT_LEVEL_TABLE[89] / OUTPUT_LEVEL_TABLE[58], ':', scaleA(89) / scaleA(58), ' - ', scaleB(89) / scaleB(58), '/', scaleC(89) / scaleC(58));
}
dumpTest();
//# sourceMappingURL=tester.js.map