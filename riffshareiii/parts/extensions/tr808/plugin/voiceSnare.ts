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
	fillNoiseData() {
		const d = new Float32Array(96000 * this.NOISE_SECONDS);
		for (let i = 0; i < d.length; i++)
			d[i] = Math.random() * 2 - 1;
		return d;
	}
	fillFrom(dst, src) {
		const step = src.length / dst.length;
		for (let i = 0; i < dst.length; i++)
			dst[i] = src[Math.floor(i * step)];
	}
	;
	noiseBuf(ac) {
		const len = Math.floor(ac.sampleRate * this.NOISE_SECONDS);
		const buf = ac.createBuffer(1, len, ac.sampleRate);
		this.fillFrom(buf.getChannelData(0), this.NOISE_DATA);
		return buf;
	}

	noiseSrc(ac) {
		const s = ac.createBufferSource();
		s.buffer = this.noiseBuf(ac);
		s.loop = true;
		s.loopStart = Math.random() * 1.0;
		return s;
	}

	constructor(context: AudioContext, propertyId: number) {
		this.audioContext = context;
		this.drumProperties = snareInfos[propertyId].snareprops;
		this.outGain = this.audioContext.createGain();
		//
		this.wholeDuration = Math.max(this.drumProperties.toneDur + 0.03, this.drumProperties.noiceDur + 0.02);
		this.NOISE_DATA = this.fillNoiseData();
		console.log('VoiceSnare', this.drumProperties);
	}

	start(when: number, pitchRatio: number, volume: number) {
		this.snareEng(this.audioContext, when, this.outGain, pitchRatio, this.drumProperties);

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
			tone.osc.type = 'triangle';
			return tone;
		} else {
			let toneSnare: SnareTone = {
				osc: this.audioContext.createOscillator()
				, baseGain: this.audioContext.createGain()
			};
			toneSnare.baseGain.connect(this.outGain);
			this.tones.push(toneSnare);
			return toneSnare;
		}
	}
	snareEng(ctx, when, out, pitchRatio, props: SnareEngineProps808) {
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
	}
};
///

