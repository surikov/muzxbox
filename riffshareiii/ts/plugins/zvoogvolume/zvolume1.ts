console.log('zvolume');
class ZVolImplementation implements MZXBX_AudioFilterPlugin {
	audioContext: AudioContext;
	volume: GainNode;
	num: number;
	launch(context: AudioContext, parameters: string): void {
		console.log('ZVolImplementation launch', parameters);
		this.audioContext = context;
		this.volume = this.audioContext.createGain();
		this.num = parseInt(parameters);
		this.volume.gain.setValueAtTime(this.num / 100, 0);
	}
	busy(): null | string {
		return null;
	}
	schedule(when: number, parameters: string): void {
		console.log('ZVolImplementation schedule', when, parameters);
		this.volume.gain.setValueAtTime(this.num / 100, when);
		this.num = parseInt(parameters);
		this.volume.gain.linearRampToValueAtTime(0.7 * this.num, when + 0.001);

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
