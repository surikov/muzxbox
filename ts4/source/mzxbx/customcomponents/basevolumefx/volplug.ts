class BaseVolumeFxPlugin implements MZXBX_AudioFilterPlugin {
	base: GainNode;
	schedule(when: number, parameters: string) {
		let nn01: number = parseFloat(parameters);
		this.base.gain.setValueAtTime(nn01 / 100, when);
	}
	launch(context: AudioContext, parameters: string): void {//89%
		if (!(this.base)) {
			this.base = context.createGain();
		}
		let nn01: number = parseFloat(parameters);

		if (isNaN(nn01)) {
			console.log('parameters', parameters, '/', nn01);
		} else {
			this.base.gain.value = nn01 / 100;
		}
		//console.log('BaseVolumeFxPlugin.launch',nn01 / 100,parameters);
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
function createBaseVolumeFx(): MZXBX_AudioFilterPlugin {
	return new BaseVolumeFxPlugin();
}
