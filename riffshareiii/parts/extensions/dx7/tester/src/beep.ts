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
	feedback: GainNode;
	//volume:number;

	oscMode = 0;
	constructor(cntxt: AudioContext) {
		this.audioContext = cntxt;

		this.output = this.audioContext.createGain();
		this.feedback = this.audioContext.createGain();

		this.envelope = new EnvelopeNode(this.audioContext);
		this.envelope.envelopeGain.connect(this.output);

		//this.phaseDelay = this.audioContext.createDelay();

		//this.phaseDelay.connect(this.envelope.envelopeGain);

		//this.modulationLevel = this.audioContext.createGain();
		//this.modulationLevel.gain.value = 0;

		//this.modulationLevel.connect(this.phaseDelay.delayTime);
		this.phaseNode = new PhaseNode(this.audioContext);

		this.feedback.connect(this.phaseNode.carrier);
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
		this.feedback.gain.value = fbRatio;

		this.output.gain.value = 0.2 * cfg.volume / 99;
		/*if (this.phaseNode.modulationLevel) {
			let soundFrequency=260;
			this.phaseNode.modulationLevel.value = 4 / (2 * Math.PI * soundFrequency);
			
		}*/
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
		let carrierFrequency = detuneRatio * freqRatio * this.frequencyFromNoteNumber(note);
		//carrierFrequency=2616.2556530059865;
		if (this.oscMode > 0) {
			carrierFrequency = Math.pow(10, this.freqCoarse % 4) * (1 + (this.freqFine / 99) * 8.772);;
		} else {
			//
		}
		console.log('carrierFrequency', this.detune, this.freqCoarse + '|' + this.freqFine + '=' + freqRatio, note, carrierFrequency);
		if (this.phaseNode.carrierFrequency) {
			this.phaseNode.carrierFrequency.value = carrierFrequency;
		}
		if (this.phaseNode.modulationLevel) {
			//this.phaseNode.modulationLevel.value = 4 / 3;
			//this.phaseNode.modulationLevel.value = Math.PI * 2;
			//this.phaseNode.modulationLevel.value =  Math.PI * 3 ;
			//this.phaseNode.modulationLevel.value =  Math.PI *1.7 ;
			//this.phaseNode.modulationLevel.value = Math.PI * 2;

			//brass1
			this.phaseNode.modulationLevel.value = 38;
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

		let ff = 440 * Math.pow(2, (note - 69) / 12);
		//console.log('frequencyFromNoteNumber', note, ff);
		return ff;
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

		this.output.connect(this.feedback);
	}
}
