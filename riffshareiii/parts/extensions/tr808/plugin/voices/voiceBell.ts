
class VoiceBell implements BoomDrum {
	lastWhen: number = 0;
	wholeDuration: number;
	outGain: GainNode;
	audioContext: AudioContext;
	drumProperties: CowbellEngineProps808;
	//
	NOISE_SECONDS = 2;
	NOISE_DATA: Float32Array;
	noiseBufferSource: AudioBufferSourceNode;
	//biFilter: BiquadFilterNode;
	passFilter: BiquadFilterNode;
	//volumeGain: GainNode;
	//beep:OscillatorNode;

	subfreqs: {
		beep: OscillatorNode
		, bifilter: BiquadFilterNode
		, vogain: GainNode
	}[] = [];

	noiseGain: GainNode;
	noiseSource: AudioBufferSourceNode;
	bellEng(ctx, when, out, pitchRatio, props: CowbellEngineProps808) {
		props.freqs.forEach(bellFreq => {
			const beep = ctx.createOscillator();
			const biFilter = ctx.createBiquadFilter();
			const volumeGain = ctx.createGain();
			beep.type = 'square';
			beep.frequency.value = bellFreq * pitchRatio;
			biFilter.type = 'bandpass';
			biFilter.frequency.value = props.bpFilterFreq * pitchRatio;
			biFilter.Q.value = props.qualityFilter;
			volumeGain.gain.setValueAtTime(props.bellLevel, when);
			volumeGain.gain.exponentialRampToValueAtTime(0.12, when + 0.03);
			volumeGain.gain.exponentialRampToValueAtTime(0.0001, when + props.duration);
			beep.connect(biFilter);
			biFilter.connect(volumeGain);
			volumeGain.connect(out);
			beep.start(when);
			beep.stop(when + props.duration + 0.05);
		});
		if (props.strikeVolume) {
			const noiseSource = this.noiseSrc(ctx);
			const passFilter = ctx.createBiquadFilter();
			passFilter.type = 'bandpass';
			passFilter.frequency.value = 2500 * pitchRatio;
			const noiseGain = ctx.createGain();
			noiseGain.gain.setValueAtTime(props.strikeVolume, when);
			noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.03);
			noiseSource.connect(passFilter);
			passFilter.connect(noiseGain);
			noiseGain.connect(out);
			noiseSource.start(when);
			noiseSource.stop(when + 0.05);
		}
	}
	constructor(context: AudioContext, propertyId: number) {
		this.audioContext = context;
		//this.drumProperties = hatInfos[propertyId].hatprops;

		this.drumProperties = cowbellInfos[propertyId].cowbellprops;
		this.outGain = this.audioContext.createGain();
		this.wholeDuration = this.drumProperties.duration + 0.05;
		//
		this.NOISE_DATA = this.fillNoiseData();
		//

		this.passFilter = this.audioContext.createBiquadFilter();
		this.passFilter.type = 'bandpass';
		this.noiseGain = this.audioContext.createGain();

		this.passFilter.connect(this.noiseGain);
		this.noiseGain.connect(this.outGain);
	}

	start(when: number, pitchRatio: number, volume: number) {
		//console.log('start', when, pitchRatio, volume, this.drumProperties);
		//this.bellEng(this.audioContext, when, this.outGain, pitchRatio, this.drumProperties);
		this.subfreqs.forEach((single) => {
			single.beep.disconnect();
		});
		for (let ii = 0; ii < this.drumProperties.freqs.length; ii++) {
			let bellFreq = this.drumProperties.freqs[ii];
			if (ii < this.subfreqs.length) {
				this.subfreqs[ii].beep.disconnect();
				this.subfreqs[ii].beep = this.audioContext.createOscillator();
				this.subfreqs[ii].beep.connect(this.subfreqs[ii].bifilter);
			} else {
				let single = {
					beep: this.audioContext.createOscillator()
					, bifilter: this.audioContext.createBiquadFilter()
					, vogain: this.audioContext.createGain()
				};
				single.beep.type = 'square';
				single.bifilter.type = 'bandpass';
				single.beep.connect(single.bifilter);
				single.bifilter.connect(single.vogain);
				single.vogain.connect(this.outGain);
				this.subfreqs.push(single);
			}
			let cur = this.subfreqs[ii];
			cur.beep.frequency.value = bellFreq * pitchRatio;
			cur.bifilter.frequency.value = this.drumProperties.bpFilterFreq * pitchRatio;
			cur.bifilter.Q.value = this.drumProperties.qualityFilter;
			cur.vogain.gain.setValueAtTime(this.drumProperties.bellLevel, when);
			cur.vogain.gain.exponentialRampToValueAtTime(0.12, when + 0.03);
			cur.vogain.gain.exponentialRampToValueAtTime(0.0001, when + this.drumProperties.duration);
			cur.beep.start(when);
			cur.beep.stop(when + this.drumProperties.duration + 0.05);


			/*
						const beep = this.audioContext.createOscillator();
						const biFilter = this.audioContext.createBiquadFilter();
						const volumeGain = this.audioContext.createGain();
						beep.type = 'square';
						beep.frequency.value = bellFreq * pitchRatio;
						biFilter.type = 'bandpass';
						biFilter.frequency.value = this.drumProperties.bpFilterFreq * pitchRatio;
						biFilter.Q.value = this.drumProperties.qualityFilter;
						volumeGain.gain.setValueAtTime(this.drumProperties.bellLevel, when);
						volumeGain.gain.exponentialRampToValueAtTime(0.12, when + 0.03);
						volumeGain.gain.exponentialRampToValueAtTime(0.0001, when + this.drumProperties.duration);
						beep.connect(biFilter);
						biFilter.connect(volumeGain);
						volumeGain.connect(this.outGain);
						beep.start(when);
						beep.stop(when + this.drumProperties.duration + 0.05);
						*/
		}
		this.noiseGain.gain.setValueAtTime(this.drumProperties.strikeVolume, when);
		this.noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.03);
		this.passFilter.frequency.value = 2500 * pitchRatio;

		if (this.noiseSource) {
			this.noiseSource.disconnect();
		}
		this.noiseSource = this.noiseSrc(this.audioContext);
		this.noiseSource.connect(this.passFilter);

		this.noiseSource.start(when);
		this.noiseSource.stop(when + 0.05);


		this.outGain.gain.setValueAtTime(volume, when);
		this.lastWhen = when;
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
	fillNoiseData() {
		const dd: Float32Array = new Float32Array(96000 * this.NOISE_SECONDS);
		for (let ii = 0; ii < dd.length; ii++)
			dd[ii] = Math.random() * 2 - 1;
		return dd;
	}
	fillFrom(dst: Float32Array, src: Float32Array) {
		//console.log('dst',dst);
		//console.log('src', src);
		const step = src.length / dst.length;
		for (let ii = 0; ii < dst.length; ii++) {
			dst[ii] = src[Math.floor(ii * step)];
		}
	}
	;
	noiseBuf(ac: AudioContext) {
		const len = Math.floor(ac.sampleRate * this.NOISE_SECONDS);
		const buf: AudioBuffer = ac.createBuffer(1, len, ac.sampleRate);
		this.fillFrom(buf.getChannelData(0), this.NOISE_DATA);
		return buf;
	}

	noiseSrc(ac: AudioContext): AudioBufferSourceNode {
		const ss: AudioBufferSourceNode = ac.createBufferSource();
		ss.buffer = this.noiseBuf(ac);
		ss.loop = true;
		ss.loopStart = Math.random() * 1.0;
		return ss;
	}


};
///

