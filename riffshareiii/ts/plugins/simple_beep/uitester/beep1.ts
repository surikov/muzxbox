declare function newSimpleBeepImplementation(): MZXBX_AudioPerformerPlugin;
class SimpleBeepPlugin {
	audioContext: AudioContext;
	plugin: MZXBX_AudioPerformerPlugin;
	lastMessage: MZXBX_PluginMessage|null=null;
	constructor() {
		console.log('SimpleBeepPlugin');
		//setTimeout(() => { this.register(); }, 999);
		this.register();
	}
	register() {
		console.log('register');
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
	}
	receiveHostMessage(messageEvent:MessageEvent) {
		console.log('receiveHostMessage', messageEvent);
		this.lastMessage=messageEvent.data;
		//callbackID = par.data;
		/*try {
			var oo = JSON.parse(par.data);
			console.log('receiveHostMessage', oo);
		} catch (xx) {
			console.log(xx);
		}*/
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
			this.plugin.cancel(); this.plugin.schedule(this.audioContext.currentTime + 0.1, 2, [66], 120, []);

		}


	}
}
