abstract class MZXBX_Plugin_UI {
	dialogId: string = '';
	hostData: any = '';
	constructor(screenWait: boolean) {
		window.addEventListener('message', this._receiveHostMessage.bind(this), false);
		this._sendMessageToHost('', false, screenWait);
	}
	closeDialog(data: any) {
		this._sendMessageToHost(data, true, false);
	}
	updateHostData(data: any) {
		this._sendMessageToHost(data, false, false);
	}
	_sendMessageToHost(data: any, done: boolean, screenWait: boolean) {
		var message: MZXBX_MessageToHost = {
			dialogID: this.dialogId
			, pluginData: data
			, done: done
			, screenWait: screenWait
		};
		console.log('_sendMessageToHost', message);
		window.parent.postMessage(message, '*');

	}
	_receiveHostMessage(messageEvent: MessageEvent) {
		let message: MZXBX_MessageToPlugin = messageEvent.data;
		console.log('_receiveHostMessage', message);
		if (message) {
			if (this.dialogId) {
				this.hostData = message.hostData;
				this.onMessageFromHost(message);
			} else {
				this.dialogId = message.hostData;
				this.onLanguaga(message.langID);
				if (message.colors) {
					document.documentElement.style.setProperty('--background-color', message.colors.background);
					document.documentElement.style.setProperty('--main-color', message.colors.main);
					document.documentElement.style.setProperty('--drag-color', message.colors.drag);
					document.documentElement.style.setProperty('--line-color', message.colors.line);
					document.documentElement.style.setProperty('--click-color', message.colors.click);
				}
			}
		}
	}
	abstract onMessageFromHost(message: MZXBX_MessageToPlugin): void;
	abstract onLanguaga(enruzhId: string): void;
}
