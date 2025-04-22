class FilterPluginDialog {
	filter: Zvoog_FilterTarget;
	order: number;
	pluginRawData: string;
	dialogID: string = '?';
	waitFilterPluginInit: boolean = false;
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
	}
	promptFilterTitle() {
		let newTitle = prompt(this.filter.title, this.filter.title);
		if (newTitle == this.filter.title) {
			//
		} else {
			if (newTitle != null) {
				globalCommandDispatcher.exe.commitProjectChanges(['filters', this.order], () => {
					if (newTitle) {
						this.filter.title = newTitle;
					};
				});
				this.resetFilterTitle();
			}
		}
	}
	resetFilterTitle() {
		let pluginTitle = document.getElementById("pluginFilterTitle") as any;
		pluginTitle.innerHTML = '&nbsp;&nbsp;' + this.filter.title;
	}
	resetStateButtons() {
		if (this.filter.state == 1/* off */) {
			(document.getElementById("pluginFilterSetFilter") as any).className = 'pluginDoButton';
			(document.getElementById("pluginFilterSetPasstrough") as any).className = 'pluginNoneButton';
		} else {
			(document.getElementById("pluginFilterSetFilter") as any).className = 'pluginNoneButton';
			(document.getElementById("pluginFilterSetPasstrough") as any).className = 'pluginDoButton';
		}
	}
	setFilterOn() {
		globalCommandDispatcher.exe.commitProjectChanges(['filters', this.order], () => {
			this.filter.state = 0;
		});
		this.resetStateButtons();
		globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	setFilterPass() {
		globalCommandDispatcher.exe.commitProjectChanges(['filters', this.order], () => {
			this.filter.state = 1;
		});
		this.resetStateButtons();
		globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	dropFilter() {
		globalCommandDispatcher.exe.commitProjectChanges([], () => {
			let id = globalCommandDispatcher.cfg().data.filters[this.order].id;
			globalCommandDispatcher.cfg().data.filters.splice(this.order, 1);
			for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
				let oo = globalCommandDispatcher.cfg().data.filters[ii];
				oo.outputs = oo.outputs.filter(item => item !== id);
			}
			for (let ii = 0; ii < globalCommandDispatcher.cfg().data.percussions.length; ii++) {
				let oo = globalCommandDispatcher.cfg().data.percussions[ii].sampler;
				oo.outputs = oo.outputs.filter(item => item !== id);
			}
			for (let ii = 0; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
				let oo = globalCommandDispatcher.cfg().data.tracks[ii].performer;
				oo.outputs = oo.outputs.filter(item => item !== id);
			}
		});
		this.closeFilterDialogFrame();
		globalCommandDispatcher.reConnectPluginsIfPlay();
	}
	openFilterPluginDialogFrame(order: number, filter: Zvoog_FilterTarget, filterPlugin: null|MZXBX_PluginRegistrationInformation) {
		//console.log('openFilterPluginDialogFrame');
		this.filter = filter;
		this.order = order;
		this.pluginRawData = filter.data;
		this.resetFilterTitle();
		let pluginFrame = document.getElementById("pluginFilterFrame") as any;
		let pluginDiv = document.getElementById("pluginFilterDiv") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				this.waitFilterPluginInit = true;
				if(filterPlugin){
				pluginFrame.src = filterPlugin.ui;
				}
				pluginDiv.style.visibility = "visible";
				this.resetStateButtons();
			}
		}
	}
	closeFilterDialogFrame(): void {
		let pluginDiv = document.getElementById("pluginFilterDiv") as any;
		if (pluginDiv) {
			pluginDiv.style.visibility = "hidden";
		}
		let pluginFrame = document.getElementById("pluginFilterFrame") as any;
		if (pluginFrame) {
			pluginFrame.src = "plugins/pluginplaceholder.html";
		}
	}
	sendNewIdToPlugin() {
		let pluginFrame = document.getElementById("pluginFilterFrame") as any;
		if (pluginFrame) {
			this.dialogID = '' + Math.random();
			let message: MZXBX_MessageToPlugin = { hostData: this.dialogID };
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	sendPointToPlugin() {
		let pluginFrame = document.getElementById("pluginFilterFrame") as any;
		if (pluginFrame) {
			let message: MZXBX_MessageToPlugin = { hostData: this.pluginRawData };
			pluginFrame.contentWindow.postMessage(message, '*');
			//console.log('sendPointToPlugin', message);
		}
	}
	setFilterValue() {
		globalCommandDispatcher.exe.commitProjectChanges(['filters', this.order], () => {
			this.filter.data = this.pluginRawData;
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
				if (this.waitFilterPluginInit) {
					this.waitFilterPluginInit = false;
					this.sendNewIdToPlugin();
					this.sendPointToPlugin();
				} else {
					//console.log('wrong received object');
				}
			}
		}
	}
}
