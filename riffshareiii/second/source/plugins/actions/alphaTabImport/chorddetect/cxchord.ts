class ChordFinder {
	halfStepNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
	counts: number[];
	steps12: number[];
	tonic = -1;
	pretonic = -1;
	avg = -1;
	isminor = false;
	seventh = false;
	//mmm=false;
	triadPrefs: number[];
	constructor(pretonic: number, triadPrefs: number[], pre7: boolean, barNo: number, from: Zvoog_Metre, to: Zvoog_Metre, project: Zvoog_Project) {
		//this.mmm=preminor;
		this.pretonic = pretonic;
		//this.minor = preminor;
		this.triadPrefs = triadPrefs;
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
			//console.log(project.tracks[tt].title,barNo,trackMeasure);
			for (let cc = 0; cc < trackMeasure.chords.length; cc++) {
				let trackMeasureChord = trackMeasure.chords[cc];
				let mm = MMUtil().set(trackMeasureChord.skip);
				if ((!mm.less(from)) && mm.less(to)) {
					for (let pp = 0; pp < trackMeasureChord.pitches.length; pp++) {
						let halftone = trackMeasureChord.pitches[pp];
						let weight = this.pitchWeight(halftone);
						this.counts[halftone] = this.counts[halftone] + weight;
						this.steps12[halftone % 12] = this.steps12[halftone % 12] + weight;
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
		//console.log(this.counts,this.steps12,this.avg);
		this.findTonic();
	}
	pitchWeight(half: number): number {
		let oct = Math.floor(half / 12);
		let rr = 10 - oct;
		return 1 + rr * 0.123;
	}
	findTonic() {
		this.tonic = this.pretonic;
		for (let ii = 0; ii < 12; ii++) {
			if (this.steps12[ii] > 0) {
				if (this.tonic < 0) {
					this.tonic = ii;
				} else {
					/*if (this.steps12[ii] > this.steps12[this.tonic]) {
						this.tonic = ii;
					} else {
						if (this.steps12[ii] == this.steps12[this.tonic] && this.steps12[(ii + 7) % 12] > this.steps12[(this.tonic + 7) % 12]) {
							this.tonic = ii;
						}
					}*/
					if (this.steps12[ii] + 0.5 * this.steps12[(ii + 7) % 12] > this.steps12[this.tonic] + 0.5 * this.steps12[(this.tonic + 7) % 12]) {
						this.tonic = ii;
					}
				}
			}
		}
		//console.log(this.halfStepNames[this.tonic], this.tonic, JSON.stringify(this.steps12));
		if (this.tonic == this.pretonic) {
			//
		} else {
			this.seventh = false;
			//this.minor = false;
		}
		if (this.steps12[(this.tonic + 10) % 12] > 0) {
			this.seventh = true;
		}


		if (this.steps12[(this.tonic + 3) % 12] > this.steps12[(this.tonic + 4) % 12]) {
			this.isminor = true;
			this.triadPrefs[this.tonic]=-1;
		} else {
			if (this.steps12[(this.tonic + 3) % 12] < this.steps12[(this.tonic + 4) % 12]) {
				this.isminor = false;
				this.triadPrefs[this.tonic]=1;
			}else{
				if(this.triadPrefs[this.tonic]<0){
					this.isminor = true;
				}
			}
		}
	}
	chordLabel(): string {
		let label = '';
		if (this.tonic < 0) {
			label = '?';
		} else {
			label = this.halfStepNames[this.tonic];
			if (this.isminor) {
				label = label + 'm';
			}
			if (this.seventh) {
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
