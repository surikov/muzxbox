declare function WebAudioFontPlayer(): void;
class WAFPercSource implements ZvoogPercussionPlugin {
	out: GainNode;
	params: ZvoogPluginParameter[];
	audioContext: AudioContext;
	poll: { node: OscillatorNode, end: number }[];
	ins: number = 0;
	zones: any;
	lockedState = new ZvoogPluginLock();
	state(): ZvoogPluginLock {
		return this.lockedState;
	}
	
	cancelSchedule(): void {
		(window as any).wafPlayer.cancelQueue(this.audioContext);
	}
	scheduleHit(when: number): void {
		//let drumPitch=33;
		let duration=1;
		(window as any).wafPlayer.queueWaveTable(this.audioContext
			, this.out, this.zones, when, this.ins, duration, 0.99);
	}
	prepare(audioContext: AudioContext, data: string): void {
		if (this.out) {
			//
		} else {
			this.out = audioContext.createGain();
			this.params = [];
			this.poll = [];
			this.audioContext = audioContext;
			this.initWAF();
		}
		this.ins = parseInt(data);
		this.selectDrum(this.ins);
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
	selectDrum(nn: number): void {
		let me = this;
		let idx=(window as any).wafPlayer.loader.findDrum(nn);
		let info = (window as any).wafPlayer.loader.drumInfo(idx);
		//console.log(nn,idx,info);
		(window as any).wafPlayer.loader.startLoad(this.audioContext, info.url, info.variable);
		(window as any).wafPlayer.loader.waitLoad(function () {
			me.zones = window[info.variable];
		});
	}
	getParId(nn: number): string | null {
		return null;
	}
}