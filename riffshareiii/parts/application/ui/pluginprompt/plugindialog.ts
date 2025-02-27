class PluginDialogPrompt {
	dialogID: string = '?';
	waitForPluginInit: boolean = false;
	waitTitleAction: null | ((newTitle: string) => void) = null;
	waitProjectCallback: null | ((newProject: Zvoog_Project) => void) = null;
	waitTimelinePointCallback: null | ((raw: any) => void) = null;
	rawData: any;
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
	}
	openActionPluginDialogFrame(label: string, url: string, callback: (obj: Zvoog_Project) => void): void {
		this.waitProjectCallback = callback;
		this.waitTimelinePointCallback = null;
		let pluginTitle = document.getElementById("pluginTitle") as any;
		pluginTitle.innerHTML = " " + label;
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				this.waitForPluginInit = true;
				pluginFrame.src = url;
				//(document.getElementById("pluginDeleteLabel") as any).innerHTML = "action";
				//(document.getElementById("pluginEditTitleButton") as any).style.display = "none";
				(document.getElementById("pluginBottom") as any).style.display = "none";
				(document.getElementById("pluginDiv") as any).style.visibility = "visible";
			}
		}
	}
	openPluginPointDialogFrame(label: string, url: string, raw: any, callback: (obj: any) => void
		, btnLabel: string, btnAction: () => void
		, titleAction: (newTitle: string) => void
	): void {
		this.waitTitleAction = titleAction;
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

				//(document.getElementById("pluginEditTitleButton") as any).style.display = "flex";
				/*(document.getElementById("pluginEditTitleButton") as any).onclick = () => {
					if (this.waitTitleAction) {
						let newTitle = prompt(label, label);
						if (newTitle == label) {
							//
						} else {
							if (newTitle != null) {
								this.waitTitleAction(newTitle);
							}
						}
					}
				};*/
				//(document.getElementById("pluginDeleteButton") as any).onclick = btnAction;
				//(document.getElementById("pluginDeleteLabel") as any).innerHTML = btnLabel;
				(document.getElementById("pluginBottom") as any).style.display = "flex";
				(document.getElementById("pluginDiv") as any).style.visibility = "visible";
			}
		}
	}

	sendNewIdToPlugin() {
		//console.log('sendNewIdToPlugin');
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			this.dialogID = '' + Math.random();
			let message: MZXBX_MessageToPlugin = { hostData: this.dialogID };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	sendCurrentProjectToPlugin() {
		//console.log('sendCurrentProjectToPlugin');
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			let message: MZXBX_MessageToPlugin = { hostData: globalCommandDispatcher.cfg().data };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	sendPointToPlugin() {
		//console.log('sendPointToPlugin');
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			let message: MZXBX_MessageToPlugin = { hostData: this.rawData };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	closeDialogFrame(): void {
		let pluginFrame = document.getElementById("pluginFrame") as any;
		if (pluginFrame) {
			pluginFrame.src = "plugins/pluginplaceholder.html";
		}
		(document.getElementById("pluginBottom") as any).style.display = "none";
		(document.getElementById("pluginDiv") as any).style.visibility = "hidden";
	}
	receiveMessageFromPlugin(event) {
		if (!(event.data)) {
			//console.log('empty message data');
		} else {
			let message: MZXBX_MessageToHost = event.data;
			if (message.dialogID) {
				//console.log('receiveMessageFromPlugin', message);
				if (message.dialogID == this.dialogID) {
					if (this.waitProjectCallback) {
						let me = this;
						//console.log('waitProjectCallback');
						globalCommandDispatcher.exe.commitProjectChanges([], () => {
							if (me.waitProjectCallback) {
								let newProj: Zvoog_Project = message.pluginData;
								//newProj.undo = globalCommandDispatcher.cfg().data.undo;
								me.waitProjectCallback(message.pluginData);
								if (message.done) {
									me.closeDialogFrame();
								}
							}
						});
					} else {
						//console.log('plugin point');
						if (this.waitTimelinePointCallback) {
							//console.log('waitTimelinePointCallback');
							this.waitTimelinePointCallback(message.pluginData);
						}
					}
					globalCommandDispatcher.reStartPlayIfPlay();
				} else {
					//console.log('wrong received message id', message.dialogID, this.dialogID);
				}
			} else {
				//console.log('init receiveMessageFromPlugin');
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
}
