
class LocalExportPlugin {
	callbackID = '';
	parsedProject: Zvoog_Project | null = null;
	constructor() {
		//console.log('LocalExportPlugin create');
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		window.parent.postMessage('', '*');
	}
	receiveHostMessage(par) {
		//console.log('receiveHostMessage', par);
		//callbackID = par.data;
		/*try {
			//console.log('parse', par.data.data);
			this.parsedProject = JSON.parse(par.data.data);
			//console.log('result', oo);
			this.callbackID = par.data.dialogID;
			//console.log('dialogID', this.callbackID);
		} catch (xx) {
			console.log(xx);
		}*/
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.callbackID) {
			this.parsedProject = message.hostData;
		} else {
			this.callbackID = message.hostData;
		}
	}
	exportLocalfile(th) {
		//console.log('exportLocalfile', th);
		if (this.parsedProject) {
			this.download(JSON.stringify(this.parsedProject, null, '	'), 'export', 'application/json');
		}
	}
	download(data: string, filename: string, type: string) {

		let file = new Blob([data], { type: type });
		let a: HTMLAnchorElement = document.createElement("a");
		let url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();

	}
}
