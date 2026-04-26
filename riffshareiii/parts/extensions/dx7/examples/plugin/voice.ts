class DX7Voice {
	operators: DX7Operator[];
	locktime: number = 0;
	audioContext: AudioContext;
	output: GainNode;
	mixID: number;
	constructor(mixID: number, audioContext: AudioContext, to: AudioNode) {
		this.mixID = mixID;
		this.audioContext = audioContext;
		this.output = this.audioContext.createGain();
		this.output.connect(to);
		this.output.gain.value = 0.125;//0.33;//0.25;//0.125;
		this.operators = [
			new DX7Operator(this.audioContext)
			, new DX7Operator(this.audioContext)
			, new DX7Operator(this.audioContext)
			, new DX7Operator(this.audioContext)
			, new DX7Operator(this.audioContext)
			, new DX7Operator(this.audioContext)
		];
		this.connectOperators();
	}
	reConnectOperators() {
		for (let ii = 0; ii < 6; ii++) {
			this.operators[ii].output.disconnect();
		}
		this.connectOperators();
	}
	connectOperators() {
		//console.log(this.mixID, this.matrixConnectionAlgorithmsDX7[this.mixID]);
		let mix=this.matrixConnectionAlgorithmsDX7[this.mixID-1];
		for (let cid = 0; cid < mix.modulationMatrix.length; cid++) {
			let carrier = this.operators[cid];
			let modulatorIds = mix.modulationMatrix[cid];
			for (let mm = 0; mm < modulatorIds.length; mm++) {
				let mid = modulatorIds[mm];
				let modulator = this.operators[mid];
				if (mid == cid) {
					modulator.output.connect(carrier.feedbackLevel);
					//console.log((1 + mid), 'feedback');
				} else {
					modulator.output.connect(carrier.modulationLevel);
					//console.log((1 + mid), 'to', (1 + cid));
				}
			}

		}
		for (let ii = 0; ii < mix.outputMix.length; ii++) {
			let outIdx = mix.outputMix[ii];
			this.operators[outIdx].output.connect(this.output);
			//console.log((1 + outIdx), 'out');
		}
	}
	startPlayNote(preset: SynthPreset, when: number, duration: number, note: number) {
		//this.reConnectOperators();//preset);
		for (let ii = 0; ii < 6; ii++) {
			if (preset.operators[ii].enabled) {
				let frequency = preset.operators[ii].constantFrequency;
				if (!(frequency)) {
					let noteFreq = 440 * Math.pow(2, (note - 69) / 12);
					let detuneRatio = Math.pow(Math.exp(Math.log(2) / 1024), preset.operators[ii].detune);
					frequency = noteFreq * detuneRatio * preset.operators[ii].frequencyRatio;
				}
				//console.log(ii, 'startPlayFrequency', frequency);
				this.operators[ii].startPlayFrequency(preset.operators[ii], when, duration, frequency, preset.feedbackRatio);
				let otime = when + duration + preset.operators[ii].envelope.release+0.01;
				if (this.locktime < otime) {
					this.locktime = otime;
					//console.log(ii, 'locktime', time,'when',when,'now',this.audioContext.currentTime);
				}

			}
		}

		//console.log('startPlayNote', note, 'when', when, preset);
	}
	matrixConnectionAlgorithmsDX7: ConnectionSchemeDX7[] = [
		//stacking
		{ outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], [5]] },    //1
		{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3], [4], [5], []] },    //2
		{ outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [5]] },    //3
		{ outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [3]] },    //4
		{ outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [5]] },     //5 e.piano 1
		{ outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [4]] },     //6
		//branch
		{ outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], [5]] },   //7
		{ outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [3], [5], []] },   //8
		{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3, 4], [], [5], []] },   //9
		{ outputMix: [0, 3], modulationMatrix: [[1], [2], [2], [4, 5], [], []] },   //10
		{ outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4, 5], [], [5]] },   //11
		{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3, 4, 5], [], [], []] },  //12
		{ outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4, 5], [], [], [5]] },  //13
		{ outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4, 5], [], [5]] },   //14
		{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3], [4, 5], [], []] },   //15
		{ outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], [5]] }, //16 
		{ outputMix: [0], modulationMatrix: [[1, 2, 4], [1], [3], [], [5], []] }, //17
		{ outputMix: [0], modulationMatrix: [[1, 2, 3], [], [2], [4], [5], []] }, //18
		//rooting/tower combi
		{ outputMix: [0, 3, 4], modulationMatrix: [[1], [2], [], [5], [5], [5]] },    //19
		{ outputMix: [0, 1, 3], modulationMatrix: [[2], [2], [2], [4, 5], [], []] },   //20
		{ outputMix: [0, 1, 3, 4], modulationMatrix: [[2], [2], [2], [5], [5], []] },    //21

		{ outputMix: [0, 2, 3, 4], modulationMatrix: [[1], [], [5], [5], [5], [5]] },    //22 bass 1


		{ outputMix: [0, 1, 3, 4], modulationMatrix: [[], [2], [], [5], [5], [5]] },     //23 vibe 1
		{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [5], [5], [5], [5]] },     //24
		{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [5], [5], [5]] },      //25
		//branch/tower combi
		{ outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], [5]] },    //26
		{ outputMix: [0, 1, 3], modulationMatrix: [[], [2], [2], [4, 5], [], []] },    //27
		{ outputMix: [0, 2, 5], modulationMatrix: [[1], [], [3], [4], [4], []] },     //28
		{ outputMix: [0, 1, 2, 4], modulationMatrix: [[], [], [3], [], [5], [5]] },      //29
		{ outputMix: [0, 1, 2, 5], modulationMatrix: [[], [], [3], [4], [4], []] },      //30
		{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [], [5], [5]] },       //31
		{ outputMix: [0, 1, 2, 3, 4, 5], modulationMatrix: [[], [], [], [], [], [5]] }         //32 e.organ 1
	];
}
