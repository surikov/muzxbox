//https://github.com/asb2m10/dexed/blob/master/Source/DXComponents.cpp

let synthPiano: SynthDX7;
let synthBrass: SynthDX7;
let cusPres: SynthDX7;
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

let customPresets: DX7PresetData[];
var selectedPresetData: DX7PresetData | null = null;
function loadPresetNum(ii: number) {
	console.log('loadPresetNum', ii, customPresets[ii].name);
	selectedPresetData = customPresets[ii];

	cusPres = new SynthDX7(acx);
	cusPres.resetPreset(selectedPresetData);
}
function loadSysexFile(fileList: FileList) {
	let numFiles = fileList.length;
	console.log(fileList[0]);
	let reader = new FileReader();
	reader.onload = () => {
		let result: string = reader.result as string;
		console.log(fileList[0].name);
		customPresets = [];
		for (let ii = 0; ii < 32; ii++) {
			let one: DX7PresetData = parseSysexFile(result, ii);
			console.log(ii, one);
			customPresets.push(one);
		}
	};
	reader.onerror = (error) => {
		console.log('error', error)
	};
	reader.readAsText(fileList[0]);

}
function parseSysexFile(bankData: string, patchId: number): DX7PresetData {
	var dataStart = 128 * patchId + 6;
	var dataEnd = dataStart + 128;
	var voiceData = bankData.substring(dataStart, dataEnd);
	var operators: DX7OperatorData[] = [];

	for (var ii = 5; ii >= 0; --ii) {
		var oscStart = (5 - ii) * 17;
		var oscEnd = oscStart + 17;
		var oscData = voiceData.substring(oscStart, oscEnd);
		var operator: DX7OperatorData = {

			rates: [oscData.charCodeAt(0), oscData.charCodeAt(1), oscData.charCodeAt(2), oscData.charCodeAt(3)]
			, levels: [oscData.charCodeAt(4), oscData.charCodeAt(5), oscData.charCodeAt(6), oscData.charCodeAt(7)]
			//,keyScaleBreakpoint : oscData.charCodeAt(8)
			//,keyScaleDepthL : oscData.charCodeAt(9)
			//,keyScaleDepthR : oscData.charCodeAt(10)
			//,keyScaleCurveL : oscData.charCodeAt(11) & 3
			//,keyScaleCurveR : oscData.charCodeAt(11) >> 2
			//,keyScaleRate : oscData.charCodeAt(12) & 7
			, detune: Math.floor(oscData.charCodeAt(12) >> 3) - 7 // range 0 to 14
			//,lfoAmpModSens : oscData.charCodeAt(13) & 3
			//,velocitySens : oscData.charCodeAt(13) >> 2
			, volume: oscData.charCodeAt(14)
			, oscMode: oscData.charCodeAt(15) & 1
			, freqCoarse: Math.floor(oscData.charCodeAt(15) >> 1)
			, freqFine: oscData.charCodeAt(16)
			// Extended/non-standard parameters
			//,pan : ((i + 1) % 3 - 1) * 25 // Alternate panning: -25, 0, 25, -25, 0, 25
			//,idx : i
			, enabled: true
		};
		//let one:DX7OperatorData=operator;
		//operators.push(operator);
		operators.splice(0, 0, operator);
	}

	let preset: DX7PresetData = {
		algorithm: voiceData.charCodeAt(110) + 1, // start at 1 for readability
		feedback: voiceData.charCodeAt(111) & 7,
		operators: operators,
		name: voiceData.substring(118, 128),
		//lfoSpeed: voiceData.charCodeAt(112),
		//lfoDelay: voiceData.charCodeAt(113),
		//lfoPitchModDepth: voiceData.charCodeAt(114),
		//lfoAmpModDepth: voiceData.charCodeAt(115),
		//lfoPitchModSens: voiceData.charCodeAt(116) >> 4,
		//lfoWaveform: Math.floor(voiceData.charCodeAt(116) >> 1) & 7,
		//lfoSync: voiceData.charCodeAt(116) & 1,
		//pitchEnvelope: {
		//	rates: [voiceData.charCodeAt(102), voiceData.charCodeAt(103), voiceData.charCodeAt(104), voiceData.charCodeAt(105)],
		//	levels: [voiceData.charCodeAt(106), voiceData.charCodeAt(107), voiceData.charCodeAt(108), voiceData.charCodeAt(109)]
		//},
		//controllerModVal: 0,
		//aftertouchEnabled: 0
	};
	return preset;
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
		synthPiano.scheduleStrum(acx.currentTime + 0.1, [nn], [{ duration: 2.1, delta: 0 }]);
		//preset = epiano1preset;
	} else {
		//preset = brass1preset;
		synthBrass.scheduleStrum(acx.currentTime + 0.1, [nn], [{ duration: 2.1, delta: 0 }]);
	}

	//synth.scheduleStrum(epiano1preset, acx.currentTime + 0.1, [60], [{ duration: 12.3, delta: 0 }]);
	//synth.scheduleStrum(brass1preset, acx.currentTime + 0.1, [60], [{ duration: 2, delta: 0 }]);
	//synth.scheduleStrum(brass1preset, acx.currentTime + 0.1, [60+12], [{ duration: 2, delta: 0 }]);
	//synth.scheduleStrum(brass1preset, acx.currentTime + 0.1, [30], [{ duration: 2, delta: 0 }]);
	//synth.scheduleStrum(brass1preset, acx.currentTime + 2.2, [60], [{ duration: 2, delta: 0 }]);
	//synth.scheduleStrum(brass1preset, acx.currentTime + 4.3, [90], [{ duration: 2, delta: 0 }]);
}
function customPlay(isPiano: boolean, nn: number) {
	if (selectedPresetData) {
		console.log('customPlay', nn);

		cusPres.scheduleStrum(acx.currentTime + 0.1, [nn], [{ duration: 2.1, delta: 0 }]);
	} else {
		console.log('no data', nn);
	}
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
let EG_rate_rise_duration: number[] = [
	38.00000, 34.96000, 31.92000, 28.88000, 25.84000,
	22.80000, 20.64000, 18.48000, 16.32000, 14.16000,
	12.00000, 11.10000, 10.20000, 9.30000, 8.40000,
	7.50000, 6.96000, 6.42000, 5.88000, 5.34000,
	4.80000, 4.38000, 3.96000, 3.54000, 3.12000,
	2.70000, 2.52000, 2.34000, 2.16000, 1.98000,
	1.80000, 1.70000, 1.60000, 1.50000, 1.40000,
	1.30000, 1.22962, 1.15925, 1.08887, 1.01850,
	0.94813, 0.87775, 0.80737, 0.73700, 0.69633,
	0.65567, 0.61500, 0.57833, 0.54167, 0.50500,
	0.47300, 0.44100, 0.40900, 0.37967, 0.35033,
	0.32100, 0.28083, 0.24067, 0.20050, 0.16033,
	0.12017, 0.08000, 0.07583, 0.07167, 0.06750,
	0.06333, 0.05917, 0.05500, 0.04350, 0.03200,
	0.02933, 0.02667, 0.02400, 0.02200, 0.02000,
	0.01800, 0.01667, 0.01533, 0.01400, 0.01300,
	0.01200, 0.01100, 0.01000, 0.00900, 0.00800,
	0.00800, 0.00800, 0.00800, 0.00767, 0.00733,
	0.00700, 0.00633, 0.00567, 0.00500, 0.00433,
	0.00367, 0.00300, 0.00300, 0.00300, 0.00300,
	0.00300, 0.00300, 0.00300, 0.00300, 0.00300,
	0.00300, 0.00300, 0.00300, 0.00300, 0.00300,
	0.00300, 0.00300, 0.00300, 0.00300, 0.00300,
	0.00300, 0.00300, 0.00300, 0.00300, 0.00300,
	0.00300, 0.00300, 0.00300, 0.00300, 0.00300,
	0.00300, 0.00300, 0.00300
];

let EG_rate_decay_duration: number[] = [
	318.00000, 283.75000, 249.50000, 215.25000, 181.00000,
	167.80000, 154.60001, 141.39999, 128.20000, 115.00000,
	104.60000, 94.20000, 83.80000, 73.40000, 63.00000,
	58.34000, 53.68000, 49.02000, 44.36000, 39.70000,
	35.76000, 31.82000, 27.88000, 23.94000, 20.00000,
	18.24000, 16.48000, 14.72000, 12.96000, 11.20000,
	10.36000, 9.52000, 8.68000, 7.84000, 7.00000,
	6.83250, 6.66500, 6.49750, 6.33000, 6.16250,
	5.99500, 5.82750, 5.66000, 5.10000, 4.54000,
	3.98000, 3.64833, 3.31667, 2.98500, 2.65333,
	2.32167, 1.99000, 1.77333, 1.55667, 1.34000,
	1.22333, 1.10667, 0.99000, 0.89667, 0.80333,
	0.71000, 0.65000, 0.59000, 0.53000, 0.47000,
	0.41000, 0.32333, 0.23667, 0.15000, 0.12700,
	0.10400, 0.08100, 0.07667, 0.07233, 0.06800,
	0.06100, 0.05400, 0.04700, 0.04367, 0.04033,
	0.03700, 0.03300, 0.02900, 0.02500, 0.02333,
	0.02167, 0.02000, 0.01767, 0.01533, 0.01300,
	0.01133, 0.00967, 0.00800, 0.00800, 0.00800,
	0.00800, 0.00800, 0.00800, 0.00800, 0.00800,
	0.00800, 0.00800, 0.00800, 0.00800, 0.00800,
	0.00800, 0.00800, 0.00800, 0.00800, 0.00800,
	0.00800, 0.00800, 0.00800, 0.00800, 0.00800,
	0.00800, 0.00800, 0.00800, 0.00800, 0.00800,
	0.00800, 0.00800, 0.00800, 0.00800, 0.00800,
	0.00800, 0.00800, 0.00800
];
let EG_rate_rise_percent: number[] = [
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00501, 0.01001, 0.01500,
	0.02000, 0.02800, 0.03600, 0.04400, 0.05200,
	0.06000, 0.06800, 0.07600, 0.08400, 0.09200,
	0.10000, 0.10800, 0.11600, 0.12400, 0.13200,
	0.14000, 0.15000, 0.16000, 0.17000, 0.18000,
	0.19000, 0.20000, 0.21000, 0.22000, 0.23000,
	0.24000, 0.25100, 0.26200, 0.27300, 0.28400,
	0.29500, 0.30600, 0.31700, 0.32800, 0.33900,
	0.35000, 0.36500, 0.38000, 0.39500, 0.41000,
	0.42500, 0.44000, 0.45500, 0.47000, 0.48500,
	0.50000, 0.52000, 0.54000, 0.56000, 0.58000,
	0.60000, 0.62000, 0.64000, 0.66000, 0.68000,
	0.70000, 0.73200, 0.76400, 0.79600, 0.82800,
	0.86000, 0.89500, 0.93000, 0.96500, 1.00000,
	1.00000, 1.00000, 1.00000, 1.00000, 1.00000,
	1.00000, 1.00000, 1.00000, 1.00000, 1.00000,
	1.00000, 1.00000, 1.00000, 1.00000, 1.00000,
	1.00000, 1.00000, 1.00000, 1.00000, 1.00000,
	1.00000, 1.00000, 1.00000, 1.00000, 1.00000,
	1.00000, 1.00000, 1.00000
];

let EG_rate_decay_percent: number[] = [
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00001, 0.00001, 0.00001,
	0.00001, 0.00001, 0.00501, 0.01001, 0.01500,
	0.02000, 0.02800, 0.03600, 0.04400, 0.05200,
	0.06000, 0.06800, 0.07600, 0.08400, 0.09200,
	0.10000, 0.10800, 0.11600, 0.12400, 0.13200,
	0.14000, 0.15000, 0.16000, 0.17000, 0.18000,
	0.19000, 0.20000, 0.21000, 0.22000, 0.23000,
	0.24000, 0.25100, 0.26200, 0.27300, 0.28400,
	0.29500, 0.30600, 0.31700, 0.32800, 0.33900,
	0.35000, 0.36500, 0.38000, 0.39500, 0.41000,
	0.42500, 0.44000, 0.45500, 0.47000, 0.48500,
	0.50000, 0.52000, 0.54000, 0.56000, 0.58000,
	0.60000, 0.62000, 0.64000, 0.66000, 0.68000,
	0.70000, 0.73200, 0.76400, 0.79600, 0.82800,
	0.86000, 0.89500, 0.93000, 0.96500, 1.00000,
	1.00000, 1.00000, 1.00000, 1.00000, 1.00000,
	1.00000, 1.00000, 1.00000, 1.00000, 1.00000,
	1.00000, 1.00000, 1.00000, 1.00000, 1.00000,
	1.00000, 1.00000, 1.00000, 1.00000, 1.00000,
	1.00000, 1.00000, 1.00000, 1.00000, 1.00000,
	1.00000, 1.00000, 1.00000

];
function scaleA(nn: number): number {
	return Math.pow(2, nn * 0.16 - 11);
}
function scaleB(nn: number): number {
	return Math.pow(2, nn * 0.126);
}
function scaleVolume(nn: number): number {
	return Math.pow(2, nn / 8);
}
function scaleRise1(nn: number): number {
	return Math.pow(2, nn * 0.15);
}
function scaleRise2(nn: number): number {
	return Math.pow(2, nn * 0.155);
}
function scaleRise(nn: number): number {
	return Math.pow(2, nn * 0.14) / Math.pow(2, 127 * 0.14);
}
function volume127(nn: number): number {
	return nn;
}
function getDexedDuration(p_rate: number, p_level_l: number, p_level_r: number): number {
	let duration_table: number[] = (p_level_r > p_level_l) ? EG_rate_rise_duration : EG_rate_decay_duration;
	let duration = duration_table[p_rate];

	let percent_table: number[] = (p_level_r > p_level_l) ? EG_rate_rise_percent : EG_rate_decay_percent;
	duration = duration * Math.abs(percent_table[p_level_r] - percent_table[p_level_l]);
	return duration;
}
function dumpTest() {
	for (let ii = 0; ii < 128; ii++) {
		console.log(ii
			, EG_rate_rise_duration[ii]
			
			,  0.003+38*Math.pow(2, (127-ii) * 0.16) / Math.pow(2, 127 * 0.16)
			//,':', scaleRise(ii)/EG_rate_rise_duration[ii] 
		);
	}
	/*for (let ii = 0; ii < 128; ii++) {
		console.log(ii
			, Math.round(1000000*getDexedDuration(127 - ii, 0, 127) / getDexedDuration(0, 0, 127))
			, Math.round(1000000*getDexedDuration(127 - ii, 127, 0) / getDexedDuration(0, 127, 0))
			, Math.round(1000000*scaleRise(ii) / scaleRise(127))
			, Math.round(1000000*scaleVolume(ii) / scaleVolume(127))
		);
	}*/
	/*
		for (let ii = 0; ii < 128; ii++) {
			let dxdRP = EG_rate_rise_percent[ii] / EG_rate_rise_percent[127];
			let dxdRse = EG_rate_rise_duration[127 - ii] / EG_rate_rise_duration[0];
			let dxdDecP = EG_rate_decay_percent[ii] / EG_rate_decay_percent[127];
			let dxdDec = EG_rate_decay_duration[127 - ii] / EG_rate_decay_duration[0];
			//let dxdRse2 = scaleRise(ii)/scaleRise(127);
			//let dxdDcy = EG_rate_decay_duration[127 - ii] / EG_rate_decay_duration[0];
			//let my = scaleVolume(ii) / scaleVolume(127);
			//let my1 = scaleRise1(ii) / scaleRise1(127);
			//let my2 = scaleRise2(ii) / scaleRise2(127);
			//let myRse = scaleRise(ii) / scaleRise(127);
			let myRse = scaleRise(ii);// / scaleRise(127);
			console.log(ii, ':'
				, Math.round(100000 * dxdRse)
				, Math.round(100000 * dxdRP)
				, Math.round(100000 * dxdDec)
				, Math.round(100000 * dxdDecP)
				//, Math.round(100000 * my2)
				, Math.round(100000 * myRse)
	
			);
	
		}*/

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
