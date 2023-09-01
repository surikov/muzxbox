
class StretchShiftFxPlugin implements MZXBX_AudioFilterPlugin {
	base: GainNode;
	schedule(when: number, parameters: string) {
		let nn01: number = parseFloat(parameters);
		this.base.gain.setValueAtTime(nn01 / 100, when);
	}
	launch(context: AudioContext, parameters: string): void {
		if (!(this.base)) {
			this.base = context.createGain();
		}
		let nn01: number = parseFloat(parameters);
		this.base.gain.value = nn01 / 100;
	}
	busy(): null | string {
		return null;
	}
	output(): AudioNode | null {
		return this.base;
	}
	input(): AudioNode | null {
		return this.base;
	}

}
function createStretchShiftFx(): MZXBX_AudioFilterPlugin {
	return new StretchShiftFxPlugin();
}

function testit(){
	console.log('testit');
}
