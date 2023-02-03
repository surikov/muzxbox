console.log('test volume plugin v1.01');
class SimpleTestVolumePlugin implements MZXBX_AudioFilterPlugin {
	reset(context: AudioContext, parameters: string): boolean {
		console.log('reset', this);
		return true;
	}
}
function testPluginForVolume1(): MZXBX_AudioFilterPlugin {
	console.log('new SimpleTestVolumePlugin');
	return new SimpleTestVolumePlugin();
}
