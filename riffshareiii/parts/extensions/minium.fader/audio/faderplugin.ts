console.log('Fader v1.0');
class FaderImplementation implements MZXBX_AudioFilterPlugin {
	audioContext: AudioContext;
	volumeNode: GainNode;
	volVal: number = 0;
	launch(context: AudioContext, parameters: string): void {
		this.audioContext = context;
		this.volumeNode = this.audioContext.createGain();
		this.schedule(this.audioContext.currentTime + 0.001, 120, parameters);
	}
	busy(): null | string {
		return null;
	}
	schedule(when: number, tempo: number, parameters: string): void {
		this.parseParameters(parameters);
		//this.volumeNode.gain.setValueAtTime(this.volVal / 100, when);
		//this.volumeNode.gain.linearRampToValueAtTime(this.volVal / 100, when + 0.001);
		this.volumeNode.gain.setTargetAtTime(this.volVal / 100, when, 0.001);

	}
	input(): AudioNode | null {
		return this.volumeNode;
	}
	output(): AudioNode | null {
		return this.volumeNode;
	}
	parseParameters(parameters: string) {
		this.volVal = parseInt(parameters);
		this.volVal = (this.volVal) ? this.volVal : 0;
		this.volVal = 1 * this.volVal;
		this.volVal = (this.volVal < 0) ? 0 : this.volVal;
		this.volVal = (this.volVal > 150) ? 150 : this.volVal;
	}
}
function newBaseFader(): MZXBX_AudioFilterPlugin {
	return new FaderImplementation();
}
