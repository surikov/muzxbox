class DX7Operator {
	audioContext: AudioContext;
	output: GainNode;
	feedbackLevel: GainNode;
	phaseDelay: DelayNode;
	compensateNegativeDelay: ConstantSourceNode;
	carrier: OscillatorNode;
	modulationLevel: GainNode;
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
		this.modulationLevel.connect(this.phaseDelay.delayTime);
		this.feedbackLevel.connect(this.modulationLevel);
		this.compensateNegativeDelay.connect(this.phaseDelay.delayTime);
		this.phaseDelay.connect(this.envelope);
		this.envelope.connect(this.output);
	}
	createNodes() {
		this.output = this.audioContext.createGain();
		this.modulationLevel = this.audioContext.createGain();
		this.feedbackLevel = this.audioContext.createGain();
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
	resetEnvelope(attack: SynthSlope, decay: SynthSlope, sustain: SynthSlope, release: number, when: number, duration: number) {

		this.envelope.gain.setValueAtTime(0, when);
		this.envelope.gain.setValueCurveAtTime(attack.values, when, attack.duration);
		this.envelope.gain.setValueCurveAtTime(decay.values, when + attack.duration, decay.duration);
		this.envelope.gain.setValueCurveAtTime(sustain.values, when + attack.duration + decay.duration, sustain.duration);
		/*
		this.envelope.gain.setValueCurveAtTime([0
			, 0.025 * attack.value
			, 0.05 * attack.value
			, 0.2 * attack.value
			, 0.35 * attack.value
			, attack.value], when, attack.duration);
		this.envelope.gain.setValueCurveAtTime([attack.value
			, attack.value - 0.65 * (attack.value - decay.value)
			, attack.value - 0.8 * (attack.value - decay.value)
			, attack.value - 0.95 * (attack.value - decay.value)
			, attack.value - 0.975 * (attack.value - decay.value)
			, decay.value], when + attack.duration, decay.duration);
		this.envelope.gain.setValueCurveAtTime([decay.value
			, decay.value - 0.65 * (decay.value - sustain.value)
			, decay.value - 0.8 * (decay.value - sustain.value)
			, decay.value - 0.95 * (decay.value - sustain.value)
			, decay.value - 0.975 * (decay.value - sustain.value)
			, sustain.value], when + attack.duration + decay.duration, sustain.duration);
			*/
		this.envelope.gain.cancelAndHoldAtTime(when + duration);
		this.envelope.gain.linearRampToValueAtTime(0, when + duration + release);

		/*

		this.envelope.gain.linearRampToValueAtTime(attack.value * 0.05, when + attack.duration / 2);
		this.envelope.gain.linearRampToValueAtTime(attack.value * 0.3, when + attack.duration * 4 / 5);
		this.envelope.gain.linearRampToValueAtTime(attack.value, when + attack.duration);

		this.envelope.gain.linearRampToValueAtTime(attack.value + (decay.value - attack.value) * 0.7, when + attack.duration + decay.duration * 1 / 5);
		this.envelope.gain.linearRampToValueAtTime(attack.value + (decay.value - attack.value) * 0.95, when + attack.duration + decay.duration / 2);
		this.envelope.gain.linearRampToValueAtTime(decay.value, when + attack.duration + decay.duration);

		this.envelope.gain.linearRampToValueAtTime(decay.value + (sustain.value - decay.value) * 0.7, when + attack.duration + decay.duration + sustain.duration * 1 / 5);
		this.envelope.gain.linearRampToValueAtTime(decay.value + (sustain.value - decay.value) * 0.95, when + attack.duration + decay.duration + sustain.duration /2 );
		this.envelope.gain.linearRampToValueAtTime(sustain.value, when + attack.duration + decay.duration + sustain.duration);

		this.envelope.gain.cancelAndHoldAtTime(when + duration);
		this.envelope.gain.setValueAtTime(sustain.value, when + duration);
		this.envelope.gain.linearRampToValueAtTime(0, when + duration + release);
		*/

		/*
		this.envelope.gain.setTargetAtTime(attack.value, when + attack.duration, attack.duration * 0.9);
		this.envelope.gain.setTargetAtTime(decay.value, when + attack.duration, decay.duration * slopeRatio);
		this.envelope.gain.setTargetAtTime(sustain.value, when + attack.duration + decay.duration, sustain.duration * slopeRatio);
		this.envelope.gain.cancelAndHoldAtTime(when + duration);
		this.envelope.gain.setTargetAtTime(sustain.value, when + duration, slopeRatio);
		this.envelope.gain.setTargetAtTime(0, when + duration + release, release * slopeRatio);
		*/

	}
	resetFrequency(frequency: number, feedbackRatio: number) {
		//let modulationRatio = Math.E / frequency;
		this.carrier.frequency.value = frequency;

		this.modulationLevel.gain.value = 2.99 / frequency;//2.8 / frequency;//modulationRatio;
		this.compensateNegativeDelay.offset.value = 3 / frequency;//2 * modulationRatio;

		//this.modulationLevel.gain.value = 7 / frequency;//2.8 / frequency;//modulationRatio;
		//this.compensateNegativeDelay.offset.value = 8/ frequency;//2 * modulationRatio;

		//this.feedbackLevel.gain.value = 0.16 * feedbackRatio;
		//this.feedbackLevel.gain.value = 1.2 * feedbackRatio;
		//this.feedbackLevel.gain.value = 1.7;
		//this.feedbackLevel.gain.value = 0.41;
		this.feedbackLevel.gain.value = 0.4*feedbackRatio;
	}
	startPlayFrequency(info: OperatorInfo, when: number, duration: number, frequency: number, feedbackRatio: number) {
		this.resetCarrier(when);
		//console.log('resetEnvelope', info);
		this.resetEnvelope(info.attack, info.decay, info.sustain, info.release, when, duration);
		this.resetFrequency(frequency, feedbackRatio);
		this.output.gain.value = info.volume;
	}
}
