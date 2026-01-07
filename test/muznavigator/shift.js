function resamplePitchShiftFloat32Array(
/* float[*/ pitchShift, /* long */ numSampsToProcess, /* long */ fftFrameSize, /* long */ osamp, /* float[*/ sampleRate, /* float[] */ indata) {
    var MAX_FRAME_LENGTH = 16000;
    var gInFIFO = new Array(MAX_FRAME_LENGTH).fill(0.0);
    var gOutFIFO = new Array(MAX_FRAME_LENGTH).fill(0.0);
    var gFFTworksp = new Array(2 * MAX_FRAME_LENGTH).fill(0.0);
    var gLastPhase = new Array(MAX_FRAME_LENGTH / 2 + 1).fill(0.0);
    var gSumPhase = new Array(MAX_FRAME_LENGTH / 2 + 1).fill(0.0);
    var gOutputAccum = new Array(2 * MAX_FRAME_LENGTH).fill(0.0);
    var gAnaFreq = new Array(MAX_FRAME_LENGTH).fill(0.0);
    var gAnaMagn = new Array(MAX_FRAME_LENGTH).fill(0.0);
    var gSynFreq = new Array(MAX_FRAME_LENGTH).fill(0.0);
    var gSynMagn = new Array(MAX_FRAME_LENGTH).fill(0.0);
    var gRover = 0;
    /* double */
    var magn;
    var phase;
    var tmp;
    var window;
    var real;
    var imag;
    /* double */
    var freqPerBin;
    var expct;
    /* long */
    //let ii: number;
    //let kk: number;
    var qpd;
    var index;
    var inFifoLatency;
    var stepSize;
    var fftFrameSize2;
    /* float[] */
    var outdata = indata;
    /* set up some handy variables */
    fftFrameSize2 = Math.trunc(fftFrameSize / 2);
    stepSize = Math.trunc(fftFrameSize / osamp);
    freqPerBin = sampleRate / /* (double) */ fftFrameSize;
    expct = 2.0 * Math.PI * /* (double) */ stepSize / /* (double) */ fftFrameSize;
    inFifoLatency = Math.trunc(fftFrameSize - stepSize);
    if (gRover == 0) {
        gRover = inFifoLatency;
    }
    /* main processing loop */
    for (var ii = 0; ii < numSampsToProcess; ii++) {
        /* As long as we have not yet collected enough data just read in */
        gInFIFO[gRover] = indata[ii];
        outdata[ii] = gOutFIFO[gRover - inFifoLatency];
        gRover++;
        /* now we have enough data for processing */
        if (gRover >= fftFrameSize) {
            gRover = inFifoLatency;
            /* do windowing and re,im interleave */
            for (var kk = 0; kk < fftFrameSize; kk++) {
                window = -.5 * Math.cos(2.0 * Math.PI * /* (double) */ kk / /* (double) */ fftFrameSize) + .5;
                gFFTworksp[2 * kk] = /* (float) */ (gInFIFO[kk] * window);
                gFFTworksp[2 * kk + 1] = 0.0;
            }
            /* ***************** ANALYSIS ******************* */
            /* do transform */
            ShortTimeFourierTransform(gFFTworksp, fftFrameSize, -1);
            /* this is the analysis step */
            for (var kk = 0; kk <= fftFrameSize2; kk++) {
                /* de-interlace FFT buffer */
                real = gFFTworksp[2 * kk];
                imag = gFFTworksp[2 * kk + 1];
                /* compute magnitude and phase */
                magn = 2.0 * Math.sqrt(real * real + imag * imag);
                phase = Math.atan2(imag, real);
                /* compute phase difference */
                tmp = phase - gLastPhase[kk];
                gLastPhase[kk] = /* (float) */ phase;
                /* subtract expected phase difference */
                //tmp -= /* (double) */kk * expct;
                tmp = tmp - /* (double) */ kk * expct;
                /* map delta phase into +/- Pi interval */
                qpd = /* (long) */ Math.trunc(tmp / Math.PI);
                if (qpd >= 0) {
                    //qpd += qpd & 1;
                    qpd = qpd + qpd & 1;
                }
                else {
                    //qpd -= qpd & 1;
                    qpd = qpd - qpd & 1;
                }
                //tmp -= Math.PI * /* (double) */qpd;
                tmp = tmp - Math.PI * /* (double) */ qpd;
                /* get deviation from bin frequency from the +/- Pi interval */
                tmp = osamp * tmp / (2.0 * Math.PI);
                /* compute the k-th partials' true frequency */
                tmp = /* (double) */ kk * freqPerBin + tmp * freqPerBin;
                /* store magnitude and true frequency in analysis arrays */
                gAnaMagn[kk] = /* (float) */ magn;
                gAnaFreq[kk] = /* (float) */ tmp;
            }
            /* ***************** PROCESSING ******************* */
            /* this does the actual pitch shifting */
            for (var zero = 0; zero < fftFrameSize; zero++) {
                gSynMagn[zero] = 0;
                gSynFreq[zero] = 0;
            }
            for (var kk = 0; kk <= fftFrameSize2; kk++) {
                index = /* (long) */ Math.trunc(kk * pitchShift);
                if (index <= fftFrameSize2) {
                    //gSynMagn[index] += gAnaMagn[kk];
                    gSynMagn[index] = gSynMagn[index] + gAnaMagn[kk];
                    gSynFreq[index] = gAnaFreq[kk] * pitchShift;
                }
            }
            /* ***************** SYNTHESIS ******************* */
            /* this is the synthesis step */
            for (var kk = 0; kk <= fftFrameSize2; kk++) {
                /* get magnitude and true frequency from synthesis arrays */
                magn = gSynMagn[kk];
                tmp = gSynFreq[kk];
                /* subtract bin mid frequency */
                //tmp -= /* (double) */kk * freqPerBin;
                tmp = tmp - /* (double) */ kk * freqPerBin;
                /* get bin deviation from freq deviation */
                //tmp /= freqPerBin;
                tmp = tmp / freqPerBin;
                /* take osamp into account */
                tmp = 2.0 * Math.PI * tmp / osamp;
                /* add the overlap phase advance back in */
                //tmp += /* (double) */kk * expct;
                tmp = tmp + /* (double) */ kk * expct;
                /* accumulate delta phase to get bin phase */
                //gSumPhase[kk] += /* (float) */tmp;
                gSumPhase[kk] = gSumPhase[kk] + /* (float) */ tmp;
                phase = gSumPhase[kk];
                /* get real and imag part and re-interleave */
                gFFTworksp[2 * kk] = /* (float) */ (magn * Math.cos(phase));
                gFFTworksp[2 * kk + 1] = /* (float) */ (magn * Math.sin(phase));
            }
            /* zero negative frequencies */
            for (var kk = fftFrameSize + 2; kk < 2 * fftFrameSize; kk++) {
                gFFTworksp[kk] = 0.0;
            }
            /* do inverse transform */
            ShortTimeFourierTransform(gFFTworksp, fftFrameSize, 1);
            /* do windowing and add to output accumulator */
            for (var kk = 0; kk < fftFrameSize; kk++) {
                window = -.5 * Math.cos(2.0 * Math.PI * /* (double) */ kk / /* (double) */ fftFrameSize) + .5;
                gOutputAccum[kk] += /* (float) */ (2.0 * window * gFFTworksp[2 * kk] / (fftFrameSize2 * osamp));
            }
            for (var kk = 0; kk < stepSize; kk++) {
                gOutFIFO[kk] = gOutputAccum[kk];
            }
            /* shift accumulator */
            //memmove(gOutputAccum, gOutputAccum + stepSize, fftFrameSize * sizeof(float));
            for (var kk = 0; kk < fftFrameSize; kk++) {
                gOutputAccum[kk] = gOutputAccum[kk + stepSize];
            }
            /* move input FIFO */
            for (var kk = 0; kk < inFifoLatency; kk++) {
                gInFIFO[kk] = gInFIFO[kk + stepSize];
            }
        }
    }
    return outdata;
}
function ShortTimeFourierTransform(
/* float[] */ fftBuffer, /* long */ fftFrameSize, /* long */ sign) {
    /* float */
    //let wr: number;
    //let wi: number;
    //let arg: number;
    var temp;
    /* float */
    var tr;
    var ti;
    //let ur: number;
    //let ui: number;
    /* long */
    //let i: number;
    var bitm;
    //let j: number;
    //let le: number;
    //let le2: number;
    //let k: number;
    for (var ii = 2; ii < 2 * fftFrameSize - 2; ii += 2) {
        var jj = 0;
        //for (bitm = 2/*, j = 0*/; bitm < 2 * fftFrameSize; bitm <<= 1) {
        for (bitm = 2 /*, j = 0*/; bitm < 2 * fftFrameSize; bitm = bitm << 1) {
            if ((ii & bitm) != 0) {
                jj++;
            }
            //jj <<= 1;
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
    /* long */ var max = /* (long) */ Math.trunc(Math.log(fftFrameSize) / Math.log(2.0) + .5);
    var le = 2;
    for (var kk = 0 /*, le = 2*/; kk < max; kk++) {
        //le <<= 1;
        le = le << 1;
        //le2 = le >> 1;
        var le2 = le >> 1;
        var ur = 1.0;
        var ui = 0.0;
        var arg = /* (float) */ Math.PI / (le2 >> 1);
        var wr = /* (float) */ Math.cos(arg);
        var wi = /* (float) */ (sign * Math.sin(arg));
        for (var jj = 0; jj < le2; jj += 2) {
            for (var ii = jj; ii < 2 * fftFrameSize; ii += le) {
                tr = fftBuffer[ii + le2] * ur - fftBuffer[ii + le2 + 1] * ui;
                ti = fftBuffer[ii + le2] * ui + fftBuffer[ii + le2 + 1] * ur;
                fftBuffer[ii + le2] = fftBuffer[ii] - tr;
                fftBuffer[ii + le2 + 1] = fftBuffer[ii + 1] - ti;
                //fftBuffer[ii] += tr;
                fftBuffer[ii] = fftBuffer[ii] + tr;
                //fftBuffer[ii + 1] += ti;
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
            //console.log('doPitchShift', ratio, audioBuffer);
            var data = new Float32Array(audioBuffer.length);
            //console.log(data);
            audioBuffer.copyFromChannel(data, 0);
            //let shiftAmount = 1.0;
            var sampleRate = audioBuffer.sampleRate;
            var newData = resamplePitchShiftFloat32Array(ratio, data.length, 1024, 10, sampleRate, data);
            //console.log(newData);
            for (var ii = 0; ii < audioBuffer.numberOfChannels; ii++) {
                audioBuffer.copyToChannel(newData, ii);
            }
        }
    }
}
