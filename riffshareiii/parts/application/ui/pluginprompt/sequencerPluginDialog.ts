class SequencerPluginDialog {
	track: Zvoog_MusicTrack;
	order: number;
	pluginRawData: string;
	dialogID: string = '?';
	waitSequencerPluginInit: boolean = false;
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
	}
	promptSequencerTitle() {
		let newTitle = prompt(this.track.title, this.track.title);
		if (newTitle == this.track.title) {
			//
		} else {
			if (newTitle != null) {
				globalCommandDispatcher.exe.commitProjectChanges(['tracks', this.order], () => {
					if (newTitle) {
						this.track.title = newTitle;
					};
				});
				this.resetSequencerTitle();
			}
		}
	}
	resetSequencerTitle() {
		let pluginTitle = document.getElementById("pluginSequencerTitle") as any;
		pluginTitle.innerHTML = '&nbsp;&nbsp;' + this.track.title;
	}
	resetStateButtons() {
		if (this.track.performer.state == 1) {//0 | 1 | 2;//on|mute|solo
			(document.getElementById("pluginSequencerSetPlay") as any).className = 'pluginDoButton';
			(document.getElementById("pluginSequencerSetPasstrough") as any).className = 'pluginNoneButton';
			(document.getElementById("pluginSequencerSetSolo") as any).className = 'pluginDoButton';
		} else {
			if (this.track.performer.state == 2) {
				(document.getElementById("pluginSequencerSetPlay") as any).className = 'pluginDoButton';
				(document.getElementById("pluginSequencerSetPasstrough") as any).className = 'pluginDoButton';
				(document.getElementById("pluginSequencerSetSolo") as any).className = 'pluginNoneButton';
			} else {
				(document.getElementById("pluginSequencerSetPlay") as any).className = 'pluginNoneButton';
				(document.getElementById("pluginSequencerSetPasstrough") as any).className = 'pluginDoButton';
				(document.getElementById("pluginSequencerSetSolo") as any).className = 'pluginDoButton';
			}
		}
	}
	setSequencerOn() {
		globalCommandDispatcher.exe.commitProjectChanges(['tracks', this.order], () => {
			this.track.performer.state = 0;
		});
		this.resetStateButtons();
		globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	setSequencerMute() {
		globalCommandDispatcher.exe.commitProjectChanges(['tracks', this.order], () => {
			this.track.performer.state = 1;
		});
		this.resetStateButtons();
		globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	setSequencerSolo() {
		globalCommandDispatcher.exe.commitProjectChanges(['tracks', this.order], () => {
			this.track.performer.state = 2;
		});
		this.resetStateButtons();
		globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	dropSequencer() {
		globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
			globalCommandDispatcher.cfg().data.tracks.splice(this.order, 1);
		});
		this.closeSequencerDialogFrame();
		globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	openEmptySequencerPluginDialogFrame(order: number, track: Zvoog_MusicTrack) {


		this.track = track;
		this.order = order;

		this.resetSequencerTitle();
		let pluginFrame = document.getElementById("pluginSequencerFrame") as HTMLIFrameElement;
		let pluginDiv = document.getElementById("pluginSequencerDiv") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				//pluginFrame.src = 'pluginplaceholder.html';
				pluginFrame.contentWindow.window.location.replace("plugins/pluginplaceholder.html");
				pluginDiv.style.visibility = "visible";
				this.resetStateButtons();
			}
		}
	}
	openSequencerPluginDialogFrame(farNo: number, trackNo: number, track: Zvoog_MusicTrack, trackPlugin: null | MZXBX_PluginRegistrationInformation) {
		//console.log('openSequencerPluginDialogFrame far', farNo, 'track', trackNo, track.title);
		//console.log(globalCommandDispatcher.cfg().data.farorder);
		//for (let kk = 0; kk < globalCommandDispatcher.cfg().data.tracks.length; kk++) {
		//	console.log(kk, globalCommandDispatcher.cfg().data.tracks[kk].title);
		//}
		if (farNo) {
			globalCommandDispatcher.exe.commitProjectChanges(['farorder'], () => {
				let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
				let nn = farorder.splice(farNo, 1)[0];
				farorder.splice(0, 0, nn);
				globalCommandDispatcher.cfg().data.farorder = farorder;
				//console.log(globalCommandDispatcher.cfg().data.farorder);
			});
		}
		this.track = track;
		this.order = trackNo;
		this.pluginRawData = track.performer.data;
		this.resetSequencerTitle();
		let pluginFrame = document.getElementById("pluginSequencerFrame") as HTMLIFrameElement;
		let pluginDiv = document.getElementById("pluginSequencerDiv") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				this.waitSequencerPluginInit = true;
				if (trackPlugin) {
					//pluginFrame.src = trackPlugin.ui;
					pluginFrame.contentWindow.window.location.replace(trackPlugin.ui);
				}
				pluginDiv.style.visibility = "visible";
				this.resetStateButtons();
			}
		}
	}
	closeSequencerDialogFrame(): void {
		let pluginDiv = document.getElementById("pluginSequencerDiv") as any;
		if (pluginDiv) {
			pluginDiv.style.visibility = "hidden";
		}
		let pluginFrame = document.getElementById("pluginSequencerFrame") as HTMLIFrameElement;
		if (pluginFrame.contentWindow) {
			//pluginFrame.src = "plugins/pluginplaceholder.html";
			pluginFrame.contentWindow.window.location.replace("plugins/pluginplaceholder.html");
		}
	}
	sendNewIdToPlugin() {
		let pluginFrame = document.getElementById("pluginSequencerFrame") as any;
		if (pluginFrame) {
			this.dialogID = '' + Math.random();
			let message: MZXBX_MessageToPlugin = { hostData: this.dialogID, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	sendPointToPlugin() {
		let pluginFrame = document.getElementById('pluginSequencerFrame') as any;
		if (pluginFrame) {
			let message: MZXBX_MessageToPlugin = { hostData: this.pluginRawData, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
			pluginFrame.contentWindow.postMessage(message, '*');
			//console.log('sendPointToPlugin', message);
		}
	}
	setSequencerValue() {
		globalCommandDispatcher.exe.commitProjectChanges(['tracks', this.order], () => {
			this.track.performer.data = this.pluginRawData;
		});
		globalCommandDispatcher.reStartPlayIfPlay();
	}
	receiveMessageFromPlugin(event) {
		//console.log('sequencer receiveMessageFromPlugin', event);
		if (!(event.data)) {
			//console.log('empty message data');
		} else {
			let message: MZXBX_MessageToHost = event.data;
			if (message.dialogID) {
				//console.log('receiveMessageFromPlugin', message);
				if (message.dialogID == this.dialogID) {
					this.pluginRawData = message.pluginData;
					this.setSequencerValue();
				} else {
					//console.log('wrong received message id', message.dialogID, this.dialogID);
				}
			} else {
				//console.log('init receiveMessageFromPlugin');
				if (this.waitSequencerPluginInit) {
					this.waitSequencerPluginInit = false;
					this.sendNewIdToPlugin();
					this.sendPointToPlugin();
				} else {
					//console.log('wrong received object');
				}
			}
		}
	}
}
