console.log('BarTimeEdit v1.0.1');
class BarTimeEdit extends MZXBX_Plugin_UI {
	callbackID = '';
	currentProject: Zvoog_Project;
	startMeasure = 0;
	endMeasure = 0;
	metrecount = 4;
	metrepart = 4;
	tempo = 0;
	constructor() {
		super(false);
	}
	onMessageFromHost(message: MZXBX_MessageToPlugin): void {
		this.currentProject = message.hostData;
		if (this.currentProject) {
			this.startMeasure = this.currentProject.selectedPart.startMeasure;
			this.endMeasure = this.currentProject.selectedPart.endMeasure;
			if (this.startMeasure < 0) {
				this.startMeasure = 0;
				this.endMeasure = this.currentProject.timeline.length - 1;
			}
			this.metrecount = this.currentProject.timeline[this.startMeasure].metre.count;
			this.metrepart = this.currentProject.timeline[this.startMeasure].metre.part;
			this.tempo = this.currentProject.timeline[this.startMeasure].tempo;
			this.refreshInfo();
		}
	}
	setText(id: string, txt: string) {
		let oo = document.getElementById(id);
		if (oo) {
			oo.innerHTML = txt;
		}
	}
	onLanguaga(enruzhId: string): void {
		if (enruzhId == 'zh') {
			this.setText('plugintitle', '更改选定措施');
			this.setText('sellabel', '选择');
			this.setText('splitlabel', '分离');
			this.setText('tempolabel', '音乐节奏');
			this.setText('metrelabel', '音乐节拍');
			this.setText('btndel', '删除');
			this.setText('btnclear', '清除');
			this.setText('btnadd', '添加');
			this.setText('btnpushaside', '推开');
			this.setText('btnmerge', '合并');
		} else {
			if (enruzhId == 'ru') {
				this.setText('plugintitle', 'Изменить такты');
				this.setText('sellabel', 'Выбрано');
				this.setText('splitlabel', 'Отделить');
				this.setText('tempolabel', 'Темп');
				this.setText('metrelabel', 'Метр');
				this.setText('btndel', 'Удалить');
				this.setText('btnclear', 'Очистить');

				this.setText('btnadd', 'Добавить');
				this.setText('btnpushaside', 'Отодвинуть');
				this.setText('btnmerge', 'Объединить');
			} else {
				this.setText('plugintitle', 'Change selected measures');
				this.setText('sellabel', 'Selection');
				this.setText('splitlabel', 'Split');
				this.setText('tempolabel', 'Tempo');
				this.setText('metrelabel', 'Metre');
				this.setText('btndel', 'Delete');
				this.setText('btnclear', 'Clrear');
				this.setText('btnadd', 'Add to end');
				this.setText('btnpushaside', 'Push aside');
				this.setText('btnmerge', 'Merge');
			}
		}

	}
	split() {
		console.log('split');
		this.closeDialog(JSON.stringify(this.currentProject));
	}
	setTempo() {

		let bpm = document.getElementById('bpm');
		//console.log('start setTempo',bpm);
		if (bpm) {
			let newTempo = parseInt((bpm as any).value);
			if (newTempo > 20 && newTempo < 400) {
				//console.log('setTempo',newTempo);
				for (let ii = this.startMeasure; ii <= this.endMeasure; ii++) {
					this.currentProject.timeline[ii].tempo = newTempo;
				}
			}
		}
		//this.closeDialog(JSON.stringify(this.currentProject));
		//console.log(this.currentProject);
	}
	metre() {
		console.log('metre');
		this.closeDialog(JSON.stringify(this.currentProject));
	}
	deleteBars() {
		console.log('deleteBars');
		this.closeDialog(JSON.stringify(this.currentProject));
	}
	shiftContent() {
		console.log('shiftContent');
		this.closeDialog(JSON.stringify(this.currentProject));
	}
	mergeBars() {
		console.log('mergeBars');
		this.closeDialog(JSON.stringify(this.currentProject));
	}
	addBars() {
		console.log('addBars');
		this.closeDialog(JSON.stringify(this.currentProject));
	}
	clear() {
		console.log('clear');
		this.closeDialog(JSON.stringify(this.currentProject));
	}


	/*init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		window.parent.postMessage({
			dialogID: ''
			, pluginData: ''
			, done: false
		}, '*');
	}*/
	//sendImportedMIDIData() {
	/*console.log('sendImportedMIDIData', this.parsedProject);
	if (this.parsedProject) {
		var oo: MZXBX_MessageToHost = {
			dialogID: this.callbackID
			, pluginData: this.parsedProject
			, done: true
		};
		window.parent.postMessage(oo, '*');
	} else {
		alert('No parsed data');
	}*/
	//}
	refreshInfo() {
		let selfrom = document.getElementById('selfrom');
		if (selfrom) {
			(selfrom as any).value = this.startMeasure + 1;
		}
		let selto = document.getElementById('selto');
		if (selto) {
			(selto as any).value = this.endMeasure + 1;
		}
		let metreinput = document.getElementById('metreinput');
		if (metreinput) {
			(metreinput as any).value = '' + this.metrecount + '/' + this.metrepart;
		}
		let bpm = document.getElementById('bpm');
		if (bpm) {
			(bpm as any).value = this.tempo;
		}
	}

	sendProjectToHost222() {
		/*var oo: MZXBX_MessageToHost = {
			dialogID: this.callbackID
			, pluginData: this.currentProject
			, done: true
		};
		window.parent.postMessage(oo, '*');*/
		this.updateHostData(JSON.stringify(this.currentProject));
	}
	/*receiveHostMessage(par) {
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.callbackID) {
			this.currentProject = par.data.hostData;
			if (this.currentProject) {
				this.startMeasure = this.currentProject.selectedPart.startMeasure;
				this.endMeasure = this.currentProject.selectedPart.endMeasure;
			}
			if (this.startMeasure < 0) {
				this.startMeasure = 0;
				this.endMeasure = this.currentProject.timeline.length - 1;
			}
			this.refreshInfo();
		} else {
			this.callbackID = message.hostData;
		}
		console.log(par);
	}*/
	deleteBars2() {
		console.log('deleteBars');
		let count = this.endMeasure - this.startMeasure + 1;
		if (count >= this.currentProject.timeline.length) {
			count = this.currentProject.timeline.length - 1;
		}
		for (let ii = 0; ii < count; ii++) {
			this.currentProject.timeline.splice(this.startMeasure, 1);
			for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
				let track = this.currentProject.tracks[nn];
				track.measures.splice(this.startMeasure, 1);
			}
			for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
				let percu = this.currentProject.percussions[nn];
				percu.measures.splice(this.startMeasure, 1);
			}
			for (let nn = 0; nn < this.currentProject.filters.length; nn++) {
				let filter = this.currentProject.filters[nn];
				filter.automation.splice(this.startMeasure, 1);
			}
			this.currentProject.comments.splice(this.startMeasure, 1);
		}
		//this.sendProjectToHost();
	}
	insertEmptyBar(at: number, newTempo: number, metreCount: number, metrePart: number) {
		this.currentProject.timeline.splice(this.endMeasure + 1, 0, { tempo: newTempo, metre: { count: metreCount, part: metrePart } });
		for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
			let track = this.currentProject.tracks[nn];
			track.measures.splice(at, 0, { chords: [] });
		}
		for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
			let percu = this.currentProject.percussions[nn];
			percu.measures.splice(at, 0, { skips: [] });
		}
		for (let nn = 0; nn < this.currentProject.filters.length; nn++) {
			let filter = this.currentProject.filters[nn];
			filter.automation.splice(at, 0, { changes: [] });
		}
		this.currentProject.comments.splice(at, 0, { points: [] });
	}
	addBars2() {
		console.log('addBars', this.startMeasure, this.endMeasure, this.currentProject.timeline.length);
		let count = this.endMeasure - this.startMeasure + 1;
		//let newTempo = this.currentProject.timeline[this.endMeasure].tempo;
		//let newMetre = MMUtil().set(this.currentProject.timeline[this.endMeasure].metre);
		for (let ii = 0; ii < count; ii++) {
			this.insertEmptyBar(this.endMeasure + 1
				, this.currentProject.timeline[this.endMeasure].tempo
				, this.currentProject.timeline[this.endMeasure].metre.count
				, this.currentProject.timeline[this.endMeasure].metre.part
			);
			/*
			this.currentProject.timeline.splice(this.endMeasure + 1, 0, { tempo: newTempo, metre: newMetre.metre() });
			for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
				let track = this.currentProject.tracks[nn];
				track.measures.splice(this.endMeasure + 1, 0, { chords: [] });
			}
			for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
				let percu = this.currentProject.percussions[nn];
				percu.measures.splice(this.endMeasure + 1, 0, { skips: [] });
			}
			for (let nn = 0; nn < this.currentProject.filters.length; nn++) {
				let filter = this.currentProject.filters[nn];
				filter.automation.splice(this.endMeasure + 1, 0, { changes: [] });
			}
			this.currentProject.comments.splice(this.endMeasure + 1, 0, { points: [] });
			*/
		}
		console.log('new len', this.currentProject.timeline.length);
		//this.sendProjectToHost();
	}
	promptTempo() {
		console.log('promptTempo');
		let oldTempo = this.currentProject.timeline[this.startMeasure].tempo;
		let newTempo = prompt('Tempo', '' + oldTempo);
		if (newTempo) {
			let bpm = parseInt(newTempo);
			if (bpm > 39 && bpm < 300) {
				let count = this.endMeasure - this.startMeasure + 1;
				for (let ii = 0; ii < count; ii++) {
					this.currentProject.timeline[this.startMeasure + ii].tempo = bpm;
				}
				//this.sendProjectToHost();
			}
		}
	}
	promptMetre() {
		console.log('promptMetre');
		console.log('promptTempo');
		let oldMetre = this.currentProject.timeline[this.startMeasure].metre.count + '/' + this.currentProject.timeline[this.startMeasure].metre.part;
		let newMetre = prompt('Metre', '' + oldMetre);
		if (newMetre) {
			let parts = newMetre.split('/');
			let nCount = parseInt(parts[0]);
			let nPart = parseInt(parts[1]);
			if (nCount >= 1 && (nPart == 1 || nPart == 2 || nPart == 4 || nPart == 8)) {
				let count = this.endMeasure - this.startMeasure + 1;
				for (let ii = 0; ii < count; ii++) {
					this.currentProject.timeline[this.startMeasure + ii].metre.count = nCount;
					this.currentProject.timeline[this.startMeasure + ii].metre.part = nPart;
				}
				this.adjustContent();
				//this.sendProjectToHost();
			}
		}
	}
	shiftContent2() {
		console.log('shiftContent');
	}
	adjustContent() {
		for (let ii = 0; ii < this.currentProject.timeline.length; ii++) {
			let barMetre = MMUtil().set(this.currentProject.timeline[ii].metre);
			for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
				let trackBar = this.currentProject.tracks[nn].measures[ii];
				for (let kk = 0; kk < trackBar.chords.length; kk++) {
					let chord = trackBar.chords[kk];
					if (barMetre.less(chord.skip)) {
						chord.skip = MMUtil().set(chord.skip).minus(barMetre).simplyfy();
						trackBar.chords.splice(kk, 1);
						kk--;
						if (ii + 1 >= this.currentProject.timeline.length) {
							this.insertEmptyBar(ii + 1
								, this.currentProject.timeline[ii].tempo
								, this.currentProject.timeline[ii].metre.count
								, this.currentProject.timeline[ii].metre.part
							);
						}
						this.currentProject.tracks[nn].measures[ii + 1].chords.push(chord);
					}
				}
			}
			for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
				let percuBar = this.currentProject.percussions[nn].measures[ii];
				for (let kk = 0; kk < percuBar.skips.length; kk++) {
					let skip = percuBar.skips[kk];
					if (barMetre.less(skip)) {
						let newSkip = MMUtil().set(skip).minus(barMetre).simplyfy();
						percuBar.skips.splice(kk, 1);
						kk--;
						if (ii + 1 >= this.currentProject.timeline.length) {
							this.insertEmptyBar(ii + 1
								, this.currentProject.timeline[ii].tempo
								, this.currentProject.timeline[ii].metre.count
								, this.currentProject.timeline[ii].metre.part
							);
						}
						this.currentProject.percussions[nn].measures[ii + 1].skips.push(newSkip);
					}
				}
			}
			for (let nn = 0; nn < this.currentProject.filters.length; nn++) {
				let autoBar = this.currentProject.filters[nn].automation[ii];
				for (let kk = 0; kk < autoBar.changes.length; kk++) {
					let change = autoBar.changes[kk];
					if (barMetre.less(change.skip)) {
						change.skip = MMUtil().set(change.skip).minus(barMetre).simplyfy();
						autoBar.changes.splice(kk, 1);
						kk--;
						if (ii + 1 >= this.currentProject.timeline.length) {
							this.insertEmptyBar(ii + 1
								, this.currentProject.timeline[ii].tempo
								, this.currentProject.timeline[ii].metre.count
								, this.currentProject.timeline[ii].metre.part
							);
						}
						this.currentProject.filters[nn].automation[ii + 1].changes.push(change);
					}
				}
			}
			for (let nn = 0; nn < this.currentProject.comments.length; nn++) {
				let textBar = this.currentProject.comments[nn];
				for (let kk = 0; kk < textBar.points.length; kk++) {
					let point = textBar.points[kk];
					if (barMetre.less(point.skip)) {
						let newSkip = MMUtil().set(point.skip).minus(barMetre).simplyfy();
						textBar.points.splice(kk, 1);
						kk--;
						if (ii + 1 >= this.currentProject.timeline.length) {
							this.insertEmptyBar(ii + 1
								, this.currentProject.timeline[ii].tempo
								, this.currentProject.timeline[ii].metre.count
								, this.currentProject.timeline[ii].metre.part
							);
						}
						this.currentProject.comments[nn + 1].points.push(point);
					}
				}
			}
		}
	}
}


