let synth: SynthDX7;
function initTester() {
	console.log('initTester');
	let audioContext = new window.AudioContext();
	synth = new SynthDX7(audioContext);
}
function testPlay() {
	console.log('testPlay');
	synth.test();
}
