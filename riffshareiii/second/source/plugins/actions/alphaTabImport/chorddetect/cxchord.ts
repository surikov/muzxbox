class ChordFinder {
	halfStepNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
	counts: number[];
	steps12: number[];
	tonic = -1;
	pretonic = -1;
	avg = -1;
	minor = false;
	seventh = false;
	//mmm=false;
	constructor(pretonic: number, preminor: boolean, pre7: boolean, barNo: number, from: Zvoog_Metre, to: Zvoog_Metre, project: Zvoog_Project) {
		//this.mmm=preminor;
		this.pretonic = pretonic;
		this.minor = preminor;
		this.seventh = pre7;
		this.counts = [];
		this.steps12 = [];
		for (let ii = 0; ii < 128; ii++) {
			this.counts[ii] = 0;
		}
		for (let ii = 0; ii < 12; ii++) {
			this.steps12[ii] = 0;
		}
		for (let tt = 0; tt < project.tracks.length; tt++) {
			let trackMeasure = project.tracks[tt].measures[barNo];
			for (let cc = 0; cc < trackMeasure.chords.length; cc++) {
				let trackMeasureChord = trackMeasure.chords[cc];
				let mm = MMUtil().set(trackMeasureChord.skip);
				if ((!mm.less(from)) && mm.less(to)) {
					for (let pp = 0; pp < trackMeasureChord.pitches.length; pp++) {
						let halftone = trackMeasureChord.pitches[pp];
						this.counts[halftone]++;
						this.steps12[halftone % 12]++;
					}
				}
			}
		}
		let sum = 0;
		let cnt = 0;
		for (let ii = 0; ii < 128; ii++) {
			if (this.counts[ii] > 0) {
				sum = sum + ii * this.counts[ii];
				cnt = cnt + this.counts[ii];
			}
		}
		this.avg = Math.round(sum / cnt);
		this.findTonic();
	}
	findTonic() {
		this.tonic = this.pretonic;
		for (let ii = 0; ii < 12; ii++) {
			if (this.steps12[ii] > 0) {
				if (this.tonic < 0) {
					this.tonic = ii;
				} else {
					if (this.steps12[ii] > this.steps12[this.tonic]) {
						this.tonic = ii;
					} else {
						if (this.steps12[ii] == this.steps12[this.tonic] && this.steps12[(ii + 7) % 12] > this.steps12[(this.tonic + 7) % 12]) {
							this.tonic = ii;
						}
					}
				}
			}
		}
		//console.log(this.halfStepNames[this.tonic], this.tonic, JSON.stringify(this.steps12));
		if (this.tonic == this.pretonic) {
			//
		} else {
			this.seventh = false;
			this.minor = false;
		}
		if (this.steps12[(this.tonic + 10) % 12] > 0) {
			this.seventh = true;
		}
		if (this.steps12[(this.tonic + 3) % 12] > this.steps12[(this.tonic + 4) % 12]) {
			this.minor = true;
		}
	}
	chordLabel(): string {
		let label = '';
		if (this.tonic < 0) {
			label = '?';
		} else {
			label = this.halfStepNames[this.tonic];
			if(this.minor){
				label = label + 'm';
			}
			if(this.seventh){
				label = label + '7';
			}
			/*if (this.steps12[(this.tonic + 3) % 12] == 0 && this.steps12[(this.tonic + 4) % 12] == 0) {
				label = label + '5';
			} else {
				if (this.steps12[(this.tonic + 3) % 12] > this.steps12[(this.tonic + 4) % 12]) {
					label = label + 'm';
				}
			}
			if (this.steps12[(this.tonic + 10) % 12] > 0) {
				label = label + '7';
			}*/
			//label = label+ ':' + JSON.stringify(this.steps12);/
			/*
			for (let kk = 0; kk < 12; kk++) {
				if (this.steps12[kk] > 0) {
					label = label + '/' + this.halfStepNames[kk] + this.steps12[kk];
				}
			}*/

			//label = label+ ':' +this.minor+'-'+this.mmm;
			
		}
		//console.log(label);
		return label;
	}
}
