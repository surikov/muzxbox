function newDX7FMSynth1(): MZXBX_AudioPerformerPlugin {
	console.log('newDX7FMSynth1');
	let matrixConnectionAlgorithmsDX7: ConnectionSchemeDX7[] = [
		{ outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], []], feedbackMatrix: [[], [1], [], [], [], []] }
		, { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], []], feedbackMatrix: [[], [], [], [], [], [3]] }
		, { outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [4]] }
		, { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], []], feedbackMatrix: [[], [], [], [3], [], []] }
		, { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], []], feedbackMatrix: [[], [1], [], [], [], []] }
		, { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [2], [], [], []] }
		, { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4, 5], [], [], []], feedbackMatrix: [[], [1], [], [], [], []] }
		, { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4, 5], [], [], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4, 5], [], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4, 5], [], []], feedbackMatrix: [[], [1], [], [], [], []] }
		, { outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], []], feedbackMatrix: [[], [1], [], [], [], []] }
		, { outputMix: [0], modulationMatrix: [[1, 2, 3], [], [2], [], [5], []], feedbackMatrix: [[], [], [], [4], [], []] }
		, { outputMix: [0, 3, 4], modulationMatrix: [[1], [2], [], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 1, 3], modulationMatrix: [[2], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [2], [], [], []] }
		, { outputMix: [0, 1, 3, 4], modulationMatrix: [[2], [2], [], [5], [5], []], feedbackMatrix: [[], [], [2], [], [], []] }
		, { outputMix: [0, 2, 3, 4], modulationMatrix: [[1], [], [5], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 1, 3, 4], modulationMatrix: [[], [2], [], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [5], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [2], [], [], []] }
		, { outputMix: [0, 2, 5], modulationMatrix: [[1], [], [3], [4], [], []], feedbackMatrix: [[], [], [], [], [4], []] }
		, { outputMix: [0, 1, 2, 4], modulationMatrix: [[], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 1, 2, 5], modulationMatrix: [[], [], [3], [4], [], []], feedbackMatrix: [[], [], [], [], [4], []] }
		, { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }
		, { outputMix: [0, 1, 2, 3, 4, 5], modulationMatrix: [[], [], [], [], [], []], feedbackMatrix: [[], [], [], [], [], [5]] }
	];
	class MiniumFMOperator {
		audioContext: AudioContext;
		operatorOutput: GainNode;
		feedbackLevel: GainNode;
		phaseDelay: DelayNode;
		compensateNegativeDelay: ConstantSourceNode;
		carrier: OscillatorNode;
		modulationLevel: GainNode;
		envelope: GainNode;
		connectFlag = false;
		constructor(cntxt: AudioContext) {
			this.audioContext = cntxt;
			this.operatorOutput = this.audioContext.createGain();
			this.modulationLevel = this.audioContext.createGain();
			this.feedbackLevel = this.audioContext.createGain();
			this.envelope = this.audioContext.createGain();
			this.phaseDelay = this.audioContext.createDelay();
			this.compensateNegativeDelay = this.audioContext.createConstantSource();
			this.carrier = this.audioContext.createOscillator();

			this.connectNodes();

			this.operatorOutput.gain.value = 0;
			this.phaseDelay.delayTime.value = 0;
			this.envelope.gain.value = 0;
			this.compensateNegativeDelay.start(this.audioContext.currentTime);
			this.carrier.start(this.audioContext.currentTime);
		}
		connectNodes() {
			if (!this.connectFlag) {
				this.envelope.connect(this.operatorOutput);
				this.phaseDelay.connect(this.envelope);
				this.modulationLevel.connect(this.phaseDelay.delayTime);
				this.compensateNegativeDelay.connect(this.phaseDelay.delayTime);
				this.feedbackLevel.connect(this.phaseDelay.delayTime);
				this.carrier.connect(this.phaseDelay);
				this.connectFlag = true;
			} else {
				//console.log('wrong connectNodes');
			}

		}
		/*disconnectNodes() {
			if (this.connectFlag) {
				this.envelope.disconnect(this.operatorOutput);
				//this.phaseDelay.disconnect(this.envelope);
				//this.modulationLevel.disconnect(this.phaseDelay.delayTime);
				//this.compensateNegativeDelay.disconnect(this.phaseDelay.delayTime);
				//this.feedbackLevel.disconnect(this.phaseDelay.delayTime);
				//this.carrier.disconnect(this.phaseDelay);
				this.connectFlag = false;
			} else {
				console.log('wrong disconnectNodes');
			}
		}*/
		addFrequencySlide(when: number, frequency: number, modulationRatio: number, feedbackRatio: number) {
			this.carrier.frequency.linearRampToValueAtTime(frequency, when);
			this.modulationLevel.gain.linearRampToValueAtTime(modulationRatio / frequency, when);
			this.compensateNegativeDelay.offset.linearRampToValueAtTime(1.1 * modulationRatio / frequency, when);
			this.feedbackLevel.gain.linearRampToValueAtTime(feedbackRatio / frequency, when);
		}
		startPlayFrequency(info: OperatorInfo, when: number, duration: number, frequency: number, modulationRatio: number, feedbackRatio: number) {//}, slides: MZXBX_SlideItem[]) {
			//this.connectNodes();
			this.envelope.gain.cancelScheduledValues(this.audioContext.currentTime);
			this.envelope.gain.setValueAtTime(this.audioContext.currentTime, when);
			this.envelope.gain.setValueCurveAtTime(info.envelope.attack.values, when, info.envelope.attack.duration);






			this.envelope.gain.setValueCurveAtTime(info.envelope.decay.values, when + info.envelope.attack.duration, info.envelope.decay.duration);
			this.envelope.gain.setValueCurveAtTime(info.envelope.sustain.values, when + info.envelope.attack.duration + info.envelope.decay.duration, info.envelope.sustain.duration);
			this.envelope.gain.cancelAndHoldAtTime(when + duration);
			this.envelope.gain.linearRampToValueAtTime(0, when + duration + info.envelope.release);

			this.carrier.frequency.value = frequency;
			this.modulationLevel.gain.linearRampToValueAtTime(modulationRatio / frequency, when);
			this.compensateNegativeDelay.offset.linearRampToValueAtTime(1.1 * modulationRatio / frequency, when);
			this.feedbackLevel.gain.linearRampToValueAtTime(feedbackRatio / frequency, when);
			this.operatorOutput.gain.value = info.volume;
		}
		cancelOperator() {
			this.envelope.gain.cancelScheduledValues(this.audioContext.currentTime);
			this.modulationLevel.gain.cancelScheduledValues(this.audioContext.currentTime);
			this.carrier.frequency.cancelScheduledValues(this.audioContext.currentTime);
			this.compensateNegativeDelay.offset.cancelScheduledValues(this.audioContext.currentTime);
			this.feedbackLevel.gain.cancelScheduledValues(this.audioContext.currentTime);
			//this.disconnectNodes();
		}
	}
	class MinumFMVoice {
		operators: MiniumFMOperator[];
		locktime: number = 0;
		audioContext: AudioContext;
		output: GainNode;
		mixID: number;
		mixOutput: AudioNode;
		constructor(mixID: number, audioContext: AudioContext, to: AudioNode) {
			this.mixID = mixID;
			this.mixOutput = to;
			this.audioContext = audioContext;
			this.output = this.audioContext.createGain();
			//this.output.connect(to);
			this.operators = [
				new MiniumFMOperator(this.audioContext)
				, new MiniumFMOperator(this.audioContext)
				, new MiniumFMOperator(this.audioContext)
				, new MiniumFMOperator(this.audioContext)
				, new MiniumFMOperator(this.audioContext)
				, new MiniumFMOperator(this.audioContext)
			];
			this.connectOperators();
		}
		/*disonnectOperators() {
			for (let ii = 0; ii < 6; ii++) {
				this.operators[ii].operatorOutput.disconnect();
				//this.operators[ii].disconnectNodes();
			}
			this.mixID = 0;
			this.output.disconnect();
		}*/
		connectOperators() {

			let mix = matrixConnectionAlgorithmsDX7[this.mixID - 1];
			//console.log('connectOperators mix', this.mixID, mix);
			for (let cid = 0; cid < mix.modulationMatrix.length; cid++) {
				let carrier = this.operators[cid];
				let modulatorIds = mix.modulationMatrix[cid];
				for (let mm = 0; mm < modulatorIds.length; mm++) {
					let mid = modulatorIds[mm];
					let modulator = this.operators[mid];
					//console.log('modulator', mid, 'to', cid);
					modulator.operatorOutput.connect(carrier.modulationLevel);
				}
			}
			for (let cid = 0; cid < mix.feedbackMatrix.length; cid++) {
				let carrier = this.operators[cid];
				let fbIds = mix.feedbackMatrix[cid];
				for (let ff = 0; ff < fbIds.length; ff++) {
					let fid = fbIds[ff];
					let fbmodulator = this.operators[fid];
					//console.log('feedback', cid, 'from', fid);
					fbmodulator.operatorOutput.connect(carrier.feedbackLevel);
				}
			}
			for (let ii = 0; ii < mix.outputMix.length; ii++) {
				let outIdx = mix.outputMix[ii];
				//======================
				//console.log('output', outIdx);
				this.operators[outIdx].operatorOutput.connect(this.output);
			}
			this.output.connect(this.mixOutput);
		}
		startPlayNote(volume: number, preset: SynthPreset, when: number, note: number, slides: MZXBX_SlideItem[]) {
			this.output.gain.value = 0.33 * volume / 100;
			let duration = slides.reduce((sm, cur) => sm + cur.duration, 0);
			for (let ii = 0; ii < 6; ii++) {
				let info = preset.operators[ii];
				if (info.enabled) {
					let frequency = info.constantFrequency;
					if (!(frequency)) {
						let noteFreq = 440 * Math.pow(2, (note - 69) / 12);
						let detuneRatio = Math.pow(Math.exp(Math.log(2) / 1024), info.detune);
						frequency = noteFreq * detuneRatio * info.frequencyRatio;
						if (preset.transpose > 0) frequency = frequency * 2;
						if (preset.transpose < 0) frequency = frequency * 0.5;
					}
					this.operators[ii].startPlayFrequency(info, when, duration, frequency, preset.modulationRatio, preset.feedbackRatio);//, slides);
					let otime = when + duration + info.envelope.release + 0.01;
					if (this.locktime < otime) {
						this.locktime = otime;
					}
					if (info.frequencyRatio && (slides.length > 1 || slides[0].delta != 0)) {
						let next = when;
						for (let ff = 0; ff < slides.length; ff++) {
							next = next + slides[ff].duration;
							let noteFreq = 440 * Math.pow(2, (note + slides[ff].delta - 69) / 12);
							let detuneRatio = Math.pow(Math.exp(Math.log(2) / 1024), info.detune);
							let slideFreq = noteFreq * detuneRatio * info.frequencyRatio;
							this.operators[ii].addFrequencySlide(next, slideFreq, preset.modulationRatio, preset.feedbackRatio);
						}
					}
				}
			}
		}
		cancelVoice() {
			for (let ii = 0; ii < this.operators.length; ii++) {
				this.operators[ii].cancelOperator();
			}
			this.output.gain.value = 0;
			this.locktime = 0;
		}
	}
	class MiniumFMSynth {
		cache: MinumFMVoice[] = [];
		audioContext: AudioContext;
		mixOutput: GainNode;
		constructor() {
		}
		init(audioContext: AudioContext) {
			this.audioContext = audioContext;
			this.mixOutput = this.audioContext.createGain();
		}
		/*checkCache() {
			if (this.cache.length > 25) {
				for (let ii = 0; ii < this.cache.length; ii++) {
					if (this.cache[ii].locktime < this.audioContext.currentTime) {
						this.cache[ii].disonnectOperators();
						this.cache[ii].mixID = 0;
					}
				}
			}
		}*/
		takeVox(mxid: number): MinumFMVoice {
			//this.checkCache();
			for (let ii = 0; ii < this.cache.length; ii++) {
				if (this.cache[ii].locktime < this.audioContext.currentTime && mxid == this.cache[ii].mixID) {
					//console.log('reuse',this.cache.length);
					return this.cache[ii];
				}
			}
			/*
			for (let ii = 0; ii < this.cache.length; ii++) {
				if (this.cache[ii].locktime < this.audioContext.currentTime && this.cache[ii].mixID == 0) {
					//console.log('change',this.cache.length);
					this.cache[ii].mixID = mxid;
					this.cache[ii].connectOperators()
					return this.cache[ii];
				}
			}*/
			//console.log('create',this.cache.length);
			let vx: MinumFMVoice = new MinumFMVoice(mxid, this.audioContext, this.mixOutput);
			this.cache.push(vx);
			return vx;
		}
		cancelSynth() {
			for (let ii = 0; ii < this.cache.length; ii++) {
				this.cache[ii].cancelVoice();
			}
		}
		scheduleStrum(volume: number, preset: SynthPreset, when: number, pitches: number[], slides: MZXBX_SlideItem[]) {
			for (let ii = 0; ii < pitches.length; ii++) {
				let vox = this.takeVox(preset.mixID);
				vox.startPlayNote(volume, preset, when, pitches[ii], slides);
			}
		}
	}
	class MiniumPluginDX7Bridge implements MZXBX_AudioPerformerPlugin {
		synth: MiniumFMSynth | null = null;
		fm: FMParameter | null = null;
		launch(context: AudioContext, parameters: string): number {
			if (this.synth) {
				//
			} else {
				this.synth = new MiniumFMSynth();
				this.synth.init(context);
			}
			this.fm = (parameters as any) as FMParameter;
			return 1;
		}
		busy(): null | string {
			return null;
		}
		cancel(): void {
			if (this.synth) {
				this.synth.cancelSynth();
			}
		}
		output(): AudioNode | null {
			if (this.synth) {
				return this.synth.mixOutput;
			} else {
				return null;
			}
		}
		strum(whenStart: number, zpitches: number[], tempo: number, mzbxslide: MZXBX_SlideItem[]): void {
			if (this.synth) {
				if (this.fm) {
					this.synth.scheduleStrum(this.fm.volume, this.fm.preset, whenStart, zpitches, mzbxslide);
				}
			}
		}
	}
	return new MiniumPluginDX7Bridge();
}
