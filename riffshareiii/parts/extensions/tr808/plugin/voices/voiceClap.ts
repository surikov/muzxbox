
class VoiceClap implements BoomDrum {
	lastWhen: number = 0;
	wholeDuration: number;
	outGain: GainNode;
	audioContext: AudioContext;
	drumProperties: ClapEngineProps808;
	//
	NOISE_SECONDS = 2;
	NOISE_DATA: Float32Array;
	noiseBufferSource: AudioBufferSourceNode;
	biFilter: BiquadFilterNode;
	baseGain: GainNode;;
	constructor(context: AudioContext, propertyId: number) {
		this.audioContext = context;
		this.drumProperties = clapInfos[propertyId].clapprops;
		this.outGain = this.audioContext.createGain();
		this.wholeDuration =  this.drumProperties.tail + 0.02;
		//
		this.NOISE_DATA = this.fillNoiseData();
		//
		this.biFilter = this.audioContext.createBiquadFilter();
		this.biFilter.type = 'bandpass';
		this.baseGain = this.audioContext.createGain();
		
		this.biFilter.connect(this.baseGain);
		this.baseGain.connect(this.outGain);
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
		//this.clapEng(this.audioContext, when, this.outGain, pitchRatio, this.drumProperties);
		if (this.noiseBufferSource) {
			this.noiseBufferSource.disconnect();
		}
		this.noiseBufferSource = this.noiseSrc(this.audioContext);
		this.noiseBufferSource.connect(this.biFilter);
		this.biFilter.frequency.value = this.drumProperties.freq * pitchRatio;
		this.biFilter.Q.value = this.drumProperties.qualityFactor;
		//
		this.lastWhen = when;
		this.outGain.gain.setValueAtTime(volume, when);
		this.baseGain.gain.setValueAtTime(0.0001, when);
		this.drumProperties.bursts.forEach(off => {
			this.baseGain.gain.setValueAtTime(0.9, when + off);
			this.baseGain.gain.exponentialRampToValueAtTime(0.12, when + off + 0.01);
		});
		const last = this.drumProperties.bursts[this.drumProperties.bursts.length - 1];
		this.baseGain.gain.setValueAtTime(0.7, when + last + 0.011);
		this.baseGain.gain.exponentialRampToValueAtTime(0.0001, when + last + this.drumProperties.tail);
		this.noiseBufferSource.start(when);
		this.noiseBufferSource.stop(when + last + this.drumProperties.tail + 0.02);
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

