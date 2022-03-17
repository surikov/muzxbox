class WAFEqualizer implements ZvoogFilterPlugin {
	inpt: GainNode;
	outpt: GainNode;
	chnl: any;
	params: ZvoogPluginParameter[];
	lockedState = new ZvoogPluginLock();
	state(): ZvoogPluginLock {
		return this.lockedState;
	}

	prepare(audioContext: AudioContext, data: string): void {
		if (this.inpt) {
			//
		} else {
			this.inpt = audioContext.createGain();
			this.outpt = audioContext.createGain();
			this.params = [];
			this.initWAF();
			this.chnl = (window as any).wafPlayer.createChannel(audioContext);
			this.params.push(new RangedAudioParam120(((this.chnl.band32.gain as any) as ZvoogPluginParameter), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band64.gain as any) as ZvoogPluginParameter), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band128.gain as any) as ZvoogPluginParameter), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band256.gain as any) as ZvoogPluginParameter), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band512.gain as any) as ZvoogPluginParameter), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band1k.gain as any) as ZvoogPluginParameter), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band2k.gain as any) as ZvoogPluginParameter), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band4k.gain as any) as ZvoogPluginParameter), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band8k.gain as any) as ZvoogPluginParameter), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band16k.gain as any) as ZvoogPluginParameter), -10, 10));
		}
		this.inpt.connect(this.chnl.input);
		this.chnl.output.connect(this.outpt);
	}
	getInput(): AudioNode {
		return this.inpt;
	}
	getOutput(): AudioNode {
		return this.outpt;
	}
	getParams(): ZvoogPluginParameter[] {
		return this.params;
	}

	busy(): number {
		return 0;
	}
	initWAF() {
		if (!((window as any).wafPlayer)) {
			(window as any).wafPlayer = new WebAudioFontPlayer();
		}
	}
	getParId(nn: number): string | null {
		switch (nn) {
			case 0: return '32';
			case 1: return '64';
			case 2: return '128';
			case 3: return '256';
			case 4: return '512';
			case 5: return '1k';
			case 6: return '2k';
			case 7: return '4k';
			case 8: return '8k';
			case 9: return '16k';
		}
		return null;
	}
}
