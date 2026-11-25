console.log('BarTimeEdit v1.0.3');
class MiniumHarmonyPlugin extends MZXBX_Plugin_UI {
	callbackID = '';
	currentProject: Zvoog_Project;
	startMeasure = 0;
	endMeasure = 0;
	constructor() {
		super(false);
	}
	onMessageFromHost(message: MZXBX_MessageToPlugin): void {
		this.currentProject = message.hostData;
		if (this.currentProject) {
			this.refreshInfo();
			let preview=this.setupProjectChordHints(this.currentProject);
			this.setText('preview', '' + preview);
			
		}
	}
	refreshInfo() {
		this.startMeasure = this.currentProject.selectedPart.startMeasure;
		this.endMeasure = this.currentProject.selectedPart.endMeasure;
		if (this.startMeasure < 0) {
			this.startMeasure = 0;
			this.endMeasure = this.currentProject.timeline.length - 1;
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
			this.setText('btnok', 'OK');

		} else {
			if (enruzhId == 'ru') {
				this.setText('btnok', 'OK');
			} else {
				this.setText('btnok', 'OK');
			}
		}

	}
	sendClose() {
		console.log('sendClose');


		this.closeDialog(this.currentProject);
	}

	setupProjectChordHints(project: Zvoog_Project | null): string {
		let preview = '';
		if (project) {
			let lastLabel = '';
			let step = { count: 1, part: 2 };
			let lastTonic = -1;
			let last7 = false;
			let triadPrefs: number[] = [];
			for (let hh = 0; hh < 12; hh++) {
				triadPrefs[hh] = 0;
			}
			for (let ii = this.startMeasure; ii <= this.endMeasure; ii++) {
				for (let nn = 0; nn < project.comments[ii].points.length; nn++) {
					if (project.comments[ii].points[nn].row == 0) {
						project.comments[ii].points.splice(nn, 1);
						nn--;
					}
				}
			}
			for (let ii = this.startMeasure; ii <=this.endMeasure; ii++) {
				let measure = project.timeline[ii];
				let point = MMUtil().set({ count: 0, part: 1 });
				let barLabel = ', ' + (1 + ii) + ':';
				if(ii == this.startMeasure){
					barLabel = '' + (1 + ii) + ':';
				}
				while (point.less(measure.metre)) {
					let chord = new ChordFinder(lastTonic, triadPrefs, last7, ii, point, point.plus(step), project);
					lastTonic = chord.tonic;
					last7 = chord.seventh;
					let label = chord.chordLabel();
					if (label != lastLabel) {
						preview = preview + barLabel + ' ' + label;
						barLabel = '';

						project.comments[ii].points.push({
							skip: point.metre()
							, text: label
							, row: 0
						});
						lastLabel = label;
					}
					point = point.plus(step);
				}
			}
		}
		return preview;
	}
}


