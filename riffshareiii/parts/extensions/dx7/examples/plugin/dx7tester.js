"use strict";
class DX7Synthesizer {
    constructor(audioContext) {
        this.cache = [];
        this.audioContext = audioContext;
        this.output = this.audioContext.createGain();
    }
    checkCache() {
        if (this.cache.length > 25) {
            for (let ii = 0; ii < this.cache.length; ii++) {
                if (this.cache[ii].locktime < this.audioContext.currentTime) {
                    this.cache[ii].disonnectOperators();
                    this.cache[ii].mixID = 0;
                }
            }
        }
    }
    takeVox(mid) {
        this.checkCache();
        for (let ii = 0; ii < this.cache.length; ii++) {
            if (this.cache[ii].locktime < this.audioContext.currentTime && mid == this.cache[ii].mixID) {
                return this.cache[ii];
            }
        }
        for (let ii = 0; ii < this.cache.length; ii++) {
            if (this.cache[ii].locktime < this.audioContext.currentTime && this.cache[ii].mixID == 0) {
                this.cache[ii].mixID = mid;
                this.cache[ii].connectOperators();
                return this.cache[ii];
            }
        }
        let vx = new DX7Voice(mid, this.audioContext, this.output);
        this.cache.push(vx);
        return vx;
    }
    scheduleStrum(preset, when, pitches, slides) {
        for (let ii = 0; ii < pitches.length; ii++) {
            let vox = this.takeVox(preset.mixID);
            vox.startPlayNote(preset, when, slides.reduce((sm, cur) => sm + cur.duration, 0), pitches[ii]);
        }
    }
}
class DX7Loader {
    scale99(nn) {
        let speed = Math.pow(2, nn * 0.16);
        return speed;
    }
    durationDown(nn) {
        return 169 * Math.pow(2, (99 - nn) * 0.16) / Math.pow(2, 99 * 0.16);
    }
    durationUp(nn) {
        return 24.9 * Math.pow(2, (99 - nn) * 0.16) / Math.pow(2, 99 * 0.16);
    }
    levelRatio(nn) {
        return nn / 99;
    }
    slopeDuration(r99, from99, to99) {
        let partDuration = Math.abs(this.levelRatio(from99) - this.levelRatio(to99)) / this.levelRatio(99);
        let fullDuration = this.durationDown(r99);
        if (from99 < to99) {
            fullDuration = this.durationUp(r99);
        }
        let slope = {
            duration: partDuration * fullDuration,
            from: this.scale99(from99) / this.scale99(99),
            to: this.scale99(to99) / this.scale99(99)
        };
        return slope;
    }
    convertDX7data(fileName, dx7preset) {
        let preset = {
            label: dx7preset.name.trim() + '/' + fileName.trim(),
            mixID: dx7preset.algorithm1_32,
            operators: [],
            feedbackRatio: 0.075 * 2.8 * Math.pow(2, (dx7preset.feedback0_7 - 7)),
            modulationRatio: 2.8
        };
        for (let ii = 0; ii < 6; ii++) {
            let data = dx7preset.operators[ii];
            let attackSlope = this.slopeDuration(data.rates0_99[0], data.levels0_99[3], data.levels0_99[0]);
            let decaySlope = this.slopeDuration(data.rates0_99[1], data.levels0_99[0], data.levels0_99[1]);
            let sustainSlope = this.slopeDuration(data.rates0_99[2], data.levels0_99[1], data.levels0_99[2]);
            let releaseSlope = this.slopeDuration(data.rates0_99[3], data.levels0_99[2], data.levels0_99[3]);
            let operator = {
                constantFrequency: 0,
                frequencyRatio: 0,
                enabled: data.enabled,
                volume: 0,
                detune: data.detune_7_7,
                envelope: {
                    attack: {
                        values: [0,
                            0.025 * attackSlope.to,
                            0.05 * attackSlope.to,
                            0.2 * attackSlope.to,
                            0.35 * attackSlope.to,
                            attackSlope.to],
                        duration: attackSlope.duration
                    },
                    decay: {
                        values: [attackSlope.to,
                            attackSlope.to - 0.65 * (attackSlope.to - decaySlope.to),
                            attackSlope.to - 0.8 * (attackSlope.to - decaySlope.to),
                            attackSlope.to - 0.95 * (attackSlope.to - decaySlope.to),
                            attackSlope.to - 0.975 * (attackSlope.to - decaySlope.to),
                            decaySlope.to],
                        duration: decaySlope.duration
                    },
                    sustain: {
                        values: [decaySlope.to,
                            decaySlope.to - 0.65 * (decaySlope.to - sustainSlope.to),
                            decaySlope.to - 0.8 * (decaySlope.to - sustainSlope.to),
                            decaySlope.to - 0.95 * (decaySlope.to - sustainSlope.to),
                            decaySlope.to - 0.975 * (decaySlope.to - sustainSlope.to),
                            sustainSlope.to],
                        duration: sustainSlope.duration
                    },
                    release: releaseSlope.duration
                }
            };
            operator.envelope.attack.duration = Math.max(0.0001, operator.envelope.attack.duration);
            operator.envelope.decay.duration = Math.max(0.0001, operator.envelope.decay.duration);
            operator.envelope.sustain.duration = Math.max(0.0001, operator.envelope.sustain.duration);
            operator.envelope.release = Math.max(0.005, operator.envelope.release);
            operator.envelope.release = Math.min(3, operator.envelope.release);
            let freqRatio = 1 / (1 + dx7preset.lfoPitchModDepth0_99 / 99);
            if (data.constMode0_1 > 0) {
                operator.volume = 0.05 * Math.pow(2, data.volumeLevel0_99 * 0.125) / Math.pow(2, 99 * 0.125) * (1 - 0.2 * data.velocitySens0_7 / 7);
                operator.constantFrequency = freqRatio * Math.pow(10, data.freqCoarse0_31 % 4) * (1 + (data.freqFine0_99 / 99) * 8.772);
            }
            else {
                operator.volume = Math.pow(2, data.volumeLevel0_99 * 0.125) / Math.pow(2, 99 * 0.125) * (1 - 0.2 * data.velocitySens0_7 / 7);
                let coarse = 0.5;
                if (data.freqCoarse0_31) {
                    coarse = data.freqCoarse0_31;
                }
                operator.frequencyRatio = freqRatio * coarse * (1 + data.freqFine0_99 / 100);
            }
            operator.volume = operator.volume * (1 + dx7preset.lfoAmpModDepth0_99 / 99);
            preset.operators.push(operator);
        }
        return preset;
    }
    parseSyxFile(from, onDone) {
        let reader = new FileReader();
        let all = [];
        reader.onload = () => {
            let result = reader.result;
            for (let ii = 0; ii < 32; ii++) {
                let one = this.parseSysexData(result, ii);
                let preset = this.convertDX7data(from.name, one);
                all.push(preset);
            }
            onDone(all);
        };
        reader.onerror = (error) => {
            console.log('error', error);
        };
        reader.readAsText(from);
    }
    pow2x(x01, minx, maxx, yratio) {
        if (x01) {
            return yratio * Math.pow(2, x01 * (maxx - minx) + minx);
        }
        else {
            return 0;
        }
    }
    parseSysexData(bankData, patchId) {
        var dataStart = 128 * patchId + 6;
        var dataEnd = dataStart + 128;
        var voiceData = bankData.substring(dataStart, dataEnd);
        var operators = [];
        for (var ii = 5; ii >= 0; --ii) {
            var oscStart = (5 - ii) * 17;
            var oscEnd = oscStart + 17;
            var oscData = voiceData.substring(oscStart, oscEnd);
            var operator = {
                rates0_99: [oscData.charCodeAt(0), oscData.charCodeAt(1), oscData.charCodeAt(2), oscData.charCodeAt(3)],
                levels0_99: [oscData.charCodeAt(4), oscData.charCodeAt(5), oscData.charCodeAt(6), oscData.charCodeAt(7)],
                detune_7_7: Math.floor(oscData.charCodeAt(12) >> 3) - 7,
                volumeLevel0_99: oscData.charCodeAt(14),
                constMode0_1: oscData.charCodeAt(15) & 1,
                freqCoarse0_31: Math.floor(oscData.charCodeAt(15) >> 1),
                freqFine0_99: oscData.charCodeAt(16),
                enabled: true,
                velocitySens0_7: oscData.charCodeAt(13) >> 2
            };
            operators.splice(0, 0, operator);
        }
        let preset = {
            algorithm1_32: voiceData.charCodeAt(110) + 1,
            feedback0_7: voiceData.charCodeAt(111) & 7,
            operators: operators,
            name: voiceData.substring(118, 128),
            lfoPitchModDepth0_99: voiceData.charCodeAt(114),
            lfoAmpModDepth0_99: voiceData.charCodeAt(115),
        };
        console.log('parseSysexData', patchId, preset);
        return preset;
    }
}
class DX7Voice {
    constructor(mixID, audioContext, to) {
        this.locktime = 0;
        this.matrixConnectionAlgorithmsDX7 = [
            { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], []], feedbackMatrix: [[], [1], [], [], [], []] },
            { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], []], feedbackMatrix: [[], [], [], [], [], [3]] },
            { outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [4]] },
            { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], []], feedbackMatrix: [[], [], [], [3], [], []] },
            { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], []], feedbackMatrix: [[], [1], [], [], [], []] },
            { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [2], [], [], []] },
            { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4, 5], [], [], []], feedbackMatrix: [[], [1], [], [], [], []] },
            { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4, 5], [], [], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4, 5], [], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4, 5], [], []], feedbackMatrix: [[], [1], [], [], [], []] },
            { outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], []], feedbackMatrix: [[], [1], [], [], [], []] },
            { outputMix: [0], modulationMatrix: [[1, 2, 3], [], [2], [], [5], []], feedbackMatrix: [[], [], [], [4], [], []] },
            { outputMix: [0, 3, 4], modulationMatrix: [[1], [2], [], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 1, 3], modulationMatrix: [[2], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [2], [], [], []] },
            { outputMix: [0, 1, 3, 4], modulationMatrix: [[2], [2], [], [5], [5], []], feedbackMatrix: [[], [], [2], [], [], []] },
            { outputMix: [0, 2, 3, 4], modulationMatrix: [[1], [], [5], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 1, 3, 4], modulationMatrix: [[], [2], [], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [5], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [2], [], [], []] },
            { outputMix: [0, 2, 5], modulationMatrix: [[1], [], [3], [4], [], []], feedbackMatrix: [[], [], [], [], [4], []] },
            { outputMix: [0, 1, 2, 4], modulationMatrix: [[], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 1, 2, 5], modulationMatrix: [[], [], [3], [4], [], []], feedbackMatrix: [[], [], [], [], [4], []] },
            { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] },
            { outputMix: [0, 1, 2, 3, 4, 5], modulationMatrix: [[], [], [], [], [], []], feedbackMatrix: [[], [], [], [], [], [5]] }
        ];
        this.mixID = mixID;
        this.audioContext = audioContext;
        this.output = this.audioContext.createGain();
        this.output.connect(to);
        this.output.gain.value = 0.125;
        this.operators = [
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext)
        ];
        this.connectOperators();
    }
    disonnectOperators() {
        for (let ii = 0; ii < 6; ii++) {
            this.operators[ii].output.disconnect();
        }
        this.mixID = 0;
    }
    connectOperators() {
        let mix = this.matrixConnectionAlgorithmsDX7[this.mixID - 1];
        for (let cid = 0; cid < mix.modulationMatrix.length; cid++) {
            let carrier = this.operators[cid];
            let modulatorIds = mix.modulationMatrix[cid];
            for (let mm = 0; mm < modulatorIds.length; mm++) {
                let mid = modulatorIds[mm];
                let modulator = this.operators[mid];
                modulator.output.connect(carrier.modulationLevel);
            }
        }
        for (let cid = 0; cid < mix.feedbackMatrix.length; cid++) {
            let carrier = this.operators[cid];
            let fbIds = mix.modulationMatrix[cid];
            for (let ff = 0; ff < fbIds.length; ff++) {
                let fid = fbIds[ff];
                let fbmodulator = this.operators[fid];
                fbmodulator.output.connect(carrier.feedbackLevel);
            }
        }
        for (let ii = 0; ii < mix.outputMix.length; ii++) {
            let outIdx = mix.outputMix[ii];
            this.operators[outIdx].output.connect(this.output);
        }
    }
    startPlayNote(preset, when, duration, note) {
        for (let ii = 0; ii < 6; ii++) {
            if (preset.operators[ii].enabled) {
                let frequency = preset.operators[ii].constantFrequency;
                if (!(frequency)) {
                    let noteFreq = 440 * Math.pow(2, (note - 69) / 12);
                    let detuneRatio = Math.pow(Math.exp(Math.log(2) / 1024), preset.operators[ii].detune);
                    frequency = noteFreq * detuneRatio * preset.operators[ii].frequencyRatio;
                }
                this.operators[ii].startPlayFrequency(preset.operators[ii], when, duration, frequency, preset.modulationRatio, preset.feedbackRatio);
                let otime = when + duration + preset.operators[ii].envelope.release + 0.01;
                if (this.locktime < otime) {
                    this.locktime = otime;
                }
            }
        }
    }
}
class DX7Operator {
    constructor(cntxt) {
        this.audioContext = cntxt;
        this.createNodes();
        this.connectNodes();
        this.setupNodes();
    }
    setupNodes() {
        this.output.gain.value = 0;
        this.phaseDelay.delayTime.value = 0;
        this.envelope.gain.value = 0;
        this.compensateNegativeDelay.start(this.audioContext.currentTime);
        this.carrier.start(this.audioContext.currentTime);
    }
    connectNodes() {
        this.envelope.connect(this.output);
        this.phaseDelay.connect(this.envelope);
        this.modulationLevel.connect(this.phaseDelay.delayTime);
        this.compensateNegativeDelay.connect(this.phaseDelay.delayTime);
        this.feedbackLevel.connect(this.phaseDelay.delayTime);
        this.carrier.connect(this.phaseDelay);
    }
    createNodes() {
        this.output = this.audioContext.createGain();
        this.modulationLevel = this.audioContext.createGain();
        this.feedbackLevel = this.audioContext.createGain();
        this.envelope = this.audioContext.createGain();
        this.phaseDelay = this.audioContext.createDelay();
        this.compensateNegativeDelay = this.audioContext.createConstantSource();
        this.carrier = this.audioContext.createOscillator();
    }
    rresetCarrier(when) {
    }
    resetEnvelope(edata, when, duration) {
        this.envelope.gain.setValueAtTime(0, when);
        this.envelope.gain.setValueCurveAtTime(edata.attack.values, when, edata.attack.duration);
        this.envelope.gain.setValueCurveAtTime(edata.decay.values, when + edata.attack.duration, edata.decay.duration);
        this.envelope.gain.setValueCurveAtTime(edata.sustain.values, when + edata.attack.duration + edata.decay.duration, edata.sustain.duration);
        this.envelope.gain.cancelAndHoldAtTime(when + duration);
        this.envelope.gain.linearRampToValueAtTime(0, when + duration + edata.release);
    }
    resetFrequency(when, frequency, modulationRatio, feedbackRatio) {
        this.carrier.frequency.linearRampToValueAtTime(frequency, when);
        this.modulationLevel.gain.linearRampToValueAtTime(modulationRatio / frequency, when);
        this.compensateNegativeDelay.offset.linearRampToValueAtTime(1.1 * modulationRatio / frequency, when);
        this.feedbackLevel.gain.linearRampToValueAtTime(feedbackRatio / frequency, when);
    }
    startPlayFrequency(info, when, duration, frequency, modulationRatio, feedbackRatio) {
        this.resetEnvelope(info.envelope, when, duration);
        this.resetFrequency(when, frequency, modulationRatio, feedbackRatio);
        this.output.gain.value = info.volume;
    }
}
class DX7Test {
    constructor() {
        this.synth = null;
        this.selectedPreset = null;
        this.parsed = null;
        let test = {
            "algorithm1_32": 5,
            "feedback0_7": 6,
            "operators": [
                {
                    "rates0_99": [
                        96,
                        25,
                        25,
                        67
                    ],
                    "levels0_99": [
                        99,
                        75,
                        0,
                        0
                    ],
                    "detune_7_7": 3,
                    "volumeLevel0_99": 99,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": false,
                    "velocitySens0_7": 2
                },
                {
                    "rates0_99": [
                        95,
                        50,
                        35,
                        78
                    ],
                    "levels0_99": [
                        99,
                        75,
                        0,
                        0
                    ],
                    "detune_7_7": 0,
                    "volumeLevel0_99": 58,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 14,
                    "freqFine0_99": 0,
                    "enabled": false,
                    "velocitySens0_7": 7
                },
                {
                    "rates0_99": [
                        95,
                        20,
                        20,
                        50
                    ],
                    "levels0_99": [
                        99,
                        95,
                        0,
                        0
                    ],
                    "detune_7_7": 0,
                    "volumeLevel0_99": 99,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": false,
                    "velocitySens0_7": 2
                },
                {
                    "rates0_99": [
                        95,
                        29,
                        20,
                        50
                    ],
                    "levels0_99": [
                        99,
                        95,
                        0,
                        0
                    ],
                    "detune_7_7": 0,
                    "volumeLevel0_99": 89,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": false,
                    "velocitySens0_7": 6
                },
                {
                    "rates0_99": [
                        95,
                        20,
                        20,
                        50
                    ],
                    "levels0_99": [
                        99,
                        95,
                        0,
                        0
                    ],
                    "detune_7_7": -7,
                    "volumeLevel0_99": 99,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": true,
                    "velocitySens0_7": 0
                },
                {
                    "rates0_99": [
                        95,
                        29,
                        20,
                        50
                    ],
                    "levels0_99": [
                        99,
                        95,
                        0,
                        0
                    ],
                    "detune_7_7": 7,
                    "volumeLevel0_99": 79,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": true,
                    "velocitySens0_7": 6
                }
            ],
            "name": "E.PIANO 1 ",
            "lfoPitchModDepth0_99": 0,
            "lfoAmpModDepth0_99": 0,
        };
        test.operators[0].enabled = false;
        test.operators[1].enabled = false;
        test.operators[2].enabled = false;
        test.operators[3].enabled = false;
        test.operators[4].detune_7_7 = 0;
        test.operators[5].detune_7_7 = 0;
        test.feedback0_7 = 0;
        let loader = new DX7Loader();
        this.selectedPreset = loader.convertDX7data('test', test);
        console.log('dx7preset', test);
        console.log('synthpreset', this.selectedPreset);
    }
    loadSysexFile(fileList) {
        console.log('loadSysexFile', fileList);
        let loader = new DX7Loader();
        let me = this;
        loader.parseSyxFile(fileList[0], (presets) => {
            console.log('presets', presets);
            me.parsed = presets;
        });
    }
    testPlay(isPiano, nn) {
        if (!(this.synth)) {
            let ac = new AudioContext();
            this.synth = new DX7Synthesizer(ac);
            this.synth.output.connect(ac.destination);
        }
        if (this.synth) {
            if (this.selectedPreset) {
                this.synth.scheduleStrum(this.selectedPreset, this.synth.audioContext.currentTime + 0.321, [nn], [{ duration: 1.2, delta: 0 }]);
            }
        }
    }
    playTestSuBass() {
        if (!(this.synth)) {
            let ac = new AudioContext();
            this.synth = new DX7Synthesizer(ac);
            this.synth.output.connect(ac.destination);
        }
        let C = 0, Cs = 1, D = 2, Ds = 3, E = 4, F = 5, Fs = 6, G = 7, Gs = 8, A = 9, As = 10, B = 11;
        let tempo = 120;
        let n4 = 60 / tempo;
        let n16 = n4 / 4;
        let n8 = n4 / 2;
        let n2 = n4 * 2;
        let n1 = n4 * 4;
        let o2 = 24;
        let o3 = 36;
        let o4 = 48;
        let o5 = 60;
        if (this.synth) {
            if (this.selectedPreset) {
                let tt = this.synth.audioContext.currentTime + 0.2;
                let pp = this.selectedPreset;
                this.synth.scheduleStrum(pp, tt + 0 * n8, [A + o2], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 1 * n8, [A + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 2 * n8, [A + o2], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 3 * n8, [A + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 4 * n8, [G + o2], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 5 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 6 * n8, [G + o2], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 7 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 8 * n8, [F + o2], [{ duration: n2, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 12 * n8, [G + o2], [{ duration: n4, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 14 * n8, [G + o2], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 15 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 16 * n8, [A + o2], [{ duration: n2, delta: 0 }]);
            }
        }
    }
    playTestBass() {
        if (!(this.synth)) {
            let ac = new AudioContext();
            this.synth = new DX7Synthesizer(ac);
            this.synth.output.connect(ac.destination);
        }
        let C = 0, Cs = 1, D = 2, Ds = 3, E = 4, F = 5, Fs = 6, G = 7, Gs = 8, A = 9, As = 10, B = 11;
        let tempo = 120;
        let n4 = 60 / tempo;
        let n16 = n4 / 4;
        let n8 = n4 / 2;
        let n2 = n4 * 2;
        let n1 = n4 * 4;
        let o3 = 36;
        let o4 = 48;
        let o5 = 60;
        if (this.synth) {
            if (this.selectedPreset) {
                let tt = this.synth.audioContext.currentTime + 0.2;
                let pp = this.selectedPreset;
                this.synth.scheduleStrum(pp, tt + 0 * n8, [A + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 1 * n8, [A + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 2 * n8, [A + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 3 * n8, [A + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 4 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 5 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 6 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 7 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 8 * n8, [F + o3], [{ duration: n2, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 12 * n8, [G + o3], [{ duration: n4, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 14 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 15 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 16 * n8, [A + o3], [{ duration: n2, delta: 0 }]);
            }
        }
    }
    playTestChords() {
        if (!(this.synth)) {
            let ac = new AudioContext();
            this.synth = new DX7Synthesizer(ac);
            this.synth.output.connect(ac.destination);
        }
        let C = 0, Cs = 1, D = 2, Ds = 3, E = 4, F = 5, Fs = 6, G = 7, Gs = 8, A = 9, As = 10, B = 11;
        let tempo = 120;
        let n4 = 60 / tempo;
        let n16 = n4 / 4;
        let n8 = n4 / 2;
        let n2 = n4 * 2;
        let n1 = n4 * 4;
        let o3 = 36;
        let o4 = 48;
        let o5 = 60;
        let o6 = 73;
        if (this.synth) {
            if (this.selectedPreset) {
                let tt = this.synth.audioContext.currentTime + 0.2;
                let pp = this.selectedPreset;
                this.synth.scheduleStrum(pp, tt + 0 * n8, [A + o4], [{ duration: n4, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 1 * n8, [A + o5, C + o6, E + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 2 * n8, [E + o4], [{ duration: n4, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 3 * n8, [A + o5, C + o6, E + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 4 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 5 * n8, [E + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 6 * n8, [F + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 7 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 8 * n8, [A + o5, C + o6, E + o6], [{ duration: n4, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 12 * n8, [G + o5, B + o5, D + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 13 * n8, [G + o5, B + o5, D + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 14 * n8, [G + o5, B + o5, D + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 15 * n8, [G + o5, B + o5, D + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 16 * n8, [A + o5, C + o6, E + o6], [{ duration: n4, delta: 0 }]);
            }
        }
    }
    playTestMelody() {
        if (!(this.synth)) {
            let ac = new AudioContext();
            this.synth = new DX7Synthesizer(ac);
            this.synth.output.connect(ac.destination);
        }
        let C = 0, Cs = 1, D = 2, Ds = 3, E = 4, F = 5, Fs = 6, G = 7, Gs = 8, A = 9, As = 10, B = 11;
        let tempo = 120;
        let n4 = 60 / tempo;
        let n16 = n4 / 4;
        let n8 = n4 / 2;
        let n2 = n4 * 2;
        let n1 = n4 * 4;
        let o3 = 36;
        let o4 = 48;
        let o5 = 60;
        let o6 = 73;
        if (this.synth) {
            if (this.selectedPreset) {
                let tt = this.synth.audioContext.currentTime + 0.2;
                let pp = this.selectedPreset;
                this.synth.scheduleStrum(pp, tt + 0 * n16, [A + o6], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 1 * n16, [G + o6], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 2 * n16, [E + o6], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 3 * n16, [C + o6], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 4 * n16, [A + o5], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 5 * n16, [G + o5], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 6 * n16, [E + o5], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 7 * n16, [C + o5], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 4 * n8, [A + o5], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 5 * n8, [C + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 6 * n8, [G + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 7 * n8, [E + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 8 * n8, [A + o6], [{ duration: n2, delta: 0 }]);
            }
        }
    }
    customPlay(isPiano, nn) {
        this.testPlay(isPiano, nn);
    }
    loadPresetNum(nn) {
        if (this.parsed) {
            this.selectedPreset = this.parsed[nn];
            console.log('select', nn, this.selectedPreset);
        }
    }
}
var tester = new DX7Test();
//# sourceMappingURL=dx7tester.js.map