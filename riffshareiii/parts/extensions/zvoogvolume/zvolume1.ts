console.log('zvolume v1.0');
class ZVolImplementation implements MZXBX_AudioFilterPlugin {
	audioContext: AudioContext;
	volume: GainNode;
	num: number = 0;
	launch(context: AudioContext, parameters: string): void {
		this.audioContext = context;
		this.volume = this.audioContext.createGain();
		//this.num = parseInt(parameters);
		//this.volume.gain.setValueAtTime(this.num / 100, 0);
		this.schedule(this.audioContext.currentTime + 0.001, 120, parameters);
	}
	busy(): null | string {
		return null;
	}
	schedule(when: number, tempo: number, parameters: string): void {
		this.volume.gain.setValueAtTime(this.num / 100, when);
		this.num = parseInt(parameters);
		this.num = (this.num) ? this.num : 0;
		if (this.num < 0) this.num = 0;
		if (this.num > 100) this.num = 100;
		this.volume.gain.linearRampToValueAtTime(this.num / 100, when + 0.001);
		//console.log(this.audioContext.currentTime, when, tempo,parameters,this.num);
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

