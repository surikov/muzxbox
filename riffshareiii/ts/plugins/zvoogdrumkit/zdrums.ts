console.log('ZvoogDrumKit v1.0');
class ZvoogDrumKitImplementation implements MZXBX_AudioSamplerPlugin {
	audioContext: AudioContext;
	player: ZDRWebAudioFontPlayer = new ZDRWebAudioFontPlayer();
	volume: GainNode;
	loader: ZDRWebAudioFontLoader = new ZDRWebAudioFontLoader();
	midinumber: number = 0;
	info: ZDRPresetInfo;
	preset: ZDRWavePreset | null = null;
	sampleDuration = 0.000001;
	launch(context: AudioContext, parameters: string): void {
		this.preset = null;
		this.audioContext = context;
		this.volume = this.audioContext.createGain();
		this.volume.gain.setValueAtTime(0.7, 0);
		this.midinumber = parseInt(parameters);
		let idx = this.loader.findDrum(this.midinumber);
		this.info = this.loader.drumInfo(idx);
		this.loader.startLoad(context, this.info.url, this.info.variable);
		this.loader.waitLoad(() => {
			this.preset = window[this.info.variable];
			//console.log('preset',this.preset,this.info);
		});
	}
	busy(): null | string {
		if (this.preset == null) {
			return 'preset ' + this.info;
		} else {
			if (!this.loader.loaded(this.info.variable)) {
				return 'loaded ' + this.info;
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
	schedule(when: number) {
		if (this.audioContext) {
			if (this.volume) {
				if (this.preset) {
					this.player.queueWaveTable(this.audioContext, this.volume, this.preset, when, this.info.pitch, 1, 0.9);
				}
			}
		}
	}
	cancel(): void {
		this.player.cancelQueue(this.audioContext)
	}
	output(): AudioNode | null {
		if (this.volume) {
			return this.volume;
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
	player: ZDRWebAudioFontPlayer = new ZDRWebAudioFontPlayer();
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.sendMessageToHost('');
		this.list = document.getElementById('drlist');
		this.player = new ZDRWebAudioFontPlayer();
		let drms = this.player.loader.drumKeys();

		for (let ii = 0; ii < drms.length; ii++) {
			var option = document.createElement('option');
			option.value = '' + ii;
			let midi = parseInt(drms[ii].substring(0, 2));
			option.innerHTML = drms[ii] + ": " + this.player.loader.drumTitles()[midi];
			this.list.appendChild(option);
		}
		this.list.addEventListener('change', (event) => {
			console.dir(this.player.loader.drumKeys()[1 * this.list.value]);
			this.sendMessageToHost('0/' + this.list.value);
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
		console.log('setState', data);
		this.data = data;
		let split = this.data.split('/');
		if (split.length == 2) {
			this.list.value = parseInt(split[1]);
		} else {
			//this.list.value = this.player.loader.findInstrument(parseInt(split[0]));
		}
	}
}
function newZvoogDrumKitImplementation(): MZXBX_AudioSamplerPlugin {
	return new ZvoogDrumKitImplementation();
}
function initZDRUI() {
	console.log('initZPerfUI');
	new ZDUI().init();
}