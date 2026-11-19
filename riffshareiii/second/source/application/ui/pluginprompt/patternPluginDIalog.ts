class PatternPluginDialog {
	patternTrack: Zvoog_PatternTrack;
	order: number;
	pluginRawData: string;
	dialogID: string = '?';
	waitSamplerPluginInit: boolean = false;
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPatternPlugin.bind(this), false);
	}
	promptPatternTitle() {
		let newTitle = prompt(this.patternTrack.title, this.patternTrack.title);
		if (newTitle == this.patternTrack.title) {
			//
		} else {
			if (newTitle != null) {
				globalCommandDispatcher.exe.commitProjectChanges(['patterns', this.order], () => {
					if (newTitle) {
						this.patternTrack.title = newTitle;
					};
				});
				this.resetPatternTitle();
			}
		}
	}
	resetPatternTitle() {
		let pluginTitle = document.getElementById("pluginPatternTitle") as any;
		pluginTitle.innerHTML = '&nbsp;&nbsp;' + this.patternTrack.title;
	}
	resetStateButtons() {
		if (this.patternTrack.arpeggiator.state == 1) {//0 | 1 | 2;//on|mute|solo
			(document.getElementById("pluginPatternSetPlay") as any).className = 'pluginDoButton';
			(document.getElementById("pluginPatternSetPasstrough") as any).className = 'pluginNoneButton';
			(document.getElementById("pluginPatternSetSolo") as any).className = 'pluginDoButton';
		} else {
			if (this.patternTrack.arpeggiator.state == 2) {
				(document.getElementById("pluginPatternSetPlay") as any).className = 'pluginDoButton';
				(document.getElementById("pluginPatternSetPasstrough") as any).className = 'pluginDoButton';
				(document.getElementById("pluginPatternSetSolo") as any).className = 'pluginNoneButton';
			} else {
				(document.getElementById("pluginPatternSetPlay") as any).className = 'pluginNoneButton';
				(document.getElementById("pluginPatternSetPasstrough") as any).className = 'pluginDoButton';
				(document.getElementById("pluginPatternSetSolo") as any).className = 'pluginDoButton';
			}
		}
	}
	setPatternOn() {
		globalCommandDispatcher.exe.commitProjectChanges(['patterns', this.order], () => {
			this.patternTrack.arpeggiator.state = 0;
		});
		this.resetStateButtons();
		//globalCommandDispatcher.reConnectPluginsIfPlay();
		globalCommandDispatcher.reStartPlayIfPlay();//false);*/
	}
	setPatternMute() {
		globalCommandDispatcher.exe.commitProjectChanges(['patterns', this.order], () => {
			this.patternTrack.arpeggiator.state = 1;
		});
		this.resetStateButtons();
		//globalCommandDispatcher.reConnectPluginsIfPlay();
		globalCommandDispatcher.reStartPlayIfPlay();//false);
	}
	setPatternSolo() {
		globalCommandDispatcher.exe.commitProjectChanges(['patterns', this.order], () => {
			this.patternTrack.arpeggiator.state = 2;
		});
		this.resetStateButtons();
		//globalCommandDispatcher.reConnectPluginsIfPlay();
		globalCommandDispatcher.reStartPlayIfPlay();//false);
	}
	dropPattern() {
		globalCommandDispatcher.exe.commitProjectChanges(['patterns'], () => {
			globalCommandDispatcher.cfg().data.patterns.splice(this.order, 1);
		});
		this.closePatternDialogFrame();
		//globalCommandDispatcher.reConnectPluginsIfPlay();
		globalCommandDispatcher.reStartPlayIfPlay();//false);
	}
	//openEmptyDrumPluginDialogFrame(order: number, drum: Zvoog_PercussionTrack) {
		/*this.drum = drum;
		this.order = order;
		this.resetDrumTitle();
		let pluginFrame = document.getElementById("pluginSamplerFrame") as HTMLIFrameElement;
		let pluginDiv = document.getElementById("pluginSamplerDiv") as any;
		//pluginFrame.src = 'pluginplaceholder.html';
		if (pluginFrame.contentWindow) {
			pluginFrame.contentWindow.window.location.replace("plugins/pluginplaceholder.html");
		}
		pluginDiv.style.visibility = "visible";
		this.resetStateButtons();*/
	//}
	openPatternPluginDialogFrame(order: number, patt: Zvoog_PatternTrack, fplugin: null | MZXBX_PluginRegistrationInformation) {
		//console.log('openDrumPluginDialogFrame',order, drum, fplugin);
		this.patternTrack = patt;
		this.order = order;
		this.pluginRawData = patt.arpeggiator.data;
		this.resetPatternTitle();
		let pluginFrame = document.getElementById("pluginPatternFrame") as HTMLIFrameElement;
		let pluginDiv = document.getElementById("pluginPatternDiv") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				this.waitSamplerPluginInit = true;
				if (fplugin) {
					//pluginFrame.src = fplugin.ui;
					pluginFrame.contentWindow.window.location.replace(fplugin.ui);
				}
				pluginDiv.style.visibility = "visible";
				this.resetStateButtons();
			}
		}
	}
    closePatternDialogFrame(): void {
		let pluginDiv = document.getElementById("pluginPatternDiv") as any;
		if (pluginDiv) {
			pluginDiv.style.visibility = "hidden";
		}
		let pluginFrame = document.getElementById("pluginPatternFrame") as any;
		if (pluginFrame) {
			pluginFrame.src = "plugins/pluginplaceholder.html";
		}
	}
	/*closeDrumDialogFrame(): void {
		let pluginDiv = document.getElementById("pluginSamplerDiv") as any;
		if (pluginDiv) {
			pluginDiv.style.visibility = "hidden";
		}
		let pluginFrame = document.getElementById("pluginSamplerFrame") as any;
		if (pluginFrame) {
			pluginFrame.src = "plugins/pluginplaceholder.html";
		}
	}*/
	sendNewIdToPlugin() {
		let pluginFrame = document.getElementById("pluginPatternFrame") as any;
		if (pluginFrame) {
			this.dialogID = '' + Math.random();
			let message: MZXBX_MessageToPlugin = { hostData: this.dialogID, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	sendPointToPlugin() {
		let pluginFrame = document.getElementById("pluginPatternFrame") as any;
		if (pluginFrame) {
			let message: MZXBX_MessageToPlugin = { hostData: this.pluginRawData, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
			pluginFrame.contentWindow.postMessage(message, '*');
			//console.log('sendPointToPlugin', message);
		}
	}
	setPatternValue() {
		globalCommandDispatcher.exe.commitProjectChanges(['patterns', this.order], () => {
			this.patternTrack.arpeggiator.data = this.pluginRawData;
		});
		globalCommandDispatcher.reStartPlayIfPlay();//false);
        
	}
	receiveMessageFromPatternPlugin(event) {
		//console.log('receiveMessageFromPlugin', event);
		if (!(event.data)) {
			//console.log('empty message data');
		} else {
			let message: MZXBX_MessageToHost = event.data;
			if (message.dialogID) {
				//console.log('receiveMessageFromPlugin', message);
				if (message.dialogID == this.dialogID) {
					this.pluginRawData = message.pluginData;
					this.setPatternValue();
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
