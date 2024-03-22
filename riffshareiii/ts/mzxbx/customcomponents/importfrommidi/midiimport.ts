class MIDIIImportMusicPlugin {
	callbackID = '';
	constructor() {
		this.init();
	}
	init() {
		console.log('init MIDI import');
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
	}
	sendTestData() {
		console.log('sendTestData');
		var oo = {
			dialog: this.callbackID,
			data: {
				bla: 'bla',
				test: 121212
			}
		};
		window.parent.postMessage(JSON.stringify(oo), '*');
	}

	loadfile(inputFile) {
		console.log('loadfile', inputFile.files);
	}

	receiveHostMessage(par) {
		console.log('receiveHostMessage', par);
		//callbackID = par.data;
		try {
			var oo = JSON.parse(par.data);
			this.callbackID = oo.dialog;
		} catch (xx) {
			console.log(xx);
		}
	}

}
