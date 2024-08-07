class PluginDialogPrompt {
	dialogID: string = '?';
	waitCallback: (obj: any) => boolean;
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
	}
	openDialogFrame(label: string, url: string, data: string,callback: (obj: any) => boolean): void {
		this.waitCallback = callback;
		let pluginTitle = document.getElementById("pluginTitle") as any;
		pluginTitle.innerHTML = label;
		let pluginFrame = document.getElementById("pluginFrame") as any;
		this.dialogID = '' + Math.random();
		let me = this;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				pluginFrame.onload = function () {
					//console.log('onload', me.waitForId);
					//pluginFrame.contentWindow.postMessage(me.waitForId, '*')
					me.sendMessageToPlugin(data);
				};
				pluginFrame.src = url;
				(document.getElementById("pluginDiv") as any).style.visibility = "visible";
			}
		}
	}
	sendMessageToPlugin(data: string) {
		console.log('sendMessageToPlugin', this.dialogID);
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			let message: MZXBX_PluginMessage = { dialogID: this.dialogID, data: data };
			let txt = JSON.stringify(message);
			pluginFrame.contentWindow.postMessage(txt, '*');
		}
	}
	closeDialogFrame(): void {
		(document.getElementById("pluginDiv") as any).style.visibility = "hidden";
	}
	receiveMessageFromPlugin(e) {
		//console.log('receiveMessage', e);
		let parsed: MZXBX_PluginMessage |null=null;
		try {
			parsed = JSON.parse(e.data)
		} catch (xxx) {
			console.log(xxx);
		}
		console.log('parsed', parsed);
		if (parsed) {
			if (parsed.dialogID == this.dialogID) {
				//console.log('data', parsed.data);
				let close: boolean = this.waitCallback(parsed.data);
				if (close) {
					this.closeDialogFrame();
				}
			} else {
				console.log('wrong received message id', parsed.dialogID, this.dialogID);
			}
		} else {
			console.log('wrong received object');
		}
	}
}
