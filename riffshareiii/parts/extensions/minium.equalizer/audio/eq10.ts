console.log('Equalizer v1.0');
class EqualizerImplementation implements MZXBX_AudioFilterPlugin {
	audioContext: AudioContext;
	inputNode: GainNode;
	band32: BiquadFilterNode;
	band64: BiquadFilterNode;
	band128: BiquadFilterNode;
	band256: BiquadFilterNode;
	band512: BiquadFilterNode;
	band1k: BiquadFilterNode;
	band2k: BiquadFilterNode;
	band4k: BiquadFilterNode;
	band8k: BiquadFilterNode;
	band16k: BiquadFilterNode;
	outputNode: GainNode;
	values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	launch(context: AudioContext, parameters: string): void {
		if (this.audioContext) {
			//
		} else {
			this.audioContext = context;
			this.inputNode = this.audioContext.createGain();
			this.band32 = this.bandEqualizer(this.inputNode, 32);
			this.band64 = this.bandEqualizer(this.band32, 64);
			this.band128 = this.bandEqualizer(this.band64, 128);
			this.band256 = this.bandEqualizer(this.band128, 256);
			this.band512 = this.bandEqualizer(this.band256, 512);
			this.band1k = this.bandEqualizer(this.band512, 1024);
			this.band2k = this.bandEqualizer(this.band1k, 2048);
			this.band4k = this.bandEqualizer(this.band2k, 4096);
			this.band8k = this.bandEqualizer(this.band4k, 8192);
			this.band16k = this.bandEqualizer(this.band8k, 16384);
			this.outputNode = this.audioContext.createGain();
			this.band16k.connect(this.outputNode);
		}
		this.schedule(this.audioContext.currentTime, 120, parameters);
	}
	busy(): null | string {
		return null;
	}
	schedule(when: number, tempo: number, parameters: string): void {
		this.parseParameters(parameters);
		this.band32.gain.setTargetAtTime(this.values[0] , when, 0.01);
		this.band64.gain.setTargetAtTime(this.values[1] , when, 0.01);
		this.band128.gain.setTargetAtTime(this.values[2], when, 0.01);
		this.band256.gain.setTargetAtTime(this.values[3], when, 0.01);
		this.band512.gain.setTargetAtTime(this.values[4], when, 0.01);
		this.band1k.gain.setTargetAtTime(this.values[5] , when, 0.01);
		this.band2k.gain.setTargetAtTime(this.values[6] , when, 0.01);
		this.band4k.gain.setTargetAtTime(this.values[7] , when, 0.01);
		this.band8k.gain.setTargetAtTime(this.values[8] , when, 0.01);
		this.band16k.gain.setTargetAtTime(this.values[9], when, 0.01);

	}
	input(): AudioNode | null {
		return this.inputNode;
	}
	output(): AudioNode | null {
		return this.outputNode;
	}
	parseParameters(parameters: string) {
		try {
			let arr = JSON.parse(parameters);
			for (let ii = 0; ii < 10; ii++) {
				this.values[ii] = (arr[ii]) ? (1 * arr[ii]) : 0;
			}
		} catch (xx) {
			console.log(xx);
		}
	}
	bandEqualizer(from: AudioNode, frequency: number): BiquadFilterNode {
		var filter: BiquadFilterNode = this.audioContext.createBiquadFilter();
		filter.frequency.setTargetAtTime(frequency, 0, 0.0001);
		filter.type = "peaking";
		filter.gain.setTargetAtTime(0, 0, 0.0001);
		filter.Q.setTargetAtTime(1.0, 0, 0.0001);
		from.connect(filter);
		return filter;
	};
}
function new10bEqualizer(): MZXBX_AudioFilterPlugin {
	return new EqualizerImplementation();
}
