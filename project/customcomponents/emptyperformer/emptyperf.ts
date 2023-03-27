class EmptyPerformer implements MZXBX_AudioPerformerPlugin {
	out: GainNode;
	launch(context: AudioContext, parameters: string): void {
		if (this.out) {
			//
		} else {
			this.out = context.createGain();
		}
	}
	busy(): null | string {
		return null;
	}
	schedule(when: number, pitch: number, slides: MZXBX_SlideItem[]): void {
		//
	}
	output(): AudioNode | null {
		return this.out;
	}
	cancel(): void {
		//
	}
}
function testCreateEmpty(): MZXBX_AudioPerformerPlugin {
	return new EmptyPerformer();
}
