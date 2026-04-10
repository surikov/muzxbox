//https://github.com/asb2m10/dexed/blob/master/Source/DXComponents.cpp

let synthPiano: SynthDX7;
let synthBrass: SynthDX7;
let acx: AudioContext;
function initTester() {
	console.log('initTester');
	acx = new window.AudioContext();
	loadPhaseWorkletSource(acx, () => {
		console.log('skipLoadPhaseWorkletSource', skipLoadPhaseWorkletSource);

		//epiano1preset.operators[3].volume = 85;//85 0.18946457081379972 - 89 0.29524816535738263 - 89 0.3298769776932236



		//epiano1preset.operators[0].enabled = false;
		//epiano1preset.operators[1].enabled = false;//0.9
		//epiano1preset.operators[2].enabled = false;
		//epiano1preset.operators[3].enabled = false;//0.6
		//epiano1preset.operators[4].enabled = false;
		//epiano1preset.operators[5].enabled = false;

		synthPiano = new SynthDX7(acx);
		synthPiano.resetPreset(epiano1preset);
		synthBrass = new SynthDX7(acx);
		synthBrass.resetPreset(brass1preset);
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
function testPlay(isPiano: boolean, nn: number) {
	console.log('testPlay', isPiano, nn);
	//let preset: DX7PresetData;
	if (isPiano) {
		synthPiano.scheduleStrum(acx.currentTime + 0.1, [nn], [{ duration: 4.3, delta: 0 }]);
		//preset = epiano1preset;
	} else {
		//preset = brass1preset;
		synthBrass.scheduleStrum(acx.currentTime + 0.1, [nn], [{ duration: 4.3, delta: 0 }]);
	}

	//synth.scheduleStrum(epiano1preset, acx.currentTime + 0.1, [60], [{ duration: 12.3, delta: 0 }]);
	//synth.scheduleStrum(brass1preset, acx.currentTime + 0.1, [60], [{ duration: 2, delta: 0 }]);
	//synth.scheduleStrum(brass1preset, acx.currentTime + 0.1, [60+12], [{ duration: 2, delta: 0 }]);
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
function rate2(nn: number): number {
	let ss = Math.pow(2, nn * 0.16 - 11);
	return ss;
}
function level2(nn: number): number {
	let ratio = Math.log(nn + 1) * 14 + nn;
	return ratio;
}
function test2(rr) {
	return Math.pow(2, rr * 0.16 - 11);
}
function test5889(kk: number) {
	let a58 = ((99 - 58) * kk / 1000) * test2(58) / test2(99);
	let a89 = ((99 - 89) * kk / 1000) * + test2(89) / test2(99);
	console.log(kk, a58, a89, a89 / a58);

}
function bezier99(nn: number) {
	let t = nn;
	//let p0 = { x: 0, y: 0 };//start
	let p1 = { x: 0.95, y: 0.1 };//start handler
	let p2 = { x: 0.9, y: 0.7 };//end handler
	//let p3 = { x: 1, y: 1 };//end

	let cX = 3 * p1.x;
	let bX = 3 * (p2.x - p1.x) - cX;
	let aX = 1 - cX - bX;

	let cY = 3 * p1.y;
	let bY = 3 * (p2.y - p1.y) - cY;
	let aY = 1 - cY - bY;

	let x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t);
	let y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t);

	return { x: x, y: y };

}
function bezierO(nn: number) {
	let t = nn;
	let p0 = { x: 10, y: 10 };//start
	let p1 = { x: 50, y: 100 };//start handler
	let p2 = { x: 150, y: 200 };//end handler
	let p3 = { x: 200, y: 75 };//end

	let cX = 3 * (p1.x - p0.x);
	let bX = 3 * (p2.x - p1.x) - cX;
	let aX = p3.x - p0.x - cX - bX;

	let cY = 3 * (p1.y - p0.y);
	let bY = 3 * (p2.y - p1.y) - cY;
	let aY = p3.y - p0.y - cY - bY;

	let x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
	let y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

	return { x: x, y: y };

}
var OUTPUT_LEVEL_TABLE = [
	0.000000, 0.000337, 0.000476, 0.000674, 0.000952, 0.001235, 0.001602, 0.001905, 0.002265, 0.002694,
	0.003204, 0.003810, 0.004531, 0.005388, 0.006408, 0.007620, 0.008310, 0.009062, 0.010776, 0.011752,
	0.013975, 0.015240, 0.016619, 0.018123, 0.019764, 0.021552, 0.023503, 0.025630, 0.027950, 0.030480,
	0.033238, 0.036247, 0.039527, 0.043105, 0.047006, 0.051261, 0.055900, 0.060960, 0.066477, 0.072494,
	0.079055, 0.086210, 0.094012, 0.102521, 0.111800, 0.121919, 0.132954, 0.144987, 0.158110, 0.172420,
	0.188025, 0.205043, 0.223601, 0.243838, 0.265907, 0.289974, 0.316219, 0.344839, 0.376050, 0.410085,
	0.447201, 0.487676, 0.531815, 0.579948, 0.632438, 0.689679, 0.752100, 0.820171, 0.894403, 0.975353,
	1.063630, 1.159897, 1.264876, 1.379357, 1.504200, 1.640341, 1.788805, 1.950706, 2.127260, 2.319793,
	2.529752, 2.758714, 3.008399, 3.280683, 3.577610, 3.901411, 4.254519, 4.639586, 5.059505, 5.517429,
	6.016799, 6.561366, 7.155220, 7.802823, 8.509039, 9.279172, 10.11901, 11.03486, 12.03360, 13.12273
];
function scaleA(nn: number): number {
	return Math.pow(2, nn * 0.16 - 11);
}
function scaleB(nn: number): number {
	return Math.pow(2, nn * 0.126 );
}
function scaleC(nn: number): number {
	return Math.pow(2, nn * 0.125 );
}
function dumpTest() {

	for (let ii = 0; ii < 100; ii++) {

		console.log('n' + ii, Math.floor(10000 * OUTPUT_LEVEL_TABLE[ii] / OUTPUT_LEVEL_TABLE[99])
			, ':', Math.floor(10000 * scaleA(ii) / scaleA(99))
			, ' - ', Math.floor(10000 * scaleB(ii))
			, '/', Math.floor(10000 * scaleC(ii) / scaleC(99))

		);
	}
	console.log(OUTPUT_LEVEL_TABLE[89] / OUTPUT_LEVEL_TABLE[58]
		, ':', scaleA(89) / scaleA(58)
		, ' - ', scaleB(89) / scaleB(58)
		, '/', scaleC(89) / scaleC(58)
	);
	//console.log((rate2(89) / rate2(99)) / (rate2(58) / rate2(99)),'	',bezier99(ii));
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
