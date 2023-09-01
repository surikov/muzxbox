type CachedVoxEnvelope = {
	audioBufferSourceNode: AudioBufferSourceNode
	, when: number
	, duration: number
	, out: GainNode
};
class PerformerCachedVoxPlugin implements MZXBX_AudioPerformerPlugin {
	out: GainNode;
	//parameters = "";
	wavePath = '';
	waveRatio = 1;
	audioContext: AudioContext;
	//wave: MZXBX_CachedWave | null;
	audioBuffer: AudioBuffer;
	afterTime = 0.05;
	nearZero = 0.000001;
	envelopes: CachedVoxEnvelope[] = [];
	newWaveRatio(parameters: string): boolean {
		if (parameters) {
			let arr = parameters.split('|');
			if (arr.length == 2) {
				let newRatio = parseFloat(arr[0]);
				let newPath = arr[1];
				if (this.wavePath == newPath && this.waveRatio == newRatio) {
					//
				} else {
					console.log('newWaveRatio',newPath,newRatio);
					this.wavePath = newPath;
					this.waveRatio = newRatio;
					return true;
				}
			}
		}
		return false;
	}
	launch(context: AudioContext, parameters: string): void {
		if (!(this.out)) {
			this.audioContext = context;
			this.out = this.audioContext.createGain();
			//this.parameters = parameters;
			//this.newWaveRatio(parameters);
		}
		//if (!(this.wave)) {
		//if (this.parameters) {
		if (this.newWaveRatio(parameters)) {
			let me = this;
			/*MZXBX_loadCachedBuffer(context, this.parameters, (cachedWave: MZXBX_CachedWave) => {
				if (cachedWave.buffer) {
					me.wave = cachedWave;
				}
			});*/
			console.log('load',this.wavePath);
			MZXBX_loadCachedBuffer(context, this.wavePath, (cachedWave: MZXBX_CachedWave) => {
				console.log('check',me.wavePath,cachedWave.buffer);
				if (cachedWave.buffer) {
					if (this.waveRatio == 1) {
						me.audioBuffer = cachedWave.buffer;
					} else {
						//me.doPitchShift(me.audioBuffer, me.waveRatio);
						me.cloneShifted(cachedWave.buffer);
					}
					console.log('done',me.wavePath);
				}
			});
		}
		//}
	}
	cloneShifted(from:AudioBuffer){
		//audioBuffer.cl
		console.log('cloneShifted',this.waveRatio);
		this.audioBuffer=this.audioContext.createBuffer(1,from.length,from.sampleRate);
		let data=new Float32Array(from.length);
		from.copyFromChannel(data,0);
		this.audioBuffer.copyToChannel(data,0);
		this.doPitchShift(this.audioBuffer, this.waveRatio);
	}
	busy(): string | null {
		//if (this.wave) {
		if (this.audioBuffer) {
			return null;
		} else {
			return "loading wave "+this.wavePath+', ratio '+this.waveRatio;
		}
	}
	schedule(when: number, pitch: number, slides: MZXBX_SlideItem[]): void {
		//console.log('vox', when);
		let involume = 1.0;
		let offset = 0;
		let duration = 0;
		if (slides[0].duration < 0 && slides.length > 1) {
			offset = -slides[0].duration;
			duration = 0;
			for (let i = 1; i < slides.length; i++) {
				duration = duration + slides[i].duration;
			}
		} else {
			for (let i = 0; i < slides.length; i++) {
				duration = duration + slides[i].duration;
			}
		}
		/*for (let i = 0; i < slides.length; i++) {
			duration = duration + slides[i].duration;
		}*/
		var envelope: CachedVoxEnvelope = this.findEnvelope(this.audioContext, this.out);
		envelope.when = when;
		envelope.duration = duration + this.afterTime;
		envelope.out.gain.cancelScheduledValues(when);
		envelope.out.gain.setValueAtTime(this.noZeroVolume(involume), when);
		envelope.out.gain.setValueAtTime(this.noZeroVolume(involume), when + duration);
		envelope.out.gain.linearRampToValueAtTime(this.noZeroVolume(0), when + duration + this.afterTime);
		envelope.out.disconnect();
		envelope.out.connect(this.out);
		if (this.waveRatio == 1) {
			//
		} else {
			envelope.audioBufferSourceNode.playbackRate.value =  this.waveRatio;
		}
		envelope.audioBufferSourceNode.start(when, offset);
		envelope.audioBufferSourceNode.stop(when + duration + this.afterTime);
	}
	output(): AudioNode | null {
		return this.out;
	}
	cancel(): void {
		for (var i = 0; i < this.envelopes.length; i++) {
			var e: CachedVoxEnvelope = this.envelopes[i];
			e.audioBufferSourceNode.disconnect();
			e.audioBufferSourceNode.stop(0);
			e.when = -1;
		}
	}
	noZeroVolume(n: number): number {
		if (n > this.nearZero) {
			return n;
		} else {
			return this.nearZero;
		}
	};
	findEnvelope(audioContext: AudioContext, out: AudioNode): CachedVoxEnvelope {
		for (var i = 0; i < this.envelopes.length; i++) {
			var e: CachedVoxEnvelope = this.envelopes[i];
			if (audioContext.currentTime > e.when + e.duration + 0.001) {
				try {
					if (e.audioBufferSourceNode) {
						e.audioBufferSourceNode.disconnect();
						//e.audioBufferSourceNode.disconnect();
						e.audioBufferSourceNode.stop(0);
					}
				} catch (x) {
					//audioBufferSourceNode is dead already
				}
				e.audioBufferSourceNode = this.audioContext.createBufferSource();
				//if (this.wave) e.audioBufferSourceNode.buffer = this.wave.buffer;
				if (this.audioBuffer) {
					e.audioBufferSourceNode.buffer = this.audioBuffer;
				}
				e.audioBufferSourceNode.connect(e.out);
				return e;
			}
		}
		let envelope: CachedVoxEnvelope = {
			audioBufferSourceNode: this.audioContext.createBufferSource()
			, when: 0
			, duration: 0
			, out: audioContext.createGain()
		};
		//if (this.wave) envelope.audioBufferSourceNode.buffer = this.wave.buffer;
		if (this.audioBuffer) {
			envelope.audioBufferSourceNode.buffer = this.audioBuffer;
		}
		envelope.audioBufferSourceNode.connect(envelope.out);
		this.envelopes.push(envelope);
		return envelope;
	};
	//https://stackoverflow.com/questions/57222269/how-to-pitchshift-an-audio-buffer-in-tone-js

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

	resamplePitchShift(
		/* float[*/ pitchShift: number
		, /* long */ numSampsToProcess: number
		, /* long */ fftFrameSize: number
		, /* long */ osamp: number
		, /* float[*/ sampleRate: number
		, /* float[] */ indata: Float32Array
	): Float32Array {
		let MAX_FRAME_LENGTH: number = 16000;
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
		let i: number;
		let k: number;
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
		for (i = 0; i < numSampsToProcess; i++) {

			/* As long as we have not yet collected enough data just read in */
			gInFIFO[gRover] = indata[i];
			outdata[i] = gOutFIFO[gRover - inFifoLatency];
			gRover++;

			/* now we have enough data for processing */
			if (gRover >= fftFrameSize) {
				gRover = inFifoLatency;

				/* do windowing and re,im interleave */
				for (k = 0; k < fftFrameSize; k++) {
					window = -.5 * Math.cos(2.0 * Math.PI * /* (double) */k / /* (double) */fftFrameSize) + .5;
					gFFTworksp[2 * k] = /* (float) */(gInFIFO[k] * window);
					gFFTworksp[2 * k + 1] = 0.0;
				}


				/* ***************** ANALYSIS ******************* */
				/* do transform */
				this.shortTimeFourierTransform(gFFTworksp, fftFrameSize, -1);

				/* this is the analysis step */
				for (k = 0; k <= fftFrameSize2; k++) {

					/* de-interlace FFT buffer */
					real = gFFTworksp[2 * k];
					imag = gFFTworksp[2 * k + 1];

					/* compute magnitude and phase */
					magn = 2.0 * Math.sqrt(real * real + imag * imag);
					phase = Math.atan2(imag, real);

					/* compute phase difference */
					tmp = phase - gLastPhase[k];
					gLastPhase[k] = /* (float) */phase;

					/* subtract expected phase difference */
					//tmp -= /* (double) */k * expct;
					tmp = tmp - /* (double) */k * expct;

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
					tmp = /* (double) */k * freqPerBin + tmp * freqPerBin;

					/* store magnitude and true frequency in analysis arrays */
					gAnaMagn[k] = /* (float) */magn;
					gAnaFreq[k] = /* (float) */tmp;

				}

				/* ***************** PROCESSING ******************* */
				/* this does the actual pitch shifting */
				for (var zero = 0; zero < fftFrameSize; zero++) {
					gSynMagn[zero] = 0;
					gSynFreq[zero] = 0;
				}

				for (k = 0; k <= fftFrameSize2; k++) {
					index = /* (long) */Math.trunc(k * pitchShift);
					if (index <= fftFrameSize2) {
						//gSynMagn[index] += gAnaMagn[k];
						gSynMagn[index] = gSynMagn[index] + gAnaMagn[k];
						gSynFreq[index] = gAnaFreq[k] * pitchShift;
					}
				}

				/* ***************** SYNTHESIS ******************* */
				/* this is the synthesis step */
				for (k = 0; k <= fftFrameSize2; k++) {

					/* get magnitude and true frequency from synthesis arrays */
					magn = gSynMagn[k];
					tmp = gSynFreq[k];

					/* subtract bin mid frequency */
					//tmp -= /* (double) */k * freqPerBin;
					tmp = tmp - /* (double) */k * freqPerBin;

					/* get bin deviation from freq deviation */
					//tmp /= freqPerBin;
					tmp = tmp / freqPerBin;

					/* take osamp into account */
					tmp = 2.0 * Math.PI * tmp / osamp;

					/* add the overlap phase advance back in */
					//tmp += /* (double) */k * expct;
					tmp = tmp + /* (double) */k * expct;

					/* accumulate delta phase to get bin phase */
					//gSumPhase[k] += /* (float) */tmp;
					gSumPhase[k] = gSumPhase[k] + /* (float) */tmp;
					phase = gSumPhase[k];

					/* get real and imag part and re-interleave */
					gFFTworksp[2 * k] = /* (float) */(magn * Math.cos(phase));
					gFFTworksp[2 * k + 1] = /* (float) */(magn * Math.sin(phase));
				}

				/* zero negative frequencies */
				for (k = fftFrameSize + 2; k < 2 * fftFrameSize; k++) {
					gFFTworksp[k] = 0.0;
				}
				/* do inverse transform */
				this.shortTimeFourierTransform(gFFTworksp, fftFrameSize, 1);

				/* do windowing and add to output accumulator */
				for (k = 0; k < fftFrameSize; k++) {
					window = -.5 * Math.cos(2.0 * Math.PI * /* (double) */k / /* (double) */fftFrameSize) + .5;
					//gOutputAccum[k] += /* (float) */(2.0 * window * gFFTworksp[2 * k] / (fftFrameSize2 * osamp));
					gOutputAccum[k] = gOutputAccum[k] + /* (float) */(2.0 * window * gFFTworksp[2 * k] / (fftFrameSize2 * osamp));
				}
				for (k = 0; k < stepSize; k++) {
					gOutFIFO[k] = gOutputAccum[k];
				}
				/* shift accumulator */
				//memmove(gOutputAccum, gOutputAccum + stepSize, fftFrameSize * sizeof(float));
				for (k = 0; k < fftFrameSize; k++) {
					gOutputAccum[k] = gOutputAccum[k + stepSize];
				}

				/* move input FIFO */
				for (k = 0; k < inFifoLatency; k++) {
					gInFIFO[k] = gInFIFO[k + stepSize];
				}
			}
		}
		return outdata;
	}

	shortTimeFourierTransform(
		/* float[] */ fftBuffer: number[]
		, /* long */ fftFrameSize: number
		, /* long */ sign: number
	) {
		/* float */
		let wr: number;
		let wi: number;
		let arg: number;
		let temp: number;
		/* float */
		let tr: number;
		let ti: number;
		let ur: number;
		let ui: number;
		/* long */
		let i: number;
		let bitm: number;
		let j: number;
		let le: number;
		let le2: number;
		let k: number;

		for (i = 2; i < 2 * fftFrameSize - 2; i += 2) {
			for (bitm = 2, j = 0; bitm < 2 * fftFrameSize; bitm <<= 1) {
				if ((i & bitm) != 0) j++;
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
		/* long */ var max = /* (long) */Math.trunc(Math.log(fftFrameSize) / Math.log(2.0) + .5);
		for (k = 0, le = 2; k < max; k++) {
			le <<= 1;
			le2 = le >> 1;
			ur = 1.0;
			ui = 0.0;
			arg = /* (float) */Math.PI / (le2 >> 1);
			wr = /* (float) */Math.cos(arg);
			wi = /* (float) */(sign * Math.sin(arg));
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









	doPitchShift(audioBuffer: AudioBuffer, ratio: number) {
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
				let newData = this.resamplePitchShift(ratio, data.length, 1024, 10, sampleRate, data);
				//console.log(newData);
				for (let ii = 0; ii < audioBuffer.numberOfChannels; ii++) {
					audioBuffer.copyToChannel(newData, ii);
				}
			}
		}
	}
}
function createPluginCachedVoxPerf(): MZXBX_AudioPerformerPlugin {
	return new PerformerCachedVoxPlugin();
}
