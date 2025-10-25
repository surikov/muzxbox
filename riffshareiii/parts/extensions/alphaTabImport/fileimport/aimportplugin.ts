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
			this.setupColors(message.colors);
		}
	}
	setupColors(colors: {
		background: string// #101;
		, main: string//#9cf;
		, drag: string//#03f;
		, line: string//#ffc;
		, click: string// #c39;
	}) {
		//console.log('setipColors', colors.background, window.getComputedStyle(document.documentElement).getPropertyValue('--background-color'));
		document.documentElement.style.setProperty('--background-color', colors.background);
		document.documentElement.style.setProperty('--main-color', colors.main);
		document.documentElement.style.setProperty('--drag-color', colors.drag);
		document.documentElement.style.setProperty('--line-color', colors.line);
		document.documentElement.style.setProperty('--click-color', colors.click);
	}

	loadMusicfile(inputFile) {
		//console.log('loadMusicfile');
		//console.dir(inputFile);
		let loader = new FileLoaderAlpha(inputFile);
		//console.log('loadMusicfile', inputFile);

	}

}

