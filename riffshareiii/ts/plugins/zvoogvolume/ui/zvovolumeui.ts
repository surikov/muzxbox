class ZVUI {
	id: string = '';
	data: string = '';
	slider: any;
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.sendMessageToHost('');
		this.slider = document.getElementById('voluctrl');
		this.slider.addEventListener('change', (event) => {
			this.sendMessageToHost(this.slider.value);
		});
	}
	sendMessageToHost(data: string) {
		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false };
		window.parent.postMessage(message, '*');
	}
	receiveHostMessage(messageEvent: MessageEvent) {
		let message: MZXBX_MessageToPlugin = messageEvent.data;
		if (this.id) {
			this.setState(message.hostData);
		} else {
			this.setMessagingId(message.hostData);
		}
	}
	setMessagingId(newId: string) {
		this.id = newId;
	}
	setState(data: string) {
		this.data = data;
		this.slider.value = parseInt(this.data);
	}
}
function initZVUI() {
	let zz = new ZVUI();
	zz.init();
}