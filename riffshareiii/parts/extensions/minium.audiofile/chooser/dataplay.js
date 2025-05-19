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
class AudioFilePicker {
    constructor() {
        this.id = '';
        this.path = 'https://surikov.github.io/muzxbox/riffshareiii/parts/extensions/minium.audiofile/audiosamples/hello.wav';
        this.ratio = 0;
        this.volumeLevel = 100;
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        this.ratioslider = document.getElementById('ratioslider');
        this.numval = document.getElementById('numval');
        this.volumeslider = document.getElementById('volumeslider');
        this.volval = document.getElementById('volval');
        this.fname = document.getElementById('fname');
        this.ratioslider.addEventListener('change', (event) => {
            this.ratio = this.ratioslider.value;
            this.numval.innerHTML = this.ratio;
            this.sendMessageToHost(new AudioFileParametersUrility().dump(this.ratio, this.volumeLevel, this.path));
        });
        this.volumeslider.addEventListener('change', (event) => {
            this.volumeLevel = this.volumeslider.value;
            this.volval.innerHTML = this.volumeLevel;
            this.sendMessageToHost(new AudioFileParametersUrility().dump(this.ratio, this.volumeLevel, this.path));
        });
        this.sendMessageToHost('');
        this.updateUI();
    }
    sendMessageToHost(data) {
        var message = { dialogID: this.id, pluginData: data, done: false };
        window.parent.postMessage(message, '*');
    }
    receiveHostMessage(messageEvent) {
        let message = messageEvent.data;
        if (this.id) {
            let parsed = new AudioFileParametersUrility().parse(message.hostData);
            this.ratio = parsed.ratio;
            this.volumeLevel = parsed.volume;
            this.path = parsed.url;
            this.updateUI();
        }
        else {
            this.id = message.hostData;
        }
    }
    updateUI() {
        this.numval.innerHTML = this.ratio;
        this.volval.innerHTML = this.volumeLevel;
        this.ratioslider.value = this.ratio;
        this.volumeslider.value = this.volumeLevel;
        this.fname.value = this.path;
    }
    selectPath(name) {
        this.path = 'https://surikov.github.io/muzxbox/riffshareiii/parts/extensions/minium.audiofile/audiosamples/' + name;
        this.sendMessageToHost('' + this.ratio + ',' + this.path);
        this.updateUI();
    }
    bufferName(ratio, url) {
        return ratio + ',' + url;
    }
    checkPath() {
        this.sendMessageToHost(new AudioFileParametersUrility().dump(this.ratio, this.volumeLevel, this.path));
        if (window[this.bufferName(this.ratio, this.path)]) {
            this.beep();
        }
        else {
            this.startLoadFile(this.path, this.ratio);
        }
    }
    startLoadFile(url, ratio) {
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open("GET", url, true);
        xmlHttpRequest.responseType = "arraybuffer";
        xmlHttpRequest.onload = (event) => {
            const arrayBuffer = xmlHttpRequest.response;
            if (arrayBuffer) {
                this.startDecodeBuffer(arrayBuffer, url, ratio);
            }
        };
        xmlHttpRequest.onerror = (proevent) => {
            console.log('onerror', proevent);
            console.log('xmlHttpRequest', xmlHttpRequest);
            alert('Error ' + proevent);
        };
        try {
            xmlHttpRequest.send(null);
        }
        catch (xx) {
            console.log(xx);
            alert('Error ' + xx);
        }
    }
    startDecodeBuffer(arrayBuffer, path, ratio) {
        let audioContext = new AudioContext();
        let me = this;
        audioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
            window[me.bufferName(ratio, path)] = audioBuffer;
            me.startTransposeAudioBuffer(path, ratio);
        });
    }
    startTransposeAudioBuffer(path, ratio) {
        ratio = ratio ? ratio : 0;
        if (ratio) {
            let audioBuffer = window[this.bufferName(ratio, path)];
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
        this.beep();
    }
    beep() {
        let audioContext = new AudioContext();
        let audioBufferSourceNode = audioContext.createBufferSource();
        audioBufferSourceNode.buffer = window[this.bufferName(this.ratio, this.path)];
        audioBufferSourceNode.connect(audioContext.destination);
        audioBufferSourceNode.start(0);
    }
}
let pickerbridge = new AudioFilePicker();
//# sourceMappingURL=dataplay.js.map