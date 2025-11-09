class SamplerPluginDialog {
	drum: Zvoog_PercussionTrack;
	order: number;
	pluginRawData: string;
	dialogID: string = '?';
	waitSamplerPluginInit: boolean = false;
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
	}
	promptDrumTitle() {
		let newTitle = prompt(this.drum.title, this.drum.title);
		if (newTitle == this.drum.title) {
			//
		} else {
			if (newTitle != null) {
				globalCommandDispatcher.exe.commitProjectChanges(['percussions', this.order], () => {
					if (newTitle) {
						this.drum.title = newTitle;
					};
				});
				this.resetDrumTitle();
			}
		}
	}
	resetDrumTitle() {
		let pluginTitle = document.getElementById("pluginSamplerTitle") as any;
		pluginTitle.innerHTML = '&nbsp;&nbsp;' + this.drum.title;
	}
	resetStateButtons() {
		if (this.drum.sampler.state == 1) {//0 | 1 | 2;//on|mute|solo
			(document.getElementById("pluginSamplerSetPlay") as any).className = 'pluginDoButton';
			(document.getElementById("pluginSamplerSetPasstrough") as any).className = 'pluginNoneButton';
			(document.getElementById("pluginSamplerSetSolo") as any).className = 'pluginDoButton';
		} else {
			if (this.drum.sampler.state == 2) {
				(document.getElementById("pluginSamplerSetPlay") as any).className = 'pluginDoButton';
				(document.getElementById("pluginSamplerSetPasstrough") as any).className = 'pluginDoButton';
				(document.getElementById("pluginSamplerSetSolo") as any).className = 'pluginNoneButton';
			} else {
				(document.getElementById("pluginSamplerSetPlay") as any).className = 'pluginNoneButton';
				(document.getElementById("pluginSamplerSetPasstrough") as any).className = 'pluginDoButton';
				(document.getElementById("pluginSamplerSetSolo") as any).className = 'pluginDoButton';
			}
		}
	}
	setDrumOn() {
		globalCommandDispatcher.exe.commitProjectChanges(['percussions', this.order], () => {
			this.drum.sampler.state = 0;
		});
		this.resetStateButtons();
		globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	setDrumMute() {
		globalCommandDispatcher.exe.commitProjectChanges(['percussions', this.order], () => {
			this.drum.sampler.state = 1;
		});
		this.resetStateButtons();
		globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	setDrumSolo() {
		globalCommandDispatcher.exe.commitProjectChanges(['percussions', this.order], () => {
			this.drum.sampler.state = 2;
		});
		this.resetStateButtons();
		globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	dropDrum() {
		globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
			globalCommandDispatcher.cfg().data.percussions.splice(this.order, 1);
		});
		this.closeDrumDialogFrame();
		globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	openEmptyDrumPluginDialogFrame(order: number, drum: Zvoog_PercussionTrack) {
		this.drum = drum;
		this.order = order;
		this.resetDrumTitle();
		let pluginFrame = document.getElementById("pluginSamplerFrame") as any;
		let pluginDiv = document.getElementById("pluginSamplerDiv") as any;
		pluginFrame.src = 'pluginplaceholder.html';
		pluginDiv.style.visibility = "visible";
		this.resetStateButtons();
	}
	openDrumPluginDialogFrame(order: number, drum: Zvoog_PercussionTrack, fplugin: null | MZXBX_PluginRegistrationInformation) {
		//console.log('openDrumPluginDialogFrame',order, drum, fplugin);
		this.drum = drum;
		this.order = order;
		this.pluginRawData = drum.sampler.data;
		this.resetDrumTitle();
		let pluginFrame = document.getElementById("pluginSamplerFrame") as any;
		let pluginDiv = document.getElementById("pluginSamplerDiv") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				this.waitSamplerPluginInit = true;
				if (fplugin) {
					pluginFrame.src = fplugin.ui;
				}
				pluginDiv.style.visibility = "visible";
				this.resetStateButtons();
			}
		}
	}
	closeDrumDialogFrame(): void {
		let pluginDiv = document.getElementById("pluginSamplerDiv") as any;
		if (pluginDiv) {
			pluginDiv.style.visibility = "hidden";
		}
		let pluginFrame = document.getElementById("pluginSamplerFrame") as any;
		if (pluginFrame) {
			pluginFrame.src = "plugins/pluginplaceholder.html";
		}
	}
	sendNewIdToPlugin() {
		let pluginFrame = document.getElementById("pluginSamplerFrame") as any;
		if (pluginFrame) {
			this.dialogID = '' + Math.random();
			let message: MZXBX_MessageToPlugin = { hostData: this.dialogID, colors: globalCommandDispatcher.readThemeColors(), screenData: null };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	sendPointToPlugin() {
		let pluginFrame = document.getElementById("pluginSamplerFrame") as any;
		if (pluginFrame) {
			let message: MZXBX_MessageToPlugin = { hostData: this.pluginRawData, colors: globalCommandDispatcher.readThemeColors(), screenData: null };
			pluginFrame.contentWindow.postMessage(message, '*');
			//console.log('sendPointToPlugin', message);
		}
	}
	setFilterValue() {
		globalCommandDispatcher.exe.commitProjectChanges(['percussions', this.order], () => {
			this.drum.sampler.data = this.pluginRawData;
		});
		globalCommandDispatcher.reStartPlayIfPlay();
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
					this.setFilterValue();
				} else {
					//console.log('wrong received message id', message.dialogID, this.dialogID);
				}
			} else {
				//console.log('init receiveMessageFromPlugin');
				if (this.waitSamplerPluginInit) {
					this.waitSamplerPluginInit = false;
					this.sendNewIdToPlugin();
					this.sendPointToPlugin();
				} else {
					//console.log('wrong received object');
				}
			}
		}
	}
}
