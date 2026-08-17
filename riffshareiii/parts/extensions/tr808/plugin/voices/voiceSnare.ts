type SnareTone = {
	osc: OscillatorNode;
	baseGain: GainNode;
};
class VoiceSnare implements BoomDrum {
	lastWhen: number = 0;
	wholeDuration: number;
	outGain: GainNode;
	audioContext: AudioContext;
	drumProperties: SnareEngineProps808;
	//
	tones: SnareTone[] = [];
	NOISE_SECONDS = 2;
	NOISE_DATA: Float32Array;
	noiseSourceBuffer: AudioBufferSourceNode;
	bqFilter: BiquadFilterNode;
	noiseGain: GainNode;
	fillNoiseData() {
		const d = new Float32Array(96000 * this.NOISE_SECONDS);
		for (let i = 0; i < d.length; i++)
			d[i] = Math.random() * 2 - 1;
		return d;
	}
	fillFrom(dst: Float32Array, src: Float32Array) {
		//console.log('dst',dst);
		//console.log('src', src);
		const step = src.length / dst.length;
		for (let i = 0; i < dst.length; i++)
			dst[i] = src[Math.floor(i * step)];
	}
	;
	noiseBuf(ac: AudioContext) {
		const len = Math.floor(ac.sampleRate * this.NOISE_SECONDS);
		const buf: AudioBuffer = ac.createBuffer(1, len, ac.sampleRate);
		this.fillFrom(buf.getChannelData(0), this.NOISE_DATA);
		return buf;
	}

	noiseSrc(ac: AudioContext) {
		const ss: AudioBufferSourceNode = ac.createBufferSource();
		ss.buffer = this.noiseBuf(ac);
		ss.loop = true;
		ss.loopStart = Math.random() * 1.0;
		return ss;
	}

	constructor(context: AudioContext, propertyId: number) {
		this.audioContext = context;
		this.drumProperties = snareInfos[propertyId].snareprops;
		this.outGain = this.audioContext.createGain();
		//
		this.NOISE_DATA = this.fillNoiseData();
		this.noiseGain = this.audioContext.createGain();

		this.wholeDuration = Math.max(this.drumProperties.toneDur + 0.03, this.drumProperties.noiceDur + 0.02);

		this.bqFilter = this.audioContext.createBiquadFilter();
		this.bqFilter.type = 'highpass';

		this.bqFilter.connect(this.noiseGain);
		this.noiseGain.connect(this.outGain);

		console.log(this.drumProperties);

	}

	start(when: number, pitchRatio: number, volume: number) {
		//this.snareEng(this.audioContext, when, this.outGain, pitchRatio, this.drumProperties);
		for (let ii = 0; ii < this.drumProperties.tones.length; ii++) {
			let pair = this.drumProperties.tones[ii];
			let tone = this.takeTone(ii);
			tone.osc.frequency.setValueAtTime(pair.frequency * pitchRatio, when);
			tone.baseGain.gain.setValueAtTime(pair.volume, when);
			tone.baseGain.gain.exponentialRampToValueAtTime(0.0001, when + this.drumProperties.toneDur);
			tone.osc.start(when);
			tone.osc.stop(when + this.drumProperties.toneDur + 0.03);
		}
		if (this.drumProperties.noiseLevel) {
			this.bqFilter.frequency.value = this.drumProperties.noiseFreq * pitchRatio;
			this.noiseGain.gain.setValueAtTime(this.drumProperties.noiseLevel, when);
			this.noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + this.drumProperties.noiceDur);
			if (this.noiseSourceBuffer) {
				this.noiseSourceBuffer.disconnect();
			}
			this.noiseSourceBuffer = this.noiseSrc(this.audioContext);
			this.noiseSourceBuffer.connect(this.bqFilter);
			this.noiseSourceBuffer.start(when);
			this.noiseSourceBuffer.stop(when + this.drumProperties.noiceDur + 0.02);
		}
		//
		this.lastWhen = when;
		this.outGain.gain.setValueAtTime(volume, when);
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
	takeTone(from: number): SnareTone {
		if (from < this.tones.length) {
			let tone = this.tones[from];
			tone.osc.disconnect();
			tone.osc = this.audioContext.createOscillator();
			tone.osc.connect(tone.baseGain);
			//tone.osc.type = 'triangle';
			return tone;
		} else {
			let toneSnare: SnareTone = {
				osc: this.audioContext.createOscillator()
				, baseGain: this.audioContext.createGain()
			};
			toneSnare.osc.type = 'triangle';
			toneSnare.osc.connect(toneSnare.baseGain);
			toneSnare.baseGain.connect(this.outGain);
			this.tones.push(toneSnare);
			return toneSnare;
		}
	}
	/*snareEng(ctx, when, out, pitchRatio, props: SnareEngineProps808) {
		for (let ii = 0; ii < props.tones.length; ii++) {
			let pair = props.tones[ii];
			let tone = this.takeTone(ii);
			tone.osc.frequency.setValueAtTime(pair.frequency * pitchRatio, when);
			tone.baseGain.gain.setValueAtTime(pair.volume, when);
			tone.baseGain.gain.exponentialRampToValueAtTime(0.0001, when + props.toneDur);
			tone.osc.start(when);
			tone.osc.stop(when + props.toneDur + 0.03);
		}
		if (props.noiseLevel) {
			const noiseSourceBuffer = this.noiseSrc(ctx);
			const bqFilter = ctx.createBiquadFilter();
			bqFilter.type = 'highpass';
			bqFilter.frequency.value = props.noiseFreq * pitchRatio;
			const noiseGain = ctx.createGain();
			noiseGain.gain.setValueAtTime(props.noiseLevel, when);
			noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + props.noiceDur);
			noiseSourceBuffer.connect(bqFilter);
			bqFilter.connect(noiseGain);
			noiseGain.connect(out);
			noiseSourceBuffer.start(when);
			noiseSourceBuffer.stop(when + props.noiceDur + 0.02);
		}
	}*/
};
///

