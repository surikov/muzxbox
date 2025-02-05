console.log('zecho v1.0');
class ZCompressorImplementation implements MZXBX_AudioFilterPlugin {
	audioContext: AudioContext;
	outputNode: GainNode;
	inputNode: GainNode;
	compressor: DynamicsCompressorNode;
	dry: GainNode;
	wet: GainNode;
	num: number = 1;
	createAll(context: AudioContext) {
		this.audioContext = context;
		this.inputNode = this.audioContext.createGain();
		this.outputNode = this.audioContext.createGain();
		this.compressor = this.audioContext.createDynamicsCompressor();
		var threshold = -40;
		var knee = 35;
		var ratio = 15;
		var attack = 0.02;
		var release = 0.91;
		this.compressor.threshold.setValueAtTime(threshold, this.audioContext.currentTime + 0.0001);//-100,0
		this.compressor.knee.setValueAtTime(knee, this.audioContext.currentTime + 0.0001);//0,40
		this.compressor.ratio.setValueAtTime(ratio, this.audioContext.currentTime + 0.0001);//2,20
		this.compressor.attack.setValueAtTime(attack, this.audioContext.currentTime + 0.0001);//0,1
		this.compressor.release.setValueAtTime(release, this.audioContext.currentTime + 0.0001);//0,1
		this.dry = this.audioContext.createGain();
		this.wet = this.audioContext.createGain();
		this.dry.gain.setTargetAtTime(0.001, 0, 0.0001);
		this.wet.gain.setTargetAtTime(0.999, 0, 0.0001);
		this.inputNode.connect(this.dry);
		this.inputNode.connect(this.compressor);
		this.compressor.connect(this.wet);
		this.dry.connect(this.outputNode);
		this.wet.connect(this.outputNode);
	}
	launch(context: AudioContext, parameters: string): void {
		if (this.audioContext) {
			//
		} else {
			this.createAll(context);
		}
		this.schedule(this.audioContext.currentTime + 0.0001, 120, parameters);
	}
	busy(): null | string {
		return null;
	}
	schedule(when: number, tempo: number, parameters: string): void {
		this.wet.gain.setValueAtTime(this.num, when);
		this.dry.gain.setValueAtTime(1 - this.num, when);
		this.num = parseInt(parameters);
		this.wet.gain.linearRampToValueAtTime(this.num, when + 0.001);
		this.dry.gain.linearRampToValueAtTime(1 - this.num, when + 0.001);
	}
	input(): AudioNode | null {
		return this.inputNode;
	}
	output(): AudioNode | null {
		return this.outputNode;
	}
}
class ZCO {
	id: string = '';
	data: string = '';
	slider: any;
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.sendMessageToHost('');
		this.slider = document.getElementById('coctrl');
		this.slider.addEventListener('change', (event) => {
			this.sendMessageToHost(this.slider.value);
		});
	}
	sendMessageToHost(data: string) {
		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false };
		window.parent.postMessage(message, '*');
	}
	receiveHostMessage(messageEvent: MessageEvent) {
		let message: MZXBX_MessageToPlugin = messageEvent.data;
		if (this.id) {
			this.setState(message.hostData);
		} else {
			this.setMessagingId(message.hostData);
		}
	}
	setMessagingId(newId: string) {
		this.id = newId;
	}
	setState(data: string) {
		this.data = data;
		this.slider.value = parseInt(this.data);
	}
}
function initZC() {
	let zz = new ZCO();
	zz.init();
}
function newZvoogCompreImplementation(): MZXBX_AudioFilterPlugin {
	return new ZCompressorImplementation();
}

