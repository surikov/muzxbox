declare var Tone;
class FxPlayer {
	mp3arrayBuffer: ArrayBuffer | null = null;
	mp3audioBuffer: AudioBuffer | null = null;
	currentContext: AudioContext | null = null;
	mp3sourceNode: AudioBufferSourceNode | null = null;
	volumeNode: GainNode;
	//lastStart = 0;
	//lastDuration = 0;
	pitchRatio: number = 1;
	shift;
	waf: WebAudioFontPlayer;
	reverberator: WebAudioFontReverberator;
	//fxShift: FxShift;
	channelMaster:WebAudioFontChannel;
	resetSource() {
		console.log('resetSource');
		if (this.currentContext) {
			if (this.mp3sourceNode) {
				this.mp3sourceNode.stop();
				this.mp3sourceNode.disconnect();
			} else {
				//
			}
			if (this.mp3audioBuffer) {
				/*let buff = this.transpose();
				if (buff) {
					this.startAudioBuffer(buff);
				}*/
				this.startAudioBuffer(this.mp3audioBuffer);
			}
		}
	}
	resetPitch(nn: number) {
		console.log('resetPitch', nn);
		if (this.currentContext) {
			//this.fxShift.setupPitch(nn);
			this.shift.pitch = nn;
		}
	}
	startAudioBuffer(rebuff: AudioBuffer) {
		//let duration = rebuff.duration;
		let tt = Tone;
		console.log(tt);
		//Tone.context = this.currentContext;
		tt.setContext(this.currentContext);
		//console.log(tt.getContext()._context);
		//this.currentContext = tt.getContext()._context;
		if (this.currentContext) {

			//--this.mp3sourceNode.connect(this.currentContext.destination);
			//this.mp3sourceNode.connect(this.fxShift.input());

			this.waf = new WebAudioFontPlayer();
			this.reverberator = this.waf.createReverberator(this.currentContext);
			this.reverberator.compressorWet.gain.setTargetAtTime(0, 0, 0.0001);
			this.reverberator.compressorDry.gain.setTargetAtTime(1, 0, 0.0001);
			this.channelMaster = this.waf.createChannel(this.currentContext);	


			this.volumeNode = this.currentContext.createGain();

			this.mp3sourceNode = this.currentContext.createBufferSource();
			this.mp3sourceNode.buffer = rebuff;

			this.mp3sourceNode.connect(this.channelMaster.input);
			this.shift = new Tone.PitchShift();
			//tt.connect(this.mp3sourceNode, this.shift);
			tt.connect(this.channelMaster.output, this.shift);
			tt.connect(this.shift, this.volumeNode);
			this.volumeNode.connect(this.reverberator.input);
			this.reverberator.output.connect(this.currentContext.destination);

			//console.log(node);
			//let out = node.output.output.output._nativeAudioNode;
			//let inp = node.input.input._nativeAudioNode;
			//this.mp3sourceNode.connect(inp);
			//out.connect(this.volumeNode);
			//this.mp3sourceNode.connect(this.volumeNode);
			//node.connect(this.mp3sourceNode,this.currentContext.destination);
			//console.log(inp,out);
			if (this.mp3sourceNode) {
				let offset = 0;
				/*if (this.lastDuration) {
					offset = (this.currentContext.currentTime - this.lastStart) % this.lastDuration;
				}
				this.lastDuration = rebuff.duration;
				if (offset > this.lastDuration) {
					offset = 0;
				}*/
				this.mp3sourceNode.loop = true;
				this.mp3sourceNode.loopStart = 0;
				this.mp3sourceNode.loopEnd = rebuff.duration;
				this.mp3sourceNode.start(0, offset);
				//this.lastStart = this.currentContext.currentTime;
				console.log('duration', '' + Math.floor(rebuff.duration / 60) + ':' + Math.floor(rebuff.duration % 60));
			}
		}
	}
	initContext() {
		if (this.currentContext) {
			//skip
		} else {
			this.currentContext = new AudioContext();
			console.log('baseLatency', this.currentContext.baseLatency);
			//this.fxShift = new FxShift(this.currentContext);
			//this.fxShift.output().connect(this.currentContext.destination);

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
		if (document) {
			let button = document.getElementById("filestart");
			if (button) {
				(button as any).disabled = true;
			}
		}
	}
	/*transpose(): AudioBuffer | null {
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
	}*/
}
