class FxPlayer {
	mp3arrayBuffer: ArrayBuffer | null = null;
	mp3audioBuffer: AudioBuffer | null = null;
	currentContext: AudioContext | null = null;
	mp3sourceNode: AudioBufferSourceNode | null = null;
	lastStart = 0;
	lastDuration = 0;
	pitchRatio: number = 1;

	resetSource() {
		console.log('resetSource');
		if (this.currentContext) {
			if (this.mp3sourceNode) {
				this.mp3sourceNode.stop();
			} else {
				//
			}
			if (this.mp3audioBuffer) {
				let buff = this.transpose();
				if (buff) {
					this.startAudioBuffer(buff);
				}
			}
		}
	}
	startAudioBuffer(rebuff: AudioBuffer) {
		//let duration = rebuff.duration;

		if (this.currentContext) {
			this.mp3sourceNode = this.currentContext.createBufferSource();
			this.mp3sourceNode.connect(this.currentContext.destination);
			this.mp3sourceNode.buffer = rebuff;
			if (this.mp3sourceNode) {
				let offset = 0;
				if (this.lastDuration) {
					offset = (this.currentContext.currentTime - this.lastStart) % this.lastDuration;
				}
				this.lastDuration = rebuff.duration;
				if (offset > this.lastDuration) {
					offset = 0;
				}
				this.mp3sourceNode.loop = true;
				this.mp3sourceNode.loopStart = 0;
				this.mp3sourceNode.loopEnd = this.lastDuration;
				this.mp3sourceNode.start(0, offset);
				this.lastStart = this.currentContext.currentTime;
				console.log('duration', this.lastDuration + '"', 'start', offset + '"');
			}
		}
	}
	initContext() {
		if (this.currentContext) {
			//skip
		} else {
			this.currentContext = new AudioContext();
			console.log('baseLatency', this.currentContext.baseLatency);
		}
	}
	load(file: File) {
		console.log('load', file);
		let me = this;
		this.initContext();
		const reader = new FileReader();
		reader.onload = () => {
			console.log(reader);
			me.mp3arrayBuffer = reader.result as ArrayBuffer;
			if (me.currentContext) {
				me.currentContext.decodeAudioData(me.mp3arrayBuffer, function (audioBuffer: AudioBuffer) {
					console.log('audioBuffer', audioBuffer);
					me.mp3audioBuffer = audioBuffer;
					me.resetSource();
				});
			}
		};
		reader.onerror = () => {
			alert('error');
		};
		reader.readAsArrayBuffer(file);
	}
	transpose(): AudioBuffer | null {
		console.log('transpose', this.pitchRatio, new Date());
		if (this.mp3audioBuffer) {
			let data = new Float32Array(this.mp3audioBuffer.length);
			this.mp3audioBuffer.copyFromChannel(data, 0);
			let sampleRate = this.mp3audioBuffer.sampleRate;
			//let ratio = 0.95;
			if (this.pitchRatio == 1) {
				return this.mp3audioBuffer;
			} else {
				console.log('calculate', new Date());
				let newData = resamplePitchShiftFloat32Array(this.pitchRatio, data.length, 1024, 10, sampleRate, data);
				if (this.currentContext) {
					let audioBuffer: AudioBuffer = this.currentContext.createBuffer(
						this.mp3audioBuffer.numberOfChannels
						, this.mp3audioBuffer.length
						, this.mp3audioBuffer.sampleRate);
					console.log('copy', new Date());
					for (let ii = 0; ii < this.mp3audioBuffer.numberOfChannels; ii++) {
						audioBuffer.copyToChannel(newData, ii);
					}
					console.log('done', new Date());
					return audioBuffer;
				}
			}
		}
		return null;
	}
}
