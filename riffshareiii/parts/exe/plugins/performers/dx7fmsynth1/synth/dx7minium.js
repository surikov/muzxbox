"use strict";
function DX7FMSynth1() {
    let matrixConnectionAlgorithmsDX7 = [
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
    class MiniumFMOperator {
        constructor(cntxt) {
            this.audioContext = cntxt;
            this.output = this.audioContext.createGain();
            this.modulationLevel = this.audioContext.createGain();
            this.feedbackLevel = this.audioContext.createGain();
            this.envelope = this.audioContext.createGain();
            this.phaseDelay = this.audioContext.createDelay();
            this.compensateNegativeDelay = this.audioContext.createConstantSource();
            this.carrier = this.audioContext.createOscillator();
            this.envelope.connect(this.output);
            this.phaseDelay.connect(this.envelope);
            this.modulationLevel.connect(this.phaseDelay.delayTime);
            this.compensateNegativeDelay.connect(this.phaseDelay.delayTime);
            this.feedbackLevel.connect(this.phaseDelay.delayTime);
            this.carrier.connect(this.phaseDelay);
            this.output.gain.value = 0;
            this.phaseDelay.delayTime.value = 0;
            this.envelope.gain.value = 0;
            this.compensateNegativeDelay.start(this.audioContext.currentTime);
            this.carrier.start(this.audioContext.currentTime);
        }
        startPlayFrequency(info, when, duration, frequency, modulationRatio, feedbackRatio) {
            this.envelope.gain.setValueAtTime(0, when);
            this.envelope.gain.setValueCurveAtTime(info.envelope.attack.values, when, info.envelope.attack.duration);
            this.envelope.gain.setValueCurveAtTime(info.envelope.decay.values, when + info.envelope.attack.duration, info.envelope.decay.duration);
            this.envelope.gain.setValueCurveAtTime(info.envelope.sustain.values, when + info.envelope.attack.duration + info.envelope.decay.duration, info.envelope.sustain.duration);
            this.envelope.gain.cancelAndHoldAtTime(when + duration);
            this.envelope.gain.linearRampToValueAtTime(0, when + duration + info.envelope.release);
            this.carrier.frequency.linearRampToValueAtTime(frequency, when);
            this.modulationLevel.gain.linearRampToValueAtTime(modulationRatio / frequency, when);
            this.compensateNegativeDelay.offset.linearRampToValueAtTime(1.1 * modulationRatio / frequency, when);
            this.feedbackLevel.gain.linearRampToValueAtTime(feedbackRatio / frequency, when);
            this.output.gain.value = info.volume;
        }
    }
    class MinumFMVoice {
        constructor(mixID, audioContext, to) {
            this.locktime = 0;
            this.mixID = mixID;
            this.audioContext = audioContext;
            this.output = this.audioContext.createGain();
            this.output.connect(to);
            this.output.gain.value = 0.175;
            this.operators = [
                new MiniumFMOperator(this.audioContext),
                new MiniumFMOperator(this.audioContext),
                new MiniumFMOperator(this.audioContext),
                new MiniumFMOperator(this.audioContext),
                new MiniumFMOperator(this.audioContext),
                new MiniumFMOperator(this.audioContext)
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
            let mix = matrixConnectionAlgorithmsDX7[this.mixID - 1];
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
    class MiniumFMSynth {
        constructor() {
            this.cache = [];
        }
        init(audioContext) {
            this.audioContext = audioContext;
            this.mixOutput = this.audioContext.createGain();
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
            let vx = new MinumFMVoice(mid, this.audioContext, this.mixOutput);
            this.cache.push(vx);
            return vx;
        }
        cancelVoices() {
        }
        scheduleStrum(preset, when, pitches, slides) {
            for (let ii = 0; ii < pitches.length; ii++) {
                let vox = this.takeVox(preset.mixID);
                vox.startPlayNote(preset, when, slides.reduce((sm, cur) => sm + cur.duration, 0), pitches[ii]);
            }
        }
    }
    class MiniumPluginDX7Bridge {
        constructor() {
            this.synth = null;
        }
        launch(context, parameters) {
            if (this.synth) {
            }
            else {
                this.synth = new MiniumFMSynth();
                this.synth.init(context);
            }
            return 1;
        }
        busy() {
            return null;
        }
        cancel() {
            if (this.synth) {
                this.synth.cancelVoices();
            }
        }
        output() {
            if (this.synth) {
                return this.synth.mixOutput;
            }
            else {
                return null;
            }
        }
        strum(whenStart, zpitches, tempo, mzbxslide) {
        }
    }
    return new MiniumPluginDX7Bridge();
}
//# sourceMappingURL=dx7minium.js.map