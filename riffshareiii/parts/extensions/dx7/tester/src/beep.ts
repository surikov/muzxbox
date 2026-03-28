class BeepDX7 {
	audioContext: AudioContext;

	//modulationLevel: GainNode;
	//phaseDelay: DelayNode;
	phaseNode: PhaseNode;
	output: GainNode;
	envelope: EnvelopeNode;
	//carrier: OscillatorNode | null = null;
	ready = false;
	freqCoarse: number;
	freqFine: number;
	detune: number;
	oscMode = 0;
	constructor(cntxt: AudioContext) {
		this.audioContext = cntxt;

		this.output = this.audioContext.createGain();

		this.envelope = new EnvelopeNode(this.audioContext);
		this.envelope.envelopeGain.connect(this.output);

		//this.phaseDelay = this.audioContext.createDelay();

		//this.phaseDelay.connect(this.envelope.envelopeGain);

		//this.modulationLevel = this.audioContext.createGain();
		//this.modulationLevel.gain.value = 0;

		//this.modulationLevel.connect(this.phaseDelay.delayTime);
		this.phaseNode = new PhaseNode(this.audioContext);
	}
	setupOperator(cfg: DX7OperatorData) {
		this.envelope.setupEnvelope(cfg.rates, cfg.levels);
		this.ready = true;
		this.oscMode = cfg.oscMode;
		this.freqFine = cfg.freqFine;
		this.freqCoarse = cfg.freqCoarse;
		if (cfg.freqCoarse == 0) {
			this.freqCoarse = 0.5;
		}
		this.detune = cfg.detune;
	}
	startOperator(when: number, duration: number, note: number) {
		//console.log(this.audioContext.currentTime, 'start at', when, 'duration', duration, 'note', note);
		/*
		setOutputLevel 2 16.6658671
		voice-dx7.js:117 setOutputLevel 3 7.00713483
		*/

		/*if (this.carrier) {
			this.carrier.disconnect();
		}*/
		var OCTAVE_1024 = 1.0006771307; //Math.exp(Math.log(2)/1024);
		let detuneRatio = Math.pow(OCTAVE_1024, this.detune);
		let freqRatio = this.freqCoarse * (1 + this.freqFine / 100);
		let carierFrequency = detuneRatio * freqRatio * this.frequencyFromNoteNumber(note);

		if (this.oscMode > 0) {
			carierFrequency = Math.pow(10, this.freqCoarse % 4) * (1 + (this.freqFine / 99) * 8.772);;
		} else {
			//
		}
		console.log('carierFrequency', carierFrequency);
		if (this.phaseNode.carrierFrequency) {
			this.phaseNode.carrierFrequency.value = carierFrequency;
		}
		if (this.phaseNode.modulationLevel) {
			this.phaseNode.modulationLevel.value = 4/3;
		}
		//this.phaseDelay.delayTime.value = 0.5 / carierFrequency;
		//this.modulationLevel.gain.value = (4/3) / (2 * Math.PI * carierFrequency);

		//this.carrier = this.audioContext.createOscillator();
		//this.carrier.frequency.value = carierFrequency;
		//this.carrier.connect(this.phaseDelay);

		//this.carrier.start(when);
		//this.carrier.stop(when+duration);
		this.phaseNode.carrier.connect(this.envelope.envelopeGain);
		this.envelope.startEnvelope(when, duration);
	}
	frequencyFromNoteNumber(note: number) {
		return 440 * Math.pow(2, (note - 69) / 12);
	};

	connectToOutputNode(outNode: AudioNode) {
		this.output.connect(outNode);

	}
	connectToCarrier(opDX7: BeepDX7) {
		//this.output.connect(opDX7.modulationLevel);
		//opDX7.output.connect(this.modulationLevel);
		this.output.connect(opDX7.phaseNode.carrier);
	}
	connectToSelf() {

	}
}
