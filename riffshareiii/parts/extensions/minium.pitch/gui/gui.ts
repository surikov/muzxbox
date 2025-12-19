console.log('Chords GUI v1.0.3');
class CHPUI {
	id: string = '';
	selectedCategoryIdx: number = 0;
	selectedMIDInum: number = 0;
	selectedItemIdx: number = 0;
	selectedVolume = 0;
	selectedMode = 0;
	level: HTMLInputElement;
	inslist: HTMLUListElement;
	subUl: HTMLUListElement | null;
	util: ChordPitchPerformerUtil = new ChordPitchPerformerUtil();
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
			if (idx == this.selectedMIDInum) {
				let pref = '' + idx;
				if (pref.length == 2) pref = '0' + pref;
				if (pref.length == 1) pref = '00' + pref;
				let ul = document.createElement('ul');
				this.subUl.appendChild(ul);
				let list = this.util.tonechordinstrumentKeys();
				for (let kk = 0; kk < list.length; kk++) {
					let one = list[kk];
					if (one.startsWith(pref)) {
						let li = document.createElement('li');
						li.textContent = one;
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
				let fullName = this.util.tonechordinslist()[ii];
				let cat = fullName.split(': ')[1];
				if (cat == curCat) {
					if (this.subUl) {
						this.addSub(fullName.split(': ')[0], ii);
					}
				} else {
					let li = document.createElement('li');
					li.textContent = cat;
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
			let insName = this.util.tonechordinstrumentKeys()[this.selectedItemIdx];
			this.selectedMIDInum = parseInt(insName.substring(0, 3));
			tileval.innerHTML = '' + this.util.tonechordinslist()[this.selectedMIDInum] + ' / ' + insName;
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
		console.log('refreshMode',el);
	}
	init() {
		let el = document.getElementById('inslist');
		if (el) {
			this.inslist = el as HTMLUListElement;
		}
		el = document.getElementById('level');
		if (el) {
			this.level = el as HTMLInputElement;
			this.level.addEventListener('change', (event) => {
				this.selectedVolume = parseInt(this.level.value);
				this.refreshVolume();
				this.sendDataToHost();
			});
		}
		el = document.getElementById('radio0'); if (el) { el.addEventListener('change', (event) => { this.setMode(0); }); }
		el = document.getElementById('radio1'); if (el) { el.addEventListener('change', (event) => { this.setMode(1); }); }
		el = document.getElementById('radio2'); if (el) { el.addEventListener('change', (event) => { this.setMode(2); }); }
		el = document.getElementById('radio3'); if (el) { el.addEventListener('change', (event) => { this.setMode(3); }); }
		el = document.getElementById('radio4'); if (el) { el.addEventListener('change', (event) => { this.setMode(4); }); }
		this.reFillList();
		this.refreshTitle();
		this.refreshVolume();
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.sendIDRequestToHost();
	}
	setMode(num: number) {
		this.selectedMode = num;
		this.sendDataToHost();
	}
	sendIDRequestToHost(){
		this.sendToHost('');
	}
	sendDataToHost(){
		this.sendToHost(this.util.dumpParameters(this.selectedVolume, this.selectedItemIdx, this.selectedMode));
	}
	sendToHost(data: string) {
		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false, screenWait: false };
		console.log('sendToHost',message);
		window.parent.postMessage(message, '*');
	}
	receiveHostMessage(messageEvent: MessageEvent) {
		let message: MZXBX_MessageToPlugin = messageEvent.data;
		if (this.id) {
			this.setState(message.hostData);
		} else {
			this.setMessagingId(message.hostData);
			this.setupLangColors(message);
		}
	}
	setMessagingId(newId: string) {
		this.id = newId;
	}
	setState(data: string) {
		let parsed = this.util.checkParameters(data);
		this.selectedVolume = parsed.loudness;
		this.selectedItemIdx = parsed.idx;
		this.selectedMode = parsed.mode;
		let insName = this.util.tonechordinstrumentKeys()[this.selectedItemIdx];
		this.selectedMIDInum = parseInt(insName.substring(0, 3));
		this.selectedCategoryIdx = 8 * Math.floor(this.selectedMIDInum / 8);
		if (this.level) {
			this.level.value = '' + this.selectedVolume;
		}
		this.reFillList();
		this.refreshTitle();
		this.refreshMode();
		this.refreshVolume();
	}
	tapCategory(idx: number) {
		this.selectedCategoryIdx = idx;
		this.reFillList();
	}
	tapSub(idx: number) {
		this.selectedMIDInum = idx;
		this.reFillList();
	}
	tapItem(idx: number) {
		console.log('tapItem', idx);
		this.selectedItemIdx = idx;
		this.sendDataToHost();
		this.refreshTitle();
	}
	setupLangColors(message: MZXBX_MessageToPlugin) {
		/*colors: {
		background: string// #101;
		, main: string//#9cf;
		, drag: string//#03f;
		, line: string//#ffc;
		, click: string// #c39;
	}) {*/
		//console.log('setipColors', colors.background, window.getComputedStyle(document.documentElement).getPropertyValue('--background-color'));
		document.documentElement.style.setProperty('--background-color', message.colors.background);
		document.documentElement.style.setProperty('--main-color', message.colors.main);
		document.documentElement.style.setProperty('--drag-color', message.colors.drag);
		document.documentElement.style.setProperty('--line-color', message.colors.line);
		document.documentElement.style.setProperty('--click-color', message.colors.click);
		if (message.langID == 'ru') {
			(document.getElementById('title') as any).innerHTML = 'Аккорд/Тон';
		} else {
			if (message.langID == 'zh') {
				(document.getElementById('title') as any).innerHTML = '?';
			} else {
				(document.getElementById('title') as any).innerHTML = 'Chord/Pitch';
			}
		}

	}
}
function initCHPUI() {
	new CHPUI().init();
}
