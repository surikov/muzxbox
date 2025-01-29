class LocalProjectImport {
	id = '';
	parsedProject: Zvoog_Project | null = null;
	constructor() {
		this.init();
	}
	init() {
		console.log('init MIDI import');
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		window.parent.postMessage('', '*');
	}

	loadLocalFile(inputFile) {
		var file = inputFile.files[0];
		var fileReader = new FileReader();
		let me = this;
		fileReader.onload = function (progressEvent: any) {
			if (progressEvent != null) {
				console.log('loadLocalFile', progressEvent);
				me.parsedProject = JSON.parse(progressEvent.target.result);
			}
		}
		fileReader.readAsText(file);
	}
	sendLoadedData() {
		if (this.parsedProject) {
			var oo: MZXBX_MessageToHost = { dialogID: this.id, pluginData: this.parsedProject };
			window.parent.postMessage(oo, '*');
		}
	}




	receiveHostMessage(par) {
		//console.log('receiveHostMessage', par);
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.id) {
			//
		} else {
			this.id = message.hostData;
		}
	}

}
