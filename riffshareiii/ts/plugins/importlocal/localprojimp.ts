class LocalProjectImport {
	callbackID = '';
	parsedProject: Zvoog_Project | null = null;
	constructor() {
		this.init();
	}
	init() {
		console.log('init MIDI import');
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
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
			var oo: MZXBX_PluginMessage = {
				dialogID: this.callbackID,
				data: JSON.stringify(this.parsedProject)
			};
			window.parent.postMessage(JSON.stringify(oo), '*');
		}
	}
	



	receiveHostMessage(par) {
		console.log('receiveHostMessage', par);
		//callbackID = par.data;
		try {
			//console.log('parse', par.data.data);
			//var oo: MZXBX_PluginMessage = JSON.parse(par.data.data);
			//console.log('result', oo);
			this.callbackID = par.data.dialogID;
			//console.log('dialogID', this.callbackID);
		} catch (xx) {
			console.log(xx);
		}
	}

}
