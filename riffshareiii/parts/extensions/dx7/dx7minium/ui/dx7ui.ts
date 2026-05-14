class DX7UI {
	id: string = '';
	volumeValue: number = 100;
	volumeLabel: any;
	preset: SynthPreset | null = null;
	titleText: any;
	fileInput: any;
	constructor() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		var message: MZXBX_MessageToHost = { dialogID: '', pluginData: '', done: false, screenWait: false };
		window.parent.postMessage(message, '*');

		let me = this;
		this.titleText = document.getElementById('presettitle') as any;
		this.fileInput = document.getElementById('fileInput') as any;
		this.volumeLabel = document.getElementById('volumeValue') as any;
		this.resetVolumeLabel();
		this.fileInput.addEventListener('change', (changeEvent) => {
			let file: File = changeEvent.target.files[0];
			let fileReder: FileReader = new FileReader();
			fileReder.onload = () => {
				let loader: DX7Loader = new DX7Loader();
				loader.loadSyxFile(file, (dx7presets: DX7PresetData[]) => {
					for (var ii = 0; ii < dx7presets.length; ii++) {
						libDX7list.splice(0, 0, dx7presets[ii]);
					}
					me.renderLibList();
				});
			};
			fileReder.readAsText(file);
		});
		let loader: DX7Loader = new DX7Loader();
		this.preset = loader.convertDX7data(libDX7list[32]);
		this.titleText.innerHTML = this.preset.label;
		this.renderLibList();
	}

	parseHostData(data: any): FMParameter | null {
		if (data) {
			if (data.preset) {
				if (data.preset.operators) {
					if (data.preset.operators.length == 6) {
						return data as FMParameter;
					}
				}
			}
		}
		return null;
	}
	receiveHostMessage(messageEvent: MessageEvent) {
		let message: MZXBX_MessageToPlugin = messageEvent.data;
		if (this.id) {
			let data: FMParameter | null = this.parseHostData(message.hostData);
			if (data) {
				console.log('receiveHostMessage', data);
				this.volumeValue = data.volume;
				this.preset = data.preset;
				this.titleText.innerHTML = this.preset.label;
				this.resetVolumeLabel();
			}
		} else {
			this.id = message.hostData;
		}
	}
	renderLibList() {
		let liblist = document.getElementById('liblist');
		let me = this;
		if (liblist) {
			while (liblist.lastElementChild) {
				liblist.removeChild(liblist.lastElementChild);
			}
			for (let ii = 0; ii < libDX7list.length; ii++) {
				let li = document.createElement('li');
				li.innerText = '' + (1 + ii) + '. ' + libDX7list[ii].name;
				let pid = ii;
				li.onclick = () => {
					let loader: DX7Loader = new DX7Loader();
					let selectedPreset: SynthPreset = loader.convertDX7data(libDX7list[pid]);
					console.log(pid, 'DX7 preset', libDX7list[pid], 'Synth parameters', selectedPreset);
					me.preset = selectedPreset;
					let par: FMParameter = {
						volume: me.volumeValue, preset: me.preset
					};
					//var message: MZXBX_MessageToHost = { dialogID: me.id, pluginData: par, done: false, screenWait: false };
					//window.parent.postMessage(message, '*');
					this.sendPresetToHost(par);
					this.titleText.innerHTML = me.preset.label;
				};
				liblist.appendChild(li);
			}
		}

	}
	importFile() {
		console.log('importFile');
		this.fileInput.click();
	}
	minusVolume() {
		console.log('minusVolume', this.volumeValue);
		if (this.volumeValue < 10) {
			this.volumeValue = 10;
		}
		if (this.preset) {
			this.volumeValue = this.volumeValue - 10;
			this.resetVolumeLabel();
			let par: FMParameter = {
				volume: this.volumeValue, preset: this.preset
			};
			//var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: par, done: false, screenWait: false };
			//window.parent.postMessage(message, '*');
			this.sendPresetToHost(par);
		}

	}
	plusVolume() {
		console.log('plusVolume', this.volumeValue);
		if (this.volumeValue > 140) {
			this.volumeValue = 140;
		}
		if (this.preset) {
			this.volumeValue = this.volumeValue + 10;
			this.resetVolumeLabel();
			let par: FMParameter = {
				volume: this.volumeValue, preset: this.preset
			};
			//var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: par, done: false, screenWait: false };
			//window.parent.postMessage(message, '*');
			this.sendPresetToHost(par);
		}

	}
	resetVolumeLabel() {
		this.volumeLabel.innerText = '' + this.volumeValue;
	}
	sendPresetToHost(par: FMParameter) {
		console.log('sendPresetToHost',par);
		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: par, done: false, screenWait: false };
		window.parent.postMessage(message, '*');
	}
}
