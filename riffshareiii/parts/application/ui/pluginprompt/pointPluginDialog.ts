class PointPluginDialog {
	filter: Zvoog_FilterTarget;
	
	pluginRawData: string;
	dialogID: string = '?';
	waitPointPluginInit: boolean = false;
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
	}
	resetPointTitle() {
		let pluginTitle = document.getElementById("pluginPointTitle") as any;
		pluginTitle.innerHTML = '&nbsp;&nbsp;' + this.filter.title;
	}

	dropPoint() {
		//
	}
	openPointPluginDialogFrame(filter: Zvoog_FilterTarget, filterPlugin: MZXBX_PluginRegistrationInformation) {
		this.filter = filter;
		
		this.pluginRawData = filter.data;
		this.resetPointTitle();
		let pluginFrame = document.getElementById("pluginPointFrame") as any;
		let pluginDiv = document.getElementById("pluginPointDiv") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				this.waitPointPluginInit = true;
				pluginFrame.src = filterPlugin.ui;
				pluginDiv.style.visibility = "visible";
			}
		}
	}
	closePointDialogFrame(): void {
		let pluginDiv = document.getElementById("pluginPointDiv") as any;
		if (pluginDiv) {
			pluginDiv.style.visibility = "hidden";
		}
		let pluginFrame = document.getElementById("pluginPointFrame") as any;
		if (pluginFrame) {
			pluginFrame.src = "plugins/pluginplaceholder.html";
		}
	}
	sendNewIdToPlugin() {
		let pluginFrame = document.getElementById("pluginPointFrame") as any;
		if (pluginFrame) {
			this.dialogID = '' + Math.random();
			let message: MZXBX_MessageToPlugin = { hostData: this.dialogID };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	sendPointToPlugin() {
		let pluginFrame = document.getElementById("pluginPointFrame") as any;
		if (pluginFrame) {
			let message: MZXBX_MessageToPlugin = { hostData: this.pluginRawData };
			pluginFrame.contentWindow.postMessage(message, '*');
			//console.log('sendPointToPlugin', message);
		}
	}
	setPointValue() {
		//
	}
	receiveMessageFromPlugin(event) {
		//console.log('receiveMessageFromPlugin', event);
		if (!(event.data)) {
			//console.log('empty message data');
		} else {
			let message: MZXBX_MessageToHost = event.data;
			if (message.dialogID) {
				//console.log('receiveMessageFromPlugin', message);
				if (message.dialogID == this.dialogID) {
					this.pluginRawData = message.pluginData;
					this.setPointValue();
				} else {
					//console.log('wrong received message id', message.dialogID, this.dialogID);
				}
			} else {
				//console.log('init receiveMessageFromPlugin');
				if (this.waitPointPluginInit) {
					this.waitPointPluginInit = false;
					this.sendNewIdToPlugin();
					this.sendPointToPlugin();
				} else {
					//console.log('wrong received object');
				}
			}
		}
	}
}
