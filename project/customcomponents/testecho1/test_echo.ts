console.log('test echo plugin v1.01');
class SimpleEchoTestPlugin implements MZXBX_AudioFilterPlugin {
	reset(context: AudioContext, parameters: string): boolean {
		console.log('reset', this);
		return true;
	}
}
function testPluginForEcho1(): MZXBX_AudioFilterPlugin {
	console.log('new SimpleEchoTestPlugin');
	return new SimpleEchoTestPlugin();
}
