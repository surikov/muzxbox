//http://www.dspdimension.com
//https://stackoverflow.com/questions/57222269/how-to-pitchshift-an-audio-buffer-in-tone-js

/*
<!-- Translated from https://sites.google.com/site/mikescoderama/pitch-shifting to javascript By Seth Kitchen 2019-->
<html>
<div id="wrapper">
	<p>PitchShift factor value which is between 0.5 (one octave down) and 2. (one octave up)</p>
	<input id="shiftAmount" type="text" value=".5" />
	<button onclick="loadTheTrack()">Pick a file and then wait for the pitch shift to happen! </button>
	<p id="status">Waiting for you to pick file.</p>
</div>
*/

/****************************************************************************
*
* NAME: PitchShift
* VERSION: 1.2
* HOME URL: http://www.dspdimension.com
* KNOWN BUGS: none
*
* SYNOPSIS: Routine for doing pitch shifting while maintaining
* duration using the Short Time Fourier Transform.
*
* DESCRIPTION: The routine takes a pitchShift factor value which is between 0.5
* (one octave down) and 2. (one octave up). A value of exactly 1 does not change
* the pitch. numSampsToProcess tells the routine how many samples in indata[0...
* numSampsToProcess-1] should be pitch shifted and moved to outdata[0 ...
* numSampsToProcess-1]. The two buffers can be identical (ie. it can process the
* data in-place). fftFrameSize defines the FFT frame size used for the
* processing. Typical values are 1024, 2048 and 4096. It may be any value <=
* MAX_FRAME_LENGTH but it MUST be a power of 2. osamp is the STFT
* oversampling factor which also determines the overlap between adjacent STFT
* frames. It should at least be 4 for moderate scaling ratios. A value of 32 is
* recommended for best quality. sampleRate takes the sample rate for the signal 
* in unit Hz, ie. 44100 for 44.1 kHz audio. The data passed to the routine in 
* indata[] should be in the range [-1.0, 1.0), which is also the output range 
* for the data, make sure you scale the data accordingly (for 16bit signed integers
* you would have to divide (and multiply) by 32768). 
*
* COPYRIGHT 1999-2006 Stephan M. Bernsee <smb [AT] dspdimension [DOT] com>
*
*                       The Wide Open License (WOL)
*
* Permission to use, copy, modify, distribute and sell this software and its
* documentation for any purpose is hereby granted without fee, provided that
* the above copyright notice and this license appear in all source copies. 
* THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT EXPRESS OR IMPLIED WARRANTY OF
* ANY KIND. See http://www.dspguru.com/wol.htm for more information.
*
*****************************************************************************/


/*
var AudioContext = window.AudioContext;// || window.webkitAudioContext;
var audioCtx = new AudioContext();

function loadTheTrack() {
	var input: any = document.createElement('input');
	input.type = 'file';
	input.style = "display:none";
	input.onchange = function (e) {
		var file = e.target.files[0];
		console.log(file);
		var reader = new FileReader();
		reader.onload = function () {
			console.log("decoding audio data with" + this.result);
			(document.getElementById('status') as any).innerText = "Pitch Shifting (yeah it takes a min)....";
			audioCtx.decodeAudioData(this.result as ArrayBuffer, (decodedData) => {
				var in_data_l: Float32Array = decodedData.getChannelData(0);
				console.log(in_data_l);
				var in_data_r = decodedData.getChannelData(1);
				console.log(in_data_r);
				var shiftAmount = (document.getElementById("shiftAmount") as any).value;
				console.log(shiftAmount);
				in_data_l = resamplePitchShift(shiftAmount, in_data_l.length, 1024, 10, audioCtx.sampleRate, in_data_l);
				console.log(in_data_l);
				in_data_r = resamplePitchShift(shiftAmount, in_data_l.length, 1024, 10, audioCtx.sampleRate, in_data_r);
				decodedData.copyToChannel(in_data_l, 0);
				decodedData.copyToChannel(in_data_r, 1);
				var source = audioCtx.createBufferSource(); // creates a sound source
				source.buffer = decodedData;       // tell the source which sound to play
				source.connect(audioCtx.destination);       // connect the source to the context's destination (the speakers)
				console.log('starting');
				(document.getElementById('status') as any).innerText = "Playing...";
				source.start(0);                            // play the source now
			}, (e) => {
				alert('Sorry this browser unable to download this file... try Chrome');
			});
		}
		reader.readAsArrayBuffer(file);
	}
	let kk =
		document.getElementById("wrapper")

	if (kk) kk.appendChild(input);
	input.click();
}
*/
function resamplePitchShiftFloat32Array(
    /* float[*/ pitchShift: number
	, /* long */ numSampsToProcess: number
	, /* long */ fftFrameSize: number
	, /* long */ osamp: number
	, /* float[*/ sampleRate: number
	, /* float[] */ indata: Float32Array
): Float32Array {
	let MAX_FRAME_LENGTH: number = 16000;
	let gInFIFO: number[] = new Array(MAX_FRAME_LENGTH).fill(0.0);
	let gOutFIFO: number[] = new Array(MAX_FRAME_LENGTH).fill(0.0);
	let gFFTworksp: number[] = new Array(2 * MAX_FRAME_LENGTH).fill(0.0);
	let gLastPhase: number[] = new Array(MAX_FRAME_LENGTH / 2 + 1).fill(0.0);
	let gSumPhase: number[] = new Array(MAX_FRAME_LENGTH / 2 + 1).fill(0.0);
	let gOutputAccum: number[] = new Array(2 * MAX_FRAME_LENGTH).fill(0.0);
	let gAnaFreq: number[] = new Array(MAX_FRAME_LENGTH).fill(0.0);
	let gAnaMagn: number[] = new Array(MAX_FRAME_LENGTH).fill(0.0);
	let gSynFreq: number[] = new Array(MAX_FRAME_LENGTH).fill(0.0);
	let gSynMagn: number[] = new Array(MAX_FRAME_LENGTH).fill(0.0);
	let gRover = 0;
	/* double */
	let magn: number;
	let phase: number;
	let tmp: number;
	let window: number;
	let real: number;
	let imag: number;
	/* double */
	let freqPerBin: number;
	let expct: number;
	/* long */
	//let ii: number;
	//let kk: number;
	let qpd: number;
	let index: number;
	let inFifoLatency: number;
	let stepSize: number;
	let fftFrameSize2: number;


	/* float[] */
	let outdata: Float32Array = indata;
	/* set up some handy variables */
	fftFrameSize2 = Math.trunc(fftFrameSize / 2);
	stepSize = Math.trunc(fftFrameSize / osamp);
	freqPerBin = sampleRate / /* (double) */fftFrameSize;
	expct = 2.0 * Math.PI * /* (double) */stepSize / /* (double) */fftFrameSize;
	inFifoLatency = Math.trunc(fftFrameSize - stepSize);
	if (gRover == 0) {
		gRover = inFifoLatency;
	}

	/* main processing loop */
	for (let ii = 0; ii < numSampsToProcess; ii++) {

		/* As long as we have not yet collected enough data just read in */
		gInFIFO[gRover] = indata[ii];
		outdata[ii] = gOutFIFO[gRover - inFifoLatency];
		gRover++;

		/* now we have enough data for processing */
		if (gRover >= fftFrameSize) {
			gRover = inFifoLatency;

			/* do windowing and re,im interleave */
			for (let kk = 0; kk < fftFrameSize; kk++) {
				window = -.5 * Math.cos(2.0 * Math.PI * /* (double) */kk / /* (double) */fftFrameSize) + .5;
				gFFTworksp[2 * kk] = /* (float) */(gInFIFO[kk] * window);
				gFFTworksp[2 * kk + 1] = 0.0;
			}


			/* ***************** ANALYSIS ******************* */
			/* do transform */
			ShortTimeFourierTransform(gFFTworksp, fftFrameSize, -1);

			/* this is the analysis step */
			for (let kk = 0; kk <= fftFrameSize2; kk++) {

				/* de-interlace FFT buffer */
				real = gFFTworksp[2 * kk];
				imag = gFFTworksp[2 * kk + 1];

				/* compute magnitude and phase */
				magn = 2.0 * Math.sqrt(real * real + imag * imag);
				phase = Math.atan2(imag, real);

				/* compute phase difference */
				tmp = phase - gLastPhase[kk];
				gLastPhase[kk] = /* (float) */phase;

				/* subtract expected phase difference */
				//tmp -= /* (double) */kk * expct;
				tmp = tmp - /* (double) */kk * expct;

				/* map delta phase into +/- Pi interval */
				qpd = /* (long) */Math.trunc(tmp / Math.PI);
				if (qpd >= 0) {
					//qpd += qpd & 1;
					qpd = qpd + qpd & 1;
				}
				else {
					//qpd -= qpd & 1;
					qpd = qpd - qpd & 1;
				}
				//tmp -= Math.PI * /* (double) */qpd;
				tmp = tmp - Math.PI * /* (double) */qpd;

				/* get deviation from bin frequency from the +/- Pi interval */
				tmp = osamp * tmp / (2.0 * Math.PI);

				/* compute the k-th partials' true frequency */
				tmp = /* (double) */kk * freqPerBin + tmp * freqPerBin;

				/* store magnitude and true frequency in analysis arrays */
				gAnaMagn[kk] = /* (float) */magn;
				gAnaFreq[kk] = /* (float) */tmp;

			}

			/* ***************** PROCESSING ******************* */
			/* this does the actual pitch shifting */
			for (var zero = 0; zero < fftFrameSize; zero++) {
				gSynMagn[zero] = 0;
				gSynFreq[zero] = 0;
			}

			for (let kk = 0; kk <= fftFrameSize2; kk++) {
				index = /* (long) */Math.trunc(kk * pitchShift);
				if (index <= fftFrameSize2) {
					//gSynMagn[index] += gAnaMagn[kk];
					gSynMagn[index] = gSynMagn[index] + gAnaMagn[kk];
					gSynFreq[index] = gAnaFreq[kk] * pitchShift;
				}
			}

			/* ***************** SYNTHESIS ******************* */
			/* this is the synthesis step */
			for (let kk = 0; kk <= fftFrameSize2; kk++) {

				/* get magnitude and true frequency from synthesis arrays */
				magn = gSynMagn[kk];
				tmp = gSynFreq[kk];

				/* subtract bin mid frequency */
				//tmp -= /* (double) */kk * freqPerBin;
				tmp = tmp - /* (double) */kk * freqPerBin;

				/* get bin deviation from freq deviation */
				//tmp /= freqPerBin;
				tmp = tmp / freqPerBin;

				/* take osamp into account */
				tmp = 2.0 * Math.PI * tmp / osamp;

				/* add the overlap phase advance back in */
				//tmp += /* (double) */kk * expct;
				tmp = tmp + /* (double) */kk * expct;

				/* accumulate delta phase to get bin phase */
				//gSumPhase[kk] += /* (float) */tmp;
				gSumPhase[kk] = gSumPhase[kk] + /* (float) */tmp;
				phase = gSumPhase[kk];

				/* get real and imag part and re-interleave */
				gFFTworksp[2 * kk] = /* (float) */(magn * Math.cos(phase));
				gFFTworksp[2 * kk + 1] = /* (float) */(magn * Math.sin(phase));
			}

			/* zero negative frequencies */
			for (let kk = fftFrameSize + 2; kk < 2 * fftFrameSize; kk++) {
				gFFTworksp[kk] = 0.0;
			}
			/* do inverse transform */
			ShortTimeFourierTransform(gFFTworksp, fftFrameSize, 1);

			/* do windowing and add to output accumulator */
			for (let kk = 0; kk < fftFrameSize; kk++) {
				window = -.5 * Math.cos(2.0 * Math.PI * /* (double) */kk / /* (double) */fftFrameSize) + .5;
				gOutputAccum[kk] += /* (float) */(2.0 * window * gFFTworksp[2 * kk] / (fftFrameSize2 * osamp));
			}
			for (let kk = 0; kk < stepSize; kk++) {
				gOutFIFO[kk] = gOutputAccum[kk];
			}

			/* shift accumulator */
			//memmove(gOutputAccum, gOutputAccum + stepSize, fftFrameSize * sizeof(float));
			for (let kk = 0; kk < fftFrameSize; kk++) {
				gOutputAccum[kk] = gOutputAccum[kk + stepSize];
			}

			/* move input FIFO */
			for (let kk = 0; kk < inFifoLatency; kk++) {
				gInFIFO[kk] = gInFIFO[kk + stepSize];
			}
		}
	}
	return outdata;
}

function ShortTimeFourierTransform(
    /* float[] */ fftBuffer: number[]
	, /* long */ fftFrameSize: number
	, /* long */ sign: number
) {
	/* float */
	//let wr: number;
	//let wi: number;
	//let arg: number;
	let temp: number;
	/* float */
	let tr: number;
	let ti: number;
	//let ur: number;
	//let ui: number;
	/* long */
	//let i: number;
	let bitm: number;
	//let j: number;
	//let le: number;
	//let le2: number;
	//let k: number;

	for (let ii = 2; ii < 2 * fftFrameSize - 2; ii += 2) {
		let jj = 0;
		//for (bitm = 2/*, j = 0*/; bitm < 2 * fftFrameSize; bitm <<= 1) {
		for (bitm = 2/*, j = 0*/; bitm < 2 * fftFrameSize; bitm = bitm << 1) {
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
	/* long */ var max = /* (long) */Math.trunc(Math.log(fftFrameSize) / Math.log(2.0) + .5);
	let le = 2;
	for (let kk = 0/*, le = 2*/; kk < max; kk++) {
		//le <<= 1;
		le = le << 1;
		//le2 = le >> 1;
		let le2 = le >> 1;
		let ur = 1.0;
		let ui = 0.0;
		let arg = /* (float) */Math.PI / (le2 >> 1);
		let wr = /* (float) */Math.cos(arg);
		let wi = /* (float) */(sign * Math.sin(arg));
		for (let jj = 0; jj < le2; jj += 2) {

			for (let ii = jj; ii < 2 * fftFrameSize; ii += le) {
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









function ___do___PitchShift(audioBuffer: AudioBuffer, ratio: number) {
	if (ratio) {
		if (ratio == 1) {
			return;
		} else {
			//console.log('doPitchShift', ratio, audioBuffer);
			let data = new Float32Array(audioBuffer.length);
			//console.log(data);
			audioBuffer.copyFromChannel(data, 0);
			//let shiftAmount = 1.0;
			let sampleRate = audioBuffer.sampleRate;
			let newData = resamplePitchShiftFloat32Array(ratio, data.length, 1024, 10, sampleRate, data);
			//console.log(newData);
			for (let ii = 0; ii < audioBuffer.numberOfChannels; ii++) {
				audioBuffer.copyToChannel(newData, ii);
			}
		}
	}
}

