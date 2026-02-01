"use strict";
class AudioFileParametersUrility {
    parse(parameters) {
        let result = { ratio: 0, volume: 100, url: '' };
        try {
            let split = parameters.split(',');
            result.ratio = parseInt(split[0]);
            result.volume = parseInt(split[1]);
            result.url = split[2];
        }
        catch (xx) {
            console.log(xx);
        }
        if (result.ratio >= -100 && result.ratio <= 100) {
        }
        else {
            result.ratio = 0;
        }
        if (result.volume >= 0 && result.ratio <= 100) {
        }
        else {
            result.volume = 100;
        }
        result.url = (result.url) ? result.url : '';
        return result;
    }
    dump(ratio, volume, url) {
        return '' + ratio + ',' + volume + ',' + url;
    }
    bufferName(ratio, url) {
        return ratio + ',' + url;
    }
    startLoadFile(url, ratio, onDone) {
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open("GET", url, true);
        xmlHttpRequest.responseType = "arraybuffer";
        xmlHttpRequest.onload = (event) => {
            const arrayBuffer = xmlHttpRequest.response;
            if (arrayBuffer) {
                this.startDecodeBuffer(arrayBuffer, url, ratio, onDone);
            }
        };
        xmlHttpRequest.onerror = (proevent) => {
            console.log('onerror', proevent);
            console.log('xmlHttpRequest', xmlHttpRequest);
        };
        try {
            xmlHttpRequest.send(null);
        }
        catch (xx) {
            console.log(xx);
        }
    }
    startDecodeBuffer(arrayBuffer, path, ratio, onDone) {
        let audioContext = new AudioContext();
        let me = this;
        audioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
            window[new AudioFileParametersUrility().bufferName(ratio, path)] = audioBuffer;
            me.startTransposeAudioBuffer(path, ratio, onDone);
        });
    }
    startTransposeAudioBuffer(path, ratio, onDone) {
        ratio = ratio ? ratio : 0;
        if (ratio) {
            let audioBuffer = window[new AudioFileParametersUrility().bufferName(ratio, path)];
            let data = new Float32Array(audioBuffer.length);
            audioBuffer.copyFromChannel(data, 0);
            let sampleRate = audioBuffer.sampleRate;
            let pitchShift = 0;
            if (ratio < 0) {
                pitchShift = 1 + ratio / 100 * 0.5;
            }
            else {
                pitchShift = 1 + ratio / 100 * 1;
            }
            let newData = resamplePitchShiftFloat32Array(pitchShift, data.length, 1024, 10, sampleRate, data);
            for (let ii = 0; ii < audioBuffer.numberOfChannels; ii++) {
                audioBuffer.copyToChannel(newData, ii);
            }
        }
        else {
        }
        onDone();
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
console.log('Audio File v1.0');
class AudiFileSamplerTrackImplementation {
    constructor() {
        this.freqRatio = 0;
        this.fileURL = '';
        this.volumeLevel = 0;
        this.ratio = 0;
        this.path = '';
        this.allNodes = [];
    }
    launch(context, parameters) {
        console.log('audiofile lauch');
        if (this.audioContext) {
        }
        else {
            this.audioContext = context;
            this.outputNode = this.audioContext.createGain();
            this.allNodes = [];
        }
        let parsed = new AudioFileParametersUrility().parse(parameters);
        this.ratio = parsed.ratio;
        this.volumeLevel = parsed.volume;
        this.path = parsed.url;
        this.startLoadFile();
    }
    start(when, tempo) {
        let buffer = window[new AudioFileParametersUrility().bufferName(this.ratio, this.path)];
        if (buffer) {
            let audioBufferSourceNode = this.takeFreeNode(when, buffer.duration);
            audioBufferSourceNode.buffer = buffer;
            audioBufferSourceNode.start(when);
        }
    }
    cancel() {
        for (let ii = 0; ii < this.allNodes.length; ii++) {
            try {
                this.allNodes[ii].audio.stop(0);
            }
            catch (xx) {
                console.log(xx);
            }
        }
        this.allNodes = [];
    }
    ;
    busy() {
        if (window[new AudioFileParametersUrility().bufferName(this.ratio, this.path)]) {
            return null;
        }
        else {
            return 'loading ' + this.ratio + '|' + this.path;
        }
    }
    output() {
        return this.outputNode;
    }
    duration() {
        let buffer = window[new AudioFileParametersUrility().bufferName(this.ratio, this.path)];
        if (buffer) {
            return buffer.duration;
        }
        else {
            return 0.1;
        }
    }
    takeFreeNode(when, duration) {
        for (let ii = 0; ii < this.allNodes.length; ii++) {
            if (this.allNodes[ii].end < when + duration) {
                this.allNodes[ii].end = when + duration + 0.01;
                return this.allNodes[ii].audio;
            }
        }
        let audioBufferSourceNode = this.audioContext.createBufferSource();
        audioBufferSourceNode.connect(this.outputNode);
        this.allNodes.push({ audio: audioBufferSourceNode, end: when + duration + 0.01 });
        return audioBufferSourceNode;
    }
    startLoadFile() {
        if (window[new AudioFileParametersUrility().bufferName(this.ratio, this.path)]) {
        }
        else {
            let ratio = this.ratio;
            let path = this.path;
            new AudioFileParametersUrility().startLoadFile(this.path, this.ratio, () => { console.log('loaded', ratio, path); });
        }
    }
}
function newAudiFileSamplerTrack() {
    console.log('audiofile newAudiFileSamplerTrack');
    return new AudiFileSamplerTrackImplementation();
}
//# sourceMappingURL=fileplay.js.map