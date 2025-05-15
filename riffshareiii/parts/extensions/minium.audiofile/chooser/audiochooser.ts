class AudioFilePicker {
	id: string = '';
	path: string = '';
	ratio: number = 0;
	ratioslider: any;
	numval: any;
	constructor() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.ratioslider = document.getElementById('ratioslider') as any;
		this.numval = document.getElementById('numval') as any;
		this.ratioslider.addEventListener('change', (event) => {
			this.ratio = this.ratioslider.value
			this.numval.innerHTML = this.ratio;
			this.sendMessageToHost('' + this.ratio + ',' + this.path);
		});
		this.sendMessageToHost('');
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
			this.path = '';
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

	}
	selectPath(path: string) {
		this.path = path;
		this.sendMessageToHost('' + this.ratio + ',' + this.path);
		this.updateUI();
	}
	checkPath(){
		alert('Check');
	}
}
let pickerbridge = new AudioFilePicker();
