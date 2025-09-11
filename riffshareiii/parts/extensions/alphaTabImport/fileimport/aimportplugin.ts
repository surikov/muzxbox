console.log('Alpha Tab Import *.mid v1.0.1');
class AlphaTabImportMusicPlugin {
	callbackID = '';
	parsedProject: Zvoog_Project | null = null;
	constructor() {
		this.init();
	}
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		window.parent.postMessage({
			dialogID: this.callbackID
			, pluginData: this.parsedProject
			, done: false
		}, '*');
	}
	sendImportedMusicData() {
		console.log('sendImportedMusicData', this.parsedProject);
		if (this.parsedProject) {
			var oo: MZXBX_MessageToHost = {
				dialogID: this.callbackID
				, pluginData: this.parsedProject
				, done: true
			};
			window.parent.postMessage(oo, '*');
		} else {
			alert('No parsed data');
		}
	}

	receiveHostMessage(par) {
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.callbackID) {
			//
		} else {
			this.callbackID = message.hostData;
		}
	}

	loadMusicfile(inputFile) {
		console.log('loadMusicfile');
		console.dir(inputFile);
		let loader = new FileLoaderAlpha(inputFile);
	}

}

