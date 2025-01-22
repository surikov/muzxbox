console.log('zvolume');
class ZVolImplementation implements MZXBX_AudioFilterPlugin {
	audioContext: AudioContext;
	volume: GainNode;
	num: number;
	launch(context: AudioContext, parameters: string): void {
		//console.log('ZVolImplementation launch', parameters);
		this.audioContext = context;
		this.volume = this.audioContext.createGain();
		this.num = parseInt(parameters);
		this.volume.gain.setValueAtTime(this.num / 100, 0);
	}
	busy(): null | string {
		return null;
	}
	schedule(when: number, parameters: string): void {
		//console.log('ZVolImplementation schedule', when, parameters);
		this.volume.gain.setValueAtTime(this.num / 100, when);
		this.num = parseInt(parameters);
		//console.log(parameters,this.num, when);
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
class ZVUI{
	init(){
		console.log('ZVUI init');
	}
}
function initZVUI(){
	let zz=new ZVUI();
	zz.init();
}
