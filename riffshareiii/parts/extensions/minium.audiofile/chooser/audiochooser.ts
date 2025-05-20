class AudioFilePicker {
	id: string = '';
	path: string = 'https://surikov.github.io/muzxbox/riffshareiii/parts/extensions/minium.audiofile/audiosamples/hello.wav';
	ratio: number = 0;
	ratioslider: any;
	numval: any;
	volumeslider: any;
	volval: any;
	fname: any;
	volumeLevel = 100;
	constructor() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.ratioslider = document.getElementById('ratioslider') as any;
		this.numval = document.getElementById('numval') as any;
		this.volumeslider = document.getElementById('volumeslider') as any;
		this.volval = document.getElementById('volval') as any;
		this.fname = document.getElementById('fname') as any;
		this.ratioslider.addEventListener('change', (event) => {
			this.ratio = this.ratioslider.value;
			this.numval.innerHTML = this.ratio;
			this.sendMessageToHost(new AudioFileParametersUrility().dump(this.ratio, this.volumeLevel, this.path));
		});
		this.volumeslider.addEventListener('change', (event) => {
			this.volumeLevel = this.volumeslider.value;
			this.volval.innerHTML = this.volumeLevel;
			this.sendMessageToHost(new AudioFileParametersUrility().dump(this.ratio, this.volumeLevel, this.path));
		});
		this.sendMessageToHost('');
		this.updateUI();
	}
	sendMessageToHost(data: string) {
		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false };
		window.parent.postMessage(message, '*');
	}
	receiveHostMessage(messageEvent: MessageEvent) {
		let message: MZXBX_MessageToPlugin = messageEvent.data;
		if (this.id) {
			let parsed = new AudioFileParametersUrility().parse(message.hostData);
			this.ratio = parsed.ratio;
			this.volumeLevel = parsed.volume;
			this.path = parsed.url;
			this.updateUI();
		} else {
			this.id = message.hostData;
		}
	}
	updateUI() {
		this.numval.innerHTML = this.ratio;
		this.volval.innerHTML = this.volumeLevel;
		this.ratioslider.value = this.ratio;
		this.volumeslider.value = this.volumeLevel;
		this.fname.value = this.path;
	}
	selectPath(name: string) {
		this.path = 'https://surikov.github.io/muzxbox/riffshareiii/parts/extensions/minium.audiofile/audiosamples/' + name;
		this.sendMessageToHost('' + this.ratio + ',' + this.path);
		this.updateUI();
	}
	
	checkPath() {
		this.sendMessageToHost(new AudioFileParametersUrility().dump(this.ratio, this.volumeLevel, this.path));
		if (window[new AudioFileParametersUrility().bufferName(this.ratio, this.path)]) {
			this.beep();
		} else {
			new AudioFileParametersUrility().startLoadFile(this.path, this.ratio,()=>{this.beep();});
		}
	}
	
	beep() {
		let audioContext = new AudioContext();
		let audioBufferSourceNode = audioContext.createBufferSource();
		audioBufferSourceNode.buffer = window[new AudioFileParametersUrility().bufferName(this.ratio, this.path)];
		audioBufferSourceNode.connect(audioContext.destination);
		audioBufferSourceNode.start(0);
	}
}
let pickerbridge = new AudioFilePicker();
