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





/////////////////
/*
var outputlevelArray = [0, 5, 9, 13, 17, 20, 23, 25, 27, 29, 31, 33, 35, 37, 39,
	41, 42, 43, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
	62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
	81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
	100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
	115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127
];*/
function testPlay() {
	console.log('testPlay');
	//synth.scheduleStrum(epiano1preset, acx.currentTime + 0.1, [60], [{ duration: 12.3, delta: 0 }]);
	//synth.scheduleStrum(brass1preset, acx.currentTime + 0.1, [60], [{ duration: 2, delta: 0 }]);
	synth.scheduleStrum(brass1preset, acx.currentTime + 0.1, [60+12], [{ duration: 2, delta: 0 }]);
	//synth.scheduleStrum(brass1preset, acx.currentTime + 0.1, [30], [{ duration: 2, delta: 0 }]);
	//synth.scheduleStrum(brass1preset, acx.currentTime + 2.2, [60], [{ duration: 2, delta: 0 }]);
	//synth.scheduleStrum(brass1preset, acx.currentTime + 4.3, [90], [{ duration: 2, delta: 0 }]);
}
/*
function decayIncrementValue0(nn: number): number {
	var rate_scaling = 0;
	let qr = Math.min(63, rate_scaling + ((nn * 41) >> 6)); // 5 -> 3; 49 -> 31; 99 -> 63
	let decayIncrement = Math.pow(2, qr / 4) / 2048;
	return decayIncrement;
}
function decayIncrementValue(nn: number): number {
	let decayIncrement = Math.pow(2, nn * 0.16 - 11);
	return decayIncrement;
}
function outputlevelArrayValue0(nn: number) {
	let kk = Math.log(nn + 1) * 14;
	let val = 0.6 * (kk + nn);
	return Math.round(val);
}
function outputlevelArrayValue(nn: number) {
	let kk = Math.log(nn + 1) * 14;
	let val = 0.6 * (kk + nn) * 127 / 99;
	return Math.round(val);
}
function targetLevelValue0(nn: number) {
	let targetlevel = Math.max(0, (outputlevelArrayValue(nn) << 5) - 224); // 1 -> -192; 99 -> 127 -> 3840
	return targetlevel;
}
function targetLevelValue(nn: number) {
	if (nn) {
		let targetlevel = (outputlevelArrayValue(nn) * 32) - 224; // 1 -> -192; 99 -> 127 -> 3840
		return targetlevel;
	} else {
		return 0;
	}
}
function outputLUTvalue(nn: number): number {

	var dB = (nn - 3824) * 0.0235;
	return Math.pow(20, (dB / 20));
}
function level99(nn: number): number {
	let rr = Math.pow(2.55, nn / 10 - 7.45) / 10;
	return rr;
}
function scale99(n99: number) {
	let rr = Math.pow(2, n99 * 0.16 - 11);
	return rr;
}*/
/*
rate/ticks
99/18
98/22
97/22
96/26
95/32
94/32
93/38
92/46
91/46
90/55
85/94
80/160
75/271
70/545
60/1547
50/4380
40/14740
30/41694
20/140249
10/396688
0/1122008 - 24.63s
*/

function speedRatio(nn: number): number {
	let speed = Math.pow(2, nn * 0.16 - 11);
	return speed;
}
/*
function durationDown(nn: number): number {
	let ss = speedRatio(nn);
	return 0.1 / ss;
}
function levelRatio(nn: number): number {
	let ratio = Math.log(nn + 1) * 14 + nn;
	return ratio;
}*/
function dumpTest() {
	for (let nn = 0; nn <= 100; nn++) {
		//console.log(nn, 'durationDown', 0.12/speedRatio(nn));
	}
	/*let rr = 75;
	let full=durationDown(rr);
	let rr2 = 50;
	let full2=durationDown(rr2);
	console.log(rr,rr2);
	for (let ii = 0; ii < 10; ii++) {
		let vv = (10 - ii) * 10 ;
		let part = (levelRatio(vv) - levelRatio(vv - 10)) / levelRatio(100);
		console.log(''+vv+'-'+(vv-10),part*full,part*full2);
	}*/
	/*console.log((levelRatio(99) - levelRatio(75)) / levelRatio(100));
	console.log((levelRatio(75) - levelRatio(50)) / levelRatio(100));
	console.log((levelRatio(50) - levelRatio(25)) / levelRatio(100));
	console.log((levelRatio(25) - levelRatio(0)) / levelRatio(100));*/
}
dumpTest();
