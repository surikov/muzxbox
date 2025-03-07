class PluginDialogPrompt {
	dialogID: string = '?';
	waitForPluginInit: boolean = false;
	waitTitleAction: null | (() => void) = null;
	waitProjectCallback: null | ((newProject: Zvoog_Project) => void) = null;
	waitTimelinePointCallback: null | ((raw: any) => void) = null;
	pluginMode: '' | 'action' | 'filter' | 'sequencer' | 'sampler' = '';
	rawData: any;
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
	}
	openActionPluginDialogFrame(actionPlugin: MZXBX_PluginRegistrationInformation) {//label: string, url: string, callback: (obj: Zvoog_Project) => void): void {
		this.pluginMode = 'action';
		this.waitTitleAction = null;
		this.waitProjectCallback = (obj: any) => {
			let project: Zvoog_Project = obj;
			globalCommandDispatcher.registerWorkProject(project);
			globalCommandDispatcher.resetProject();
		};
		this.waitTimelinePointCallback = null;
		let pluginTitle = document.getElementById("pluginActionTitle") as any;
		pluginTitle.innerHTML = " " + actionPlugin.label;
		let pluginFrame = document.getElementById("pluginActionFrame") as any;
		let pluginDiv = document.getElementById("pluginActionDiv") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				this.waitForPluginInit = true;
				pluginFrame.src = actionPlugin.ui;
				pluginDiv.style.visibility = "visible";
			}
		}
	}
	openFilterPluginDialogFrame(order: number, raw: string, filter: Zvoog_FilterTarget, filterPlugin: MZXBX_PluginRegistrationInformation) {//label: string, url: string, raw: any, callback: (obj: any) => void, titleAction: (newTitle: string) => void): void {
		this.pluginMode = 'filter';
		//this.waitTitleAction = titleAction;
		this.waitProjectCallback = null;
		this.waitTimelinePointCallback = (raw: any) => {
			globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
				filter.data = raw;
			});
		};
		this.waitTitleAction = () => {
			let newTitle = prompt(filter.title, filter.title);
			if (newTitle == filter.title) {
				//
			} else {
				if (newTitle != null) {
					globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
						if (newTitle) {
							filter.title = newTitle;
						};
						let pluginTitle = document.getElementById("pluginFilterTitle") as any;
						pluginTitle.innerHTML = '&nbsp;&nbsp;' + filter.title;
					});
				}
			}
		};
		this.rawData = raw;
		let pluginTitle = document.getElementById("pluginFilterTitle") as any;
		pluginTitle.innerHTML = '&nbsp;&nbsp;' + filter.title;
		let pluginFrame = document.getElementById("pluginFilterFrame") as any;
		let pluginDiv = document.getElementById("pluginFilterDiv") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				this.waitForPluginInit = true;
				//console.log(filter.);
				pluginFrame.src = filterPlugin.ui;
				if (filter.state == 1/* off */) {
					(document.getElementById("pluginFilterSetFilter") as any).className = 'pluginDoButton';
					(document.getElementById("pluginFilterSetPasstrough") as any).className = 'pluginNoneButton';
				} else {
					(document.getElementById("pluginFilterSetFilter") as any).className = 'pluginNoneButton';
					(document.getElementById("pluginFilterSetPasstrough") as any).className = 'pluginDoButton';
				}
				/*
				let pmode = 'filter2';
				if (pmode == 'filter') {
					(document.getElementById("pluginSetFilter") as any).style.display = "visible";
					(document.getElementById("pluginSetPlay") as any).style.display = "none";
					(document.getElementById("pluginSetPasstrough") as any).style.display = "visible";
					(document.getElementById("pluginSetSolo") as any).style.display = "none";
				} else {
					(document.getElementById("pluginSetFilter") as any).style.display = "none";
					(document.getElementById("pluginSetPlay") as any).style.display = "visible";
					(document.getElementById("pluginSetPasstrough") as any).style.display = "visible";
					(document.getElementById("pluginSetSolo") as any).style.display = "visible";
				}
				(document.getElementById("pluginBottom") as any).style.display = "flex";
				(document.getElementById("pluginDiv") as any).style.visibility = "visible";
				*/
				pluginDiv.style.visibility = "visible";
			}
		}
	}

	promptPluginDialogTitle() {
		if (this.waitTitleAction) {
			this.waitTitleAction();
		}
	}

	sendNewIdToPlugin() {
		//console.log('sendNewIdToPlugin');
		//let pluginFrame = document.getElementById("pluginFrame") as any;
		let pluginFrame;
		if (this.pluginMode == 'action') {
			pluginFrame = document.getElementById("pluginActionFrame") as any;
		} else {
			if (this.pluginMode == 'filter') {
				pluginFrame = document.getElementById("pluginFilterFrame") as any;
			}
		}
		if (pluginFrame) {
			this.dialogID = '' + Math.random();
			let message: MZXBX_MessageToPlugin = { hostData: this.dialogID };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	sendCurrentProjectToActionPlugin() {
		//console.log('sendCurrentProjectToPlugin');
		let pluginFrame = document.getElementById("pluginActionFrame") as any;
		if (pluginFrame) {
			let message: MZXBX_MessageToPlugin = { hostData: globalCommandDispatcher.cfg().data };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	sendPointToPlugin() {
		//console.log('sendPointToPlugin');
		//let pluginFrame = document.getElementById("pluginFrame") as any;
		let pluginFrame;
		if (this.pluginMode == 'action') {
			pluginFrame = document.getElementById("pluginActionFrame") as any;
		} else {
			if (this.pluginMode == 'filter') {
				pluginFrame = document.getElementById("pluginFilterFrame") as any;
			}
		}
		if (pluginFrame) {
			let message: MZXBX_MessageToPlugin = { hostData: this.rawData };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	closeDialogFrame(): void {
		let pluginFrame;
		let pluginDiv;
		if (this.pluginMode == 'action') {
			pluginFrame = document.getElementById("pluginActionFrame") as any;
			pluginDiv = document.getElementById("pluginActionDiv") as any;
		} else {
			if (this.pluginMode == 'filter') {
				pluginFrame = document.getElementById("pluginFilterFrame") as any;
				pluginDiv = document.getElementById("pluginFilterDiv") as any;
			}
		}
		if (pluginDiv) {
			pluginDiv.style.visibility = "hidden";
		}
		if (pluginFrame) {
			pluginFrame.src = "plugins/pluginplaceholder.html";
		}
	}
	receiveMessageFromPlugin(event) {
		console.log('receiveMessageFromPlugin', event);
		if (!(event.data)) {
			console.log('empty message data');
		} else {
			let message: MZXBX_MessageToHost = event.data;
			if (message.dialogID) {
				console.log('receiveMessageFromPlugin', message);
				if (message.dialogID == this.dialogID) {
					if (this.waitProjectCallback) {
						let me = this;
						console.log('waitProjectCallback');
						globalCommandDispatcher.exe.commitProjectChanges([], () => {
							if (me.waitProjectCallback) {
								//let newProj: Zvoog_Project = message.pluginData;
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
							console.log('waitTimelinePointCallback');
							this.waitTimelinePointCallback(message.pluginData);
						}
					}
					globalCommandDispatcher.reStartPlayIfPlay();
				} else {
					console.log('wrong received message id', message.dialogID, this.dialogID);
				}
			} else {
				console.log('init receiveMessageFromPlugin');
				if (this.waitForPluginInit) {
					this.waitForPluginInit = false;
					this.sendNewIdToPlugin();
					if (this.waitProjectCallback) {
						this.sendCurrentProjectToActionPlugin();
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
