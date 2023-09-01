"use strict";
class PerformerCachedVoxPlugin {
    constructor() {
        this.wavePath = '';
        this.waveRatio = 1;
        this.afterTime = 0.05;
        this.nearZero = 0.000001;
        this.envelopes = [];
    }
    newWaveRatio(parameters) {
        if (parameters) {
            let arr = parameters.split('|');
            if (arr.length == 2) {
                let newRatio = parseFloat(arr[0]);
                let newPath = arr[1];
                if (this.wavePath == newPath && this.waveRatio == newRatio) {
                }
                else {
                    console.log('newWaveRatio', newPath, newRatio);
                    this.wavePath = newPath;
                    this.waveRatio = newRatio;
                    return true;
                }
            }
        }
        return false;
    }
    launch(context, parameters) {
        if (!(this.out)) {
            this.audioContext = context;
            this.out = this.audioContext.createGain();
        }
        if (this.newWaveRatio(parameters)) {
            let me = this;
            console.log('load', this.wavePath);
            MZXBX_loadCachedBuffer(context, this.wavePath, (cachedWave) => {
                console.log('check', me.wavePath, cachedWave.buffer);
                if (cachedWave.buffer) {
                    if (this.waveRatio == 1) {
                        me.audioBuffer = cachedWave.buffer;
                    }
                    else {
                        me.cloneShifted(cachedWave.buffer);
                    }
                    console.log('done', me.wavePath);
                }
            });
        }
    }
    cloneShifted(from) {
        console.log('cloneShifted', this.waveRatio);
        this.audioBuffer = this.audioContext.createBuffer(1, from.length, from.sampleRate);
        let data = new Float32Array(from.length);
        from.copyFromChannel(data, 0);
        this.audioBuffer.copyToChannel(data, 0);
        this.doPitchShift(this.audioBuffer, this.waveRatio);
    }
    busy() {
        if (this.audioBuffer) {
            return null;
        }
        else {
            return "loading wave " + this.wavePath + ', ratio ' + this.waveRatio;
        }
    }
    schedule(when, pitch, slides) {
        let involume = 1.0;
        let offset = 0;
        let duration = 0;
        if (slides[0].duration < 0 && slides.length > 1) {
            offset = -slides[0].duration;
            duration = 0;
            for (let i = 1; i < slides.length; i++) {
                duration = duration + slides[i].duration;
            }
        }
        else {
            for (let i = 0; i < slides.length; i++) {
                duration = duration + slides[i].duration;
            }
        }
        var envelope = this.findEnvelope(this.audioContext, this.out);
        envelope.when = when;
        envelope.duration = duration + this.afterTime;
        envelope.out.gain.cancelScheduledValues(when);
        envelope.out.gain.setValueAtTime(this.noZeroVolume(involume), when);
        envelope.out.gain.setValueAtTime(this.noZeroVolume(involume), when + duration);
        envelope.out.gain.linearRampToValueAtTime(this.noZeroVolume(0), when + duration + this.afterTime);
        envelope.out.disconnect();
        envelope.out.connect(this.out);
        if (this.waveRatio == 1) {
        }
        else {
            envelope.audioBufferSourceNode.playbackRate.value = this.waveRatio;
        }
        envelope.audioBufferSourceNode.start(when, offset);
        envelope.audioBufferSourceNode.stop(when + duration + this.afterTime);
    }
    output() {
        return this.out;
    }
    cancel() {
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            e.audioBufferSourceNode.disconnect();
            e.audioBufferSourceNode.stop(0);
            e.when = -1;
        }
    }
    noZeroVolume(n) {
        if (n > this.nearZero) {
            return n;
        }
        else {
            return this.nearZero;
        }
    }
    ;
    findEnvelope(audioContext, out) {
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            if (audioContext.currentTime > e.when + e.duration + 0.001) {
                try {
                    if (e.audioBufferSourceNode) {
                        e.audioBufferSourceNode.disconnect();
                        e.audioBufferSourceNode.stop(0);
                    }
                }
                catch (x) {
                }
                e.audioBufferSourceNode = this.audioContext.createBufferSource();
                if (this.audioBuffer) {
                    e.audioBufferSourceNode.buffer = this.audioBuffer;
                }
                e.audioBufferSourceNode.connect(e.out);
                return e;
            }
        }
        let envelope = {
            audioBufferSourceNode: this.audioContext.createBufferSource(),
            when: 0,
            duration: 0,
            out: audioContext.createGain()
        };
        if (this.audioBuffer) {
            envelope.audioBufferSourceNode.buffer = this.audioBuffer;
        }
        envelope.audioBufferSourceNode.connect(envelope.out);
        this.envelopes.push(envelope);
        return envelope;
    }
    ;
    resamplePitchShift(pitchShift, numSampsToProcess, fftFrameSize, osamp, sampleRate, indata) {
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
        let i;
        let k;
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
        for (i = 0; i < numSampsToProcess; i++) {
            gInFIFO[gRover] = indata[i];
            outdata[i] = gOutFIFO[gRover - inFifoLatency];
            gRover++;
            if (gRover >= fftFrameSize) {
                gRover = inFifoLatency;
                for (k = 0; k < fftFrameSize; k++) {
                    window = -.5 * Math.cos(2.0 * Math.PI * k / fftFrameSize) + .5;
                    gFFTworksp[2 * k] = (gInFIFO[k] * window);
                    gFFTworksp[2 * k + 1] = 0.0;
                }
                this.shortTimeFourierTransform(gFFTworksp, fftFrameSize, -1);
                for (k = 0; k <= fftFrameSize2; k++) {
                    real = gFFTworksp[2 * k];
                    imag = gFFTworksp[2 * k + 1];
                    magn = 2.0 * Math.sqrt(real * real + imag * imag);
                    phase = Math.atan2(imag, real);
                    tmp = phase - gLastPhase[k];
                    gLastPhase[k] = phase;
                    tmp = tmp - k * expct;
                    qpd = Math.trunc(tmp / Math.PI);
                    if (qpd >= 0) {
                        qpd = qpd + qpd & 1;
                    }
                    else {
                        qpd = qpd - qpd & 1;
                    }
                    tmp = tmp - Math.PI * qpd;
                    tmp = osamp * tmp / (2.0 * Math.PI);
                    tmp = k * freqPerBin + tmp * freqPerBin;
                    gAnaMagn[k] = magn;
                    gAnaFreq[k] = tmp;
                }
                for (var zero = 0; zero < fftFrameSize; zero++) {
                    gSynMagn[zero] = 0;
                    gSynFreq[zero] = 0;
                }
                for (k = 0; k <= fftFrameSize2; k++) {
                    index = Math.trunc(k * pitchShift);
                    if (index <= fftFrameSize2) {
                        gSynMagn[index] = gSynMagn[index] + gAnaMagn[k];
                        gSynFreq[index] = gAnaFreq[k] * pitchShift;
                    }
                }
                for (k = 0; k <= fftFrameSize2; k++) {
                    magn = gSynMagn[k];
                    tmp = gSynFreq[k];
                    tmp = tmp - k * freqPerBin;
                    tmp = tmp / freqPerBin;
                    tmp = 2.0 * Math.PI * tmp / osamp;
                    tmp = tmp + k * expct;
                    gSumPhase[k] = gSumPhase[k] + tmp;
                    phase = gSumPhase[k];
                    gFFTworksp[2 * k] = (magn * Math.cos(phase));
                    gFFTworksp[2 * k + 1] = (magn * Math.sin(phase));
                }
                for (k = fftFrameSize + 2; k < 2 * fftFrameSize; k++) {
                    gFFTworksp[k] = 0.0;
                }
                this.shortTimeFourierTransform(gFFTworksp, fftFrameSize, 1);
                for (k = 0; k < fftFrameSize; k++) {
                    window = -.5 * Math.cos(2.0 * Math.PI * k / fftFrameSize) + .5;
                    gOutputAccum[k] = gOutputAccum[k] + (2.0 * window * gFFTworksp[2 * k] / (fftFrameSize2 * osamp));
                }
                for (k = 0; k < stepSize; k++) {
                    gOutFIFO[k] = gOutputAccum[k];
                }
                for (k = 0; k < fftFrameSize; k++) {
                    gOutputAccum[k] = gOutputAccum[k + stepSize];
                }
                for (k = 0; k < inFifoLatency; k++) {
                    gInFIFO[k] = gInFIFO[k + stepSize];
                }
            }
        }
        return outdata;
    }
    shortTimeFourierTransform(fftBuffer, fftFrameSize, sign) {
        let wr;
        let wi;
        let arg;
        let temp;
        let tr;
        let ti;
        let ur;
        let ui;
        let i;
        let bitm;
        let j;
        let le;
        let le2;
        let k;
        for (i = 2; i < 2 * fftFrameSize - 2; i += 2) {
            for (bitm = 2, j = 0; bitm < 2 * fftFrameSize; bitm <<= 1) {
                if ((i & bitm) != 0)
                    j++;
                j <<= 1;
            }
            if (i < j) {
                temp = fftBuffer[i];
                fftBuffer[i] = fftBuffer[j];
                fftBuffer[j] = temp;
                temp = fftBuffer[i + 1];
                fftBuffer[i + 1] = fftBuffer[j + 1];
                fftBuffer[j + 1] = temp;
            }
        }
        var max = Math.trunc(Math.log(fftFrameSize) / Math.log(2.0) + .5);
        for (k = 0, le = 2; k < max; k++) {
            le <<= 1;
            le2 = le >> 1;
            ur = 1.0;
            ui = 0.0;
            arg = Math.PI / (le2 >> 1);
            wr = Math.cos(arg);
            wi = (sign * Math.sin(arg));
            for (j = 0; j < le2; j += 2) {
                for (i = j; i < 2 * fftFrameSize; i += le) {
                    tr = fftBuffer[i + le2] * ur - fftBuffer[i + le2 + 1] * ui;
                    ti = fftBuffer[i + le2] * ui + fftBuffer[i + le2 + 1] * ur;
                    fftBuffer[i + le2] = fftBuffer[i] - tr;
                    fftBuffer[i + le2 + 1] = fftBuffer[i + 1] - ti;
                    fftBuffer[i] += tr;
                    fftBuffer[i + 1] += ti;
                }
                tr = ur * wr - ui * wi;
                ui = ur * wi + ui * wr;
                ur = tr;
            }
        }
    }
    doPitchShift(audioBuffer, ratio) {
        if (ratio) {
            if (ratio == 1) {
                return;
            }
            else {
                let data = new Float32Array(audioBuffer.length);
                audioBuffer.copyFromChannel(data, 0);
                let sampleRate = audioBuffer.sampleRate;
                let newData = this.resamplePitchShift(ratio, data.length, 1024, 10, sampleRate, data);
                for (let ii = 0; ii < audioBuffer.numberOfChannels; ii++) {
                    audioBuffer.copyToChannel(newData, ii);
                }
            }
        }
    }
}
function createPluginCachedVoxPerf() {
    return new PerformerCachedVoxPlugin();
}
//# sourceMappingURL=cachedvox.js.map