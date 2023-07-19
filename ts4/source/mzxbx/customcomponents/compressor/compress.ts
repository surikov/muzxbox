class SimpleCompressorPlugin implements MZXBX_AudioFilterPlugin {
	inpt: GainNode;
	outpt: GainNode;
	//fx: GainNode;
	//pass: GainNode;
	compressor: DynamicsCompressorNode;
	schedule(when: number, parameters: string) {
		console.log('not implemented yet');
	}
	launch(context: AudioContext, parameters: string): void {
		if (!(this.inpt)) {
			this.inpt = context.createGain();
			this.outpt = context.createGain();
			this.compressor = context.createDynamicsCompressor();
			this.inpt.connect(this.compressor);
			this.compressor.connect(this.outpt);
			//this.fx = context.createGain();
			//this.compressor.connect(this.outpt);
			//this.fx.connect(this.outpt);
			//this.pass = context.createGain();
			//this.inpt.connect(this.pass);
			//this.pass.connect(this.outpt);

			var threshold = -35;
			var knee = 35;
			var ratio = 8;
			var attack = 0.02;
			var release = 0.1;

			this.compressor.threshold.setValueAtTime(threshold, 0.0001);//-100,0
			this.compressor.knee.setValueAtTime(knee, 0.0001);//0,40
			this.compressor.ratio.setValueAtTime(ratio, 0.0001);//2,20
			this.compressor.attack.setValueAtTime(attack, 0.0001);//0,1
			this.compressor.release.setValueAtTime(release, 0.0001);//0,1

			//this.pass.gain.setTargetAtTime(0.8, 0, 0.0001);
			//this.fx.gain.setTargetAtTime(0.2, 0, 0.0001);
		}
	}
	busy(): string | null {
		return null;
	}
	output(): AudioNode | null {
		return this.outpt;
	}
	input(): AudioNode | null {
		return this.inpt;
	}
}
function basePluginForCompression(): MZXBX_AudioFilterPlugin {
	return new SimpleCompressorPlugin();
}
