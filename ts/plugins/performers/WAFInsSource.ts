declare function WebAudioFontPlayer(): void;
class WAFInsSource implements ZvoogInstrumentPlugin {
	out: GainNode;
	params: ZvoogPluginParameter[];
	audioContext: AudioContext;
	poll: { node: OscillatorNode, end: number }[];
	ins: number = 0;
	zones: any;
	lockedState = new ZvoogPluginLock();
	transpose = 1 * 12;
	state(): ZvoogPluginLock {
		return this.lockedState;
	}

	cancelSchedule(): void {
		(window as any).wafPlayer.cancelQueue(this.audioContext);
	}
	scheduleChord(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void {
		//console.log(this.audioContext.currentTime, when, tempo, chord, variation);
		/*for (let i = 0; i < chord.length; i++) {
			let envelope: ZvoogEnvelope = chord[i];
			let slides: { pitch: number, when: number }[] = [];
			let duration: number = duration2seconds(tempo, duration384(envelope.pitches[0].duration));
			let t = 0;
			for (let n = 1; n < envelope.pitches.length; n++) {
				t = t + duration2seconds(tempo, duration384(envelope.pitches[n - 1].duration));
				slides.push({
					pitch: envelope.pitches[n].pitch
					, when: t
				});
				duration = duration + duration2seconds(tempo, duration384(envelope.pitches[n].duration));
			}
			(window as any).wafPlayer.queueWaveTable(this.audioContext
				, this.out, this.zones, when, envelope.pitches[0].pitch, duration, 1.0, slides);
		}*/
		//if (this.busy()==0) {
		let pitches: number[] = [];
		for (let i = 0; i < chord.length; i++) {
			let envelope: ZvoogEnvelope = chord[i];
			pitches.push(envelope.pitches[0].pitch + this.transpose);
		}
		let envelope: ZvoogEnvelope = chord[0];
		//let duration: number = duration2seconds(tempo, duration384(envelope.pitches[0].duration));
		let duration: number = meter2seconds(tempo, envelope.pitches[0].duration);

		let slides: { pitch: number, when: number }[] = [];
		let tt = 0;
		for (let n = 1; n < envelope.pitches.length; n++) {
			//tt = tt + duration2seconds(tempo, duration384(envelope.pitches[n - 1].duration));
			slides.push({
				pitch: envelope.pitches[n].pitch + this.transpose
				, when: tt
			});
			//duration = duration + duration2seconds(tempo, duration384(envelope.pitches[n].duration));
			duration = duration + meter2seconds(tempo, envelope.pitches[n].duration);
		}
		//this.out=this.audioContext.destination;
		if (variation == 1 || variation == 2 || variation == 3) {
			if (variation == 1) {
				(window as any).wafPlayer.queueStrumDown(this.audioContext
					, this.out
					//, this.audioContext.destination
					, this.zones, when, pitches, duration, 0.99, slides);
			} else {
				if (variation == 2) {
					(window as any).wafPlayer.queueStrumUp(this.audioContext
						, this.out
						//, this.audioContext.destination
						, this.zones, when, pitches, duration, 0.99, slides);
				} else {
					(window as any).wafPlayer.queueSnap(this.audioContext
						, this.out
						//, this.audioContext.destination
						, this.zones, when, pitches, duration, 0.99, slides);
				}
			}
		} else {
			//console.log(this.audioContext, this.out, this.zones, when, pitches, duration, 1.0, slides);
			(window as any).wafPlayer.queueChord(this.audioContext
				, this.out
				//, this.audioContext.destination
				, this.zones, when, pitches, duration, 0.99, slides);
		}
		//}
	}
	prepare(audioContext: AudioContext, data: string): void {
		if (this.out) {
			//console.log('skip init', data);
		} else {
			this.out = audioContext.createGain();
			this.params = [];
			this.poll = [];
			this.audioContext = audioContext;
			this.initWAF();
		}
		this.zones = null;
		this.ins = parseInt(data);
		this.selectIns(this.ins);
		//console.log('prepare', data);
	}
	getOutput(): AudioNode {
		return this.out;
	}
	getParams(): ZvoogPluginParameter[] {
		return this.params;
	}
	busy(): number {
		if (this.zones) {
			return 0;
		}
		else {
			return 1;
		}
	}
	//constructor(insNum: number) {
	//	this.ins = insNum;
	//}
	initWAF() {
		if (!((window as any).wafPlayer)) {
			(window as any).wafPlayer = new WebAudioFontPlayer();
		}
	}
	selectIns(nn: number): void {
		let me = this;
		let info = (window as any).wafPlayer.loader.instrumentInfo(nn);
		//console.log(info);
		(window as any).wafPlayer.loader.startLoad(this.audioContext, info.url, info.variable);
		(window as any).wafPlayer.loader.waitLoad(function () {
			me.zones = window[info.variable];
			//console.log(me.zones);
		});
	}
	getParId(nn: number): string | null {
		return null;
	}
}
