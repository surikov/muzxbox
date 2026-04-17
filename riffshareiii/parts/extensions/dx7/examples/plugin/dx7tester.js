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
        let ratio = Math.log(nn + 1) * 14 + nn;
        return ratio;
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
    convertDX7data(fileName, dx7data) {
        let preset = {
            label: dx7data.name.trim() + '/' + fileName.trim(),
            connectionsInfo: this.matrixConnectionAlgorithmsDX7[dx7data.algorithm1_32 - 1],
            operators: [],
            feedbackRatio: Math.pow(2, (dx7data.feedback0_7 - 7)) * 0.6
        };
        for (let ii = 0; ii < 6; ii++) {
            let data = dx7data.operators[ii];
            let operator = {
                constantFrequency: 0,
                frequencyRatio: 0,
                enabled: data.enabled,
                volume: Math.pow(2, data.volumeLevel0_99 * 0.125) / Math.pow(2, 99 * 0.125),
                detune: data.detune_7_7,
                attack: this.slopeDuration(data.rates0_99[0], data.levels0_99[3], data.levels0_99[0]),
                decay: this.slopeDuration(data.rates0_99[1], data.levels0_99[0], data.levels0_99[1]),
                sustain: this.slopeDuration(data.rates0_99[2], data.levels0_99[1], data.levels0_99[2]),
                release: this.slopeDuration(data.rates0_99[3], data.levels0_99[2], data.levels0_99[3])
            };
            if (operator.release.duration < 0.003) {
                operator.release.duration = 0.003;
            }
            if (data.constMode0_1 > 0) {
                operator.constantFrequency = Math.pow(10, data.freqCoarse0_31 % 4) * (1 + (data.freqFine0_99 / 99) * 8.772);
            }
            else {
                if (data.freqCoarse0_31) {
                    operator.frequencyRatio = data.freqCoarse0_31 * (1 + data.freqFine0_99 / 100);
                }
                else {
                    operator.frequencyRatio = 0.5;
                }
            }
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
                lfoAmpModSens_3_3: oscData.charCodeAt(13) & 3,
                velocitySens0_7: oscData.charCodeAt(13) >> 2
            };
            operators.splice(0, 0, operator);
        }
        let preset = {
            algorithm1_32: voiceData.charCodeAt(110) + 1,
            feedback0_7: voiceData.charCodeAt(111) & 7,
            operators: operators,
            name: voiceData.substring(118, 128),
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
                console.log('found vox', ii);
                return this.cache[ii];
            }
        }
        console.log('new vox', this.audioContext.currentTime, this.cache);
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
        this.output.gain.value = 0.125;
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
                if (id == ii) {
                    this.operators[id].output.connect(this.operators[id].feedback);
                }
                else {
                    this.operators[id].output.connect(carrier.modulation);
                }
            }
            for (let ii = 0; ii < preset.connectionsInfo.outputMix.length; ii++) {
                let outIdx = preset.connectionsInfo.outputMix[ii];
                this.operators[outIdx].output.connect(this.output);
            }
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
                let time = this.operators[ii].startPlayFrequency(preset.operators[ii], when, duration, frequency, preset.feedbackRatio);
                if (this.locktime < time) {
                    this.locktime = time;
                }
            }
        }
    }
}
class DX7Operator {
    constructor(cntxt) {
        this.audioContext = cntxt;
        this.output = this.audioContext.createGain();
        this.modulation = this.audioContext.createGain();
        this.feedback = this.audioContext.createGain();
        this.envelope = this.audioContext.createGain();
        this.phaseDelay = this.audioContext.createDelay();
        this.carrier = this.audioContext.createOscillator();
        this.waveShift = this.audioContext.createConstantSource();
        this.carrier.connect(this.phaseDelay);
        this.modulation.connect(this.phaseDelay.delayTime);
        this.feedback.connect(this.phaseDelay.delayTime);
        this.waveShift.connect(this.phaseDelay.delayTime);
        this.phaseDelay.connect(this.envelope);
        this.envelope.connect(this.output);
        this.output.gain.value = 0;
        this.phaseDelay.delayTime.value = 0;
        this.carrier.start(this.audioContext.currentTime);
        this.waveShift.start(this.audioContext.currentTime);
    }
    startPlayFrequency(info, targettime, duration, frequency, feedbackRatio) {
        let when = targettime - 2 * Math.PI / frequency;
        this.carrier.frequency.value = frequency;
        this.modulation.gain.value = Math.PI / frequency;
        this.waveShift.offset.value = 2 * Math.PI / frequency;
        this.feedback.gain.value = 0.66 * feedbackRatio * Math.PI / frequency;
        this.output.gain.value = info.volume;
        this.envelope.gain.setValueAtTime(info.attack.from, when);
        this.envelope.gain.linearRampToValueAtTime(info.attack.to, when + info.attack.duration);
        this.envelope.gain.linearRampToValueAtTime(info.decay.to, when + info.attack.duration + info.decay.duration);
        this.envelope.gain.linearRampToValueAtTime(info.sustain.to, when + info.attack.duration + info.decay.duration + info.sustain.duration);
        this.envelope.gain.cancelAndHoldAtTime(when + duration);
        this.envelope.gain.linearRampToValueAtTime(info.release.to, when + duration + info.release.duration);
        if (info.release.duration > 3 || info.release.to > 0) {
            this.envelope.gain.cancelAndHoldAtTime(when + duration + 3);
            this.envelope.gain.linearRampToValueAtTime(0, 0.003 + when + duration + 3);
            return 0.003 + when + duration + 3;
        }
        else {
            return 0.003 + when + duration + info.release.duration;
        }
        return 5;
    }
}
class DX7Test {
    constructor() {
        this.synth = null;
        this.selectedPreset = null;
        this.parsed = null;
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
                this.synth.scheduleStrum(this.selectedPreset, this.synth.audioContext.currentTime + 0.321, [nn], [{ duration: 2.1, delta: 0 }]);
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