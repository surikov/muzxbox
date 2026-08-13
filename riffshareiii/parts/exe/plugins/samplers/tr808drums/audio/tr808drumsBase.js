"use strict";
let drumInfos = [
    { drumname: '808 SUB', drumprops: { startFrequency: 110, nextFrequency: 34, freqChangeDuration: 0.28, duration: 4.5, clickLevel: 0.2, clickWave: 'triangle', driveLevel: 0, clickFrequency: 400, baseWave: 'sine', baselevel: 1 } },
    { drumname: 'DEEP', drumprops: { startFrequency: 80, nextFrequency: 28, freqChangeDuration: 0.4, duration: 6.0, clickLevel: 0.1, clickWave: 'triangle', driveLevel: 0, clickFrequency: 300, baseWave: 'sine', baselevel: 1 } },
    { drumname: 'DIRTY', drumprops: { startFrequency: 100, nextFrequency: 32, freqChangeDuration: 0.3, duration: 4.0, clickLevel: 0.2, clickWave: 'triangle', driveLevel: 3, clickFrequency: 400, baseWave: 'sine', baselevel: 0.8 } },
    { drumname: 'PUNCH', drumprops: { startFrequency: 140, nextFrequency: 40, freqChangeDuration: 0.15, duration: 2.0, clickLevel: 0.3, clickWave: 'square', driveLevel: 0, clickFrequency: 900, baseWave: 'sine', baselevel: 1 } }
];
let kickInfos = [
    { drumname: '808', drumprops: { startFrequency: 160, nextFrequency: 48, freqChangeDuration: 0.09, duration: 0.9, clickLevel: 0.25, driveLevel: 0, baseWave: 'sine', baselevel: 1, clickWave: 'square', clickFrequency: 900 } },
    { drumname: '707', drumprops: { startFrequency: 190, nextFrequency: 62, freqChangeDuration: 0.05, duration: 0.35, baseWave: 'triangle', clickLevel: 0.3, clickFrequency: 1100, driveLevel: 0, baselevel: 1, clickWave: 'square' } },
    { drumname: '909', drumprops: { startFrequency: 210, nextFrequency: 52, freqChangeDuration: 0.07, duration: 0.5, driveLevel: 2.2, baselevel: 0.85, clickLevel: 0.35, clickFrequency: 1400, baseWave: 'sine', clickWave: 'square' } },
    { drumname: 'TIGHT', drumprops: { startFrequency: 170, nextFrequency: 55, freqChangeDuration: 0.04, duration: 0.2, clickLevel: 0.3, driveLevel: 0, baseWave: 'sine', baselevel: 1, clickWave: 'square', clickFrequency: 900 } }
];
let snareInfos = [
    { snarename: 'CRISP', snareprops: { tones: [{ frequency: 185, volume: 0.4 }, { frequency: 330, volume: 0.25 }], toneDur: 0.18, noiseLevel: 0.6, noiseFreq: 1600, noiceDur: 0.28 } },
    { snarename: 'RIM', snareprops: { tones: [{ frequency: 440, volume: 0.5 }, { frequency: 660, volume: 0.2 }], toneDur: 0.06, noiseLevel: 0.25, noiseFreq: 2400, noiceDur: 0.07 } },
    { snarename: 'BIG', snareprops: { tones: [{ frequency: 150, volume: 0.45 }, { frequency: 270, volume: 0.3 }], toneDur: 0.4, noiseLevel: 0.55, noiseFreq: 1100, noiceDur: 0.8 } },
    { snarename: 'NOISE', snareprops: { tones: [{ frequency: 185, volume: 0.15 }], toneDur: 0.1, noiseLevel: 0.8, noiseFreq: 800, noiceDur: 0.5 } }
];
let clapInfos = [
    { clapname: '808', clapprops: { freq: 1200, qualityFactor: 1.5, bursts: [0, 0.011, 0.022], tail: 0.6 } },
    { clapname: '505', clapprops: { freq: 1600, qualityFactor: 2, bursts: [0, 0.009], tail: 0.2 } },
    { clapname: 'DOUBLE', clapprops: { freq: 1200, qualityFactor: 1.5, bursts: [0, 0.011, 0.022, 0.09, 0.101], tail: 0.45 } },
    { clapname: 'ROOM', clapprops: { freq: 1000, qualityFactor: 1, bursts: [0, 0.011, 0.022], tail: 1.0 } }
];
let hatInfos = [
    { hatname: 'LO METAL', hatprops: { freqScale: 0.7, bandFiFreq: 6500, highFiFreq: 4500, level: 0.5, decay: 0.2, washVolume: 0 } },
    { hatname: 'CLASSIC', hatprops: { level: 0.5, decay: 0.15, washVolume: 0, freqScale: 1, bandFiFreq: 10000, highFiFreq: 7000 } },
    { hatname: 'HIGH', hatprops: { freqScale: 1.3, level: 0.45, decay: 0.09, washVolume: 0, highFiFreq: 7000, bandFiFreq: 10000 } },
    { hatname: 'TIGHT', hatprops: { freqScale: 1.6, highFiFreq: 9000, level: 0.4, decay: 0.05, washVolume: 0, bandFiFreq: 10000 } }
];
let ohatInfos = [
    { hatname: 'CRASH', hatprops: { level: 0.5, decay: 2.5, washVolume: 0.3, freqScale: 1, bandFiFreq: 10000, highFiFreq: 7000 } },
    { hatname: 'LONG', hatprops: { level: 0.45, decay: 1.2, washVolume: 0.0, freqScale: 1, bandFiFreq: 10000, highFiFreq: 7000 } },
    { hatname: 'MID', hatprops: { level: 0.45, decay: 0.7, washVolume: 0.0, freqScale: 1, bandFiFreq: 10000, highFiFreq: 7000 } },
    { hatname: 'SHORT', hatprops: { freqScale: 1.3, level: 0.4, decay: 0.35, washVolume: 0.0, bandFiFreq: 10000, highFiFreq: 7000 } }
];
let cowbellInfos = [
    { cowbellname: '808', cowbellprops: { freqs: [540, 800], duration: 0.7, bpFilterFreq: 700, qualityFilter: 1.2, bellLevel: 0.45, strikeVolume: 0 } },
    { cowbellname: 'REAL', cowbellprops: { freqs: [562, 845, 1102, 1460], bpFilterFreq: 1100, qualityFilter: 0.9, bellLevel: 0.3, duration: 0.45, strikeVolume: 0.25 } },
    { cowbellname: 'LOW', cowbellprops: { freqs: [405, 600], bpFilterFreq: 550, duration: 0.9, qualityFilter: 1.2, bellLevel: 0.45, strikeVolume: 0 } },
    { cowbellname: 'PING', cowbellprops: { freqs: [880, 1320], bpFilterFreq: 1200, duration: 0.25, bellLevel: 0.35, qualityFilter: 1.2, strikeVolume: 0 } }
];
let tomInfos = [
    { tomname: '808', tomprops: { startFreq: 200, nextFreq: 110, duration: 0.85, skinLevel: 0.15, drop: 0.12, tomwave: 'sine', skinFreq: 800, skinDur: 0.05 } },
    { tomname: 'ELECTRO', tomprops: { startFreq: 300, nextFreq: 90, drop: 0.3, duration: 1.0, tomwave: 'sine', skinFreq: 800, skinDur: 0.05, skinLevel: 0 } },
    { tomname: 'NATURAL', tomprops: { startFreq: 185, nextFreq: 140, drop: 0.08, tomwave: 'triangle', duration: 0.5, skinLevel: 0.3, skinFreq: 1200, skinDur: 0.08 } },
    { tomname: 'TIGHT', tomprops: { startFreq: 220, nextFreq: 160, drop: 0.05, duration: 0.25, skinLevel: 0.2, tomwave: 'sine', skinFreq: 800, skinDur: 0.05 } }
];
class TR808Synth {
    constructor() {
        this.drumsCache = [];
        this.currentDuration = 0;
    }
    takeEngine(kind) {
        for (let ii = 0; ii < this.drumsCache.length; ii++) {
            if (this.drumsCache[ii].kind == kind && this.drumsCache[ii].drum.endTime() < this.audioContext.currentTime) {
                return this.drumsCache[ii];
            }
        }
        let drum;
        if (kind < 8) {
            drum = new VoiceKick(this.audioContext, kind);
        }
        else {
            drum = new VoiceSnare(this.audioContext, kind - 8);
        }
        drum.output().connect(this.drumOutput);
        let cache = { kind: kind, drum: drum };
        this.drumsCache.push(cache);
        return cache;
    }
    launch(context, parameters) {
        if (this.audioContext) {
        }
        else {
            this.audioContext = context;
            this.drumOutput = this.audioContext.createGain();
        }
        if (parameters) {
            let parsed = JSON.parse(parameters);
            this.parameters = parsed;
        }
        else {
            this.parameters = {
                volume: 70,
                ratio: 1,
                nn: 0
            };
        }
        let boom = this.takeEngine(this.parameters.nn);
        this.currentDuration = boom.drum.duration();
        return 0;
    }
    busy() {
        return null;
    }
    start(when, tempo) {
        let boom = this.takeEngine(this.parameters.nn);
        boom.drum.start(when, 1 + this.parameters.ratio / 10, this.parameters.volume / 100);
    }
    cancel() {
        for (let ii = 0; ii < this.drumsCache.length; ii++) {
            this.drumsCache[ii].drum.cancel();
        }
    }
    ;
    output() {
        return this.drumOutput;
    }
    duration() {
        return this.currentDuration;
    }
}
class VoiceKick {
    constructor(context, propertyId) {
        this.lastWhen = 0;
        this.audioContext = context;
        this.baseGain = this.audioContext.createGain();
        this.outGain = this.audioContext.createGain();
        this.driveGain = this.audioContext.createGain();
        this.clickGain = this.audioContext.createGain();
        this.waveShaper = this.audioContext.createWaveShaper();
        if (propertyId < 4) {
            this.drumProperties = drumInfos[propertyId].drumprops;
        }
        else {
            this.drumProperties = kickInfos[propertyId - 4].drumprops;
        }
        this.waveShaper.curve = this.curveArray();
        this.driveGain.connect(this.waveShaper);
        this.waveShaper.connect(this.baseGain);
        this.baseGain.connect(this.outGain);
        this.clickGain.connect(this.outGain);
        this.wholeDuration = this.drumProperties.duration + 0.05;
    }
    start(when, pitchRatio, volume) {
        if (this.baseOscillator)
            this.baseOscillator.disconnect();
        this.baseOscillator = this.audioContext.createOscillator();
        this.baseOscillator.type = this.drumProperties.baseWave;
        if (this.drumProperties.driveLevel) {
            this.baseOscillator.connect(this.driveGain);
        }
        else {
            this.baseOscillator.connect(this.baseGain);
        }
        this.baseOscillator.frequency.setValueAtTime(this.drumProperties.startFrequency * pitchRatio, when);
        this.baseOscillator.frequency.exponentialRampToValueAtTime(this.drumProperties.nextFrequency * pitchRatio, when + this.drumProperties.freqChangeDuration);
        this.baseOscillator.start(when);
        this.baseOscillator.stop(when + this.drumProperties.duration + 0.05);
        if (this.clickOscillator)
            this.clickOscillator.disconnect();
        this.clickOscillator = this.audioContext.createOscillator();
        this.clickOscillator.type = this.drumProperties.clickWave;
        this.clickOscillator.connect(this.clickGain);
        this.clickOscillator.frequency.setValueAtTime(this.drumProperties.clickFrequency * pitchRatio, when);
        this.clickOscillator.start(when);
        this.clickOscillator.stop(when + 0.03);
        this.driveGain.gain.value = this.drumProperties.driveLevel;
        this.baseGain.gain.setValueAtTime(this.drumProperties.baselevel, when);
        this.baseGain.gain.exponentialRampToValueAtTime(0.0001, when + this.drumProperties.duration);
        this.clickGain.gain.setValueAtTime(this.drumProperties.clickLevel, when);
        this.clickGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.015);
        this.lastWhen = when;
        this.outGain.gain.setValueAtTime(volume, when);
    }
    cancel() {
        this.outGain.gain.setValueAtTime(0, 0);
    }
    duration() {
        return this.wholeDuration;
    }
    endTime() {
        return this.lastWhen + this.wholeDuration;
    }
    curveArray() {
        let nn = 1024;
        let cu = new Float32Array(nn);
        for (let ii = 0; ii < nn; ii++) {
            let xx = (ii / (nn - 1)) * 2 - 1;
            cu[ii] = Math.tanh(1.6 * xx) / Math.tanh(1.6);
        }
        return cu;
    }
    output() {
        return this.outGain;
    }
}
;
class VoiceSnare {
    fillNoiseData() {
        const d = new Float32Array(96000 * this.NOISE_SECONDS);
        for (let i = 0; i < d.length; i++)
            d[i] = Math.random() * 2 - 1;
        return d;
    }
    fillFrom(dst, src) {
        const step = src.length / dst.length;
        for (let i = 0; i < dst.length; i++)
            dst[i] = src[Math.floor(i * step)];
    }
    ;
    noiseBuf(ac) {
        const len = Math.floor(ac.sampleRate * this.NOISE_SECONDS);
        const buf = ac.createBuffer(1, len, ac.sampleRate);
        this.fillFrom(buf.getChannelData(0), this.NOISE_DATA);
        return buf;
    }
    noiseSrc(ac) {
        const s = ac.createBufferSource();
        s.buffer = this.noiseBuf(ac);
        s.loop = true;
        s.loopStart = Math.random() * 1.0;
        return s;
    }
    constructor(context, propertyId) {
        this.lastWhen = 0;
        this.tones = [];
        this.NOISE_SECONDS = 2;
        this.audioContext = context;
        this.drumProperties = snareInfos[propertyId].snareprops;
        this.outGain = this.audioContext.createGain();
        this.wholeDuration = Math.max(this.drumProperties.toneDur + 0.03, this.drumProperties.noiceDur + 0.02);
        this.NOISE_DATA = this.fillNoiseData();
        console.log('VoiceSnare', this.drumProperties);
    }
    start(when, pitchRatio, volume) {
        this.snareEng(this.audioContext, when, this.outGain, pitchRatio, this.drumProperties);
        this.lastWhen = when;
        this.outGain.gain.setValueAtTime(volume, when);
    }
    cancel() {
        this.outGain.gain.setValueAtTime(0, 0);
    }
    duration() {
        return this.wholeDuration;
    }
    endTime() {
        return this.lastWhen + this.wholeDuration;
    }
    output() {
        return this.outGain;
    }
    takeTone(from) {
        if (from < this.tones.length) {
            let tone = this.tones[from];
            tone.osc.disconnect();
            tone.osc = this.audioContext.createOscillator();
            tone.osc.connect(tone.baseGain);
            tone.osc.type = 'triangle';
            return tone;
        }
        else {
            let toneSnare = {
                osc: this.audioContext.createOscillator(),
                baseGain: this.audioContext.createGain()
            };
            toneSnare.baseGain.connect(this.outGain);
            this.tones.push(toneSnare);
            return toneSnare;
        }
    }
    snareEng(ctx, when, out, pitchRatio, props) {
        for (let ii = 0; ii < props.tones.length; ii++) {
            let pair = props.tones[ii];
            let tone = this.takeTone(ii);
            tone.osc.frequency.setValueAtTime(pair.frequency * pitchRatio, when);
            tone.baseGain.gain.setValueAtTime(pair.volume, when);
            tone.baseGain.gain.exponentialRampToValueAtTime(0.0001, when + props.toneDur);
            tone.osc.start(when);
            tone.osc.stop(when + props.toneDur + 0.03);
        }
        if (props.noiseLevel) {
            const noiseSourceBuffer = this.noiseSrc(ctx);
            const bqFilter = ctx.createBiquadFilter();
            bqFilter.type = 'highpass';
            bqFilter.frequency.value = props.noiseFreq * pitchRatio;
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(props.noiseLevel, when);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + props.noiceDur);
            noiseSourceBuffer.connect(bqFilter);
            bqFilter.connect(noiseGain);
            noiseGain.connect(out);
            noiseSourceBuffer.start(when);
            noiseSourceBuffer.stop(when + props.noiceDur + 0.02);
        }
    }
}
;
function createNewTR808synth() {
    return new TR808Synth();
}
//# sourceMappingURL=tr808drumsBase.js.map