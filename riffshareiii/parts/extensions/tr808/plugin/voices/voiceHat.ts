
class VoiceHat implements BoomDrum {
	lastWhen: number = 0;
	wholeDuration: number;
	outGain: GainNode;
	audioContext: AudioContext;
	drumProperties: HatEngineProps808;
	//
	NOISE_SECONDS = 2;
	NOISE_DATA: Float32Array;
	noiseBufferSource: AudioBufferSourceNode;
	biFilter: BiquadFilterNode;
	baseGain: GainNode;
	freqs = [263, 400, 421, 474, 587, 845];
	hipaFilter: BiquadFilterNode;
	oscs: OscillatorNode[] = [];
	washFilter: BiquadFilterNode;
	noiseGain: GainNode;
	noiseSource: AudioBufferSourceNode;
	constructor(context: AudioContext, propertyId: number) {
		//console.log('VoiceHat propertyId', propertyId);
		this.audioContext = context;
		//this.drumProperties = hatInfos[propertyId].hatprops;

		if (propertyId < 4) {
			this.drumProperties = hatInfos[propertyId].hatprops;
		} else {
			this.drumProperties = ohatInfos[propertyId - 4].hatprops;
		}
		this.outGain = this.audioContext.createGain();
		this.wholeDuration = this.drumProperties.decay + 0.05;
		//
		this.NOISE_DATA = this.fillNoiseData();
		//
		this.biFilter = this.audioContext.createBiquadFilter();
		this.biFilter.type = 'bandpass';
		this.biFilter.Q.value = 0.8;
		this.hipaFilter = this.audioContext.createBiquadFilter();
		this.hipaFilter.type = 'highpass';
		this.baseGain = this.audioContext.createGain();
		this.biFilter.connect(this.hipaFilter);
		this.hipaFilter.connect(this.baseGain);
		this.baseGain.connect(this.outGain);
		this.washFilter = this.audioContext.createBiquadFilter();
		this.washFilter.type = 'highpass';
		this.noiseGain = this.audioContext.createGain();

		this.washFilter.connect(this.noiseGain);
		this.noiseGain.connect(this.outGain);
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

	start(when: number, pitchRatio: number, volume: number) {
		//console.log('start', when, pitchRatio, volume, this.drumProperties);
		//this.hatEng(this.audioContext, when, this.outGain, pitchRatio, this.drumProperties);

		this.biFilter.frequency.value = this.drumProperties.bandFiFreq * pitchRatio;
		this.hipaFilter.frequency.value = this.drumProperties.highFiFreq * pitchRatio;
		this.baseGain.gain.setValueAtTime(this.drumProperties.level, when);
		this.baseGain.gain.exponentialRampToValueAtTime(0.0001, when + this.drumProperties.decay);
		this.oscs.forEach((singleOscillator) => {
			singleOscillator.disconnect();
		});
		//this.oscs = [];
		this.freqs.forEach(freqVal => {
			let subOscillator: OscillatorNode = this.audioContext.createOscillator();
			subOscillator.type = 'square';
			subOscillator.frequency.value = freqVal * this.drumProperties.freqScale * pitchRatio;
			subOscillator.connect(this.biFilter);
			//subOscillator.connect(this.outGain);
			subOscillator.start(when);
			subOscillator.stop(when + this.drumProperties.decay + 0.05);
			this.oscs.push(subOscillator);
			//console.log(subOscillator);
		});
		if (this.drumProperties.washVolume) {
			if (this.noiseSource) {
				this.noiseSource.disconnect();
			}
			this.noiseSource = this.noiseSrc(this.audioContext);
			this.washFilter.frequency.value = 5000 * pitchRatio;
			this.noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + this.drumProperties.decay);
			this.noiseSource.connect(this.washFilter);
			this.noiseSource.start(when);
			this.noiseSource.stop(when + this.drumProperties.decay + 0.02);
		}
		this.outGain.gain.setValueAtTime(volume, when);
		this.lastWhen=when;
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


};
///

