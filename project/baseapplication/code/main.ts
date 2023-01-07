console.log("MuzXbox v1.0.1");
class MuzXbox {
	uiStarted: boolean = false;
	audioContext: AudioContext;
	constructor() {
		this.initAfterLoad();
	}
	initAfterLoad() {
		console.log("MuzXbox loaded");
	}
	initFromUI() {
		if (this.uiStarted) {
			console.log("skip initFromUI");
		} else {
			console.log("start initFromUI");
			this.initAudioContext();
		}
	}
	initAudioContext() {
		let AudioContextFunc = (window as any).AudioContext || (window as any).webkitAudioContext;
		this.audioContext = new AudioContextFunc();
		console.log(this.audioContext);
		if (this.audioContext.state == "running") {
			this.uiStarted = true;
		}
	}
}
