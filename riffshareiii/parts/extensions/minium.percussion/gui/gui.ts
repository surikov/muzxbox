var drumNames: string[] = [];
drumNames[35] = "Bass Drum 2";
drumNames[36] = "Bass Drum 1";
drumNames[37] = "Side Stick/Rimshot";
drumNames[38] = "Snare Drum 1";
drumNames[39] = "Hand Clap";
drumNames[40] = "Snare Drum 2";
drumNames[41] = "Low Tom 2";
drumNames[42] = "Closed Hi-hat";
drumNames[43] = "Low Tom 1";
drumNames[44] = "Pedal Hi-hat";
drumNames[45] = "Mid Tom 2";
drumNames[46] = "Open Hi-hat";
drumNames[47] = "Mid Tom 1";
drumNames[48] = "High Tom 2";
drumNames[49] = "Crash Cymbal 1";
drumNames[50] = "High Tom 1";
drumNames[51] = "Ride Cymbal 1";
drumNames[52] = "Chinese Cymbal";
drumNames[53] = "Ride Bell";
drumNames[54] = "Tambourine";
drumNames[55] = "Splash Cymbal";
drumNames[56] = "Cowbell";
drumNames[57] = "Crash Cymbal 2";
drumNames[58] = "Vibra Slap";
drumNames[59] = "Ride Cymbal 2";
drumNames[60] = "High Bongo";
drumNames[61] = "Low Bongo";
drumNames[62] = "Mute High Conga";
drumNames[63] = "Open High Conga";
drumNames[64] = "Low Conga";
drumNames[65] = "High Timbale";
drumNames[66] = "Low Timbale";
drumNames[67] = "High Agogo";
drumNames[68] = "Low Agogo";
drumNames[69] = "Cabasa";
drumNames[70] = "Maracas";
drumNames[71] = "Short Whistle";
drumNames[72] = "Long Whistle";
drumNames[73] = "Short Guiro";
drumNames[74] = "Long Guiro";
drumNames[75] = "Claves";
drumNames[76] = "High Wood Block";
drumNames[77] = "Low Wood Block";
drumNames[78] = "Mute Cuica";
drumNames[79] = "Open Cuica";
drumNames[80] = "Mute Triangle";
drumNames[81] = "Open Triangle";
class ZDUI {
	id: string = '';
	data: string = '';
	selectedCategoryIdx: number = 0;
	selectedItemIdx: number = 0;
	voluctrl: any;
	drumlist: HTMLUListElement;
	//player: ZDRWebAudioFontPlayer = new ZDRWebAudioFontPlayer();
	reFillList() {
		if (this.drumlist) {
			let me = this;
			this.drumlist.replaceChildren();
			for (let ii = 35; ii <= 81; ii++) {
				let li = document.createElement('li');
				li.textContent = drumNames[ii];
				li.addEventListener('click', (evnt) => {
					me.tapCategory(ii);
				});
				this.drumlist.appendChild(li);
				if (this.selectedCategoryIdx == ii) {
					let ul = document.createElement('ul');
					let pre = '' + ii;
					for (let nn = 0; nn < drumKeysArrayPercussionPaths.length; nn++) {
						if (drumKeysArrayPercussionPaths[nn].startsWith(pre)) {
							this.drumlist.appendChild(ul);
							let it = document.createElement('li');
							it.textContent = drumKeysArrayPercussionPaths[nn];
							it.addEventListener('click', (evnt) => {
								me.tapItem(nn);
							});
							ul.appendChild(it);
						}
					}
				}
			}
		}
	}
	refreshTitle() {
		let tileval = document.getElementById('tileval');
		if (tileval) {
			let catIdx = parseInt(drumKeysArrayPercussionPaths[this.selectedItemIdx].substring(0, 2));
			tileval.innerHTML = '' + drumNames[catIdx] + ' / ' + drumKeysArrayPercussionPaths[this.selectedItemIdx];
		}
	}
	init() {
		//let me = this;
		let el = document.getElementById('drumlist');
		if (el) {
			this.drumlist = el as HTMLUListElement;
			this.reFillList();
		}
		this.refreshTitle();
		console.dir(this.drumlist);
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
		console.log('set drum', data);
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
		if (split.length > 1 && split[1].length > 0) {
			//this.list.value = parseInt(split[1]);
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
	tapCategory(idx: number) {
		console.log('tapCategory', idx);
		this.selectedCategoryIdx = idx;
		this.reFillList();
	}
	tapItem(idx: number) {
		console.log('tapItem', idx);
		this.selectedItemIdx = idx;
		this.refreshTitle();
	}
}
function initZDRUI() {
	//console.log('initZPerfUI');
	new ZDUI().init();
}
