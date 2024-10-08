//console.log('test volume plugin v1.01');
class SimpleTestVolumePlugin implements MZXBX_AudioFilterPlugin {
    base: GainNode;
    schedule(when: number, parameters: string) {
        //console.log('not implemented yet');
        let nn01: number = parseFloat(parameters);
        this.base.gain.setValueAtTime(nn01/100,when);
    }
	launch(context: AudioContext, parameters: string): void {
		//console.log('reset', this,parameters);
		if (!(this.base)) {
			this.base = context.createGain();
		}
		let nn01: number = parseFloat(parameters);
		//console.log('gain', nn01);
        this.base.gain.value = nn01/100;
        //console.log('value', nn01);
		//return true;
	}
	busy():null|string{
		return null;
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
