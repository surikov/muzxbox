"use strict";
class FxPlayer {
    constructor() {
        this.mp3arrayBuffer = null;
        this.mp3audioBuffer = null;
        this.currentContext = null;
        this.mp3sourceNode = null;
        this.lastStart = 0;
        this.lastDuration = 0;
        this.pitchRatio = 1;
    }
    resetSource() {
        console.log('resetSource');
        if (this.currentContext) {
            if (this.mp3sourceNode) {
                this.mp3sourceNode.stop();
            }
            else {
            }
            if (this.mp3audioBuffer) {
                let buff = this.transpose();
                if (buff) {
                    this.startAudioBuffer(buff);
                }
            }
        }
    }
    startAudioBuffer(rebuff) {
        if (this.currentContext) {
            this.mp3sourceNode = this.currentContext.createBufferSource();
            this.mp3sourceNode.connect(this.currentContext.destination);
            this.mp3sourceNode.buffer = rebuff;
            if (this.mp3sourceNode) {
                let offset = 0;
                if (this.lastDuration) {
                    offset = (this.currentContext.currentTime - this.lastStart) % this.lastDuration;
                }
                this.lastDuration = rebuff.duration;
                if (offset > this.lastDuration) {
                    offset = 0;
                }
                this.mp3sourceNode.loop = true;
                this.mp3sourceNode.loopStart = 0;
                this.mp3sourceNode.loopEnd = this.lastDuration;
                this.mp3sourceNode.start(0, offset);
                this.lastStart = this.currentContext.currentTime;
                console.log('duration', this.lastDuration + '"', 'start', offset + '"');
            }
        }
    }
    initContext() {
        if (this.currentContext) {
        }
        else {
            this.currentContext = new AudioContext();
            console.log('baseLatency', this.currentContext.baseLatency);
        }
    }
    load(file) {
        console.log('load', file);
        let me = this;
        this.initContext();
        const reader = new FileReader();
        reader.onload = () => {
            console.log(reader);
            me.mp3arrayBuffer = reader.result;
            if (me.currentContext) {
                me.currentContext.decodeAudioData(me.mp3arrayBuffer, function (audioBuffer) {
                    console.log('audioBuffer', audioBuffer);
                    me.mp3audioBuffer = audioBuffer;
                    me.resetSource();
                });
            }
        };
        reader.onerror = () => {
            alert('error');
        };
        reader.readAsArrayBuffer(file);
    }
    transpose() {
        console.log('transpose', this.pitchRatio, new Date());
        if (this.mp3audioBuffer) {
            let data = new Float32Array(this.mp3audioBuffer.length);
            this.mp3audioBuffer.copyFromChannel(data, 0);
            let sampleRate = this.mp3audioBuffer.sampleRate;
            if (this.pitchRatio == 1) {
                return this.mp3audioBuffer;
            }
            else {
                console.log('calculate', new Date());
                let newData = resamplePitchShiftFloat32Array(this.pitchRatio, data.length, 1024, 10, sampleRate, data);
                if (this.currentContext) {
                    let audioBuffer = this.currentContext.createBuffer(this.mp3audioBuffer.numberOfChannels, this.mp3audioBuffer.length, this.mp3audioBuffer.sampleRate);
                    console.log('copy', new Date());
                    for (let ii = 0; ii < this.mp3audioBuffer.numberOfChannels; ii++) {
                        audioBuffer.copyToChannel(newData, ii);
                    }
                    console.log('done', new Date());
                    return audioBuffer;
                }
            }
        }
        return null;
    }
}
let player = new FxPlayer();
function startLoadMP3(it) {
    console.log('startLoadMP3', it);
    let file = it.files[0];
    player.load(file);
}
function warnInit() {
    alert('Загрузите .mp3 перед изменением звука');
}
function onPitchChange(it) {
    if (player.mp3sourceNode) {
        console.log('onPitchChange', it.value);
        player.pitchRatio = 1 * it.value;
        player.resetSource();
    }
    else {
        warnInit();
    }
}
function resamplePitchShiftFloat32Array(pitchShift, numSampsToProcess, fftFrameSize, osamp, sampleRate, indata) {
    let MAX_FRAME_LENGTH = 16000;
    let gInFIFO = new Array(MAX_FRAME_LENGTH).fill(0.0);
    let gOutFIFO = new Array(MAX_FRAME_LENGTH).fill(0.0);
    let gFFTworksp = new Array(2 * MAX_FRAME_LENGTH).fill(0.0);
    let gLastPhase = new Array(MAX_FRAME_LENGTH / 2 + 1).fill(0.0);
    let gSumPhase = new Array(MAX_FRAME_LENGTH / 2 + 1).fill(0.0);
    let gOutputAccum = new Array(2 * MAX_FRAME_LENGTH).fill(0.0);
    let gAnaFreq = new Array(MAX_FRAME_LENGTH).fill(0.0);
    let gAnaMagn = new Array(MAX_FRAME_LENGTH).fill(0.0);
    let gSynFreq = new Array(MAX_FRAME_LENGTH).fill(0.0);
    let gSynMagn = new Array(MAX_FRAME_LENGTH).fill(0.0);
    let gRover = 0;
    let magn;
    let phase;
    let tmp;
    let window;
    let real;
    let imag;
    let freqPerBin;
    let expct;
    let qpd;
    let index;
    let inFifoLatency;
    let stepSize;
    let fftFrameSize2;
    let outdata = indata;
    fftFrameSize2 = Math.trunc(fftFrameSize / 2);
    stepSize = Math.trunc(fftFrameSize / osamp);
    freqPerBin = sampleRate / fftFrameSize;
    expct = 2.0 * Math.PI * stepSize / fftFrameSize;
    inFifoLatency = Math.trunc(fftFrameSize - stepSize);
    if (gRover == 0) {
        gRover = inFifoLatency;
    }
    for (let ii = 0; ii < numSampsToProcess; ii++) {
        gInFIFO[gRover] = indata[ii];
        outdata[ii] = gOutFIFO[gRover - inFifoLatency];
        gRover++;
        if (gRover >= fftFrameSize) {
            gRover = inFifoLatency;
            for (let kk = 0; kk < fftFrameSize; kk++) {
                window = -.5 * Math.cos(2.0 * Math.PI * kk / fftFrameSize) + .5;
                gFFTworksp[2 * kk] = (gInFIFO[kk] * window);
                gFFTworksp[2 * kk + 1] = 0.0;
            }
            ShortTimeFourierTransform(gFFTworksp, fftFrameSize, -1);
            for (let kk = 0; kk <= fftFrameSize2; kk++) {
                real = gFFTworksp[2 * kk];
                imag = gFFTworksp[2 * kk + 1];
                magn = 2.0 * Math.sqrt(real * real + imag * imag);
                phase = Math.atan2(imag, real);
                tmp = phase - gLastPhase[kk];
                gLastPhase[kk] = phase;
                tmp = tmp - kk * expct;
                qpd = Math.trunc(tmp / Math.PI);
                if (qpd >= 0) {
                    qpd = qpd + qpd & 1;
                }
                else {
                    qpd = qpd - qpd & 1;
                }
                tmp = tmp - Math.PI * qpd;
                tmp = osamp * tmp / (2.0 * Math.PI);
                tmp = kk * freqPerBin + tmp * freqPerBin;
                gAnaMagn[kk] = magn;
                gAnaFreq[kk] = tmp;
            }
            for (var zero = 0; zero < fftFrameSize; zero++) {
                gSynMagn[zero] = 0;
                gSynFreq[zero] = 0;
            }
            for (let kk = 0; kk <= fftFrameSize2; kk++) {
                index = Math.trunc(kk * pitchShift);
                if (index <= fftFrameSize2) {
                    gSynMagn[index] = gSynMagn[index] + gAnaMagn[kk];
                    gSynFreq[index] = gAnaFreq[kk] * pitchShift;
                }
            }
            for (let kk = 0; kk <= fftFrameSize2; kk++) {
                magn = gSynMagn[kk];
                tmp = gSynFreq[kk];
                tmp = tmp - kk * freqPerBin;
                tmp = tmp / freqPerBin;
                tmp = 2.0 * Math.PI * tmp / osamp;
                tmp = tmp + kk * expct;
                gSumPhase[kk] = gSumPhase[kk] + tmp;
                phase = gSumPhase[kk];
                gFFTworksp[2 * kk] = (magn * Math.cos(phase));
                gFFTworksp[2 * kk + 1] = (magn * Math.sin(phase));
            }
            for (let kk = fftFrameSize + 2; kk < 2 * fftFrameSize; kk++) {
                gFFTworksp[kk] = 0.0;
            }
            ShortTimeFourierTransform(gFFTworksp, fftFrameSize, 1);
            for (let kk = 0; kk < fftFrameSize; kk++) {
                window = -.5 * Math.cos(2.0 * Math.PI * kk / fftFrameSize) + .5;
                gOutputAccum[kk] += (2.0 * window * gFFTworksp[2 * kk] / (fftFrameSize2 * osamp));
            }
            for (let kk = 0; kk < stepSize; kk++) {
                gOutFIFO[kk] = gOutputAccum[kk];
            }
            for (let kk = 0; kk < fftFrameSize; kk++) {
                gOutputAccum[kk] = gOutputAccum[kk + stepSize];
            }
            for (let kk = 0; kk < inFifoLatency; kk++) {
                gInFIFO[kk] = gInFIFO[kk + stepSize];
            }
        }
    }
    return outdata;
}
function ShortTimeFourierTransform(fftBuffer, fftFrameSize, sign) {
    let temp;
    let tr;
    let ti;
    let bitm;
    for (let ii = 2; ii < 2 * fftFrameSize - 2; ii += 2) {
        let jj = 0;
        for (bitm = 2; bitm < 2 * fftFrameSize; bitm = bitm << 1) {
            if ((ii & bitm) != 0) {
                jj++;
            }
            jj = jj << 1;
        }
        if (ii < jj) {
            temp = fftBuffer[ii];
            fftBuffer[ii] = fftBuffer[jj];
            fftBuffer[jj] = temp;
            temp = fftBuffer[ii + 1];
            fftBuffer[ii + 1] = fftBuffer[jj + 1];
            fftBuffer[jj + 1] = temp;
        }
    }
    var max = Math.trunc(Math.log(fftFrameSize) / Math.log(2.0) + .5);
    let le = 2;
    for (let kk = 0; kk < max; kk++) {
        le = le << 1;
        let le2 = le >> 1;
        let ur = 1.0;
        let ui = 0.0;
        let arg = Math.PI / (le2 >> 1);
        let wr = Math.cos(arg);
        let wi = (sign * Math.sin(arg));
        for (let jj = 0; jj < le2; jj += 2) {
            for (let ii = jj; ii < 2 * fftFrameSize; ii += le) {
                tr = fftBuffer[ii + le2] * ur - fftBuffer[ii + le2 + 1] * ui;
                ti = fftBuffer[ii + le2] * ui + fftBuffer[ii + le2 + 1] * ur;
                fftBuffer[ii + le2] = fftBuffer[ii] - tr;
                fftBuffer[ii + le2 + 1] = fftBuffer[ii + 1] - ti;
                fftBuffer[ii] = fftBuffer[ii] + tr;
                fftBuffer[ii + 1] = fftBuffer[ii + 1] + ti;
            }
            tr = ur * wr - ui * wi;
            ui = ur * wi + ui * wr;
            ur = tr;
        }
    }
}
function ___do___PitchShift(audioBuffer, ratio) {
    if (ratio) {
        if (ratio == 1) {
            return;
        }
        else {
            let data = new Float32Array(audioBuffer.length);
            audioBuffer.copyFromChannel(data, 0);
            let sampleRate = audioBuffer.sampleRate;
            let newData = resamplePitchShiftFloat32Array(ratio, data.length, 1024, 10, sampleRate, data);
            for (let ii = 0; ii < audioBuffer.numberOfChannels; ii++) {
                audioBuffer.copyToChannel(newData, ii);
            }
        }
    }
}
//# sourceMappingURL=fxplayer.js.map