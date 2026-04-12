class BeepDX7 {
	audioContext: AudioContext;

	phaseNode: PhaseNode;
	//destination: GainNode;
	output: GainNode;

	envelope: EnvelopeNode;

	ready = false;
	freqCoarse: number;
	freqFine: number;
	detune: number;
	feedback: GainNode;

	//input: GainNode;
	oscMode = 0;

	

	constructor(cntxt: AudioContext) {
		this.audioContext = cntxt;

		//this.destination = this.audioContext.createGain();
		this.output = this.audioContext.createGain();

		this.feedback = this.audioContext.createGain();
		//this.input = this.audioContext.createGain();
		this.envelope = new EnvelopeNode(this.audioContext);

		this.phaseNode = new PhaseNode(this.audioContext);

		this.feedback.connect(this.phaseNode.carrier);
		//this.input.connect(this.phaseNode.carrier);
		this.phaseNode.carrier.connect(this.envelope.envelopeGain);
		//this.envelope.envelopeGain.connect(this.destination);
		this.envelope.envelopeGain.connect(this.output);

	}

	volume99scale(nn: number): number {
		return Math.pow(2, nn * 0.125) / Math.pow(2, 99 * 0.125);
	}
	setupOperator(cfg: DX7OperatorData, fb: number) {
		this.envelope.setupEnvelope(cfg.rates, cfg.levels);
		this.ready = true;
		this.oscMode = cfg.oscMode;
		this.freqFine = cfg.freqFine;
		this.freqCoarse = cfg.freqCoarse;
		if (cfg.freqCoarse == 0) {
			this.freqCoarse = 0.5;
		}
		this.detune = cfg.detune;
		let fbRatio = Math.pow(2, (fb - 7));

		this.feedback.gain.value = fbRatio * 0.6;
		//this.destination.gain.value = 1 / 6;

		this.output.gain.value = this.volume99scale(cfg.volume);//2.2;

	}
	startOperator(when: number, duration: number, note: number):number {

		var OCTAVE_1024 = 1.0006771307; //Math.exp(Math.log(2)/1024);
		let detuneRatio = Math.pow(OCTAVE_1024, this.detune);
		let freqRatio = this.freqCoarse * (1 + this.freqFine / 100);
		let carrierFrequency = detuneRatio * freqRatio * this.frequencyFromNoteNumber(note);

		if (this.oscMode > 0) {
			carrierFrequency = Math.pow(10, this.freqCoarse % 4) * (1 + (this.freqFine / 99) * 8.772);;
		} else {
			//
		}

		if (this.phaseNode.carrierFrequency) {
			this.phaseNode.carrierFrequency.value = carrierFrequency;
		}
		if (this.phaseNode.modulationLevel) {
			this.phaseNode.modulationLevel.value = 14;
		}

		return this.envelope.startEnvelope(when, duration);
	}
	frequencyFromNoteNumber(note: number) {

		let ff = 440 * Math.pow(2, (note - 69) / 12);
		return ff;
	};

	connectToOutputNode(outNode: AudioNode) {
		this.output.connect(outNode);

	}
	connectToCarrier(opDX7: BeepDX7) {

		this.output.connect(opDX7.phaseNode.carrier);

	}
	connectToSelf() {

		this.output.connect(this.feedback);
	}
}
