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
		this.waveShift = this.audioContext.createConstantSource();

		this.modulation.connect(this.phaseDelay.delayTime);
		this.feedback.connect(this.modulation);
		this.waveShift.connect(this.phaseDelay.delayTime);
		this.phaseDelay.connect(this.envelope);
		this.envelope.connect(this.output);

		this.output.gain.value = 0;
		this.phaseDelay.delayTime.value = 0;
		this.envelope.gain.value = 0;

		this.waveShift.start(this.audioContext.currentTime);
	}
	restartCarrier(when: number) {
		if (this.carrier) {
			this.carrier.stop();
			this.carrier.disconnect();
		}
		this.carrier = this.audioContext.createOscillator();
		this.carrier.connect(this.phaseDelay);
		this.carrier.start(when);
	}
	restartEnvelope(info: OperatorInfo, when: number, duration: number) {
		this.envelope.gain.setValueAtTime(info.attack.from, when);
		this.envelope.gain.linearRampToValueAtTime(info.attack.to, when + info.attack.duration);
		this.envelope.gain.linearRampToValueAtTime(info.decay.to, when + info.attack.duration + info.decay.duration);
		this.envelope.gain.linearRampToValueAtTime(info.sustain.to, when + info.attack.duration + info.decay.duration + info.sustain.duration);
		this.envelope.gain.cancelAndHoldAtTime(when + duration);
		this.envelope.gain.setTargetAtTime(info.release.from, when + duration, 0.5);
		this.envelope.gain.linearRampToValueAtTime(info.release.to, when + duration + info.release.duration);
	}
	startPlayFrequency(info: OperatorInfo, when: number, duration: number, frequency: number, feedbackRatio: number) {
		this.restartCarrier(when);
		this.restartEnvelope(info, when, duration);
		let modulationRatio = Math.E / frequency;
		this.carrier.frequency.value = frequency;
		this.modulation.gain.value = modulationRatio;
		this.waveShift.offset.value = 2 * modulationRatio;
		this.feedback.gain.value = feedbackRatio*modulationRatio;
		this.output.gain.value = info.volume;
	}
}
