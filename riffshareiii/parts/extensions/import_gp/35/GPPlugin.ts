
class GP345ImportMusicPlugin {
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
	sendParsedGP345Data() {

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
	loadGP345file(from) {
		console.log('loadGP345file', from.files);
		let me = this;
		var file = from.files[0];
		var fileReader = new FileReader();
		let title: string = file.name;
		let ext: string | undefined = ('' + file.name).split('.').pop();
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
		fileReader.onload = function (progressEvent: any) {
			if (progressEvent != null) {
				var arrayBuffer = progressEvent.target.result;

				var pp = newGPparser(arrayBuffer, '' + ext);
				try {
					let result: Zvoog_Project = pp.convertProject(title, comment);
					//me.registerWorkProject(result);
					//me.resetProject();
					me.parsedProject = result;
				} catch (xxx) {
					console.log(xxx);
				}
			}
		};
		fileReader.readAsArrayBuffer(file);
	}
	/*
		callbackID = '';
		parsedProject: Zvoog_Project | null = null;
		constructor() {
			window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		}
		receiveHostMessage(par) {
			//console.log('receiveHostMessage', par);
			//callbackID = par.data;
			try {
				var oo:MZXBX_PluginMessage = JSON.parse(par.data);
				this.callbackID = oo.dialogID;
			} catch (xx) {
				console.log(xx);
			}
		}
		loadGP345file(from) {
			console.log('loadGP345file', from.files);
			let me = this;
			var file = from.files[0];
			var fileReader = new FileReader();
			let title: string = file.name;
			let ext: string | undefined = ('' + file.name).split('.').pop();
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
			fileReader.onload = function (progressEvent: any) {
				if (progressEvent != null) {
					var arrayBuffer = progressEvent.target.result;
	
					var pp = newGPparser(arrayBuffer, '' + ext);
					try {
						let result: Zvoog_Project = pp.convertProject(title, comment);
						//me.registerWorkProject(result);
						//me.resetProject();
						me.parsedProject = result;
					} catch (xxx) {
						console.log(xxx);
					}
				}
			};
			fileReader.readAsArrayBuffer(file);
		}
		sendParsedGP345Data() {
			console.log('sendParsedGP345Data');
			if (this.parsedProject) {
				var oo:MZXBX_PluginMessage = {
					dialogID: this.callbackID,
					data: JSON.stringify(this.parsedProject)
				};
				window.parent.postMessage(JSON.stringify(oo), '*');
			} else {
				alert('No parsed data');
			}
		}*/
}
