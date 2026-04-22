"use strict";
class DX7Loader {
    constructor() {
        this.matrixConnectionAlgorithmsDX7 = [
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
    }
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
            connectionsInfo: this.matrixConnectionAlgorithmsDX7[dx7preset.algorithm1_32 - 1],
            operators: [],
            feedbackRatio: Math.pow(2, (dx7preset.feedback0_7 - 7))
        };
        let ls = dx7preset.lfoSpeed / 6 + 0.5;
        if (dx7preset.lfoSpeed > 65) {
            ls = 10 + (dx7preset.lfoSpeed - 66) / 1;
        }
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
                attack: { value: attackSlope.to, duration: attackSlope.duration },
                decay: { value: decaySlope.to, duration: decaySlope.duration },
                sustain: { value: sustainSlope.to, duration: sustainSlope.duration },
                release: releaseSlope.duration
            };
            operator.release = Math.max(0.003, operator.release);
            operator.release = Math.min(3, operator.release);
            let freqRatio = 1 / (1 + dx7preset.lfoPitchModDepth0_99 / 99);
            if (data.constMode0_1 > 0) {
                operator.volume = 0.5 * Math.pow(2, data.volumeLevel0_99 * 0.125) / Math.pow(2, 99 * 0.125) * (1 - 0.2 * data.velocitySens0_7 / 7);
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
            lfoSpeed: voiceData.charCodeAt(112),
            lfoDelay: voiceData.charCodeAt(113),
            lfoPitchModDepth0_99: voiceData.charCodeAt(114),
            lfoAmpModDepth0_99: voiceData.charCodeAt(115),
            lfoPitchModSens: voiceData.charCodeAt(116) >> 4,
            lfoWaveform: Math.floor(voiceData.charCodeAt(116) >> 1) & 7,
            lfoSync: voiceData.charCodeAt(116) & 1,
        };
        console.log('parseSysexData', patchId, preset);
        return preset;
    }
}
class DX7Synthesizer {
    constructor(audioContext) {
        this.cache = [];
        this.audioContext = audioContext;
        this.output = this.audioContext.createGain();
    }
    takeVox() {
        for (let ii = 0; ii < this.cache.length; ii++) {
            if (this.cache[ii].locktime < this.audioContext.currentTime) {
                return this.cache[ii];
            }
        }
        let vx = new DX7Voice(this.audioContext, this.output);
        this.cache.push(vx);
        return vx;
    }
    scheduleStrum(preset, when, pitches, slides) {
        let vox = this.takeVox();
        vox.startPlayNote(preset, when, slides.reduce((sm, cur) => sm + cur.duration, 0), pitches[0]);
    }
}
class DX7Voice {
    constructor(audioContext, to) {
        this.locktime = 0;
        this.audioContext = audioContext;
        this.output = this.audioContext.createGain();
        this.output.connect(to);
        this.output.gain.value = 0.33;
        this.operators = [
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext)
        ];
    }
    reConnectOperators(preset) {
        for (let ii = 0; ii < 6; ii++) {
            this.operators[ii].output.disconnect();
        }
        for (let ii = 0; ii < preset.connectionsInfo.modulationMatrix.length; ii++) {
            let carrier = this.operators[ii];
            let modulatorIds = preset.connectionsInfo.modulationMatrix[ii];
            for (let mm = 0; mm < modulatorIds.length; mm++) {
                let id = modulatorIds[mm];
                let modulator = this.operators[id];
                if (id == ii) {
                    modulator.output.connect(modulator.feedback);
                }
                else {
                    modulator.output.connect(carrier.modulation);
                }
            }
        }
        for (let ii = 0; ii < preset.connectionsInfo.outputMix.length; ii++) {
            let outIdx = preset.connectionsInfo.outputMix[ii];
            this.operators[outIdx].output.connect(this.output);
        }
    }
    startPlayNote(preset, when, duration, note) {
        this.reConnectOperators(preset);
        for (let ii = 0; ii < 6; ii++) {
            if (preset.operators[ii].enabled) {
                let frequency = preset.operators[ii].constantFrequency;
                if (!(frequency)) {
                    let noteFreq = 440 * Math.pow(2, (note - 69) / 12);
                    let detuneRatio = Math.pow(Math.exp(Math.log(2) / 1024), preset.operators[ii].detune);
                    frequency = noteFreq * detuneRatio * preset.operators[ii].frequencyRatio;
                }
                this.operators[ii].startPlayFrequency(preset.operators[ii], when, duration, frequency, preset.feedbackRatio);
                let otime = when + duration + preset.operators[ii].release;
                if (this.locktime < otime) {
                    this.locktime = otime;
                }
            }
        }
        console.log('startPlayNote', note, 'when', when, preset);
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
    }
    connectNodes() {
        this.modulation.connect(this.phaseDelay.delayTime);
        this.compensateNegativeDelay.connect(this.phaseDelay.delayTime);
        this.phaseDelay.connect(this.envelope);
        this.envelope.connect(this.output);
    }
    createNodes() {
        this.output = this.audioContext.createGain();
        this.modulation = this.audioContext.createGain();
        this.feedback = this.audioContext.createGain();
        this.envelope = this.audioContext.createGain();
        this.phaseDelay = this.audioContext.createDelay();
        this.compensateNegativeDelay = this.audioContext.createConstantSource();
    }
    resetCarrier(when) {
        if (this.carrier) {
            this.carrier.stop();
            this.carrier.disconnect();
        }
        this.carrier = this.audioContext.createOscillator();
        this.carrier.connect(this.phaseDelay);
        this.carrier.start(when);
    }
    resetEnvelope(info, when, duration) {
        let slopeRatio = 0.09;
        this.envelope.gain.setValueAtTime(0, when);
        this.envelope.gain.linearRampToValueAtTime(info.attack.value, when);
        this.envelope.gain.setTargetAtTime(info.decay.value, when + info.attack.duration, info.decay.duration * slopeRatio);
        this.envelope.gain.setTargetAtTime(info.sustain.value, when + info.attack.duration + info.decay.duration, info.sustain.duration * slopeRatio);
        this.envelope.gain.cancelAndHoldAtTime(when + duration);
        this.envelope.gain.setTargetAtTime(info.sustain.value, when + duration, slopeRatio);
        this.envelope.gain.setTargetAtTime(0, when + duration + info.release, info.release * slopeRatio);
    }
    resetFrequency(frequency, feedbackRatio) {
        let modulationRatio = Math.E / frequency;
        this.carrier.frequency.value = frequency;
        this.modulation.gain.value = modulationRatio;
        this.compensateNegativeDelay.offset.value = 2 * modulationRatio;
        this.feedback.gain.value = feedbackRatio * modulationRatio;
    }
    startPlayFrequency(info, when, duration, frequency, feedbackRatio) {
        this.resetCarrier(when);
        this.resetEnvelope(info, when, duration);
        this.resetFrequency(frequency, feedbackRatio);
        this.output.gain.value = info.volume;
    }
}
class DX7Test {
    constructor() {
        this.synth = null;
        this.selectedPreset = null;
        this.parsed = null;
        let test = {
            "algorithm1_32": 22,
            "feedback0_7": 7,
            "operators": [
                {
                    "rates0_99": [
                        72,
                        76,
                        99,
                        71
                    ],
                    "levels0_99": [
                        99,
                        88,
                        96,
                        0
                    ],
                    "detune_7_7": 7,
                    "volumeLevel0_99": 98,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 0,
                    "freqFine0_99": 0,
                    "enabled": true,
                    "velocitySens0_7": 0
                },
                {
                    "rates0_99": [
                        62,
                        51,
                        29,
                        71
                    ],
                    "levels0_99": [
                        82,
                        95,
                        96,
                        0
                    ],
                    "detune_7_7": 7,
                    "volumeLevel0_99": 86,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 0,
                    "freqFine0_99": 0,
                    "enabled": true,
                    "velocitySens0_7": 0
                },
                {
                    "rates0_99": [
                        77,
                        76,
                        82,
                        71
                    ],
                    "levels0_99": [
                        99,
                        98,
                        98,
                        0
                    ],
                    "detune_7_7": -2,
                    "volumeLevel0_99": 99,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": true,
                    "velocitySens0_7": 2
                },
                {
                    "rates0_99": [
                        77,
                        36,
                        41,
                        71
                    ],
                    "levels0_99": [
                        99,
                        98,
                        98,
                        0
                    ],
                    "detune_7_7": 0,
                    "volumeLevel0_99": 99,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": true,
                    "velocitySens0_7": 2
                },
                {
                    "rates0_99": [
                        77,
                        36,
                        41,
                        71
                    ],
                    "levels0_99": [
                        99,
                        98,
                        98,
                        0
                    ],
                    "detune_7_7": 1,
                    "volumeLevel0_99": 98,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": true,
                    "velocitySens0_7": 2
                },
                {
                    "rates0_99": [
                        49,
                        99,
                        28,
                        68
                    ],
                    "levels0_99": [
                        98,
                        98,
                        91,
                        0
                    ],
                    "detune_7_7": 0,
                    "volumeLevel0_99": 82,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": true,
                    "velocitySens0_7": 2
                }
            ],
            "name": "BRASS   1 ",
            "lfoSpeed": 37,
            "lfoDelay": 0,
            "lfoPitchModDepth0_99": 5,
            "lfoAmpModDepth0_99": 0,
            "lfoPitchModSens": 3,
            "lfoWaveform": 4,
            "lfoSync": 0
        };
        test.operators[0].enabled = false;
        test.operators[1].enabled = false;
        test.operators[2].enabled = false;
        test.operators[3].enabled = false;
        test.operators[5].rates0_99[0] = 1;
        test.operators[5].levels0_99[0] = 99;
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
                this.synth.scheduleStrum(this.selectedPreset, this.synth.audioContext.currentTime + 0.321, [nn], [{ duration: 4.3, delta: 0 }]);
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
console.log(99, Math.pow(2, 99 * 0.125) / Math.pow(2, 99 * 0.125));
console.log(88, Math.pow(2, 88 * 0.125) / Math.pow(2, 99 * 0.125));
console.log(77, Math.pow(2, 77 * 0.125) / Math.pow(2, 99 * 0.125));
console.log(66, Math.pow(2, 66 * 0.125) / Math.pow(2, 99 * 0.125));
//# sourceMappingURL=dx7tester.js.map