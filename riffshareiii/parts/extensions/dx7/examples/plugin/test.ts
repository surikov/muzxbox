class DX7Test {
	synth: DX7Synthesizer | null = null;
	selectedPreset: SynthPreset | null = null;
	parsed: SynthPreset[] | null = null;
	constructor() {
		let test: DX7PresetData = 
		{
    "algorithm1_32": 5,
    "feedback0_7": 7,//6,
    "operators": [
        {
            "rates0_99": [
                96,
                25,
                25,
                67
            ],
            "levels0_99": [
                99,
                75,
                0,
                0
            ],
            "detune_7_7": 3,
            "volumeLevel0_99": 99,
            "constMode0_1": 0,
            "freqCoarse0_31": 1,
            "freqFine0_99": 0,
            "enabled": true
        },
        {
            "rates0_99": [
                95,
                50,
                35,
                78
            ],
            "levels0_99": [
                99,
                75,
                0,
                0
            ],
            "detune_7_7": 0,
            "volumeLevel0_99": 58,
            "constMode0_1": 0,
            "freqCoarse0_31": 14,
            "freqFine0_99": 0,
            "enabled": true
        },
        {
            "rates0_99": [
                95,
                20,
                20,
                50
            ],
            "levels0_99": [
                99,
                95,
                0,
                0
            ],
            "detune_7_7": 0,
            "volumeLevel0_99": 99,
            "constMode0_1": 0,
            "freqCoarse0_31": 1,
            "freqFine0_99": 0,
            "enabled": true
        },
        {
            "rates0_99": [
                95,
                29,
                20,
                50
            ],
            "levels0_99": [
                99,
                95,
                0,
                0
            ],
            "detune_7_7": 0,
            "volumeLevel0_99": 89,
            "constMode0_1": 0,
            "freqCoarse0_31": 1,
            "freqFine0_99": 0,
            "enabled": true
        },
        {
            "rates0_99": [
                99,//95,
                99,//20,
                99,//20,
                99//50
            ],
            "levels0_99": [
                99,
                99,//95,
                99,//0,
                99//0
            ],
            "detune_7_7": 0,//-7,
            "volumeLevel0_99": 99,
            "constMode0_1": 0,
            "freqCoarse0_31": 1,
            "freqFine0_99": 0,
            "enabled": true
        },
        {
            "rates0_99": [
                99,//95,
                99,//29,
                99,//20,
                99//50
            ],
            "levels0_99": [
                99,
                99,//95,
                99,//0,
                99//0
            ],
            "detune_7_7": 0,//7,
            "volumeLevel0_99": 99,//79,
            "constMode0_1": 0,
            "freqCoarse0_31": 1,
            "freqFine0_99": 0,
            "enabled": true
        }
    ],
    "name": "E.PIANO 1 "
}
		;
		let loader: DX7Loader = new DX7Loader();
		this.selectedPreset = loader.convertDX7data('test', test);
		console.log(test,this.selectedPreset);

		this.selectedPreset.operators[0].enabled=false;
		this.selectedPreset.operators[1].enabled=false;
		this.selectedPreset.operators[2].enabled=false;
		this.selectedPreset.operators[3].enabled=false;
		//this.selectedPreset.operators[4].enabled=false;
		//this.selectedPreset.operators[5].enabled=false;

		//this.selectedPreset.operators[5].volume=0.05;

		//this.selectedPreset.operators[3].constantFrequency=977;
		//this.selectedPreset.operators[2].constantFrequency=605;
		//this.selectedPreset.feedbackRatio=0.1;
	}
	loadSysexFile(fileList: FileList) {
		console.log('loadSysexFile', fileList);
		let loader: DX7Loader = new DX7Loader();
		let me = this;
		loader.parseSyxFile(fileList[0], (presets: SynthPreset[]) => {
			console.log('presets', presets);
			me.parsed = presets;
		});
	}
	testPlay(isPiano: boolean, nn: number) {
		if (!(this.synth)) {
			let ac = new AudioContext();
			this.synth = new DX7Synthesizer(ac);
			this.synth.output.connect(ac.destination);
		}
		if (this.synth) {
			if (this.selectedPreset) {
				//console.log('play', nn, this.selectedPreset);
				//this.selectedPreset.operators[2].volume = 0.001;
				//this.selectedPreset.operators[2].enabled = false;
				//this.selectedPreset.operators[3].enabled = false;
				//this.selectedPreset.operators[4].enabled = false;
				//this.selectedPreset.operators[5].enabled = false;

				this.synth.scheduleStrum(this.selectedPreset, this.synth.audioContext.currentTime + 0.321, [nn], [{ duration: 2.1, delta: 0 }]);
			}
		}
	}
	customPlay(isPiano: boolean, nn: number) {
		this.testPlay(isPiano, nn);
	}
	loadPresetNum(nn: number) {
		if (this.parsed) {
			this.selectedPreset = this.parsed[nn];
			console.log('select', nn, this.selectedPreset);
		}
	}
}
var tester = new DX7Test();
////////////////////////////////////////////////////////
/*
function durationUp(nn: number): number {
	//return  this.durationDown(nn)/4;
	return 0.0001 + 38 * Math.pow(2, (99 - nn) * 0.16) / Math.pow(2, 99 * 0.16);
}*/
/*
let loader: DX7Loader = new DX7Loader();
for (let ii = 0; ii < 100; ii++) {
	//console.log(ii,loader.durationUp(ii));
}

console.log(99, 0.0004, loader.durationUp(99));
console.log(98, 0.00047, loader.durationUp(98));
console.log(97, 0.00047, loader.durationUp(97));
console.log(96, 0.00056, loader.durationUp(96));
console.log(96, 0.00068, loader.durationUp(95));
console.log(95, 0.00068, loader.durationUp(94));
console.log(93, 0.00081, loader.durationUp(93));
console.log(92, 0.00098, loader.durationUp(92));
console.log(91, 0.00098, loader.durationUp(91));
console.log(90, 0.0011, loader.durationUp(90));
console.log(89, 0.0011, loader.durationUp(89));
console.log(88, 0.0013, loader.durationUp(88));
console.log(80, 0.0033, loader.durationUp(80));
console.log(70, 0.0113, loader.durationUp(70));
console.log(60, 0.0322, loader.durationUp(60));
console.log(50, 0.0912, loader.durationUp(50));
console.log(40, 0.0371, loader.durationUp(40));
console.log(30, 0.8686, loader.durationUp(30));
console.log(20, 2.92, loader.durationUp(20));
console.log(10, 8.264, loader.durationUp(10));

console.log(99, 0.0033, loader.durationDown(99));
console.log(89, 0.0088, loader.durationDown(89));
console.log(79, 0.02868, loader.durationDown(79));
console.log(69, 0.0803, loader.durationDown(69));
console.log(59, 0.2695, loader.durationDown(59));
console.log(49, 0.7615, loader.durationDown(49));
console.log(19, 20.48, loader.durationDown(19));
*/

for (let ii = 0; ii <= 7; ii++) {
	console.log(ii, Math.pow(2, (ii - 7)));
}
console.log(Math.pow(10, 10 % 4) * (1 + (99 / 99) * 8.772));