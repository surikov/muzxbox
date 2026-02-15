//https://stackoverflow.com/questions/16923288/whats-wrong-with-this-simple-fm-synth-design
//https://github.com/mmontag/dx7-synth-js/blob/d4d5e3557bf6d6f178c9a42658a54ce6fb8986fe/src/voice-dx7.js
//https://github.com/mohayonao/fm-synth
//https://github.com/g200kg/WebAudioDesigner
//https://vk.com/video-229753126_456239131
//https://www.tinyloops.com/doc/yamaha_dx7/algorithms.html
//https://github.com/itsjoesullivan/dx7-patches/tree/master
//https://github.com/itsjoesullivan/dx7-envelope

type ROMPresetPitchEnvelope = {
	rates: number[]
	, levels: number[]
};

type ROMPresetData = {
	name: string
	, algorithm: number
	, feedback: number
	, lfoSpeed: number
	, lfoDelay: number
	, lfoPitchModDepth: number
	, lfoAmpModDepth: number
	, lfoPitchModSens: number
	, lfoWaveform: number
	, lfoSync: number
	, pitchEnvelope: ROMPresetPitchEnvelope
	, controllerModVal: number
	, aftertouchEnabled: number
	, operators: ROMPresetOperator[]
	, fbRatio: number
};
type ROMPresetOperator = {
	idx: number
	, enabled: boolean
	, envelope: ROMPresetPitchEnvelope
	//, rates: number[]
	//, levels: number[]
	, detune: number
	, velocitySens: number
	, lfoAmpModSens: number
	, volume: number
	, oscMode: number
	, freqCoarse: number
	, freqFine: number
	, pan: number
	, outputLevel: number
	, keyScaleDepthL: number
	, keyScaleDepthR: number
	, keyScaleCurveL: number
	, keyScaleCurveR: number
	, keyScaleRate: number
	, keyScaleBreakpoint: number
	, freqRatio: number
	, freqFixed: number
	, ampL: number
	, ampR: number
};
type AlgorithmsDX7 = {
	outputMix: number[]
	, modulationMatrix: (number[])[]
};
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
var OL_TO_MOD_TABLE = [ // TODO: use output level to modulation index table
	// 0 - 99
	0.000000, 0.000039, 0.000078, 0.000117, 0.000157, 0.000196, 0.000254, 0.000303, 0.000360, 0.000428,
	0.000509, 0.000606, 0.000721, 0.000857, 0.001019, 0.001212, 0.001322, 0.001442, 0.001715, 0.001870,
	0.002224, 0.002425, 0.002645, 0.002884, 0.003145, 0.003430, 0.003740, 0.004079, 0.004448, 0.004851,
	0.005290, 0.005768, 0.006290, 0.006860, 0.007481, 0.008158, 0.008896, 0.009702, 0.010580, 0.011537,
	0.012582, 0.013720, 0.014962, 0.016316, 0.017793, 0.019404, 0.021160, 0.023075, 0.025163, 0.027441,
	0.029925, 0.032633, 0.035587, 0.038808, 0.042320, 0.046150, 0.050327, 0.054882, 0.059850, 0.065267,
	0.071174, 0.077616, 0.084641, 0.092301, 0.100656, 0.109766, 0.119700, 0.130534, 0.142349, 0.155232,
	0.169282, 0.184603, 0.201311, 0.219532, 0.239401, 0.261068, 0.284697, 0.310464, 0.338564, 0.369207,
	0.402623, 0.439063, 0.478802, 0.522137, 0.569394, 0.620929, 0.677128, 0.738413, 0.805245, 0.878126,
	0.957603, 1.044270, 1.138790, 1.241860, 1.354260, 1.476830, 1.610490, 1.756250, 1.915210, 2.088550,
	// 100 - 127
	2.277580, 2.483720, 2.708510, 2.953650, 3.220980, 3.512500, 3.830410, 4.177100, 4.555150, 4.967430,
	5.417020, 5.907300, 6.441960, 7.025010, 7.660830, 8.354190, 9.110310, 9.934860, 10.83400, 11.81460,
	12.88390, 14.05000, 15.32170, 16.70840, 18.22060, 19.86970, 21.66810, 23.62920
];
var LFO_FREQUENCY_TABLE = [ // see https://github.com/smbolton/hexter/tree/master/src/dx7_voice.c#L1002
	0.062506, 0.124815, 0.311474, 0.435381, 0.619784,
	0.744396, 0.930495, 1.116390, 1.284220, 1.496880,
	1.567830, 1.738994, 1.910158, 2.081322, 2.252486,
	2.423650, 2.580668, 2.737686, 2.894704, 3.051722,
	3.208740, 3.366820, 3.524900, 3.682980, 3.841060,
	3.999140, 4.159420, 4.319700, 4.479980, 4.640260,
	4.800540, 4.953584, 5.106628, 5.259672, 5.412716,
	5.565760, 5.724918, 5.884076, 6.043234, 6.202392,
	6.361550, 6.520044, 6.678538, 6.837032, 6.995526,
	7.154020, 7.300500, 7.446980, 7.593460, 7.739940,
	7.886420, 8.020588, 8.154756, 8.288924, 8.423092,
	8.557260, 8.712624, 8.867988, 9.023352, 9.178716,
	9.334080, 9.669644, 10.005208, 10.340772, 10.676336,
	11.011900, 11.963680, 12.915460, 13.867240, 14.819020,
	15.770800, 16.640240, 17.509680, 18.379120, 19.248560,
	20.118000, 21.040700, 21.963400, 22.886100, 23.808800,
	24.731500, 25.759740, 26.787980, 27.816220, 28.844460,
	29.872700, 31.228200, 32.583700, 33.939200, 35.294700,
	36.650200, 37.812480, 38.974760, 40.137040, 41.299320,
	42.461600, 43.639800, 44.818000, 45.996200, 47.174400,
	47.174400, 47.174400, 47.174400, 47.174400, 47.174400,
	47.174400, 47.174400, 47.174400, 47.174400, 47.174400,
	47.174400, 47.174400, 47.174400, 47.174400, 47.174400,
	47.174400, 47.174400, 47.174400, 47.174400, 47.174400,
	47.174400, 47.174400, 47.174400, 47.174400, 47.174400,
	47.174400, 47.174400, 47.174400
];
var LFO_AMP_MOD_TABLE = [ // TODO: use lfo amp mod table
	0.00000, 0.00793, 0.00828, 0.00864, 0.00902, 0.00941, 0.00982, 0.01025, 0.01070, 0.01117,
	0.01166, 0.01217, 0.01271, 0.01327, 0.01385, 0.01445, 0.01509, 0.01575, 0.01644, 0.01716,
	0.01791, 0.01870, 0.01952, 0.02037, 0.02126, 0.02220, 0.02317, 0.02418, 0.02524, 0.02635,
	0.02751, 0.02871, 0.02997, 0.03128, 0.03266, 0.03409, 0.03558, 0.03714, 0.03877, 0.04047,
	0.04224, 0.04409, 0.04603, 0.04804, 0.05015, 0.05235, 0.05464, 0.05704, 0.05954, 0.06215,
	0.06487, 0.06772, 0.07068, 0.07378, 0.07702, 0.08039, 0.08392, 0.08759, 0.09143, 0.09544,
	0.09962, 0.10399, 0.10855, 0.11331, 0.11827, 0.12346, 0.12887, 0.13452, 0.14041, 0.14657,
	0.15299, 0.15970, 0.16670, 0.17401, 0.18163, 0.18960, 0.19791, 0.20658, 0.21564, 0.22509,
	0.23495, 0.24525, 0.25600, 0.26722, 0.27894, 0.29116, 0.30393, 0.31725, 0.33115, 0.34567,
	0.36082, 0.37664, 0.39315, 0.41038, 0.42837, 0.44714, 0.46674, 0.48720, 0.50856, 0.53283
];
var LFO_PITCH_MOD_TABLE = [
	0, 0.0264, 0.0534, 0.0889, 0.1612, 0.2769, 0.4967, 1
];
let algorithmsDX7: AlgorithmsDX7[] = [
	//stacking
	{ outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], [5]] },    //1
	{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3], [4], [5], []] },    //2
	{ outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [5]] },    //3
	{ outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [3]] },    //4
	{ outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [5]] },     //5 e.piano 1
	{ outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [4]] },     //6
	//branch
	{ outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], [5]] },   //7
	{ outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [3], [5], []] },   //8
	{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3, 4], [], [5], []] },   //9
	{ outputMix: [0, 3], modulationMatrix: [[1], [2], [2], [4, 5], [], []] },   //10
	{ outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4, 5], [], [5]] },   //11
	{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3, 4, 5], [], [], []] },  //12
	{ outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4, 5], [], [], [5]] },  //13
	{ outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4, 5], [], [5]] },   //14
	{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3], [4, 5], [], []] },   //15
	{ outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], [5]] }, //16 bass 1
	{ outputMix: [0], modulationMatrix: [[1, 2, 4], [1], [3], [], [5], []] }, //17
	{ outputMix: [0], modulationMatrix: [[1, 2, 3], [], [2], [4], [5], []] }, //18
	//rooting/tower combi
	{ outputMix: [0, 3, 4], modulationMatrix: [[1], [2], [], [5], [5], [5]] },    //19
	{ outputMix: [0, 1, 3], modulationMatrix: [[2], [2], [2], [4, 5], [], []] },   //20
	{ outputMix: [0, 1, 3, 4], modulationMatrix: [[2], [2], [2], [5], [5], []] },    //21
	{ outputMix: [0, 2, 3, 4], modulationMatrix: [[1], [], [5], [5], [5], [5]] },    //22
	{ outputMix: [0, 1, 3, 4], modulationMatrix: [[], [2], [], [5], [5], [5]] },     //23 vibe 1
	{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [5], [5], [5], [5]] },     //24
	{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [5], [5], [5]] },      //25
	//branch/tower combi
	{ outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], [5]] },    //26
	{ outputMix: [0, 1, 3], modulationMatrix: [[], [2], [2], [4, 5], [], []] },    //27
	{ outputMix: [0, 2, 5], modulationMatrix: [[1], [], [3], [4], [4], []] },     //28
	{ outputMix: [0, 1, 2, 4], modulationMatrix: [[], [], [3], [], [5], [5]] },      //29
	{ outputMix: [0, 1, 2, 5], modulationMatrix: [[], [], [3], [4], [4], []] },      //30
	{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [], [5], [5]] },       //31
	{ outputMix: [0, 1, 2, 3, 4, 5], modulationMatrix: [[], [], [], [], [], [5]] }         //32 e.organ 1
];
//lfoWaveform "Triangle", "Sawtooth Down", "Sawtooth Up","Square", "Sine", "Sample and Hold" 
let testX7rom: ROMPresetData[] = [{
	algorithm: 22, feedback: 7, operators: [
		{ /*0*/ envelope: { rates: [72, 76, 99, 71], levels: [99, 88, 96, 0] }
			, keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 14, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0
			, detune: 7, lfoAmpModSens: 0, velocitySens: 0, volume: 98, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 0, enabled: true
			, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0
		}
		, { envelope: { rates: [62, 51, 29, 71], levels: [82, 95, 96, 0] }, keyScaleBreakpoint: 27, keyScaleDepthL: 0, keyScaleDepthR: 7, keyScaleCurveL: 3, keyScaleCurveR: 1, keyScaleRate: 0, detune: 7, lfoAmpModSens: 0, velocitySens: 0, volume: 86, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, /*0*/ { envelope: { rates: [77, 76, 82, 71], levels: [99, 98, 98, 0] }, keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: -2, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, /*0*/ { envelope: { rates: [77, 36, 41, 71], levels: [99, 98, 98, 0] }, keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, /*0*/ { envelope: { rates: [77, 36, 41, 71], levels: [99, 98, 98, 0] }, keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 1, lfoAmpModSens: 0, velocitySens: 2, volume: 98, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [49, 99, 28, 68], levels: [98, 98, 91, 0] }, keyScaleBreakpoint: 39, keyScaleDepthL: 54, keyScaleDepthR: 50, keyScaleCurveL: 1, keyScaleCurveR: 1, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 82, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'BRASS 1'
	, lfoSpeed: 37, lfoDelay: 0, lfoPitchModDepth: 5, lfoAmpModDepth: 0, lfoPitchModSens: 3, lfoWaveform: 4, lfoSync: 0
	, pitchEnvelope: { rates: [84, 95, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 22, feedback: 7, operators: [{ envelope: { rates: [99, 39, 32, 71], levels: [99, 98, 80, 0] }, keyScaleBreakpoint: 51, keyScaleDepthL: 0, keyScaleDepthR: 38, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 7, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [99, 39, 32, 71], levels: [99, 98, 80, 0] }, keyScaleBreakpoint: 51, keyScaleDepthL: 0, keyScaleDepthR: 38, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 7, lfoAmpModSens: 0, velocitySens: 0, volume: 84, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [99, 39, 32, 71], levels: [99, 98, 81, 0] }, keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: -3, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [99, 39, 32, 71], levels: [99, 98, 81, 0] }, keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: -2, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [99, 39, 32, 71], levels: [99, 98, 81, 0] }, keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 1, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [99, 39, 32, 71], levels: [99, 98, 88, 0] }, keyScaleBreakpoint: 51, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 80, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'BRASS 2', lfoSpeed: 37, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 3, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [84, 95, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 18, feedback: 6, operators: [{ envelope: { rates: [55, 24, 19, 55], levels: [99, 86, 86, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [37, 34, 15, 70], levels: [85, 0, 0, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 70, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [46, 35, 22, 50], levels: [99, 86, 86, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 77, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [66, 92, 22, 50], levels: [53, 61, 62, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 79, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [48, 55, 22, 50], levels: [98, 61, 62, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: -1, lfoAmpModSens: 0, velocitySens: 0, volume: 70, oscMode: 0, freqCoarse: 3, freqFine: 6, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [77, 56, 20, 70], levels: [99, 0, 0, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 7, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 79, oscMode: 0, freqCoarse: 7, freqFine: 21, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'BRASS 3', lfoSpeed: 35, lfoDelay: 0, lfoPitchModDepth: 5, lfoAmpModDepth: 0, lfoPitchModSens: 3, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 2, feedback: 7, operators: [{ envelope: { rates: [45, 24, 20, 41], levels: [99, 85, 70, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 3, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [75, 71, 17, 49], levels: [82, 92, 62, 0] }, keyScaleBreakpoint: 54, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 83, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [44, 45, 20, 54], levels: [99, 85, 82, 0] }, keyScaleBreakpoint: 56, keyScaleDepthL: 0, keyScaleDepthR: 97, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 86, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [96, 19, 20, 54], levels: [99, 92, 86, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 77, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [53, 19, 20, 54], levels: [86, 92, 86, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 84, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [53, 19, 20, 54], levels: [99, 92, 86, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 53, oscMode: 0, freqCoarse: 14, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'STRINGS 1', lfoSpeed: 30, lfoDelay: 0, lfoPitchModDepth: 8, lfoAmpModDepth: 0, lfoPitchModSens: 2, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}

	, {
	algorithm: 19, feedback: 6, operators: [
		{
			envelope: { rates: [81, 25, 20, 48], levels: [99, 82, 0, 0] }
			, keyScaleBreakpoint: 0, keyScaleDepthL: 85, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 4
			, detune: -2, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, pan: 0, idx: 0, outputLevel: 0
			, freqCoarse: 1, freqFine: 0, freqRatio: 0, freqFixed: 0
			, ampL: 0, ampR: 0, enabled: true
		}
		, { envelope: { rates: [99, 0, 25, 0], levels: [99, 75, 0, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 13, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: 2, lfoAmpModSens: 0, velocitySens: 0, volume: 87, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [81, 25, 25, 14], levels: [99, 99, 99, 0] }, keyScaleBreakpoint: 47, keyScaleDepthL: 32, keyScaleDepthR: 74, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 5, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 57, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [81, 23, 22, 45], levels: [99, 78, 0, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: 1, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [81, 58, 36, 39], levels: [99, 14, 0, 0] }, keyScaleBreakpoint: 48, keyScaleDepthL: 0, keyScaleDepthR: 66, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: -1, lfoAmpModSens: 0, velocitySens: 1, volume: 93, oscMode: 0, freqCoarse: 1, freqFine: 58, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { envelope: { rates: [99, 0, 25, 0], levels: [99, 75, 0, 0] }, keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 10, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: -1, lfoAmpModSens: 0, velocitySens: 0, volume: 82, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'PIANO 1'
	, lfoSpeed: 35, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 4, lfoWaveform: 0, lfoSync: 0
	, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }
	, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
];

let presets: ROMPresetData[] = [];
let audioContext: AudioContext;
function initDX7loader() {
	//console.log('initDX7loader');
	let romfile = document.getElementById('romfile');
	if (romfile) {
		romfile.addEventListener('change', loadFile);
	}

}
/*
function getNoteFrequency(semitones) {
	// Get the frequency in Hz of a note given as semitones above or below A440
	let rr= 440 * ((2 ** (1 / 12)) ** semitones);
	console.log(semitones,rr);
	return rr;
}*/

function loadFile(changeEvent) {
	//console.log(changeEvent);
	let file: File = changeEvent.target.files[0];
	//console.log(file);
	readSyxFile(file);
}
function readSyxFile(file: File) {
	let fileReder: FileReader = new FileReader();
	fileReder.onload = () => {
		//console.log(fileReder);
		//let arrayBuffer: ArrayBuffer = fileReder.result as any;
		parseBuffer(fileReder.result as string);
	};
	//fileReder.readAsArrayBuffer(file);
	fileReder.readAsText(file);
}
function parseBuffer(bankData: string) {
	//console.log(bankData);

	for (var i = 0; i < 32; i++) {
		presets.push(extractPatchFromRom(bankData, i));
	}
	//console.log(presets);
}
function extractPatchFromRom(bankData: string, patchId: number): ROMPresetData {
	var dataStart = 128 * patchId + 6;
	var dataEnd = dataStart + 128;
	var voiceData = bankData.substring(dataStart, dataEnd);
	var operators: ROMPresetOperator[] = [];//[{}, {}, {}, {}, {}, {}];

	for (var i = 5; i >= 0; --i) {
		var oscStart = (5 - i) * 17;
		var oscEnd = oscStart + 17;
		var oscData: string = voiceData.substring(oscStart, oscEnd);
		//var operator = operators[i];
		var operator: ROMPresetOperator = {
			envelope: {
				rates: [oscData.charCodeAt(0), oscData.charCodeAt(1), oscData.charCodeAt(2), oscData.charCodeAt(3)]
				, levels: [oscData.charCodeAt(4), oscData.charCodeAt(5), oscData.charCodeAt(6), oscData.charCodeAt(7)]
			}
			, keyScaleBreakpoint: oscData.charCodeAt(8)
			, keyScaleDepthL: oscData.charCodeAt(9)
			, keyScaleDepthR: oscData.charCodeAt(10)
			, keyScaleCurveL: oscData.charCodeAt(11) & 3
			, keyScaleCurveR: oscData.charCodeAt(11) >> 2
			, keyScaleRate: oscData.charCodeAt(12) & 7
			, detune: Math.floor(oscData.charCodeAt(12) >> 3) - 7 // range 0 to 14
			, lfoAmpModSens: oscData.charCodeAt(13) & 3
			, velocitySens: oscData.charCodeAt(13) >> 2
			, volume: oscData.charCodeAt(14)
			, oscMode: oscData.charCodeAt(15) & 1
			, freqCoarse: Math.floor(oscData.charCodeAt(15) >> 1)
			, freqFine: oscData.charCodeAt(16)
			// Extended/non-standard parameters
			, pan: ((i + 1) % 3 - 1) * 25 // Alternate panning: -25, 0, 25, -25, 0, 25
			, idx: i
			, enabled: true
			, outputLevel: 0
			, freqRatio: 0
			, freqFixed: 0
			, ampL: 0
			, ampR: 0
		};
		operators[i] = operator;
	}

	let romset: ROMPresetData = {
		algorithm: voiceData.charCodeAt(110) + 1, // start at 1 for readability
		feedback: voiceData.charCodeAt(111) & 7,
		operators: operators,
		name: voiceData.substring(118, 128),
		lfoSpeed: voiceData.charCodeAt(112),
		lfoDelay: voiceData.charCodeAt(113),
		lfoPitchModDepth: voiceData.charCodeAt(114),
		lfoAmpModDepth: voiceData.charCodeAt(115),
		lfoPitchModSens: voiceData.charCodeAt(116) >> 4,
		lfoWaveform: Math.floor(voiceData.charCodeAt(116) >> 1) & 7,
		lfoSync: voiceData.charCodeAt(116) & 1,
		pitchEnvelope: {
			rates: [voiceData.charCodeAt(102), voiceData.charCodeAt(103), voiceData.charCodeAt(104), voiceData.charCodeAt(105)],
			levels: [voiceData.charCodeAt(106), voiceData.charCodeAt(107), voiceData.charCodeAt(108), voiceData.charCodeAt(109)]
		},
		controllerModVal: 0,
		aftertouchEnabled: 0
		, fbRatio: 0
	}
	return romset;
}

function testPlay() {
	console.log(presets);
	if (audioContext) {
		//
	} else {
		audioContext = new window.AudioContext();
	}
	let carrier = audioContext.createOscillator();

	let mod1 = audioContext.createOscillator();
	carrier.frequency.value = 440;//getNoteFrequency(55);
	mod1.frequency.value = 10;
	var mod1Gain = audioContext.createGain();
	mod1Gain.gain.value = 4090.95;
	mod1.connect(mod1Gain);
	mod1Gain.connect(carrier.detune); // This is the magic FM part!

	carrier.connect(audioContext.destination);

	let bgn = audioContext.currentTime + 0.1;
	mod1.start(bgn);
	carrier.start(bgn);

	// Schedule automatic oscillation stop
	mod1.stop(audioContext.currentTime + 1);
	carrier.stop(audioContext.currentTime + 1);
}
function testPlay2() {
	console.log('testPlay2');
	if (audioContext) {
		//
	} else {
		audioContext = new window.AudioContext();
	}
	let dx7s = new DX7Sound(audioContext, audioContext.destination, testX7rom[4]);
	dx7s.scheduleSound(440, audioContext.currentTime + 0.1, 1);
	/*
	let curAlgorithms23: AlgorithmsDX7 = { outputMix: [0, 1, 3, 4], modulationMatrix: [[], [2], [], [5], [5], [5]] };
	let patchVibe1: ROMPresetData = {
		algorithm: 23, name: 'VIBE 1', operators: [
			{
				rates: [99, 28, 99, 50], levels: [99, 25, 0, 0]
				, keyScaleBreakpoint: 39, keyScaleDepthL: 12, keyScaleDepthR: 12, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 2
				, freqCoarse: 4, freqFine: 0, freqRatio: 0, freqFixed: 0
				, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 50, oscMode: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0
				, ampL: 0, ampR: 0
			}
			, { rates: [80, 85, 24, 50], levels: [99, 90, 0, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 4, keyScaleDepthR: 12, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
			, { rates: [80, 85, 43, 50], levels: [99, 74, 0, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 12, keyScaleDepthR: 12, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 4, volume: 72, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
			, { rates: [80, 85, 24, 50], levels: [99, 90, 0, 0], keyScaleBreakpoint: 9, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 1, keyScaleCurveR: 1, keyScaleRate: 3, detune: -7, lfoAmpModSens: 0, velocitySens: 1, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
			, { rates: [80, 85, 24, 50], levels: [99, 90, 42, 0], keyScaleBreakpoint: 9, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 1, keyScaleCurveR: 1, keyScaleRate: 3, detune: 7, lfoAmpModSens: 0, velocitySens: 5, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
			, {
				rates: [99, 48, 99, 50], levels: [99, 32, 0, 0]
				, keyScaleBreakpoint: 39, keyScaleDepthL: 12, keyScaleDepthR: 12, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 5
				, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 57, oscMode: 0, freqCoarse: 14, freqFine: 0, pan: -25, idx: 5
				, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0
			}
		]
		, lfoSpeed: 26, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 2, lfoWaveform: 0, lfoSync: 1
		, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0, feedback: 5
		, pitchEnvelope: { rates: [99, 98, 75, 60], levels: [50, 50, 50, 50] }
	};
	
	let when = audioContext.currentTime + 0.2;
	let duration = 1;

	let carrier1: OscillatorNode = audioContext.createOscillator();
	let carrier2: OscillatorNode = audioContext.createOscillator();
	let modulator3: OscillatorNode = audioContext.createOscillator();
	let gain3 = audioContext.createGain();
	let carrier4: OscillatorNode = audioContext.createOscillator();
	let carrier5: OscillatorNode = audioContext.createOscillator();
	let modulator6: OscillatorNode = audioContext.createOscillator();
	let gain6 = audioContext.createGain();

	let freqTone = 440;
	carrier1.frequency.value = freqTone;
	carrier2.frequency.value = freqTone;
	modulator3.frequency.value =  3.0;
	gain3.gain.value = 4321.0;
	carrier4.frequency.value = freqTone;
	carrier5.frequency.value = freqTone;
	modulator6.frequency.value = 14.0;
	gain6.gain.value = 4321.0;

	carrier1.connect(audioContext.destination);
	carrier2.connect(audioContext.destination);
	modulator3.connect(gain3);
	gain3.connect(carrier2.detune);
	carrier4.connect(audioContext.destination);
	carrier5.connect(audioContext.destination);
	modulator6.connect(gain6);
	gain6.connect(carrier4.detune);
	gain6.connect(carrier5.detune);
	gain6.connect(modulator6.detune);


	carrier1.start(when);
	carrier2.start(when);
	modulator3.start(when);
	carrier4.start(when);
	carrier5.start(when);
	modulator6.start(when);

	carrier1.stop(when + duration);
	carrier2.stop(when + duration);
	modulator3.stop(when + duration);
	carrier4.stop(when + duration);
	carrier5.stop(when + duration);
	modulator6.stop(when + duration);
	*/
}

class DX7Modulator {
	fromAnothers: DX7Modulator[] = [];
	moContext: AudioContext;
	modulator: OscillatorNode;
	gain: GainNode;
	constructor(audioContext: AudioContext) {
		this.moContext = audioContext;
		this.modulator = this.moContext.createOscillator();
		this.gain = this.moContext.createGain();
		this.modulator.connect(this.gain);
	}
	addAnother(anothr: DX7Modulator) {
		this.fromAnothers.push(anothr);
	}
	scheduleControl(when: number, duration: number) {
		for (let ii = 0; ii < this.fromAnothers.length; ii++) {
			this.fromAnothers[ii].output().connect(this.modulator.detune);
		}
		this.modulator.frequency.value = 3.0;
		this.gain.gain.value = 4321.0;
		this.modulator.start(when);
		this.modulator.stop(when + duration);
	}
	output(): AudioNode {
		return this.gain;
	}
}
class DX7Carrier {
	fromMods: DX7Modulator[] = [];
	caContext: AudioContext;
	carrierBeep: OscillatorNode;
	constructor(audioContext: AudioContext) {
		this.caContext = audioContext;
		this.carrierBeep = this.caContext.createOscillator();
	}
	addModulator(mod: DX7Modulator) {
		this.fromMods.push(mod);
	}
	schedulePitch(target: AudioNode, pitch: number, when: number, duration: number) {
		for (let ii = 0; ii < this.fromMods.length; ii++) {
			this.fromMods[ii].output().connect(this.carrierBeep.detune);
		}
		this.carrierBeep.frequency.value = pitch;
		this.carrierBeep.connect(target);
		this.carrierBeep.start(when);
		this.carrierBeep.stop(when + duration);
	}
}
class DX7Envelope {

}
class DX7Sound {
	audioContext: AudioContext;
	preset: ROMPresetData;
	algorithm: AlgorithmsDX7;
	operators: { carrier: DX7Carrier | null, modulator: DX7Modulator | null }[] = [];
	output: AudioNode;
	constructor(audioContext: AudioContext, target: AudioNode, preset: ROMPresetData) {
		this.preset = preset;
		this.audioContext = audioContext;
		this.algorithm = algorithmsDX7[this.preset.algorithm];
		this.createOperators();
		this.output = target;
		this.createOperators();
		this.linkOperators();
	}
	createOperators() {
		for (let ii = 0; ii < this.algorithm.outputMix.length; ii++) {
			this.operators[this.algorithm.outputMix[ii]] = { carrier: new DX7Carrier(this.audioContext), modulator: null };
		}
		for (let ii = 0; ii < 6; ii++) {
			if (this.operators[ii]) {
				//
			} else {
				this.operators[ii] = { carrier: null, modulator: new DX7Modulator(this.audioContext) };
			}
		}
	}
	linkOperators() {
		for (let ii = 0; ii < this.algorithm.modulationMatrix.length; ii++) {
			let fromOperators: number[] = this.algorithm.modulationMatrix[ii];
			let operator = this.operators[ii];
			if (operator.carrier) {
				for (let ff = 0; ff < fromOperators.length; ff++) {
					let control = this.operators[fromOperators[ff]];
					if (control.modulator) {
						operator.carrier.addModulator(control.modulator);
					}
				}
			} else {
				for (let ff = 0; ff < fromOperators.length; ff++) {
					let control = this.operators[fromOperators[ff]];
					if (control.modulator) {
						operator.modulator.addAnother(control.modulator);
					}
				}
			}
		}
	}
	scheduleSound(pitch: number, when: number, duration: number) {
		//console.log(pitch, this.operators);
		for (let ff = 0; ff < this.operators.length; ff++) {
			let operator = this.operators[ff];
			if (operator.modulator) {
				operator.modulator.scheduleControl(when, duration);
			} else {
				operator.carrier.schedulePitch(this.output, pitch, when, duration);
			}
		}
	}
}
