console.log('MINIUMselectionEditPlugin v1.0.1');
class MINIUMselectionEditPlugin {
	callbackID = '';
	currentProject: Zvoog_Project;
	startMeasure = 0;
	endMeasure = 0;
	constructor() {
		this.init();
	}
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		window.parent.postMessage({
			dialogID: ''
			, pluginData: ''
			, done: false
		}, '*');
	}
	sendImportedMIDIData() {
		/*console.log('sendImportedMIDIData', this.parsedProject);
		if (this.parsedProject) {
			var oo: MZXBX_MessageToHost = {
				dialogID: this.callbackID
				, pluginData: this.parsedProject
				, done: true
			};
			window.parent.postMessage(oo, '*');
		} else {
			alert('No parsed data');
		}*/
	}
	refreshInfo() {
		let selectionInfo = document.getElementById('selectionInfo');
		if (selectionInfo) {
			selectionInfo.innerHTML = '' + (this.startMeasure + 1) + ' - ' + (this.endMeasure + 1);
		}
	}


	receiveHostMessage(par) {
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.callbackID) {
			this.currentProject = par.data.hostData;
			if (this.currentProject) {
				this.startMeasure = this.currentProject.selectedPart.startMeasure;
				this.endMeasure = this.currentProject.selectedPart.endMeasure;
			}
			if (this.startMeasure < 0) {
				this.startMeasure = 0;
				this.endMeasure = this.currentProject.timeline.length - 1;
			}
			this.refreshInfo();
		} else {
			this.callbackID = message.hostData;
		}
		console.log(par);
	}
	deleteBars() {
		console.log('deleteBars');
	}
	addBars() {
		console.log('addBars');
		let count = this.endMeasure - this.startMeasure;
		if (count < 1) { count = 1 };

	}
	promptTempo() {
		console.log('promptTempo');
	}
	promptMetre() {
		console.log('promptMetre');
	}
	shiftContent() {
		console.log('shiftContent');
	}
}


