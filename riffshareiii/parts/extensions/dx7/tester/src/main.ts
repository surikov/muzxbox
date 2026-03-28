let synth: SynthDX7;
let acx: AudioContext;
function initTester() {
	console.log('initTester');
	acx = new window.AudioContext();
	loadPhaseWorkletSource(acx, () => {
		console.log('skipLoadPhaseWorkletSource', skipLoadPhaseWorkletSource);
		synth = new SynthDX7(acx);
	});
}
function testPlay() {
	console.log('testPlay');
	//synth.scheduleStrum(epiano1preset, acx.currentTime + 0.1, [60], [{ duration: 12.3, delta: 0 }]);
	synth.scheduleStrum(brass1preset, acx.currentTime + 0.1, [60], [{ duration: 12.3, delta: 0 }]);
	
}
