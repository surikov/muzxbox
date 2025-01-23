console.log('zvolume v1.0');
class ZVolImplementation implements MZXBX_AudioFilterPlugin {
	audioContext: AudioContext;
	volume: GainNode;
	num: number;
	launch(context: AudioContext, parameters: string): void {
		this.audioContext = context;
		this.volume = this.audioContext.createGain();
		this.num = parseInt(parameters);
		this.volume.gain.setValueAtTime(this.num / 100, 0);
	}
	busy(): null | string {
		return null;
	}
	schedule(when: number, parameters: string): void {
		this.volume.gain.setValueAtTime(this.num / 100, when);
		this.num = parseInt(parameters);
		this.volume.gain.linearRampToValueAtTime(this.num / 100, when + 0.001);

	}
	input(): AudioNode | null {
		return this.volume;
	}
	output(): AudioNode | null {
		return this.volume;
	}
}
function newZvoogVolumeImplementation(): MZXBX_AudioFilterPlugin {
	return new ZVolImplementation();
}

