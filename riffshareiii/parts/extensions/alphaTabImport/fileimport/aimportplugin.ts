console.log('Alpha Tab Import *.mid v1.0.1');
let parsedProject: Zvoog_Project | null = null;
class AlphaTabImportMusicPlugin {
	callbackID = '';

	constructor() {
		this.init();
	}
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		window.parent.postMessage({
			dialogID: this.callbackID
			, pluginData: parsedProject
			, done: false
		}, '*');
	}
	sendImportedMusicData() {
		console.log('sendImportedMusicData', parsedProject);
		if (parsedProject) {
			var oo: MZXBX_MessageToHost = {
				dialogID: this.callbackID
				, pluginData: parsedProject
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
		//console.log('loadMusicfile');
		//console.dir(inputFile);
		let loader = new FileLoaderAlpha(inputFile);
		//console.log('loadMusicfile', inputFile);

	}

}

