class DX7Operator {
	audioContext: AudioContext;
	output: GainNode;
	feedback: GainNode;
	phaseDelay: DelayNode;
	waveShift: ConstantSourceNode;
	carrier: OscillatorNode;
	modulation: GainNode;
	envelope: GainNode;
	constructor(cntxt: AudioContext) {
		this.audioContext = cntxt;

		this.output = this.audioContext.createGain();
		this.modulation = this.audioContext.createGain();
		this.feedback = this.audioContext.createGain();
		this.envelope = this.audioContext.createGain();
		this.phaseDelay = this.audioContext.createDelay();
		this.carrier = this.audioContext.createOscillator();
		this.waveShift = this.audioContext.createConstantSource();

		this.carrier.connect(this.phaseDelay);
		this.modulation.connect(this.phaseDelay.delayTime);
		this.feedback.connect(this.phaseDelay.delayTime);
		this.waveShift.connect(this.phaseDelay.delayTime);
		this.phaseDelay.connect(this.envelope);
		this.envelope.connect(this.output);

		this.output.gain.value = 0;
		this.phaseDelay.delayTime.value = 0;

		this.carrier.start(this.audioContext.currentTime);
		this.waveShift.start(this.audioContext.currentTime);
	}
	startPlayFrequency(info: OperatorInfo, targettime: number, duration: number, frequency: number, feedbackRatio: number): number {
		let when=targettime-2 * Math.PI / frequency;
		this.carrier.frequency.value = frequency;
		this.modulation.gain.value = Math.PI / frequency;//17 / (2 * Math.PI * frequency);
		this.waveShift.offset.value = 2 * Math.PI / frequency;
		this.feedback.gain.value = 0.66 * feedbackRatio * Math.PI / frequency;
		this.output.gain.value = info.volume;
		this.envelope.gain.setValueAtTime(info.attack.from, when);
		this.envelope.gain.linearRampToValueAtTime(info.attack.to, when + info.attack.duration);
		this.envelope.gain.linearRampToValueAtTime(info.decay.to, when + info.attack.duration + info.decay.duration);
		this.envelope.gain.linearRampToValueAtTime(info.sustain.to, when + info.attack.duration + info.decay.duration + info.sustain.duration);
		this.envelope.gain.cancelAndHoldAtTime(when + duration);
		this.envelope.gain.linearRampToValueAtTime(info.release.to, when + duration + info.release.duration);
		if (info.release.duration > 3 || info.release.to > 0) {
			this.envelope.gain.cancelAndHoldAtTime(when + duration + 3);
			this.envelope.gain.linearRampToValueAtTime(0, 0.003 + when + duration + 3);
			return 0.003 + when + duration + 3;
		} else {
			return 0.003 + when + duration + info.release.duration;
		}
		return 5;
	}
}
