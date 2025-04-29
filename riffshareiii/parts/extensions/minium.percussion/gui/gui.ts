class ZDUI {
	id: string = '';
	data: string = '';
	list: any;
	voluctrl: any;

	//player: ZDRWebAudioFontPlayer = new ZDRWebAudioFontPlayer();
	init() {
		/*
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.sendMessageToHost('');
		this.list = document.getElementById('drlist');
		this.player = new ZDRWebAudioFontPlayer();
		let drms = this.player.loader.drumKeys();
		this.voluctrl = document.getElementById('voluctrl');

		for (let ii = 0; ii < drms.length; ii++) {
			var option = document.createElement('option');
			option.value = '' + ii;
			let midi = parseInt(drms[ii].substring(0, 2));
			option.innerHTML = drms[ii] + ": " + this.player.loader.drumTitles()[midi];
			this.list.appendChild(option);
		}
		this.list.addEventListener('change', (event) => {
			//console.dir(this.player.loader.drumKeys()[1 * this.list.value]);
			let msg = '0/' + this.list.value + '/' + this.voluctrl.value;
			//console.log('change', msg);
			this.sendMessageToHost(msg);
		});
		this.voluctrl.addEventListener('change', (event) => {
			
			let msg = '0/' + this.list.value + '/' + this.voluctrl.value;
			//console.log('change', msg);
			this.sendMessageToHost(msg);
		});
*/
	}
	sendMessageToHost(data: string) {

		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false };
		console.log('set drum',data);
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
		//console.log('setState', data);
		this.data = data;
		let split = this.data.split('/');
		if (split.length >1 && split[1].length>0) {
			this.list.value = parseInt(split[1]);
		} else {
			//this.list.value = this.player.loader.findDrum(parseInt(split[0]));
		}
		this.voluctrl.value = 95;
		if (split.length > 2) {
			if (split[2].length > 0) {
				this.voluctrl.value = parseInt(split[2]);
			}
		}
	}
}
function initZDRUI() {
	//console.log('initZPerfUI');
	new ZDUI().init();
}
