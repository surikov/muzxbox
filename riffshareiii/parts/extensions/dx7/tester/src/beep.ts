class BeepDX7 {
	audioContext: AudioContext;

	//modulationLevel: GainNode;
	//phaseDelay: DelayNode;
	phaseNode: PhaseNode;
	destination: GainNode;
	modulate: GainNode;
	//modulators: GainNode[] = [];
	envelope: EnvelopeNode;
	//carrier: OscillatorNode | null = null;
	ready = false;
	freqCoarse: number;
	freqFine: number;
	detune: number;
	feedback: GainNode;
	//volume:number;
	input: GainNode;
	oscMode = 0;
	constructor(cntxt: AudioContext) {
		this.audioContext = cntxt;

		this.destination = this.audioContext.createGain();
		this.modulate = this.audioContext.createGain();
		//this.modulators = [];//this.audioContext.createGain();
		this.feedback = this.audioContext.createGain();
		this.input = this.audioContext.createGain();
		this.envelope = new EnvelopeNode(this.audioContext);


		//this.phaseDelay = this.audioContext.createDelay();

		//this.phaseDelay.connect(this.envelope.envelopeGain);

		//this.modulationLevel = this.audioContext.createGain();
		//this.modulationLevel.gain.value = 0;

		//this.modulationLevel.connect(this.phaseDelay.delayTime);
		this.phaseNode = new PhaseNode(this.audioContext);

		this.feedback.connect(this.phaseNode.carrier);
		this.input.connect(this.phaseNode.carrier);
		this.phaseNode.carrier.connect(this.envelope.envelopeGain);
		this.envelope.envelopeGain.connect(this.destination);
		this.envelope.envelopeGain.connect(this.modulate);

		//this.phaseNode.carrier.connect(this.destination);
		//this.phaseNode.carrier.connect(this.modulate);
	}
	/*scale99to1(nn: number): number {
		//let speed = Math.pow(2, nn * 0.17 - 11);
		let vv = Math.pow(2, nn * 0.16 - 11) / Math.pow(2, 99 * 0.16 - 11);
		return vv;
	}*/
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
		//console.log(fb, fbRatio);
		//this.feedback.gain.value = fbRatio;
		//this.feedback.gain.value = 0.25;
		//this.feedback.gain.value = fbRatio / 3.5;
		//this.feedback.gain.value = fbRatio ;
		this.feedback.gain.value = fbRatio *0.6;
		this.destination.gain.value = 1 / 6;
		//this.output.gain.value = 0.2 * cfg.volume / 99;
		//this.output.gain.value = this.scale99(cfg.volume) / 50;
		this.modulate.gain.value = this.volume99scale(cfg.volume);//2.2;
		//this.input.gain.value = 0.1;
		//this.input.gain.value = 0.99;
		//console.log('setupOperator', cfg.volume, '->', this.modulate.gain.value, cfg.volume);
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
		//console.log('carrierFrequency', this.detune, this.freqCoarse + '|' + this.freqFine + '=' + freqRatio, note, carrierFrequency);
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
			//this.phaseNode.modulationLevel.value = 12;//19;//38;
			this.phaseNode.modulationLevel.value = 14;
		}
		//this.phaseDelay.delayTime.value = 0.5 / carierFrequency;
		//this.modulationLevel.gain.value = (4/3) / (2 * Math.PI * carierFrequency);

		//this.carrier = this.audioContext.createOscillator();
		//this.carrier.frequency.value = carierFrequency;
		//this.carrier.connect(this.phaseDelay);

		//this.carrier.start(when);
		//this.carrier.stop(when+duration);

		this.envelope.startEnvelope(when, duration);
	}
	frequencyFromNoteNumber(note: number) {

		let ff = 440 * Math.pow(2, (note - 69) / 12);
		//console.log('frequencyFromNoteNumber', note, ff);
		return ff;
	};

	connectToOutputNode(outNode: AudioNode) {
		this.destination.connect(outNode);

	}
	connectToCarrier(opDX7: BeepDX7) {
		//this.output.connect(opDX7.modulationLevel);
		//opDX7.output.connect(this.modulationLevel);
		//this.output.connect(opDX7.phaseNode.carrier);
		this.modulate.connect(opDX7.input);
		//console.log('connectToCarrier',this.output.gain.value);
		/*
		let modulation: GainNode = this.audioContext.createGain();
		modulation.gain.value=0.009;
		this.envelope.envelopeGain.connect(modulation);
		modulation.connect(opDX7.phaseNode.carrier);
		this.modulators.push(modulation);
		*/
	}
	connectToSelf() {

		this.modulate.connect(this.feedback);
	}
}
