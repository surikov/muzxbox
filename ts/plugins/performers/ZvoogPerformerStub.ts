class ZvoogPerformerStub implements ZvoogPerformerPlugin {
	base: GainNode;
	params: ZvoogPluginParameter[];
	lockedState = new ZvoogPluginLock();
	setData(data: string): void {
		//
	}
	state(): ZvoogPluginLock {
		return this.lockedState;
	}
	passthrough(value: boolean): void{

	}
	prepare(audioContext: AudioContext): void {
		if (this.base) {
			//
		} else {
			this.base = audioContext.createGain();
		}
		this.params = [];
	}
	getOutput(): AudioNode {
		return this.base;
	}
	getParams(): ZvoogPluginParameter[] {
		return this.params;
	}
	busy(): number {
		return 0;
	}
	cancelSchedule(): void {
		//
	}
	addSchedule(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void {
		//
	}
}
