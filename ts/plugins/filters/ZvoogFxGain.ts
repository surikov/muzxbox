class ZvoogFxGain implements ZvoogFilterPlugin {
	base: GainNode;
	params: ZvoogPluginParameter[];
	lockedState = new ZvoogPluginLock();
	state(): ZvoogPluginLock {
		return this.lockedState;
	}
	
	prepare(audioContext: AudioContext, data: string): void {
		if (this.base) {
			//
		} else {
			this.base = audioContext.createGain();
			this.params = [];
			//this.params.push((this.base.gain as any) as ZvoogAudioParam);
			this.params.push(new RangedAudioParam120(((this.base.gain as any) as ZvoogPluginParameter), 0, 1));
		}
	}
	getInput(): AudioNode {
		return this.base;
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
}
