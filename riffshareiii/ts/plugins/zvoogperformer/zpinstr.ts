console.log('zvoog defaulet performer v1.0');
class ZvoogBasePerformerImplementation implements MZXBX_AudioPerformerPlugin {
	audioContext: AudioContext;
	player: ZPWebAudioFontPlayer = new ZPWebAudioFontPlayer();
	volume: GainNode;
	loader: ZPWebAudioFontLoader = new ZPWebAudioFontLoader(this.player);
	midiidx: number = 0;
	listidx: number = -1;
	info: ZPPresetInfo;
	preset: ZPWavePreset | null = null;
	launch(context: AudioContext, parameters: string): void {
		this.preset = null;
		this.audioContext = context;
		this.volume = this.audioContext.createGain();
		
		let split = parameters.split('/');
		let idx = 0;
		if (split.length == 2) {
			this.listidx = parseInt(split[1]);
			this.midiidx = parseInt(split[0]);
			idx = this.listidx;
		} else {
			this.listidx = -1;
			this.midiidx = parseInt(parameters);
			idx = this.loader.findInstrument(this.midiidx);
		}
		//this.midinumber = parseInt(parameters);
		//let idx = this.loader.findInstrument(this.midinumber);
		this.info = this.loader.instrumentInfo(idx);
		this.loader.startLoad(context, this.info.url, this.info.variable);
		this.volume.gain.setValueAtTime(0.5, this.audioContext.currentTime+0.001);
		/*
		if(this.info.variable=="_tone_0300_SBAWE32_sf2_file"){
			this.volume.gain.setValueAtTime(0.99, this.audioContext.currentTime+0.002);
		}
		if(this.info.variable=="_tone_0290_GeneralUserGS_sf2_file"){
			this.volume.gain.setValueAtTime(0.99, this.audioContext.currentTime+0.002);
		}*/
		this.loader.waitLoad(() => {
			this.preset = window[this.info.variable];
			//console.log('preset', this.preset, this.info);
			
		});
	}
	busy(): null | string {
		if (this.preset == null) {
			return 'preset ' + this.info;
		} else {
			if (!this.loader.loaded(this.info.variable)) {
				return 'loaded ' + this.info;
			} else {
				return null;
			}
		}
	}
	strum(when: number, zpitches: number[], tempo: number, mzbxslide: MZXBX_SlideItem[]): void {
		if (this.audioContext) {
			if (this.volume) {
				if (this.preset) {
					let duration = 0;
					let volumeLevel = 0.66;
					//let slides: ZPWaveSlide[][] = [];
					for (let ii = 0; ii < mzbxslide.length; ii++) {
						let one = mzbxslide[ii];
						duration = duration + one.duration;
						//let sipi: ZPWaveSlide[] = [];
						//for (let pp = 0; pp < zpitches.length; pp++) {
						//	sipi.push({ when: 0, delta: 0 });
						//}
						//slides.push(sipi);
					}
					let pitches: number[] = [];
					for (let ii = 0; ii < zpitches.length; ii++) {
						pitches.push(zpitches[ii] + 0);
					}
					//console.log(duration, zpitches, mzbxslide);
					this.player.queueChord(this.audioContext, this.volume, this.preset, when, pitches, duration, volumeLevel, mzbxslide);
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
}
class ZPUI {
	id: string = '';
	data: string = '';
	list: any;
	player: ZPWebAudioFontPlayer = new ZPWebAudioFontPlayer();
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.sendMessageToHost('');
		this.list = document.getElementById('inslist');
		let ins = this.player.loader.instrumentKeys();
		
		for (let ii = 0; ii < ins.length; ii++) {
			var option = document.createElement('option');
			option.value = '' + ii;
			let midi=parseInt(ins[ii].substring(0,3));
			option.innerHTML = ins[ii]+": "+this.player.loader.instrumentTitles()[midi];
			this.list.appendChild(option);
		}
		this.list.addEventListener('change', (event) => {
			console.dir(this.player.loader.instrumentKeys()[1 * this.list.value]);
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
			this.list.value = this.player.loader.findInstrument(parseInt(split[0]));
		}
	}
}
function initZPerfUI() {
	console.log('initZPerfUI');
	new ZPUI().init();
}
function newZvoogBasePerformerImplementation(): MZXBX_AudioPerformerPlugin {
	return new ZvoogBasePerformerImplementation();
}

