class PluginDialogPrompt {
	waitFor: string = '?';
	waitCall: (obj: any) => boolean;
	constructor() {
		window.addEventListener('message', this.receiveMessage.bind(this), false);
	}
	openDialogFrame(label: string, url: string, callback: (obj: any) => boolean): void {
		this.waitCall=callback;
		let pluginTitle = document.getElementById("pluginTitle") as any;
		pluginTitle.innerHTML = label;
		let pluginFrame = document.getElementById("pluginFrame") as any;
		this.waitFor = '' + Math.random();
		let me = this;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				pluginFrame.onload = function () {
					console.log('onload', me.waitFor);
					pluginFrame.contentWindow.postMessage(me.waitFor, '*')
				};
				pluginFrame.src = url;
				(document.getElementById("pluginDiv") as any).style.visibility = "visible";
			}
		}
	}
	closeDialogFrame(): void {
		(document.getElementById("pluginDiv") as any).style.visibility = "hidden";
	}
	receiveMessage(e) {
		//console.log('receiveMessage', e);
		let parsed: any = null;
		try {
			parsed = JSON.parse(e.data)
		} catch (xxx) {
			console.log(xxx);
		}
		console.log('parsed', parsed);
		if (parsed) {
			if (parsed.id == this.waitFor) {
				console.log('data', parsed.data);
				let close:boolean=this.waitCall(parsed.data);
				if(close){
					this.closeDialogFrame();
				}
			} else {
				console.log('wrong received message id', parsed.id, this.waitFor);
			}
		} else {
			console.log('wrong received object');
		}
	}
}
