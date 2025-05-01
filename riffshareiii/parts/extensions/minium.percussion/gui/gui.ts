console.log('Percussion GUI v1.0.3');

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
	selectedVolume = 0;
	//voluctrl: any;
	level: HTMLInputElement;
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
	refreshVolume() {
		let numval = document.getElementById('numval');
		if (numval) {
			numval.innerHTML = '' + this.selectedVolume;
		}
	}
	init() {
		//let me = this;
		let el = document.getElementById('drumlist');
		if (el) {
			this.drumlist = el as HTMLUListElement;
			//this.reFillList();
		}
		el = document.getElementById('level');
		if (el) {
			this.level = el as HTMLInputElement;
			this.level.addEventListener('change', (event) => {
				this.selectedVolume = parseInt(this.level.value);
				this.refreshVolume();
				this.sendMessageToHost('' + this.selectedVolume + '/' + this.selectedItemIdx);
			});
			console.dir(this.level);
		}
		this.reFillList();
		this.refreshTitle();
		this.refreshVolume();
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.sendMessageToHost('');

	}
	sendMessageToHost(data: string) {

		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false };
		console.log('set drum', data);
		window.parent.postMessage(message, '*');
	}
	receiveHostMessage(messageEvent: MessageEvent) {
		let message: MZXBX_MessageToPlugin = messageEvent.data;
		console.log('receiveHostMessage', this.id, message);
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
		try {
			let split = this.data.split('/');
			this.selectedVolume = parseInt(split[0]);
			this.selectedItemIdx = parseInt(split[1]);
			this.selectedCategoryIdx = parseInt(drumKeysArrayPercussionPaths[this.selectedItemIdx].substring(0, 2));

		} catch (xx) {
			console.log(xx);
			this.selectedVolume = 77;
			this.selectedItemIdx = 0;
			this.selectedCategoryIdx = 35;
		}
		if(this.level){
		this.level.value=''+this.selectedVolume;
		}
		this.reFillList();
		this.refreshTitle();
		this.refreshVolume();
	}
	tapCategory(idx: number) {
		console.log('tapCategory', idx);
		this.selectedCategoryIdx = idx;
		this.reFillList();
	}
	tapItem(idx: number) {
		console.log('tapItem', idx);
		this.selectedItemIdx = idx;
		this.sendMessageToHost('' + this.selectedVolume + '/' + this.selectedItemIdx);
		this.refreshTitle();
	}
}
function initZDRUI() {
	new ZDUI().init();
}
