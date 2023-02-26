//console.log('test volume plugin v1.01');
class SimpleTestVolumePlugin implements MZXBX_AudioFilterPlugin {
    base: GainNode;
    schedule(when: number, parameters: string) {
        console.log('not implemented yet');
    }
	reset(context: AudioContext, parameters: string): boolean {
		//console.log('reset', this);
		if (!(this.base)) {
			this.base = context.createGain();
		}
		let nn01: number = parseFloat(parameters);
        this.base.gain.value = nn01;
        //console.log('value', nn01);
		return true;
	}
	output(): AudioNode | null {
		return this.base;
	}
	input(): AudioNode | null {
		return this.base;
	}
}
function testPluginForVolume1(): MZXBX_AudioFilterPlugin {
	//console.log('new SimpleTestVolumePlugin');
	return new SimpleTestVolumePlugin();
}
