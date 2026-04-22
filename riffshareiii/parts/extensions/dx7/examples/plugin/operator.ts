class DX7Operator {
	audioContext: AudioContext;
	output: GainNode;
	feedback: GainNode;
	phaseDelay: DelayNode;
	compensateNegativeDelay: ConstantSourceNode;
	carrier: OscillatorNode;
	modulation: GainNode;
	envelope: GainNode;
	constructor(cntxt: AudioContext) {
		this.audioContext = cntxt;
		this.createNodes();
		this.connectNodes();
		this.setupNodes();
	}
	setupNodes() {
		this.output.gain.value = 0;
		this.phaseDelay.delayTime.value = 0;
		this.envelope.gain.value = 0;
		this.compensateNegativeDelay.start(this.audioContext.currentTime);
	}
	connectNodes() {
		this.modulation.connect(this.phaseDelay.delayTime);
		//this.feedback.connect(this.modulation);
		this.compensateNegativeDelay.connect(this.phaseDelay.delayTime);
		this.phaseDelay.connect(this.envelope);
		this.envelope.connect(this.output);
	}
	createNodes() {
		this.output = this.audioContext.createGain();
		this.modulation = this.audioContext.createGain();
		this.feedback = this.audioContext.createGain();
		this.envelope = this.audioContext.createGain();
		this.phaseDelay = this.audioContext.createDelay();
		this.compensateNegativeDelay = this.audioContext.createConstantSource();
	}
	resetCarrier(when: number) {
		if (this.carrier) {
			this.carrier.stop();
			this.carrier.disconnect();
		}
		this.carrier = this.audioContext.createOscillator();
		this.carrier.connect(this.phaseDelay);
		this.carrier.start(when);
	}
	resetEnvelope(info: OperatorInfo, when: number, duration: number) {
		let slopeRatio = 0.09;
		this.envelope.gain.setValueAtTime(0, when);
		this.envelope.gain.linearRampToValueAtTime(info.attack.value, when);
		this.envelope.gain.setTargetAtTime(info.decay.value, when + info.attack.duration, info.decay.duration * slopeRatio);
		this.envelope.gain.setTargetAtTime(info.sustain.value, when + info.attack.duration + info.decay.duration, info.sustain.duration * slopeRatio);
		this.envelope.gain.cancelAndHoldAtTime(when + duration);
		this.envelope.gain.setTargetAtTime(info.sustain.value, when + duration, slopeRatio);
		this.envelope.gain.setTargetAtTime(0, when + duration + info.release, info.release * slopeRatio);
	}
	resetFrequency(frequency: number, feedbackRatio: number) {
		let modulationRatio = Math.E / frequency;
		this.carrier.frequency.value = frequency;
		this.modulation.gain.value = modulationRatio;
		this.compensateNegativeDelay.offset.value = 2 * modulationRatio;
		this.feedback.gain.value = feedbackRatio * modulationRatio;
	}
	startPlayFrequency(info: OperatorInfo, when: number, duration: number, frequency: number, feedbackRatio: number) {
		this.resetCarrier(when);
		this.resetEnvelope(info, when, duration);
		this.resetFrequency(frequency, feedbackRatio);
		this.output.gain.value = info.volume;
	}
}
