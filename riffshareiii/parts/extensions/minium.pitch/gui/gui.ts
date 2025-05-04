console.log('Chords GUI v1.0.3');

class CHPUI {
	id: string = '';
	data: string = '';
	selectedCategoryIdx: number = 0;
	selectedSubIdx: number = 0;
	selectedItemIdx: number = 0;
	selectedVolume = 0;
	selectedMode = 0;
	//voluctrl: any;
	level: HTMLInputElement;
	inslist: HTMLUListElement;
	subUl: HTMLUListElement | null;
	//player: ZDRWebAudioFontPlayer = new ZDRWebAudioFontPlayer();
	addSub(label: string, idx: number) {
		if (this.subUl) {
			let me = this;
			this.inslist.appendChild(this.subUl);
			let subli = document.createElement('li');
			subli.textContent = label;
			subli.addEventListener('click', (evnt) => {
				me.tapSub(idx);
			});
			this.subUl.appendChild(subli);
			if (idx == this.selectedSubIdx) {
				let pref = '' + idx;
				if (pref.length == 2) pref = '0' + pref;
				if (pref.length == 1) pref = '00' + pref;
				let ul = document.createElement('ul');
				this.subUl.appendChild(ul);
				let list = tonechordinstrumentKeys();
				for (let kk = 0; kk < list.length; kk++) {
					let one = list[kk];
					if (one.startsWith(pref)) {
						let li = document.createElement('li');
						li.textContent = one;//pref + 'dnkjnkjnkjn';
						li.addEventListener('click', (evnt) => {
							me.tapItem(kk);
						});
						ul.appendChild(li);
					}
				}
			}
		}
	}
	reFillList() {
		if (this.inslist) {
			let me = this;
			this.inslist.replaceChildren();
			let curCat = '';
			for (let ii = 0; ii <= 127; ii++) {
				let fullName = tonechordinslist()[ii];
				let cat = fullName.split(': ')[1];
				if (cat == curCat) {
					if (this.subUl) {
						this.addSub(fullName.split(': ')[0], ii);
					}
				} else {
					let li = document.createElement('li');
					li.textContent = cat;//tonechordinslist()[ii];
					li.addEventListener('click', (evnt) => {
						me.tapCategory(ii);
					});
					this.inslist.appendChild(li);
					if (this.selectedCategoryIdx == ii) {
						this.subUl = document.createElement('ul');
						this.addSub(fullName.split(': ')[0], ii);

					} else {
						this.subUl = null;
					}
				}
				curCat = cat;

			}
		}
	}
	refreshTitle() {
		let tileval = document.getElementById('tileval');
		if (tileval) {
			//let catIdx = parseInt(drumKeysArrayPercussionPaths[this.selectedItemIdx].substring(0, 2));
			//tileval.innerHTML = '' + allPercussionDrumTitles()[catIdx] + ' / ' + drumKeysArrayPercussionPaths[this.selectedItemIdx];
		}
	}
	refreshVolume() {
		let numval = document.getElementById('numval');
		if (numval) {
			numval.innerHTML = '' + this.selectedVolume;
		}
	}
	refreshMode() {
		let nam = 'radio' + this.selectedMode;
		let el = document.getElementById(nam);
		if (el) {
			(el as any).checked = true;
		}
		console.log(el);
	}
	init() {

		let el = document.getElementById('inslist');
		if (el) {
			this.inslist = el as HTMLUListElement;
			//this.reFillList();
		}
		el = document.getElementById('level');
		if (el) {
			this.level = el as HTMLInputElement;
			this.level.addEventListener('change', (event) => {
				this.selectedVolume = parseInt(this.level.value);
				this.refreshVolume();
				this.sendMessageToHost('' + this.selectedVolume + '/' + this.selectedItemIdx + '/' + this.selectedMode);
			});
			console.dir(this.level);
		}
		el = document.getElementById('radio1'); if (el) { el.addEventListener('change', (event) => { this.setMode(1); }); }
		el = document.getElementById('radio2'); if (el) { el.addEventListener('change', (event) => { this.setMode(2); }); }
		el = document.getElementById('radio3'); if (el) { el.addEventListener('change', (event) => { this.setMode(3); }); }
		el = document.getElementById('radio4'); if (el) { el.addEventListener('change', (event) => { this.setMode(4); }); }
		el = document.getElementById('radio5'); if (el) { el.addEventListener('change', (event) => { this.setMode(5); }); }
		this.reFillList();
		this.refreshTitle();
		this.refreshVolume();
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.sendMessageToHost('');

		this.setState('88/445/3');
	}
	setMode(num: number) {
		//console.log('setMode', num);
		this.selectedMode = num;
		this.sendMessageToHost('' + this.selectedVolume + '/' + this.selectedItemIdx + '/' + this.selectedMode);
	}
	sendMessageToHost(data: string) {

		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false };
		console.log('set instr', data);
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
			this.selectedMode = parseInt(split[2]);

		} catch (xx) {
			console.log(xx);
			this.selectedVolume = 77;
			this.selectedItemIdx = 0;
			this.selectedCategoryIdx = 35;
		}
		if (this.level) {
			this.level.value = '' + this.selectedVolume;
		}
		this.reFillList();
		this.refreshTitle();
		this.refreshMode();
		this.refreshVolume();
	}
	tapCategory(idx: number) {
		console.log('tapCategory', idx);
		this.selectedCategoryIdx = idx;
		this.reFillList();
	}
	tapSub(idx: number) {
		console.log('tapSub', idx);
		this.selectedSubIdx = idx;
		this.reFillList();
	}
	tapItem(idx: number) {
		console.log('tapItem', idx);
		this.selectedItemIdx = idx;
		this.sendMessageToHost('' + this.selectedVolume + '/' + this.selectedItemIdx + '/' + this.selectedMode);
		this.refreshTitle();
	}
}
function initCHPUI() {
	new CHPUI().init();
}
