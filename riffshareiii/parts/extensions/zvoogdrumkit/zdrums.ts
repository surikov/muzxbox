console.log('ZvoogDrumKit v1.0');
class ZvoogDrumKitImplementation implements MZXBX_AudioSamplerPlugin {
	audioContext: AudioContext;
	player: ZDRWebAudioFontPlayer = new ZDRWebAudioFontPlayer();
	volumeNode: GainNode;
	loader: ZDRWebAudioFontLoader = new ZDRWebAudioFontLoader();
	//midinumber: number = 0;
	//midiidx: number = 0;
	//listidx: number = -1;
	info: ZDRPresetInfo;
	preset: ZDRWavePreset | null = null;
	sampleDuration = 0.000001;
	loudness = 0.5;
	launch(context: AudioContext, parameters: string): void {
		this.preset = null;
		this.audioContext = context;
		this.volumeNode = this.audioContext.createGain();
		//this.volumeNode.gain.setValueAtTime(0.99, 0);
		//this.midinumber = parseInt(parameters);

		//console.log('parameters',parameters);
		let split = parameters.split('/');
		let idx = 0;
		if (split.length>1 && split[1].length>0) {
			let listidx = parseInt(split[1]);
			idx = listidx;
			//console.log('from list',idx);
		} else {
			let midiidx = parseInt(parameters);
			idx = this.loader.findDrum(midiidx);
			//console.log('from midi',idx);
		}
		if (split.length > 2) {
			if (split[2].length > 0) {
				this.loudness = 0.01 * (0.0 + parseInt(split[2]));
			}
		}
		this.volumeNode.gain.setValueAtTime(this.loudness, 0);
		//let idx = this.loader.findDrum(this.midinumber);
		this.info = this.loader.drumInfo(idx);
		//console.log('info',this.info);
		this.loader.startLoad(context, this.info.url, this.info.variable);
		this.loader.waitLoad(() => {
			this.preset = window[this.info.variable];
			//console.log('preset',this.preset,this.info);
		});
	}
	busy(): null | string {
		if (this.preset == null) {
			return 'empty preset';
		} else {
			if (!this.loader.loaded(this.info.variable)) {
				return 'no ' + this.info.variable;
			} else {
				if (this.preset) {
					if (this.preset.zones.length > 0) {
						if (this.preset.zones[0].buffer) {
							this.sampleDuration = this.preset.zones[0].buffer.duration;
						}
					}
				}
				return null;
			}
		}
	}
	start(when: number, tempo) {
		if (this.audioContext) {
			if (this.volumeNode) {
				if (this.preset) {
					when = when + Math.random() * 1 / tempo;
					let rlevel = 1 + 0.15 * Math.random();
					this.player.queueWaveTable(this.audioContext, this.volumeNode, this.preset, when, this.info.pitch, this.sampleDuration + 0.001, rlevel);
				}
			}
		}
	}
	cancel(): void {
		this.player.cancelQueue(this.audioContext)
	}
	output(): AudioNode | null {
		if (this.volumeNode) {
			return this.volumeNode;
		} else {
			return null;
		}
	}
	duration(): number {
		return this.sampleDuration;
	}

}
class ZDUI {
	id: string = '';
	data: string = '';
	list: any;
	voluctrl: any;

	player: ZDRWebAudioFontPlayer = new ZDRWebAudioFontPlayer();
	init() {
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
			this.list.value = this.player.loader.findDrum(parseInt(split[0]));
		}
		this.voluctrl.value = 95;
		if (split.length > 2) {
			if (split[2].length > 0) {
				this.voluctrl.value = parseInt(split[2]);
			}
		}
	}
}
function newZvoogDrumKitImplementation(): MZXBX_AudioSamplerPlugin {
	return new ZvoogDrumKitImplementation();
}
function initZDRUI() {
	//console.log('initZPerfUI');
	new ZDUI().init();
}