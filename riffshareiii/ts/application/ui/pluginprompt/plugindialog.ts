class PluginDialogPrompt {
	dialogID: string = '?';
	waitForPluginInit: boolean = false;
	waitProjectCallback: null | ((newProject: Zvoog_Project) => void) = null;
	waitTimelinePointCallback: null | ((raw: any) => void) = null;
	rawData: any;
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
	}
	openActionDialogFrame(label: string, url: string, callback: (obj: Zvoog_Project) => void): void {
		this.waitProjectCallback = callback;
		this.waitTimelinePointCallback = null;
		let pluginTitle = document.getElementById("pluginTitle") as any;
		pluginTitle.innerHTML = label;
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				this.waitForPluginInit = true;
				pluginFrame.src = url;
				(document.getElementById("pluginDiv") as any).style.visibility = "visible";
			}
		}
	}
	openPointDialogFrame(label: string, url: string, raw: any, callback: (obj: any) => void): void {
		this.waitProjectCallback = null;
		this.waitTimelinePointCallback = callback;
		this.rawData = raw;
		let pluginTitle = document.getElementById("pluginTitle") as any;
		pluginTitle.innerHTML = label;
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				this.waitForPluginInit = true;
				pluginFrame.src = url;
				(document.getElementById("pluginDiv") as any).style.visibility = "visible";
			}
		}
	}
	sendNewIdToPlugin() {
		console.log('sendNewIdToPlugin');
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			this.dialogID = '' + Math.random();
			let message: MZXBX_MessageToPlugin = { hostData: this.dialogID };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	sendCurrentProjectToPlugin() {
		console.log('sendCurrentProjectToPlugin');
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			let message: MZXBX_MessageToPlugin = { hostData: globalCommandDispatcher.cfg().data };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	sendPointToPlugin() {
		console.log('sendCurrentProjectToPlugin');
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			let message: MZXBX_MessageToPlugin = { hostData: this.rawData };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	closeDialogFrame(): void {
		(document.getElementById("pluginDiv") as any).style.visibility = "hidden";
	}
	receiveMessageFromPlugin(e) {
		console.log('receiveMessage', e);
		
		if (e.data) {
			let message: MZXBX_MessageToHost = JSON.parse(e.data);
			if (message.dialogID == this.dialogID) {
				if (this.waitProjectCallback) {
					this.waitProjectCallback(message.pluginData);
				} else {
					if (this.waitTimelinePointCallback) {
						this.waitTimelinePointCallback(message.pluginData);
					}
				}
			} else {
				console.log('wrong received message id', message.dialogID, this.dialogID);
			}
		} else {
			if (this.waitForPluginInit) {
				this.waitForPluginInit = false;
				this.sendNewIdToPlugin();
				if (this.waitProjectCallback) {
					this.sendCurrentProjectToPlugin();
				} else {
					if (this.waitTimelinePointCallback) {
						this.sendPointToPlugin();
					}
				}
			} else {
				console.log('wrong received object');
			}
		}
	}
}
