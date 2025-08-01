console.log('Minium Import *.mid v1.0.1');
class MINIUMIDIIImportMusicPlugin {
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
	sendImportedMIDIData() {
		console.log('sendImportedMIDIData', this.parsedProject);
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

	loadMIDIfile(inputFile) {
		//console.log('loadMIDIfile', inputFile.files);
		var file = inputFile.files[0];
		var fileReader = new FileReader();
		let me = this;
		fileReader.onload = function (progressEvent: any) {
			if (progressEvent != null) {
				let title: string = file.name;
				let dat = '' + file.lastModifiedDate;
				try {
					let last: Date = file.lastModifiedDate;
					dat = '' + last.getFullYear();
					if (last.getMonth() < 10) {
						dat = dat + '-' + last.getMonth();
					} else {
						dat = dat + '-0' + last.getMonth();
					}
					if (last.getDate() < 10) {
						dat = dat + '-' + last.getDate();
					} else {
						dat = dat + '-0' + last.getDate();
					}
				} catch (xx) {
					console.log(xx);
				}
				let comment: string = ', ' + file.size / 1000 + 'kb, ' + dat;
				var arrayBuffer :ArrayBuffer= progressEvent.target.result as ArrayBuffer;
/*
				var midiParser = newMIDIparser2(arrayBuffer);
				console.log('done midiParser', midiParser);
				dumpStat(midiParser);
				//me.parsedProject = midiParser.convertProject(title, comment);
				let cnvrtr: MIDIConverter = new MIDIConverter();

				let midiSongData: MIDISongData = cnvrtr.convertProject(midiParser);
				console.log('done midiSongData', midiSongData);
				let proj = new Projectr();
				me.parsedProject = proj.readProject(midiSongData, title, comment);
				*/
				let proj = new Projectr();
				me.parsedProject = proj.parseRawMIDIdata(arrayBuffer, title, comment);
				console.log('done zproject', me.parsedProject);
				//me.parsedProject = cnvrtr.convertProject(midiParser, title, comment);
			}
		};
		fileReader.readAsArrayBuffer(file);
	}

	receiveHostMessage(par) {
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.callbackID) {
			//
		} else {
			this.callbackID = message.hostData;
		}
	}

}

function newMIDIparser2(arrayBuffer: ArrayBuffer) {
	return new MidiParser(arrayBuffer);
}
