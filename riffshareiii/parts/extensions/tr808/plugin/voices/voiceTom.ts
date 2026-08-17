
class VoiceTom implements BoomDrum {
	lastWhen: number = 0;
	wholeDuration: number;
	outGain: GainNode;
	audioContext: AudioContext;
	drumProperties: TomEngineProps808;
	//
	NOISE_SECONDS = 2;
	NOISE_DATA: Float32Array;
	//noiseBufferSource: AudioBufferSourceNode;
	beep: OscillatorNode;
	baseGain: GainNode;
	noiseSource: AudioBufferSourceNode;
	loFilter: BiquadFilterNode;
	noiseGain: GainNode;
	constructor(context: AudioContext, propertyId: number) {
		this.audioContext = context;
		this.drumProperties = tomInfos[propertyId].tomprops;
		this.outGain = this.audioContext.createGain();
		this.wholeDuration = this.drumProperties.duration + 0.05;
		//
		this.NOISE_DATA = this.fillNoiseData();
		//
		this.noiseGain = this.audioContext.createGain();
		this.loFilter = this.audioContext.createBiquadFilter();
		this.baseGain = this.audioContext.createGain();
		//this.beep=this.audioContext.createOscillator();
		this.loFilter.type = 'lowpass';
		//noiseSource.connect(loFilter);
		this.loFilter.connect(this.noiseGain);
		this.noiseGain.connect(this.outGain);
		//this.beep.connect(this.baseGain);
		this.baseGain.connect(this.outGain);
	}
	fillNoiseData() {
		const dd: Float32Array = new Float32Array(96000 * this.NOISE_SECONDS);
		for (let ii = 0; ii < dd.length; ii++) {
			dd[ii] = Math.random() * 2 - 1;
		}
		return dd;
	}
	fillFrom(dst: Float32Array, src: Float32Array) {
		//console.log('dst',dst);
		//console.log('src', src);
		const step = src.length / dst.length;
		for (let ii = 0; ii < dst.length; ii++)
			dst[ii] = src[Math.floor(ii * step)];
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
		if (this.beep) {
			this.beep.disconnect();
		}
		this.beep=this.audioContext.createOscillator();
		this.beep.connect(this.baseGain);
		//console.log(this.drumProperties);
		this.beep.type = this.drumProperties.tomwave as any;
		this.beep.frequency.setValueAtTime(this.drumProperties.startFreq * pitchRatio, when);
		this.beep.frequency.exponentialRampToValueAtTime(this.drumProperties.nextFreq * pitchRatio, when + this.drumProperties.drop);
		this.baseGain.gain.setValueAtTime(0.85, when);
		this.baseGain.gain.exponentialRampToValueAtTime(0.0001, when + this.drumProperties.duration);
		this.beep.start(when);
		this.beep.stop(when + this.drumProperties.duration + 0.05);
		if (this.drumProperties.skinLevel) {
			this.loFilter.frequency.value = (this.drumProperties.skinFreq) * pitchRatio;
			this.noiseGain.gain.setValueAtTime(this.drumProperties.skinLevel, when);
			this.noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + this.drumProperties.skinDur);
			if (this.noiseSource) {
				this.noiseSource.disconnect();
			}
			this.noiseSource = this.noiseSrc(this.audioContext);
			this.noiseSource.connect(this.loFilter);
			this.noiseSource.start(when);
			this.noiseSource.stop(when + this.drumProperties.skinDur + 0.02);
		}

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


};
///

