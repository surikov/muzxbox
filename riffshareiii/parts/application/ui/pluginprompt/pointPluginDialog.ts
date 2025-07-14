class PointPluginDialog {
	filter: Zvoog_FilterTarget;
	barIdx: number;
	filterIdx: number;
	pointIdx: number;
	pluginPoint: Zvoog_FilterStateChange;
	startEnd: BarStepStartEnd
	dialogID: string = '?';
	waitPointPluginInit: boolean = false;
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
	}
	resetPointTitle() {
		let pluginTitle = document.getElementById("pluginPointTitle") as any;
		pluginTitle.innerHTML = '&nbsp;&nbsp;' + (this.barIdx + 1) + ':' + this.pluginPoint.skip.count + '/' + this.pluginPoint.skip.part + ' ' + this.filter.title;
	}

	dropPoint() {
		globalCommandDispatcher.exe.commitProjectChanges(['filters', this.filterIdx, 'automation', this.barIdx], () => {
			let muStart = MMUtil().set(this.startEnd.start);
			let muEnd = MMUtil().set(this.startEnd.end);
			for (let changeIdx = 0; changeIdx < this.filter.automation[this.barIdx].changes.length; changeIdx++) {
				let testChange = this.filter.automation[this.barIdx].changes[changeIdx];
				if (muStart.more(testChange.skip)) {
					//
				} else {
					if (muEnd.more(testChange.skip)) {
						this.filter.automation[this.barIdx].changes.splice(changeIdx, 1);
						changeIdx--;
					}
				}
			}
		});
		this.closePointDialogFrame();
		//globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	openPointPluginDialogFrame(filterIdx: number, barIdx: number, info: BarStepStartEnd, pointIdx: number, pointChange: Zvoog_FilterStateChange, filter: Zvoog_FilterTarget, filterPlugin: MZXBX_PluginRegistrationInformation) {
		this.filter = filter;
		this.startEnd = info,
			this.barIdx = barIdx;
		this.filterIdx = filterIdx;
		this.pointIdx = pointIdx;
		this.pluginPoint = pointChange;
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
			let message: MZXBX_MessageToPlugin = { hostData: this.pluginPoint.stateBlob };
			pluginFrame.contentWindow.postMessage(message, '*');
			//console.log('sendPointToPlugin', message);
		}
	}
	setPointValue(data: string) {
		globalCommandDispatcher.exe.commitProjectChanges(['filters', this.filterIdx, 'automation', this.barIdx], () => {
			this.pluginPoint.stateBlob = data;
		});
		globalCommandDispatcher.reStartPlayIfPlay();
	}
	receiveMessageFromPlugin(event) {
		//console.log('point receiveMessageFromPlugin', event);
		if (!(event.data)) {
			//console.log('empty message data');
		} else {
			let message: MZXBX_MessageToHost = event.data;
			if (message.dialogID) {
				//console.log('receiveMessageFromPlugin', message);
				if (message.dialogID == this.dialogID) {
					//this.pluginPoint.stateBlob = message.pluginData;
					this.setPointValue(message.pluginData);
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
