console.log('test volume plugin v1.01');
class SimpleSinePerformer implements MZXBX_AudioPerformerPlugin {
	reset(context: AudioContext, parameters: string): boolean {
		console.log('reset', this);
		return true;
	}
	schedule(when: number, pitch: number, volume: number, slides: MZXBX_SlideItem[]): void {
		console.log('schedule', this);
	}
	cancel(): void {
		console.log('cancel', this);
	}
}
function testPluginSingleWave(): MZXBX_AudioPerformerPlugin {
	console.log('new testPluginSingleWave');
	return new SimpleSinePerformer();
}
