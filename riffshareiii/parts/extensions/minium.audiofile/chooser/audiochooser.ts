class AudioFilePicker {
	id: string = '';
	path: string = './plugins/samplers/miniumfader1/audiosamples/voice-yeah.wav';
	ratio: number = 0;
	ratioslider: any;
	numval: any;
	fname: any;
	constructor() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.ratioslider = document.getElementById('ratioslider') as any;
		this.numval = document.getElementById('numval') as any;
		this.fname = document.getElementById('fname') as any;
		this.ratioslider.addEventListener('change', (event) => {
			this.ratio = this.ratioslider.value
			this.numval.innerHTML = this.ratio;
			this.sendMessageToHost('' + this.ratio + ',' + this.path);
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
			this.ratio = 0;
			//this.path = '';
			try {
				let splits = message.hostData.split(',');
				this.ratio = parseInt(splits[0]);
				this.path = '' + parseInt(splits[1]);
			} catch (xx) {
				console.log(xx);
			}
			this.ratio = this.ratio ? this.ratio : 0;
			this.updateUI();
		} else {
			this.id =  message.hostData;
		}
	}
	updateUI() {
		this.numval.innerHTML = this.ratio;
		this.ratioslider.value=this.ratio;
		this.fname.value=this.path;
	}
	selectPath(name: string) {
		this.path = './plugins/samplers/miniumfader1/audiosamples/'+name;
		this.sendMessageToHost('' + this.ratio + ',' + this.path);
		this.updateUI();
	}
	checkPath(){
		this.sendMessageToHost('' + this.ratio + ',' + this.path);
	}
}
let pickerbridge = new AudioFilePicker();
