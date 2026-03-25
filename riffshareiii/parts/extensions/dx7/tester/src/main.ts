let synth: SynthDX7;
let acx: AudioContext;
function initTester() {
	console.log('initTester');
	acx = new window.AudioContext();
	synth = new SynthDX7(acx);
}
function testPlay() {
	console.log('testPlay');
	synth.scheduleStrum(epiano1preset, acx.currentTime + 0.1, [60], [{ duration: 1.2, delta: 0 }]);
}
