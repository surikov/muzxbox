console.log('MINIUMselectionEditPlugin v1.0.1');
class MINIUMselectionEditPlugin {
	callbackID = '';
	currentProject: Zvoog_Project;
	startMeasure = 0;
	endMeasure = 0;
	constructor() {
		this.init();
	}
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		window.parent.postMessage({
			dialogID: ''
			, pluginData: ''
			, done: false
		}, '*');
	}
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
		let selectionInfo = document.getElementById('selectionInfo');
		if (selectionInfo) {
			selectionInfo.innerHTML = '' + (this.startMeasure + 1) + ' - ' + (this.endMeasure + 1);
		}
	}

	sendProjectToHost() {
		var oo: MZXBX_MessageToHost = {
			dialogID: this.callbackID
			, pluginData: this.currentProject
			, done: true
		};
		window.parent.postMessage(oo, '*');
	}
	receiveHostMessage(par) {
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
	}
	deleteBars() {
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
		this.sendProjectToHost();
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
	addBars() {
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
		this.sendProjectToHost();
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
				this.sendProjectToHost();
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
				this.sendProjectToHost();
			}
		}
	}
	shiftContent() {
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


