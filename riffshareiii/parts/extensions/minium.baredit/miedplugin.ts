console.log('BarTimeEdit v1.0.1');
class BarTimeEdit extends MZXBX_Plugin_UI {
	callbackID = '';
	currentProject: Zvoog_Project;
	//startMeasure = 0;
	//endMeasure = 0;
	//metrecount = 4;
	//metrepart = 4;
	//tempo = 0;
	constructor() {
		super(false);
	}
	onMessageFromHost(message: MZXBX_MessageToPlugin): void {
		this.currentProject = message.hostData;
		if (this.currentProject) {
			this.refreshInfo();
		}
	}
	refreshInfo() {
		let startMeasure = this.currentProject.selectedPart.startMeasure;
		let endMeasure = this.currentProject.selectedPart.endMeasure;
		if (startMeasure < 0) {
			startMeasure = 0;
			endMeasure = this.currentProject.timeline.length - 1;
		}
		let metrecount = this.currentProject.timeline[startMeasure].metre.count;
		let metrepart = this.currentProject.timeline[startMeasure].metre.part;
		let tempo = this.currentProject.timeline[startMeasure].tempo;
		let selfrom = document.getElementById('selfrom');
		if (selfrom) {
			(selfrom as any).value = startMeasure + 1;
		}
		let selto = document.getElementById('selto');
		if (selto) {
			(selto as any).value = endMeasure + 1;
		}
		let metreinput = document.getElementById('metreinput');
		if (metreinput) {
			(metreinput as any).value = '' + metrecount + '/' + metrepart;
		}
		let bpm = document.getElementById('bpm');
		if (bpm) {
			(bpm as any).value = tempo;
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
		let selfrom = document.getElementById('selfrom');
		let startMeasure: number = parseInt((selfrom as any).value) - 1;
		let txt = (document.getElementById('splitinput') as any).value;
		let newpart = parseInt(txt.split('/')[1]);
		let newcount = parseInt(txt.split('/')[0]);
		let leftMetre = MMUtil().set({ count: newcount, part: newpart });
		let rightMetre = MMUtil().set(this.currentProject.timeline[startMeasure].metre).minus(leftMetre);
		this.insertEmptyBar(startMeasure, startMeasure + 1);
		this.currentProject.timeline[startMeasure].metre = leftMetre.metre();
		this.currentProject.timeline[startMeasure + 1].metre = rightMetre.metre();
		this.adjustContentByMeter(this.currentProject);
		this.closeDialog(this.currentProject);
	}
	setTempo() {
		let bpm = document.getElementById('bpm');
		let selfrom = document.getElementById('selfrom');
		let selto = document.getElementById('selto');

		let newTempo = parseInt((bpm as any).value);
		let startMeasure: number = parseInt((selfrom as any).value) - 1;
		let endMeasure: number = parseInt((selto as any).value) - 1;

		if (newTempo > 20 && newTempo < 400) {
			for (let ii = startMeasure; ii <= endMeasure; ii++) {
				this.currentProject.timeline[ii].tempo = newTempo;
			}
			this.closeDialog(this.currentProject);
		}
	}
	metre() {
		let selfrom = document.getElementById('selfrom');
		let selto = document.getElementById('selto');
		let _startMeasure: number = parseInt((selfrom as any).value) - 1;
		let _endMeasure: number = parseInt((selto as any).value) - 1;
		let txt = (document.getElementById('metreinput') as any).value;
		let newpart = parseInt(txt.split('/')[1]);
		let newcount = parseInt(txt.split('/')[0]);
		if ((newcount > 0) && (newpart == 1 || newpart == 2 || newpart == 4 || newpart == 8 || newpart == 16 || newpart == 32)) {
			let newMeter = MMUtil().set({ count: newcount, part: newpart });
			for (let ii = _startMeasure; ii <= _endMeasure; ii++) {
				let bar = this.currentProject.timeline[ii];
				bar.metre = newMeter.metre();
			}
			this.closeDialog(this.currentProject);
		}
	}
	deleteBars() {
		let selfrom = document.getElementById('selfrom');
		let selto = document.getElementById('selto');
		let _startMeasure: number = parseInt((selfrom as any).value) - 1;
		let _endMeasure: number = parseInt((selto as any).value) - 1;
		this.currentProject.timeline.splice(_startMeasure, _endMeasure - _startMeasure);
		for (let ii = 0; ii < this.currentProject.tracks.length; ii++) {
			this.currentProject.tracks[ii].measures.splice(_startMeasure, _endMeasure - _startMeasure);
		}
		for (let ii = 0; ii < this.currentProject.filters.length; ii++) {
			this.currentProject.filters[ii].automation.splice(_startMeasure, _endMeasure - _startMeasure);
		}
		for (let ii = 0; ii < this.currentProject.percussions.length; ii++) {
			this.currentProject.percussions[ii].measures.splice(_startMeasure, _endMeasure - _startMeasure);
		}
		this.currentProject.comments.splice(_startMeasure, _endMeasure - _startMeasure);
		this.closeDialog(this.currentProject);
	}
	shiftContent() {
		this.adjustContentByMeter(this.currentProject);
		let selfrom = document.getElementById('selfrom');
		let selto = document.getElementById('selto');
		let startMeasure: number = parseInt((selfrom as any).value) - 1;
		let endMeasure: number = parseInt((selto as any).value) - 1;
		let shiftDuration = MMUtil().set(this.currentProject.timeline[startMeasure].metre);

		for (let ii = startMeasure + 1; ii <= endMeasure; ii++) {
			shiftDuration = shiftDuration.plus(this.currentProject.timeline[ii].metre);
		}
		console.log('shiftContent', startMeasure, endMeasure, shiftDuration);
		for (let ii = startMeasure; ii < this.currentProject.timeline.length; ii++) {
			for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
				let trackBar = this.currentProject.tracks[nn].measures[ii];
				for (let kk = 0; kk < trackBar.chords.length; kk++) {
					//console.log(ii, 'from', JSON.stringify(trackBar.chords[kk].skip));
					trackBar.chords[kk].skip = shiftDuration.plus(trackBar.chords[kk].skip).metre();
					//console.log('to', JSON.stringify(trackBar.chords[kk].skip));
				}
			}
			for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
				let percuBar = this.currentProject.percussions[nn].measures[ii];
				for (let kk = 0; kk < percuBar.skips.length; kk++) {
					percuBar.skips[kk] = shiftDuration.plus(percuBar.skips[kk]).metre();
				}
			}
			for (let nn = 0; nn < this.currentProject.filters.length; nn++) {
				let autoBar = this.currentProject.filters[nn].automation[ii];
				for (let kk = 0; kk < autoBar.changes.length; kk++) {
					autoBar.changes[kk].skip = shiftDuration.plus(autoBar.changes[kk].skip).metre();
				}
			}
			let txtBar = this.currentProject.comments[ii];
			for (let kk = 0; kk < txtBar.points.length; kk++) {
				txtBar.points[kk].skip = shiftDuration.plus(txtBar.points[kk].skip).metre();
			}
		}
		this.adjustContentByMeter(this.currentProject);
		this.closeDialog(this.currentProject);
	}
	mergeBars() {
		let selfrom = document.getElementById('selfrom');
		let selto = document.getElementById('selto');
		let startMeasure: number = parseInt((selfrom as any).value) - 1;
		let endMeasure: number = parseInt((selto as any).value) - 1;
		let newDuration = MMUtil().set(this.currentProject.timeline[startMeasure].metre);
		for (let ii = startMeasure + 1; ii <= endMeasure; ii++) {
			for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
				let trackBar = this.currentProject.tracks[nn].measures[ii];
				let trackPreBar = this.currentProject.tracks[nn].measures[ii - 1];
				for (let kk = 0; kk < trackBar.chords.length; kk++) {
					trackBar.chords[kk].skip = newDuration.plus(trackBar.chords[kk].skip).metre();
					trackPreBar.chords.push(trackBar.chords[kk]);
				}
				trackBar.chords = [];
			}
			for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
				let percuBar = this.currentProject.percussions[nn].measures[ii];
				let percuPreBar = this.currentProject.percussions[nn].measures[ii - 1];
				for (let kk = 0; kk < percuBar.skips.length; kk++) {
					percuBar.skips[kk] = newDuration.plus(percuBar.skips[kk]).metre();
					percuPreBar.skips.push(percuBar.skips[kk]);
				}
				percuBar.skips = [];
			}
			for (let nn = 0; nn < this.currentProject.filters.length; nn++) {
				let autoBar = this.currentProject.filters[nn].automation[ii];
				let autoPreBar = this.currentProject.filters[nn].automation[ii - 1];
				for (let kk = 0; kk < autoBar.changes.length; kk++) {
					autoBar.changes[kk].skip = newDuration.plus(autoBar.changes[kk].skip).metre();
					autoPreBar.changes.push(autoBar.changes[kk]);
				}
				autoBar.changes = [];
			}
			let txtBar = this.currentProject.comments[ii];
			let txtPreBar = this.currentProject.comments[ii - 1];
			for (let kk = 0; kk < txtBar.points.length; kk++) {
				txtBar.points[kk].skip = newDuration.plus(txtBar.points[kk].skip).metre();
				txtPreBar.points.push(txtBar.points[kk]);
			}
			txtBar.points = [];
			newDuration = newDuration.plus(this.currentProject.timeline[ii].metre);
		}
		this.currentProject.timeline[startMeasure].metre = newDuration.metre();
		this.currentProject.selectedPart.endMeasure = this.currentProject.selectedPart.startMeasure;
		this.closeDialog(this.currentProject);

	}
	insertEmptyBar(from: number, to: number) {
		let newTempo = this.currentProject.timeline[from].tempo
		let metreCount = this.currentProject.timeline[from].metre.count
		let metrePart = this.currentProject.timeline[from].metre.part
		this.currentProject.timeline.splice(to, 0, {
			tempo: newTempo
			, metre: { count: metreCount, part: metrePart }
		});
		for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
			let track = this.currentProject.tracks[nn];
			track.measures.splice(to, 0, { chords: [] });
		}
		for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
			let percu = this.currentProject.percussions[nn];
			percu.measures.splice(to, 0, { skips: [] });
		}
		for (let nn = 0; nn < this.currentProject.filters.length; nn++) {
			let filter = this.currentProject.filters[nn];
			filter.automation.splice(to, 0, { changes: [] });
		}
		this.currentProject.comments.splice(to, 0, { points: [] });
	}
	addBars() {
		//console.log('addBars');
		let selfrom = document.getElementById('selfrom');
		let selto = document.getElementById('selto');
		let startMeasure: number = parseInt((selfrom as any).value) - 1;
		let endMeasure: number = parseInt((selto as any).value) - 1;
		let len = endMeasure - startMeasure + 1;
		for (let ii = startMeasure; ii <= endMeasure; ii++) {
			this.insertEmptyBar(ii, ii + len);
		}
		this.closeDialog(this.currentProject);
	}
	clear() {
		let selfrom = document.getElementById('selfrom');
		let selto = document.getElementById('selto');
		let startMeasure: number = parseInt((selfrom as any).value) - 1;
		let endMeasure: number = parseInt((selto as any).value) - 1;
		let newDuration = MMUtil().set(this.currentProject.timeline[startMeasure].metre);
		let noSolo = true;
		for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
			if (this.currentProject.tracks[nn].performer.state == 2) {
				noSolo = false;
				break;
			}
		}
		for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
			if (this.currentProject.percussions[nn].sampler.state == 2) {
				noSolo = false;
				break;
			}
		}
		//console.log(noSolo, startMeasure, endMeasure);
		for (let ii = startMeasure; ii <= endMeasure; ii++) {
			for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
				if ((this.currentProject.tracks[nn].performer.state == 0 && noSolo) || this.currentProject.tracks[nn].performer.state == 2) {
					let trackBar = this.currentProject.tracks[nn].measures[ii];
					trackBar.chords = [];
					//console.log(ii, this.currentProject.tracks[nn].performer.state, this.currentProject.tracks[nn].title);
				}
			}
			for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
				if ((this.currentProject.percussions[nn].sampler.state == 0 && noSolo) || this.currentProject.percussions[nn].sampler.state == 2) {
					let percuBar = this.currentProject.percussions[nn].measures[ii];
					percuBar.skips = [];
				}
			}
			for (let nn = 0; nn < this.currentProject.filters.length; nn++) {
				if (this.currentProject.filters[nn].state == 0) {
					let autoBar = this.currentProject.filters[nn].automation[ii];
					autoBar.changes = [];
				}
			}
			let txtBar = this.currentProject.comments[ii];
			txtBar.points = [];
			newDuration = newDuration.plus(this.currentProject.timeline[ii].metre);
		}
		this.closeDialog(this.currentProject);
	}
	adjustContentByMeter(currentProject: Zvoog_Project) {
		for (let ii = 0; ii < currentProject.timeline.length; ii++) {
			let barMetre = MMUtil().set(currentProject.timeline[ii].metre);
			for (let nn = 0; nn < currentProject.tracks.length; nn++) {
				if (!(currentProject.tracks[nn].measures[ii])) currentProject.tracks[nn].measures[ii] = { chords: [] };
				let trackBar = currentProject.tracks[nn].measures[ii];
				for (let kk = 0; kk < trackBar.chords.length; kk++) {
					let chord = trackBar.chords[kk];
					if (barMetre.less(chord.skip)) {
						if (ii + 1 < currentProject.timeline.length) {
							chord.skip = MMUtil().set(chord.skip).minus(barMetre).simplyfy();
							trackBar.chords.splice(kk, 1);
							kk--;
							currentProject.tracks[nn].measures[ii + 1].chords.push(chord);
						} else {
							currentProject.timeline[ii].metre = MMUtil().set(chord.skip).plus({ count: 1, part: 8 }).metre();
						}
					}
				}
			}
			for (let nn = 0; nn < currentProject.percussions.length; nn++) {
				if (!(currentProject.percussions[nn].measures[ii])) currentProject.percussions[nn].measures[ii] = { skips: [] };
				let percuBar = currentProject.percussions[nn].measures[ii];
				for (let kk = 0; kk < percuBar.skips.length; kk++) {
					let skip = percuBar.skips[kk];
					if (barMetre.less(skip)) {
						if (ii + 1 < currentProject.timeline.length) {
							let newSkip = MMUtil().set(skip).minus(barMetre).simplyfy();
							percuBar.skips.splice(kk, 1);
							kk--;
							currentProject.percussions[nn].measures[ii + 1].skips.push(newSkip);
						} else {
							currentProject.timeline[ii].metre = MMUtil().set(skip).plus({ count: 1, part: 8 }).metre();
						}
					}
				}
			}
			for (let nn = 0; nn < currentProject.filters.length; nn++) {
				if (!(currentProject.filters[nn].automation[ii])) currentProject.filters[nn].automation[ii] = { changes: [] };
				let autoBar = currentProject.filters[nn].automation[ii];
				for (let kk = 0; kk < autoBar.changes.length; kk++) {
					let change = autoBar.changes[kk];
					if (barMetre.less(change.skip)) {
						if (ii + 1 < currentProject.timeline.length) {
							change.skip = MMUtil().set(change.skip).minus(barMetre).simplyfy();
							autoBar.changes.splice(kk, 1);
							kk--;
							currentProject.filters[nn].automation[ii + 1].changes.push(change);
						} else {
							currentProject.timeline[ii].metre = MMUtil().set(change.skip).plus({ count: 1, part: 8 }).metre();
						}
					}
				}
			}
			if (!(currentProject.comments[ii])) currentProject.comments[ii] = { points: [] };
			let textBar = currentProject.comments[ii];
			for (let kk = 0; kk < textBar.points.length; kk++) {
				let point = textBar.points[kk];
				if (barMetre.less(point.skip)) {
					if (ii + 1 < currentProject.timeline.length) {
						point.skip = MMUtil().set(point.skip).minus(barMetre).simplyfy();
						textBar.points.splice(kk, 1);
						kk--;
						console.log();
						currentProject.comments[ii + 1].points.push(point);
					} else {
						currentProject.timeline[ii].metre = MMUtil().set(point.skip).plus({ count: 1, part: 8 }).metre();
					}
				}
			}
		}
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


	//sendProjectToHost222() {
	/*var oo: MZXBX_MessageToHost = {
		dialogID: this.callbackID
		, pluginData: this.currentProject
		, done: true
	};
	window.parent.postMessage(oo, '*');*/
	//this.updateHostData(JSON.stringify(this.currentProject));
	//}
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
	/*
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
	}*/
	/*
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
	}*/
	//addBars2() {
	//console.log('addBars', this.startMeasure, this.endMeasure, this.currentProject.timeline.length);
	//let count = this.endMeasure - this.startMeasure + 1;
	//let newTempo = this.currentProject.timeline[this.endMeasure].tempo;
	//let newMetre = MMUtil().set(this.currentProject.timeline[this.endMeasure].metre);
	//for (let ii = 0; ii < count; ii++) {
	/*this.insertEmptyBar(this.endMeasure + 1
		, this.currentProject.timeline[this.endMeasure].tempo
		, this.currentProject.timeline[this.endMeasure].metre.count
		, this.currentProject.timeline[this.endMeasure].metre.part
	);*/
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
	//}
	//console.log('new len', this.currentProject.timeline.length);
	//this.sendProjectToHost();
	//}
	/*promptTempo() {
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
	}*/
	/*promptMetre() {
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
	}*/
	/*adjustContent() {
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
	}*/
}


