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
let epiano1preset = {
    "algorithm": 5,
    "feedback": 6,
    "operators": [
        {
            "rates": [
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
            "keyScaleBreakpoint": 0,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": 3,
            "lfoAmpModSens": 0,
            "velocitySens": 2,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": 0,
            "idx": 0,
            "enabled": false
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
            "keyScaleBreakpoint": 0,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": 0,
            "lfoAmpModSens": 0,
            "velocitySens": 7,
            "volume": 58,
            "oscMode": 0,
            "freqCoarse": 14,
            "freqFine": 0,
            "pan": 25,
            "idx": 1,
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
            "keyScaleBreakpoint": 0,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": 0,
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
            "keyScaleBreakpoint": 0,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": 0,
            "lfoAmpModSens": 0,
            "velocitySens": 6,
            "volume": 89,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": 0,
            "idx": 3,
            "enabled": true
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
            "keyScaleBreakpoint": 0,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": -7,
            "lfoAmpModSens": 0,
            "velocitySens": 0,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": 25,
            "idx": 4,
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
            "keyScaleBreakpoint": 41,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 19,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": 7,
            "lfoAmpModSens": 0,
            "velocitySens": 6,
            "volume": 79,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": -25,
            "idx": 5,
            "enabled": false
        }
    ],
    "name": "E.PIANO 1 ",
    "lfoSpeed": 34,
    "lfoDelay": 33,
    "lfoPitchModDepth": 0,
    "lfoAmpModDepth": 0,
    "lfoPitchModSens": 3,
    "lfoWaveform": 4,
    "lfoSync": 0,
    "pitchEnvelope": {
        "rates": [
            94,
            67,
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
    slopeDuration(preLevel, nextLevel, sloperate) {
        let part = Math.abs(preLevel - nextLevel) / 100;
        let steep = 123.45;
        if (sloperate > 0 && sloperate < 100) {
            steep = Math.pow(2, sloperate * 16 / 100 - 6);
        }
        return part / steep;
    }
    mapOutputLevel(input, volume) {
        let idx = Math.min(99, Math.max(0, Math.floor(input)));
        let level = OUTPUT_LEVEL_TABLE[idx] / 16;
        let full = level * volume / 100;
        return full;
    }
    ;
    setLevelRate(level1, rate1, level2, rate2, level3, rate3, level4, rate4, when, duration, volume) {
        let slope1 = this.slopeDuration(level4, level1, rate1);
        let slope2 = this.slopeDuration(level1, level2, rate2);
        let slope3 = this.slopeDuration(level2, level3, rate3);
        let slope4 = this.slopeDuration(level3, level4, rate4);
        let volume1 = this.mapOutputLevel(level1, volume);
        let volume2 = this.mapOutputLevel(level2, volume);
        let volume3 = this.mapOutputLevel(level3, volume);
        let volume4 = this.mapOutputLevel(level4, volume);
        this.envelopeGain.gain.linearRampToValueAtTime(volume4, when);
        console.log('start', volume4, when);
        this.envelopeGain.gain.linearRampToValueAtTime(volume1, when + slope1);
        console.log(volume1, when + slope1);
        if (slope1 < duration) {
            this.envelopeGain.gain.linearRampToValueAtTime(volume2, when + slope1 + slope2);
            console.log(volume2, when + slope1 + slope2);
            if (slope1 + slope2 < duration) {
                this.envelopeGain.gain.linearRampToValueAtTime(volume3, when + slope1 + slope2 + slope3);
                console.log(volume3, when + slope1 + slope2 + slope3);
            }
        }
        this.envelopeGain.gain.cancelAndHoldAtTime(when + duration);
        this.envelopeGain.gain.linearRampToValueAtTime(volume4, when + duration + slope4 + this.minTimeDelta);
        console.log('end', volume4, when + duration + slope4 + this.minTimeDelta);
        this.envelopeGain.gain.linearRampToValueAtTime(0, when + duration + slope4 + 2 * this.minTimeDelta);
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
        this.testVox.startPlayNote(this.moContext.currentTime + 1, 14, 12 * 5);
    }
}
var OCTAVE_1024 = 1.0006771307;
class OperatorDX7 {
    constructor(cntxt) {
        this.minimalDelta = 0.001;
        this.onNotOff = false;
        this.velocitySens0_7 = 0;
        this.level0_99 = 0;
        this.lfoAmpModSens_3_3 = 0;
        this.freqCoarse0_31 = 0;
        this.freqCoarseFixed0_3 = 0;
        this.freqFine0_99 = 0;
        this.detune_7_7 = 0;
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
    startOperator(level1, rate1, level2, rate2, level3, rate3, level4, rate4, when, duration, pitch, oscMode, freqCoarse, freqFine, detune, volume) {
        if (this.onNotOff) {
            console.log('startOperator', when, pitch, ('' + freqCoarse + '.' + freqFine + '/' + detune), ('' + volume + '%'));
            let detuneRatio = Math.pow(OCTAVE_1024, detune);
            this.envelope.setLevelRate(level1, rate1, level2, rate2, level3, rate3, level4, rate4, when, duration, volume);
            let freqRatio = (freqCoarse || 0.5) * (1 + freqFine / 100);
            let opefrequency = detuneRatio * freqRatio * this.frequencyFromNoteNumber(pitch);
            if (oscMode > 0) {
                opefrequency = Math.pow(10, freqCoarse % 4) * (1 + (freqFine / 99) * 8.772);
                ;
            }
            this.osc.frequency.setValueAtTime(opefrequency, this.ocntxt.currentTime);
            this.outGain.gain.setValueAtTime(volume / 100, this.ocntxt.currentTime);
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
        this.dx7voxData = epiano1preset;
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
        console.log('startPlayNote', when, 'duration', duration, 'pitch', pitch, 'now time', this.voContext.currentTime);
        for (let ii = 0; ii < this.operators.length; ii++) {
            let operadata = this.dx7voxData.operators[ii];
            if (operadata.enabled) {
                this.operators[ii].startOperator(operadata.levels[0], operadata.rates[0], operadata.levels[1], operadata.rates[1], operadata.levels[2], operadata.rates[2], operadata.levels[3], operadata.rates[3], when, duration, pitch, operadata.oscMode, operadata.freqCoarse, operadata.freqFine, operadata.detune, operadata.volume);
            }
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