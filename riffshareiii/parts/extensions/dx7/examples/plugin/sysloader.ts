type DX7OperatorData = {
	enabled: boolean;
	freqFine0_99: number;
	freqCoarse0_31: number;
	//freqRatio: number;
	volumeLevel0_99: number;
	constMode0_1: number;
	detune_7_7: number;
	rates0_99: number[];
	levels0_99: number[];
	lfoAmpModSens_3_3: number;
	velocitySens0_7: number;
};
type DX7PresetData = {
	name: string;
	algorithm0_31: number;
	operators: DX7OperatorData[];
	feedback0_7: number;
};
type ConnectionSchemeDX7 = {
	outputMix: number[]
	, modulationMatrix: (number[])[]
};
type SynthSlope = {
	from: number;
	to: number;
	duration: number;
};
type OperatorInfo = {
	constantFrequency: number;
	frequencyRatio: number;
	detune: number;
	enabled: boolean;
	volume: number;
	attack: SynthSlope;
	decay: SynthSlope;
	sustain: SynthSlope;
	release: SynthSlope;
};
type SynthPreset = {
	label: string;
	connectionsInfo: ConnectionSchemeDX7;
	operators: OperatorInfo[];
	feedbackRatio: number;
};

class DX7Loader {
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
	scale99(nn: number): number {
		let speed = Math.pow(2, nn * 0.16);
		return speed;
	}
	durationDown(nn: number): number {
		//let ss = this.scale99(nn);
		//return 0.095 / ss;
		//return 318 * Math.pow(2, (99 - nn) * 0.16) / Math.pow(2, 99 * 0.16)//+0.008;
		return 169 * Math.pow(2, (99 - nn) * 0.16) / Math.pow(2, 99 * 0.16)//+0.008;
	}
	durationUp(nn: number): number {
		//return  this.durationDown(nn)/4;
		//return 38 * Math.pow(2, (99 - nn) * 0.16) / Math.pow(2, 99 * 0.16) //+0.0001;
		return 24.9 * Math.pow(2, (99 - nn) * 0.16) / Math.pow(2, 99 * 0.16) //+0.0001;
	}
	levelRatio(nn: number): number {
		return nn / 99;
		let ratio = Math.log(nn + 1) * 14 + nn;
		return ratio;
	}
	slopeDuration(r99: number, from99: number, to99: number): SynthSlope {
		//let fromRatio = this.levelRatio(from99);
		//let toRatio = this.levelRatio(to99);
		//let fullRatio = this.levelRatio(99);
		let partDuration = Math.abs(this.levelRatio(from99) - this.levelRatio(to99)) / this.levelRatio(99);
		let fullDuration = this.durationDown(r99);

		if (from99 < to99) {
			fullDuration = this.durationUp(r99);
		}
		//console.log(r99, 'partDuration', partDuration, 'fullDuration', fullDuration, '/', this.durationUp(r99), 'speed', this.scale99(r99));

		let slope = {
			duration: partDuration * fullDuration
			, from: this.scale99(from99) / this.scale99(99)
			, to: this.scale99(to99) / this.scale99(99)
		};
		//if(dump)console.log('slopeDuration', r99, 'from',from99,'to', to99, slope, fullDuration,'/', partDuration);
		return slope;
	}
	convertDX7data(fileName: string, dx7data: DX7PresetData): SynthPreset {
		let preset: SynthPreset = {
			label: dx7data.name.trim() + '/' + fileName.trim()
			, connectionsInfo: this.matrixConnectionAlgorithmsDX7[dx7data.algorithm0_31]
			, operators: []
			, feedbackRatio: Math.pow(2, (dx7data.feedback0_7 - 7)) * 0.6
		};
		for (let ii = 0; ii < 6; ii++) {
			let data = dx7data.operators[ii];
			let operator: OperatorInfo = {
				constantFrequency: 0
				, frequencyRatio: 0
				, enabled: data.enabled
				, volume: Math.pow(2, data.volumeLevel0_99 * 0.125) / Math.pow(2, 99 * 0.125)
				, detune: data.detune_7_7
				, attack: this.slopeDuration(data.rates0_99[0], data.levels0_99[3], data.levels0_99[0])
				, decay: this.slopeDuration(data.rates0_99[1], data.levels0_99[0], data.levels0_99[1])
				, sustain: this.slopeDuration(data.rates0_99[2], data.levels0_99[1], data.levels0_99[2])
				, release: this.slopeDuration(data.rates0_99[3], data.levels0_99[2], data.levels0_99[3])
			};
			if (operator.release.duration < 0.003) {
				operator.release.duration = 0.003
			}
			if (data.constMode0_1 > 0) {
				operator.constantFrequency = Math.pow(10, data.freqCoarse0_31 % 4) * (1 + (data.freqFine0_99 / 99) * 8.772);
			} else {
				/*var OCTAVE_1024 = 1.0006771307; //Math.exp(Math.log(2)/1024);
				let detuneRatio = Math.pow(OCTAVE_1024, data.detune_7_7);
				let freqRatio = data.freqCoarse0_31 * (1 + data.freqFine0_99 / 100);
				if (freqRatio) {
					operator.frequencyRatio = detuneRatio * freqRatio;
				} else {
					operator.frequencyRatio = detuneRatio * 0.5;
				}*/
				//operator.frequencyRatio = data.freqCoarse0_31 * (1 + data.freqFine0_99 / 100);
				if (data.freqCoarse0_31) {
					operator.frequencyRatio = data.freqCoarse0_31 * (1 + data.freqFine0_99 / 100);
				} else {
					operator.frequencyRatio = 0.5;
				}
			}
			preset.operators.push(operator);
		}
		//if(dump)console.log('preset',preset);
		return preset;
	}
	parseSyxFile(from: File, onDone: (presets: SynthPreset[]) => void) {
		let reader = new FileReader();
		let all: SynthPreset[] = [];
		reader.onload = () => {
			let result: string = reader.result as string;
			//console.log(from.name);
			//let customPresets: DX7PresetData[] = [];
			for (let ii = 0; ii < 32; ii++) {
				let one: DX7PresetData = this.parseSysexData(result, ii);
				let preset: SynthPreset = this.convertDX7data(from.name, one);
				//console.log(ii, preset);
				all.push(preset);
			}
			//console.log(customPresets);
			onDone(all);
		};
		reader.onerror = (error) => {
			console.log('error', error)
		};
		reader.readAsText(from);
	}
	parseSysexData(bankData: string, patchId: number): DX7PresetData {
		var dataStart = 128 * patchId + 6;
		var dataEnd = dataStart + 128;
		var voiceData = bankData.substring(dataStart, dataEnd);
		var operators: DX7OperatorData[] = [];
		for (var ii = 5; ii >= 0; --ii) {
			var oscStart = (5 - ii) * 17;
			var oscEnd = oscStart + 17;
			var oscData = voiceData.substring(oscStart, oscEnd);
			var operator: DX7OperatorData = {
				rates0_99: [oscData.charCodeAt(0), oscData.charCodeAt(1), oscData.charCodeAt(2), oscData.charCodeAt(3)]
				, levels0_99: [oscData.charCodeAt(4), oscData.charCodeAt(5), oscData.charCodeAt(6), oscData.charCodeAt(7)]
				, detune_7_7: Math.floor(oscData.charCodeAt(12) >> 3) - 7 // range 0 to 14
				, volumeLevel0_99: oscData.charCodeAt(14)
				, constMode0_1: oscData.charCodeAt(15) & 1
				, freqCoarse0_31: Math.floor(oscData.charCodeAt(15) >> 1)
				, freqFine0_99: oscData.charCodeAt(16)
				, enabled: true
				, lfoAmpModSens_3_3: oscData.charCodeAt(13) & 3
				, velocitySens0_7: oscData.charCodeAt(13) >> 2
			};
			operators.splice(0, 0, operator);
		}
		let preset: DX7PresetData = {
			algorithm0_31: voiceData.charCodeAt(110) + 1,
			feedback0_7: voiceData.charCodeAt(111) & 7,
			operators: operators,
			name: voiceData.substring(118, 128),
		};
		console.log('parseSysexData', patchId, preset);
		return preset;
	}
}
