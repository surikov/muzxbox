class ActionPluginDialog {
	pluginInfo: MZXBX_PluginRegistrationInformation;
	waitActionPluginInit = false;
	dialogID: string = '?';
	constructor() {
		window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
	}
	sendNewIdToPlugin() {
		let pluginFrame = document.getElementById("pluginActionFrame") as any;
		if (pluginFrame) {
			this.dialogID = '' + Math.random();
			let message: MZXBX_MessageToPlugin = { hostData: this.dialogID, colors: globalCommandDispatcher.readThemeColors(), screenData: null }
			pluginFrame.contentWindow.postMessage(message, '*');
		}
	}
	//globalCommandDispatcher.makeTileSVGsquareCanvas(300, (canvas: HTMLCanvasElement) => {
	//	globalCommandDispatcher.exportCanvasAsFile(canvas, 'testCanvasSVG.png');
	//});
	sendDataToActionPlugin() {

	}
	sendCurrentProjectToActionPlugin(screen: boolean) {
		let pluginFrame = document.getElementById("pluginActionFrame") as any;
		if (pluginFrame) {
			//let screenData: string | null = null;
			if (screen) {
				//screenData = 'test screen';
				globalCommandDispatcher.makeTileSVGsquareCanvas(600, (canvas: HTMLCanvasElement, buffer: ArrayBuffer) => {
					//globalCommandDispatcher.exportCanvasAsFile(canvas, 'testCanvasSVG.png');
					canvas.toBlob((blobresult: Blob) => {
						//globalCommandDispatcher.downloadBlob(blobresult, fileName);
						let message: MZXBX_MessageToPlugin = {
							hostData: globalCommandDispatcher.cfg().data, colors: globalCommandDispatcher.readThemeColors()
							, screenData: JSON.stringify(buffer)
						};
						console.log('screen to plugin', message);
						console.log(buffer);
						console.log(JSON.stringify(buffer));
						pluginFrame.contentWindow.postMessage(message, '*');
						//var imageData = context.createImageData(w, h);
						//imageData.data.set(incomingBuffer);
					});

				});

			} else {
				let message: MZXBX_MessageToPlugin = {
					hostData: globalCommandDispatcher.cfg().data, colors: globalCommandDispatcher.readThemeColors()
					, screenData: null
				};
				console.log('from host to plugin', message);
				pluginFrame.contentWindow.postMessage(message, '*');
			}

		}
	}
	receiveMessageFromPlugin(event) {
		//console.log('action receiveMessageFromPlugin', event);
		if (!(event.data)) {
			//console.log('empty message data');
		} else {
			let message: MZXBX_MessageToHost = event.data;
			if (message.dialogID) {
				if (message.dialogID == this.dialogID) {
					let me = this;
					console.log('waitProjectCallback');
					if (message.pluginData) {
						globalCommandDispatcher.exe.commitProjectChanges([], () => {
							let project: Zvoog_Project = message.pluginData;
							globalCommandDispatcher.registerWorkProject(project);
							globalCommandDispatcher.resetProject();
							globalCommandDispatcher.reStartPlayIfPlay();
						});
					}
					if (message.done) {
						me.closeActionDialogFrame();
					}
				} else {
					//console.log('wrong received message id', message.dialogID, this.dialogID);
				}
			} else {
				if (this.waitActionPluginInit) {
					this.waitActionPluginInit = false;
					this.sendNewIdToPlugin();
					this.sendCurrentProjectToActionPlugin(!!(message.sceenWait));
				} else {
					//console.log('wrong received object');
				}
			}
		}
	}
	openActionPluginDialogFrame(info: MZXBX_PluginRegistrationInformation) {
		this.pluginInfo = info;
		this.resetActionTitle();
		let pluginFrame = document.getElementById("pluginActionFrame") as any;
		let pluginDiv = document.getElementById("pluginActionDiv") as any;
		if (pluginFrame) {
			if (pluginFrame.contentWindow) {
				this.waitActionPluginInit = true;
				pluginFrame.src = this.pluginInfo.ui;
				pluginDiv.style.visibility = "visible";
			}
		}
	}
	closeActionDialogFrame() {
		let pluginDiv = document.getElementById("pluginActionDiv") as any;
		if (pluginDiv) {
			pluginDiv.style.visibility = "hidden";
		}
		let pluginFrame = document.getElementById("pluginActionFrame") as any;
		if (pluginFrame) {
			pluginFrame.src = "plugins/pluginplaceholder.html";
		}
	}
	resetActionTitle() {
		let pluginTitle = document.getElementById("pluginActionTitle") as any;
		pluginTitle.innerHTML = '&nbsp;&nbsp;' + this.pluginInfo.label;
	}
}
