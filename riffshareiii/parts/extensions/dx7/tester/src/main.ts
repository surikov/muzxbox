//https://github.com/asb2m10/dexed/blob/master/Source/DXComponents.cpp

//let synthPiano: SynthDX7;
//let synthBrass: SynthDX7;
//let cusPres: SynthDX7;
let acx: AudioContext;
let synthDx7: SynthDX7;

function initTester() {
	console.log('initTester');
	acx = new window.AudioContext();
	loadPhaseWorkletSource(acx, () => {
		console.log('skipLoadPhaseWorkletSource', skipLoadPhaseWorkletSource);
synthDx7=new SynthDX7(acx);
		/*synthPiano = new SynthDX7(acx);
		synthPiano.resetPreset(epiano1preset);
		synthBrass = new SynthDX7(acx);
		synthBrass.resetPreset(brass1preset);*/
	});
}

let customPresets: DX7PresetData[];
var selectedPresetData: DX7PresetData | null = null;
function loadPresetNum(ii: number) {
	console.log('loadPresetNum', ii, customPresets[ii].name);
	selectedPresetData = customPresets[ii];

	//cusPres = new SynthDX7(acx);
	//cusPres.resetPreset(selectedPresetData);
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

function testPlay(isPiano: boolean, nn: number) {
	//console.log('testPlay', isPiano, nn);
	//let preset: DX7PresetData;
	if (isPiano) {
		synthDx7.scheduleStrum(epiano1preset,acx.currentTime + 0.1, [nn], [{ duration: 2.1, delta: 0 }]);
		//preset = epiano1preset;
	} else {
		//preset = brass1preset;
		synthDx7.scheduleStrum(brass1preset,acx.currentTime + 0.1, [nn], [{ duration: 2.1, delta: 0 }]);
	}

}
function customPlay(isPiano: boolean, nn: number) {
	if (selectedPresetData) {
		//console.log('customPlay', nn);

		synthDx7.scheduleStrum(selectedPresetData,acx.currentTime + 0.1, [nn], [{ duration: 2.1, delta: 0 }]);
	} else {
		console.log('no data', nn);
	}
}
