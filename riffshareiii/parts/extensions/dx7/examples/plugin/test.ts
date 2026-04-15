class DX7Test {
	synth: DX7Synthesizer | null = null;
	selectedPreset: SynthPreset | null = null;
	parsed: SynthPreset[] | null = null;
	constructor() {

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
				this.selectedPreset.operators[2].enabled = false;
				this.selectedPreset.operators[3].enabled = false;
				this.selectedPreset.operators[4].enabled = false;
				this.selectedPreset.operators[5].enabled = false;
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

