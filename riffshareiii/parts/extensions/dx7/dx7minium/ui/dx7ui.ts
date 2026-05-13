
class DX7UI {
	id: string = '';
	//data: FMParameter | null;
	volumeValue = 100;
	volumeValueText: any;
	preset: SynthPreset | null = null;
	//volumeSlider: any;
	titleText: any;
	constructor() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		var message: MZXBX_MessageToHost = { dialogID: '', pluginData: '', done: false, screenWait: false };
		window.parent.postMessage(message, '*');
		this.renderLibList();
		let me = this;
		this.titleText = document.getElementById('presettitle') as any;
		this.volumeValueText = document.getElementById('volumeValue') as any;
		this.volumeValueText.innerText = '' + this.volumeValue;
		//console.log(this.titleText);
		/*this.volumeSlider = document.getElementById('volume') as any;
		this.volumeSlider.addEventListener('change', (event) => {
			if (me.preset) {
				me.volumeValue = me.volumeSlider.value;
				let par: FMParameter = {
					volume: me.volumeValue, preset: me.preset
				};
				var message: MZXBX_MessageToHost = { dialogID: me.id, pluginData: par, done: false, screenWait: false };
				window.parent.postMessage(message, '*');
			}
		});*/
	}
	/*sendMessageToHost(data: string) {
		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false, screenWait: false };
		window.parent.postMessage(message, '*');
	}*/
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
				//this.volumeSlider.value = data.volume;
				this.volumeValue = data.volume;
				this.preset = data.preset;
				this.titleText.innerHTML = this.preset.label;
			}
		} else {
			this.id = message.hostData;
		}
	}
	renderLibList() {
		let liblist = document.getElementById('liblist');
		let me = this;
		//console.log('liblist',liblist);
		if (liblist) {
			libDX7list.sort((a, b) => {
				return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
			});
			for (let ii = 0; ii < libDX7list.length; ii++) {

				let li = document.createElement('li');
				li.innerText = '' + ii + '. ' + libDX7list[ii].name;
				let pid = ii;
				li.onclick = () => {
					console.log(pid, libDX7list[pid].name);
					//selectedPreset
					let loader: DX7Loader = new DX7Loader();
					let selectedPreset: SynthPreset = loader.convertDX7data(libDX7list[pid]);
					me.preset = selectedPreset;
					let par: FMParameter = {
						volume: me.volumeValue, preset: me.preset
					};
					var message: MZXBX_MessageToHost = { dialogID: me.id, pluginData: par, done: false, screenWait: false };
					window.parent.postMessage(message, '*');
					this.titleText.innerHTML = me.preset.label;
				};
				//console.log(ii, libDX7list[ii].name, li);
				liblist.appendChild(li);
			}
		}
	}
	importFile() {
		console.log('importFile');
	}
	minusVolume() {
		console.log('minusVolume');
		if (this.volumeValue > 0) {
			if (this.preset) {
				this.volumeValue = this.volumeValue - 10;
				this.volumeValueText.innerText = '' + this.volumeValue;
				let par: FMParameter = {
					volume: this.volumeValue, preset: this.preset
				};
				var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: par, done: false, screenWait: false };
				window.parent.postMessage(message, '*');
			}
		}
	}
	plusVolume() {
		console.log('plusVolume');
		if (this.volumeValue < 150) {
			if (this.preset) {
				this.volumeValue = this.volumeValue + 10;
				this.volumeValueText.innerText = '' + this.volumeValue;
				let par: FMParameter = {
					volume: this.volumeValue, preset: this.preset
				};
				var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: par, done: false, screenWait: false };
				window.parent.postMessage(message, '*');
			}
		}
	}
}
