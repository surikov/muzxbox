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
			//'' + this.ratio + ',' + this.path);
		});
		this.volumeslider.addEventListener('change', (event) => {
			this.volumeLevel = this.volumeslider.value;
			this.volval.innerHTML = this.volumeLevel;
			this.sendMessageToHost(new AudioFileParametersUrility().dump(this.ratio, this.volumeLevel, this.path));
			//console.log(this.volval.innerHTML );
		});
		this.sendMessageToHost('');
		this.updateUI();
	}
	sendMessageToHost(data: string) {
		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false };
		window.parent.postMessage(message, '*');
		console.log('sendMessageToHost', message);
	}
	receiveHostMessage(messageEvent: MessageEvent) {
		let message: MZXBX_MessageToPlugin = messageEvent.data;
		console.log('receiveHostMessage', message);
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
		this.path = 'http://127.0.0.1:8080/audiosamples/' + name;
		this.sendMessageToHost('' + this.ratio + ',' + this.path);
		this.updateUI();
	}
	checkPath() {
		//this.sendMessageToHost('' + this.ratio + ',' + this.path);
		this.sendMessageToHost(new AudioFileParametersUrility().dump(this.ratio, this.volumeLevel, this.path));
		this.startLoadFile(this.path);
	}
	startLoadFile(url: string) {

		let xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", url, true);
		xmlHttpRequest.responseType = "arraybuffer";
		xmlHttpRequest.onload = (event) => {
			const arrayBuffer = xmlHttpRequest.response; // Note: not req.responseText
			if (arrayBuffer) {
				/*let byteArray = new Uint8Array(arrayBuffer);
				byteArray.forEach((element, index) => {
					// do something with each byte in the array
				});*/
				console.log('arrayBuffer',arrayBuffer);
			}
		};
		xmlHttpRequest.onerror=(proevent)=>{
			console.log('onerror',proevent);
			console.log('xmlHttpRequest',xmlHttpRequest);
			alert('Error '+proevent);
		};
		try {
			xmlHttpRequest.send(null);
		} catch (xx) {
			console.log(xx);
			alert('Error '+xx);
		}
	}
}
let pickerbridge = new AudioFilePicker();
