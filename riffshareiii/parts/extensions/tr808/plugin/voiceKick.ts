class VoiceKick implements BoomDrum {
	lastWhen: number = 0;
	wholeDuration: number;
	baseOscillator: OscillatorNode;
	baseGain: GainNode;
	out: GainNode;
	clickOscillator: OscillatorNode;
	driveGain: GainNode;
	clickGain: GainNode;
	waveShaper: WaveShaperNode;
	audioContext: AudioContext;
	drumProperties: DrumEngineProps808;
	constructor(context: AudioContext, propertyId: number) {
		this.audioContext = context;
		this.baseGain = this.audioContext.createGain();
		this.out = this.audioContext.createGain();
		this.driveGain = this.audioContext.createGain();
		this.clickGain = this.audioContext.createGain();
		this.waveShaper = this.audioContext.createWaveShaper();
		if (propertyId < 4) {
			this.drumProperties = drumInfos[propertyId].drumprops;
		} else {
			this.drumProperties = kickInfos[propertyId - 4].drumprops;
		}
		this.waveShaper.curve = this.curveArray();
		this.driveGain.connect(this.waveShaper);
		this.waveShaper.connect(this.baseGain);
		this.baseGain.connect(this.out);
		this.clickGain.connect(this.out);
		this.wholeDuration = this.drumProperties.duration + 0.05;
	}

	start(when: number, pitchRatio: number) {
		if (this.clickOscillator) this.clickOscillator.disconnect();
		this.clickOscillator = this.audioContext.createOscillator();
		this.clickOscillator.type = this.drumProperties.clickWave as any;
		this.clickOscillator.connect(this.clickGain);

		if (this.baseOscillator) this.baseOscillator.disconnect();
		this.baseOscillator = this.audioContext.createOscillator();
		this.baseOscillator.type = this.drumProperties.baseWave as any;
		this.baseOscillator.connect(this.driveGain);

		this.driveGain.gain.value = this.drumProperties.driveLevel;
		this.baseOscillator.frequency.setValueAtTime(this.drumProperties.startFrequency * pitchRatio, when);
		this.baseOscillator.frequency.exponentialRampToValueAtTime(this.drumProperties.nextFrequency * pitchRatio, when + this.drumProperties.freqChangeDuration);
		this.baseGain.gain.setValueAtTime(this.drumProperties.baselevel, when);
		this.baseGain.gain.exponentialRampToValueAtTime(0.0001, when + this.drumProperties.duration);
		this.baseOscillator.start(when);
		this.baseOscillator.stop(when + this.drumProperties.duration + 0.05);
		this.clickOscillator.frequency.setValueAtTime(this.drumProperties.clickFrequency * pitchRatio, when);
		this.clickGain.gain.setValueAtTime(this.drumProperties.clickLevel, when);
		this.clickGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.015);
		this.clickOscillator.start(when);
		this.clickOscillator.stop(when + 0.03);
		this.out.gain.setValueAtTime(1, when);
		this.lastWhen = when;
/*
		let oo = this.audioContext.createOscillator();
		oo.frequency.value = 440;
		oo.connect(this.out);
		oo.start(when);
		oo.stop(when + 1);*/
	}
	cancel() {
		this.out.gain.setValueAtTime(0, 0);
	}
	duration() {
		console.log('duration', this.wholeDuration);
		return this.wholeDuration;
	}
	endTime() {
		return this.lastWhen + this.wholeDuration;
	}
	curveArray() {
		let nn = 1024;
		let cu = new Float32Array(nn);
		for (let ii = 0; ii < nn; ii++) {
			let xx = (ii / (nn - 1)) * 2 - 1;
			cu[ii] = Math.tanh(1.6 * xx) / Math.tanh(1.6);
		}
		return cu;
	}
	output() {
		return this.out;
	}
};
