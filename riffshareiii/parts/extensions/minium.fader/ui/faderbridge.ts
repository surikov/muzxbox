class FaderBridge {
	id: string = '';
	data: string = '';
	onReadHostData: () => void;
	constructor(onReadHostData: () => void) {
		this.onReadHostData = onReadHostData;
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.sendMessageToHost('');
	}
	sendMessageToHost(data: string) {
		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false,screenWait:false };
		window.parent.postMessage(message, '*');
	}
	receiveHostMessage(messageEvent: MessageEvent) {
		let message: MZXBX_MessageToPlugin = messageEvent.data;
		if (this.id) {
			this.data = message.hostData;
			this.onReadHostData();
		} else {
			this.setMessagingId(message.hostData);
			this.setupLangColors(message);
		}
	}
	setMessagingId(newId: string) {
		this.id = newId;
		
	}
	setupLangColors(message: MZXBX_MessageToPlugin) {
		/*colors: {
		background: string// #101;
		, main: string//#9cf;
		, drag: string//#03f;
		, line: string//#ffc;
		, click: string// #c39;
	}) {*/
		//console.log('setipColors', colors.background, window.getComputedStyle(document.documentElement).getPropertyValue('--background-color'));
		document.documentElement.style.setProperty('--background-color', message.colors.background);
		document.documentElement.style.setProperty('--main-color', message.colors.main);
		document.documentElement.style.setProperty('--drag-color', message.colors.drag);
		document.documentElement.style.setProperty('--line-color', message.colors.line);
		document.documentElement.style.setProperty('--click-color', message.colors.click);
		if (message.langID == 'ru') {
			(document.getElementById('title') as any).innerHTML = 'Фейдер';
		} else {
			if (message.langID == 'zh') {
				(document.getElementById('title') as any).innerHTML = '淡入淡出';
			} else {
				(document.getElementById('title') as any).innerHTML = 'Fader';
			}
		}

	}
}
