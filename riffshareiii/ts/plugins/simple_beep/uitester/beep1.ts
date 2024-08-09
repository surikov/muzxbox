declare function newSimpleBeepImplementation(): MZXBX_AudioPerformerPlugin;
class SimpleBeepPlugin {
	audioContext: AudioContext;
	plugin: MZXBX_AudioPerformerPlugin;
	lastMessage: MZXBX_PluginMessage | null = null;
	constructor() {
		console.log('SimpleBeepPlugin');
		//setTimeout(() => { this.register(); }, 999);
		this.register();
	}
	register() {
		console.log('register');
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
	}
	receiveHostMessage(messageEvent: MessageEvent) {
		console.log('receiveHostMessage', messageEvent);
		this.lastMessage = messageEvent.data;
		//callbackID = par.data;
		/*try {
			var oo = JSON.parse(par.data);
			console.log('receiveHostMessage', oo);
		} catch (xx) {
			console.log(xx);
		}*/
	}
	sendMessageToHost(data:string) {
		console.log('sendMessageToHost');
		if (this.lastMessage) {
			var message: MZXBX_PluginMessage = {
				dialogID: this.lastMessage.dialogID,
				data: data
			};
			window.parent.postMessage(message, '*');
		}
	}
	test() {
		console.log('test beep');
		if (this.audioContext) {
			//
		} else {
			this.audioContext = new AudioContext();
		}
		if (this.plugin) {
			//
		} else {
			this.plugin = newSimpleBeepImplementation();
			this.plugin.launch(this.audioContext, '');
			let audioNode: AudioNode | null = this.plugin.output();
			if (audioNode) {
				audioNode.connect(this.audioContext.destination);
			}
		}
		if (this.plugin.busy()) {
			//
		} else {
			this.plugin.cancel();
			this.plugin.schedule(this.audioContext.currentTime + 0.1, [48, 60, 64, 67], 120
				, [{ duration: 0.1, delta: 7 }
					, { duration: 0.2, delta: -7 }
					, { duration: 0.7, delta: 0 }
				]);

		}


	}
	set() {
		this.sendMessageToHost('test answer from beep');
	}
}
