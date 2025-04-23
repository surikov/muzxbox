class EQBridge {
	id: string = '';
	eqstate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	onReadHostData: () => void;
	constructor(onReadHostData: () => void) {
		this.onReadHostData = onReadHostData;
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.sendMessageToHost('');
	}
	sendMessageToHost(data: string) {
		console.log('sendMessageToHost',data);
		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false };
		window.parent.postMessage(message, '*');
	}
	receiveHostMessage(messageEvent: MessageEvent) {
		let message: MZXBX_MessageToPlugin = messageEvent.data;
		if (this.id) {
			parseState(this, message.hostData);
			this.onReadHostData();
		} else {
			this.setMessagingId(message.hostData);
		}
	}
	setMessagingId(newId: string) {
		this.id = newId;
	}
}
