console.log('Audio File v1.0');
class AudiFileSamplerTrackImplementation implements MZXBX_AudioSamplerPlugin {
	audioContext: AudioContext;
	outputNode: GainNode;
	freqRatio: number = 0;
	fileURL: string = '';
	volumeLevel: number = 0;
	ratio: number = 0;
	path = '';
	allNodes: { audio: AudioBufferSourceNode, end: number }[] = [];
	//constructor(){
	//	console.log('audiofile lauch');
	//}
	launch(context: AudioContext, parameters: string): void {
		console.log('audiofile lauch');
		if (this.audioContext) {
			//
		} else {
			this.audioContext = context;
			this.outputNode = this.audioContext.createGain();
			this.allNodes = [];
		}
		let parsed = new AudioFileParametersUrility().parse(parameters);
		this.ratio = parsed.ratio;
		this.volumeLevel = parsed.volume;
		this.path = parsed.url;
		this.startLoadFile();
	}
	start(when: number, tempo: number): void {
		let buffer: AudioBuffer = window[new AudioFileParametersUrility().bufferName(this.ratio, this.path)];
		if (buffer) {
			let audioBufferSourceNode = this.takeFreeNode(when, buffer.duration);
			audioBufferSourceNode.buffer = buffer;
			audioBufferSourceNode.start(when);
		}
	}
	cancel(): void {
		for (let ii = 0; ii < this.allNodes.length; ii++) {
			try {
				this.allNodes[ii].audio.stop(0);
			} catch (xx) {
				console.log(xx);
			}
		}
		this.allNodes = [];
	};
	busy(): null | string {
		if (window[new AudioFileParametersUrility().bufferName(this.ratio, this.path)]) {
			return null;
		} else {
			return 'loading ' + this.ratio + '|' + this.path;
		}

	}
	output(): AudioNode | null {
		return this.outputNode;
	}
	duration():number{
		let buffer: AudioBuffer = window[new AudioFileParametersUrility().bufferName(this.ratio, this.path)];
		if (buffer) {
			return buffer.duration;
		}else{
			return 0.1;
		}
	}
	takeFreeNode(when: number, duration: number): AudioBufferSourceNode {
		for (let ii = 0; ii < this.allNodes.length; ii++) {
			if (this.allNodes[ii].end < when + duration) {
				this.allNodes[ii].end = when + duration + 0.01;
				return this.allNodes[ii].audio;
			}
		}
		let audioBufferSourceNode = this.audioContext.createBufferSource();
		audioBufferSourceNode.connect(this.outputNode);
		this.allNodes.push({ audio: audioBufferSourceNode, end: when + duration + 0.01 });
		return audioBufferSourceNode;
	}
	startLoadFile() {
		//let loadedFile = window[this.path];
		//console.log('loadedFile', loadedFile);

		if (window[new AudioFileParametersUrility().bufferName(this.ratio, this.path)]) {
			//
		} else {
			let ratio = this.ratio;
			let path = this.path;
			new AudioFileParametersUrility().startLoadFile(this.path, this.ratio, () => { console.log('loaded', ratio, path); });
		}
	}
}
function newAudiFileSamplerTrack(): MZXBX_AudioSamplerPlugin {
	console.log('audiofile newAudiFileSamplerTrack');
	return new AudiFileSamplerTrackImplementation();
}
