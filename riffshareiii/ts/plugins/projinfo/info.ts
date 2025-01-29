class ActionPluginStatistics {
	callbackID = '';
	parsedProject: Zvoog_Project | null = null;
	constructor() {
		this.init();
	}
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
	}
	sendChangedData() {
		//console.log('sendChangedData');
		if (this.parsedProject) {
			let input = document.getElementById('project_title') as any;
			if (input) {
				this.parsedProject.title = input.value;
			}
			var oo: MZXBX_PluginMessage = {
				dialogID: this.callbackID
				, data: JSON.stringify(this.parsedProject)
			};
			window.parent.postMessage(JSON.stringify(oo), '*');
		} else {
			alert('No parsed data');
		}
	}



	receiveHostMessage(par: any) {
		//console.log('receiveHostMessage', par);
		//callbackID = par.data;
		try {
			var oo: MZXBX_PluginMessage = JSON.parse(par.data);
			this.callbackID = oo.dialogID;
			this.parsedProject = JSON.parse(oo.data);


		} catch (xx) {
			console.log(xx);
		}
		let input = document.getElementById('project_title') as any;
		if (input) {
			if (this.parsedProject) {
				input.value = this.parsedProject.title;
			}
		}
	}

}




function newActionPluginStatistics() {
	return new ActionPluginStatistics();
}
