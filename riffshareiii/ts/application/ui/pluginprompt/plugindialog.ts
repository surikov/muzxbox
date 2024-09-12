class PluginDialogPrompt {
	//dialogID: string = '?';
	//dialogData: string = '';
	dialogMessage: MZXBX_PluginMessage | null = null;
	waitCallback: (obj: any) => boolean;
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
	}
	openDialogFrame(label: string, url: string, initOrProject: any, callback: (obj: any) => boolean): void {
		this.waitCallback = callback;
		let pluginTitle = document.getElementById("pluginTitle") as any;
		pluginTitle.innerHTML = label;
		let pluginFrame = document.getElementById("pluginFrame") as any;
		//this.dialogID = '' + Math.random();
		//this.dialogData = data;
		this.dialogMessage = { dialogID: '' + Math.random(), data: initOrProject };
		let me = this;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				pluginFrame.onload = function () {
					//console.log('onload', me.waitForId);
					//pluginFrame.contentWindow.postMessage(me.waitForId, '*')
					me.sendMessageToPlugin();
				};
				pluginFrame.src = url;
				(document.getElementById("pluginDiv") as any).style.visibility = "visible";
			}
		}
	}
	sendMessageToPlugin() {
		console.log('sendMessageToPlugin', this.dialogMessage);
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			//let message: MZXBX_PluginMessage = { dialogID: this.dialogID, data: this.dialogData };
			//let txt = JSON.stringify(message);
			pluginFrame.contentWindow.postMessage(this.dialogMessage, '*');
		}
	}
	closeDialogFrame(): void {
		(document.getElementById("pluginDiv") as any).style.visibility = "hidden";
	}
	receiveMessageFromPlugin(e) {
		console.log('receiveMessage', e);
		let parsed: MZXBX_PluginMessage | null = null;
		try {
			parsed = JSON.parse(e.data)
		} catch (xxx) {
			console.log(xxx);
		}
		console.log('parsed', parsed);
		if (parsed) {
			if (this.dialogMessage) {
				if (parsed.dialogID == this.dialogMessage.dialogID) {
					//console.log('data', parsed.data);
					let close: boolean = this.waitCallback(parsed.data);
					if (close) {
						this.closeDialogFrame();
					}
				} else {
					console.log('wrong received message id', parsed.dialogID, this.dialogMessage.dialogID);
				}
			} else {
				console.log('wrong received object');
			}
		}
	}
}
