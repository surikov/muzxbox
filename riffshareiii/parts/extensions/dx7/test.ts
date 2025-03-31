//https://github.com/mmontag/dx7-synth-js/blob/d4d5e3557bf6d6f178c9a42658a54ce6fb8986fe/src/voice-dx7.js
//https://github.com/mohayonao/fm-synth
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
	, rates: number[]
	, levels: number[]
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
let testX7rom: ROMPresetData[] = [{
	algorithm: 22, feedback: 7, operators: [{ rates: [72, 76, 99, 71], levels: [99, 88, 96, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 14, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 7, lfoAmpModSens: 0, velocitySens: 0, volume: 98, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [62, 51, 29, 71], levels: [82, 95, 96, 0], keyScaleBreakpoint: 27, keyScaleDepthL: 0, keyScaleDepthR: 7, keyScaleCurveL: 3, keyScaleCurveR: 1, keyScaleRate: 0, detune: 7, lfoAmpModSens: 0, velocitySens: 0, volume: 86, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [77, 76, 82, 71], levels: [99, 98, 98, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: -2, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [77, 36, 41, 71], levels: [99, 98, 98, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [77, 36, 41, 71], levels: [99, 98, 98, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 1, lfoAmpModSens: 0, velocitySens: 2, volume: 98, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [49, 99, 28, 68], levels: [98, 98, 91, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 54, keyScaleDepthR: 50, keyScaleCurveL: 1, keyScaleCurveR: 1, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 82, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'BRASS 1', lfoSpeed: 37, lfoDelay: 0, lfoPitchModDepth: 5, lfoAmpModDepth: 0, lfoPitchModSens: 3, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [84, 95, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 22, feedback: 7, operators: [{ rates: [99, 39, 32, 71], levels: [99, 98, 80, 0], keyScaleBreakpoint: 51, keyScaleDepthL: 0, keyScaleDepthR: 38, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 7, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 39, 32, 71], levels: [99, 98, 80, 0], keyScaleBreakpoint: 51, keyScaleDepthL: 0, keyScaleDepthR: 38, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 7, lfoAmpModSens: 0, velocitySens: 0, volume: 84, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 39, 32, 71], levels: [99, 98, 81, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: -3, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 39, 32, 71], levels: [99, 98, 81, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: -2, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 39, 32, 71], levels: [99, 98, 81, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 1, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 39, 32, 71], levels: [99, 98, 88, 0], keyScaleBreakpoint: 51, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 80, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'BRASS 2', lfoSpeed: 37, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 3, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [84, 95, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 18, feedback: 6, operators: [{ rates: [55, 24, 19, 55], levels: [99, 86, 86, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [37, 34, 15, 70], levels: [85, 0, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 70, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [46, 35, 22, 50], levels: [99, 86, 86, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 77, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [66, 92, 22, 50], levels: [53, 61, 62, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 79, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [48, 55, 22, 50], levels: [98, 61, 62, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: -1, lfoAmpModSens: 0, velocitySens: 0, volume: 70, oscMode: 0, freqCoarse: 3, freqFine: 6, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [77, 56, 20, 70], levels: [99, 0, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 7, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 79, oscMode: 0, freqCoarse: 7, freqFine: 21, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'BRASS 3', lfoSpeed: 35, lfoDelay: 0, lfoPitchModDepth: 5, lfoAmpModDepth: 0, lfoPitchModSens: 3, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 2, feedback: 7, operators: [{ rates: [45, 24, 20, 41], levels: [99, 85, 70, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 3, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [75, 71, 17, 49], levels: [82, 92, 62, 0], keyScaleBreakpoint: 54, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 83, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [44, 45, 20, 54], levels: [99, 85, 82, 0], keyScaleBreakpoint: 56, keyScaleDepthL: 0, keyScaleDepthR: 97, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 86, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [96, 19, 20, 54], levels: [99, 92, 86, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 77, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [53, 19, 20, 54], levels: [86, 92, 86, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 84, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [53, 19, 20, 54], levels: [99, 92, 86, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 53, oscMode: 0, freqCoarse: 14, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'STRINGS 1', lfoSpeed: 30, lfoDelay: 0, lfoPitchModDepth: 8, lfoAmpModDepth: 0, lfoPitchModSens: 2, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 2, feedback: 7, operators: [{ rates: [48, 56, 10, 47], levels: [98, 98, 36, 0], keyScaleBreakpoint: 98, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 92, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [81, 13, 7, 25], levels: [99, 92, 28, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: -6, lfoAmpModSens: 0, velocitySens: 0, volume: 74, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [51, 15, 10, 47], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 6, lfoAmpModSens: 0, velocitySens: 0, volume: 92, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [49, 74, 10, 32], levels: [98, 98, 36, 0], keyScaleBreakpoint: 98, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 76, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [76, 73, 10, 28], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 66, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [72, 76, 10, 32], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 70, oscMode: 0, freqCoarse: 8, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'STRINGS 2', lfoSpeed: 30, lfoDelay: 81, lfoPitchModDepth: 8, lfoAmpModDepth: 0, lfoPitchModSens: 2, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [84, 95, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 15, feedback: 7, operators: [{ rates: [52, 30, 25, 43], levels: [99, 92, 90, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 71, 35, 51], levels: [82, 92, 87, 0], keyScaleBreakpoint: 54, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 86, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [50, 52, 35, 41], levels: [99, 92, 91, 0], keyScaleBreakpoint: 51, keyScaleDepthL: 98, keyScaleDepthR: 60, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [96, 19, 20, 54], levels: [99, 92, 89, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 75, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [53, 67, 38, 54], levels: [86, 92, 74, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 84, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [53, 64, 44, 54], levels: [99, 92, 56, 0], keyScaleBreakpoint: 55, keyScaleDepthL: 25, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 54, oscMode: 0, freqCoarse: 14, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'STRINGS 3', lfoSpeed: 28, lfoDelay: 46, lfoPitchModDepth: 30, lfoAmpModDepth: 0, lfoPitchModSens: 1, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 2, feedback: 7, operators: [{ rates: [80, 56, 10, 45], levels: [98, 98, 36, 0], keyScaleBreakpoint: 98, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [53, 46, 32, 61], levels: [99, 93, 90, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: -6, lfoAmpModSens: 0, velocitySens: 0, volume: 83, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [54, 15, 10, 47], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 6, lfoAmpModSens: 0, velocitySens: 0, volume: 96, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [56, 74, 10, 45], levels: [98, 98, 36, 0], keyScaleBreakpoint: 98, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 72, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [76, 73, 10, 55], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 80, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [72, 76, 10, 32], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 82, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'ORCHESTRA', lfoSpeed: 30, lfoDelay: 63, lfoPitchModDepth: 6, lfoAmpModDepth: 0, lfoPitchModSens: 3, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [84, 95, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 19, feedback: 6, operators: [
		{
			rates: [81, 25, 20, 48], levels: [99, 82, 0, 0]
			, keyScaleBreakpoint: 0, keyScaleDepthL: 85, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 4
			, detune: -2, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, pan: 0, idx: 0, outputLevel: 0
			, freqCoarse: 1, freqFine: 0, freqRatio: 0, freqFixed: 0
			, ampL: 0, ampR: 0, enabled: true
		}
		, { rates: [99, 0, 25, 0], levels: [99, 75, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 13, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: 2, lfoAmpModSens: 0, velocitySens: 0, volume: 87, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [81, 25, 25, 14], levels: [99, 99, 99, 0], keyScaleBreakpoint: 47, keyScaleDepthL: 32, keyScaleDepthR: 74, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 5, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 57, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [81, 23, 22, 45], levels: [99, 78, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: 1, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [81, 58, 36, 39], levels: [99, 14, 0, 0], keyScaleBreakpoint: 48, keyScaleDepthL: 0, keyScaleDepthR: 66, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: -1, lfoAmpModSens: 0, velocitySens: 1, volume: 93, oscMode: 0, freqCoarse: 1, freqFine: 58, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 0, 25, 0], levels: [99, 75, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 10, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: -1, lfoAmpModSens: 0, velocitySens: 0, volume: 82, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'PIANO 1'
	, lfoSpeed: 35, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 4, lfoWaveform: 0, lfoSync: 0
	, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }
	, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 18, feedback: 5, operators: [{ rates: [80, 24, 10, 50], levels: [99, 62, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 94, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 0, 25, 0], levels: [99, 75, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 10, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 2, lfoAmpModSens: 0, velocitySens: 1, volume: 86, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [90, 27, 20, 50], levels: [99, 85, 0, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 27, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: 1, lfoAmpModSens: 0, velocitySens: 1, volume: 83, oscMode: 0, freqCoarse: 5, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [97, 27, 10, 25], levels: [99, 86, 48, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: -1, lfoAmpModSens: 0, velocitySens: 1, volume: 84, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [90, 71, 33, 31], levels: [99, 0, 0, 0], keyScaleBreakpoint: 27, keyScaleDepthL: 0, keyScaleDepthR: 26, keyScaleCurveL: 2, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 94, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [92, 71, 58, 36], levels: [99, 0, 0, 0], keyScaleBreakpoint: 36, keyScaleDepthL: 0, keyScaleDepthR: 98, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 1, lfoAmpModSens: 0, velocitySens: 1, volume: 78, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'PIANO 2', lfoSpeed: 30, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 4, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 3, feedback: 4, operators: [{ rates: [90, 30, 28, 45], levels: [99, 95, 0, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: -4, lfoAmpModSens: 0, velocitySens: 3, volume: 86, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [98, 36, 6, 32], levels: [91, 90, 0, 0], keyScaleBreakpoint: 50, keyScaleDepthL: 22, keyScaleDepthR: 50, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 2, detune: 4, lfoAmpModSens: 0, velocitySens: 0, volume: 85, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [94, 80, 19, 12], levels: [83, 67, 0, 0], keyScaleBreakpoint: 43, keyScaleDepthL: 9, keyScaleDepthR: 20, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 3, detune: -3, lfoAmpModSens: 0, velocitySens: 3, volume: 97, oscMode: 0, freqCoarse: 7, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [90, 64, 28, 45], levels: [99, 97, 0, 0], keyScaleBreakpoint: 46, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 3, lfoAmpModSens: 0, velocitySens: 2, volume: 95, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [98, 20, 6, 2], levels: [91, 90, 0, 0], keyScaleBreakpoint: 41, keyScaleDepthL: 0, keyScaleDepthR: 27, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 2, detune: -2, lfoAmpModSens: 0, velocitySens: 1, volume: 87, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [80, 73, 15, 10], levels: [99, 19, 0, 0], keyScaleBreakpoint: 53, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 3, detune: 2, lfoAmpModSens: 0, velocitySens: 5, volume: 84, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'PIANO 3', lfoSpeed: 45, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 4, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [0, 0, 0, 0], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 5, feedback: 6, operators: [{ rates: [96, 25, 25, 67], levels: [99, 75, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 3, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 50, 35, 78], levels: [99, 75, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 58, oscMode: 0, freqCoarse: 14, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 20, 20, 50], levels: [99, 95, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 29, 20, 50], levels: [99, 95, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 6, volume: 89, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 20, 20, 50], levels: [99, 95, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: -7, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 29, 20, 50], levels: [99, 95, 0, 0], keyScaleBreakpoint: 41, keyScaleDepthL: 0, keyScaleDepthR: 19, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 7, lfoAmpModSens: 0, velocitySens: 6, volume: 79, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'E.PIANO 1', lfoSpeed: 34, lfoDelay: 33, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 3, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 8, feedback: 7, operators: [{ rates: [74, 85, 27, 70], levels: [99, 95, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 5, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [91, 25, 39, 60], levels: [99, 86, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 65, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 93, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [78, 87, 22, 75], levels: [99, 92, 0, 0], keyScaleBreakpoint: 34, keyScaleDepthL: 9, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [81, 87, 22, 75], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 14, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 4, volume: 89, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [81, 87, 22, 75], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 15, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 99, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 57, 99, 75], levels: [99, 0, 0, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 53, keyScaleDepthR: 20, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 3, velocitySens: 6, volume: 57, oscMode: 0, freqCoarse: 12, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'GUITAR 1', lfoSpeed: 35, lfoDelay: 0, lfoPitchModDepth: 1, lfoAmpModDepth: 3, lfoPitchModSens: 3, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [75, 80, 75, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 16, feedback: 7, operators: [{ rates: [95, 67, 99, 71], levels: [99, 99, 99, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 82, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 3, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 86, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 99, 99, 42], levels: [99, 99, 99, 99], keyScaleBreakpoint: 48, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 87, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 99, 99, 71], levels: [99, 99, 99, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 40, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 50, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [92, 99, 15, 71], levels: [99, 96, 75, 0], keyScaleBreakpoint: 60, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 70, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 99, 12, 0], levels: [99, 99, 76, 0], keyScaleBreakpoint: 60, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 85, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 44, 1, 71], levels: [99, 96, 75, 0], keyScaleBreakpoint: 60, keyScaleDepthL: 0, keyScaleDepthR: 46, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 73, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'GUITAR 2', lfoSpeed: 35, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 4, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [84, 95, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 18, feedback: 7, operators: [{ rates: [99, 0, 12, 70], levels: [99, 95, 95, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 1, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 95, 0, 0], levels: [99, 96, 89, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: -1, lfoAmpModSens: 0, velocitySens: 0, volume: 71, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 87, 0, 0], levels: [93, 90, 0, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 21, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 82, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 92, 28, 60], levels: [99, 90, 0, 0], keyScaleBreakpoint: 48, keyScaleDepthL: 0, keyScaleDepthR: 60, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 6, detune: 2, lfoAmpModSens: 0, velocitySens: 0, volume: 71, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 99, 97, 0], levels: [99, 65, 60, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: -2, lfoAmpModSens: 0, velocitySens: 0, volume: 43, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 70, 60, 0], levels: [99, 99, 97, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 21, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 47, oscMode: 0, freqCoarse: 17, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'SYN-LEAD 1', lfoSpeed: 37, lfoDelay: 42, lfoPitchModDepth: 0, lfoAmpModDepth: 99, lfoPitchModSens: 4, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [0, 0, 0, 0], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 16, feedback: 7, operators: [{ rates: [95, 62, 17, 58], levels: [99, 95, 32, 0], keyScaleBreakpoint: 36, keyScaleDepthL: 57, keyScaleDepthR: 14, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 7, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 20, 0, 0], levels: [99, 0, 0, 0], keyScaleBreakpoint: 41, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 7, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 80, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [88, 96, 32, 30], levels: [79, 65, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 6, detune: 0, lfoAmpModSens: 0, velocitySens: 3, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [90, 42, 7, 55], levels: [90, 30, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: 0, lfoAmpModSens: 0, velocitySens: 5, volume: 93, oscMode: 0, freqCoarse: 5, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 0, 0, 0], levels: [99, 0, 0, 0], keyScaleBreakpoint: 52, keyScaleDepthL: 75, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 7, detune: 0, lfoAmpModSens: 0, velocitySens: 3, volume: 62, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [94, 56, 24, 55], levels: [93, 28, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 85, oscMode: 0, freqCoarse: 9, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'BASS 1', lfoSpeed: 35, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 3, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 17, feedback: 7, operators: [{ rates: [75, 37, 18, 63], levels: [99, 70, 0, 0], keyScaleBreakpoint: 48, keyScaleDepthL: 0, keyScaleDepthR: 32, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 1, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [28, 37, 42, 50], levels: [99, 0, 0, 0], keyScaleBreakpoint: 41, keyScaleDepthL: 0, keyScaleDepthR: 35, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 80, oscMode: 0, freqCoarse: 0, freqFine: 3, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [73, 25, 32, 30], levels: [97, 78, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 7, lfoAmpModSens: 0, velocitySens: 3, volume: 68, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [80, 39, 28, 53], levels: [93, 57, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 51, 0, 0], levels: [99, 74, 0, 0], keyScaleBreakpoint: 34, keyScaleDepthL: 0, keyScaleDepthR: 32, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 75, oscMode: 0, freqCoarse: 1, freqFine: 1, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [25, 50, 24, 55], levels: [96, 97, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 1, lfoAmpModSens: 0, velocitySens: 7, volume: 87, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'BASS 2', lfoSpeed: 31, lfoDelay: 33, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 2, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 32, feedback: 0, operators: [{ rates: [99, 80, 22, 90], levels: [99, 99, 99, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: -2, lfoAmpModSens: 0, velocitySens: 0, volume: 94, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 20, 22, 90], levels: [99, 99, 97, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 10, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: -6, lfoAmpModSens: 0, velocitySens: 0, volume: 94, oscMode: 0, freqCoarse: 1, freqFine: 1, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 80, 54, 82], levels: [99, 99, 99, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 4, lfoAmpModSens: 0, velocitySens: 0, volume: 94, oscMode: 0, freqCoarse: 1, freqFine: 50, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 80, 22, 90], levels: [99, 99, 99, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 5, lfoAmpModSens: 0, velocitySens: 0, volume: 94, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 80, 22, 90], levels: [99, 99, 99, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 2, lfoAmpModSens: 0, velocitySens: 0, volume: 94, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 54, 22, 90], levels: [99, 0, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 94, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'E.ORGAN 1', lfoSpeed: 35, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 4, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [75, 80, 75, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 19, feedback: 7, operators: [{ rates: [45, 25, 25, 36], levels: [99, 99, 98, 0], keyScaleBreakpoint: 41, keyScaleDepthL: 0, keyScaleDepthR: 50, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 97, 62, 47], levels: [99, 99, 90, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 90, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 97, 62, 47], levels: [99, 99, 90, 0], keyScaleBreakpoint: 46, keyScaleDepthL: 17, keyScaleDepthR: 40, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 5, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 75, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [61, 25, 25, 50], levels: [99, 99, 97, 0], keyScaleBreakpoint: 60, keyScaleDepthL: 10, keyScaleDepthR: 10, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 88, oscMode: 0, freqCoarse: 4, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [61, 25, 25, 61], levels: [99, 99, 93, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 97, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [72, 25, 25, 70], levels: [99, 99, 99, 0], keyScaleBreakpoint: 46, keyScaleDepthL: 10, keyScaleDepthR: 1, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 76, oscMode: 0, freqCoarse: 10, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'PIPES 1', lfoSpeed: 34, lfoDelay: 33, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 2, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 5, feedback: 1, operators: [{ rates: [95, 28, 27, 47], levels: [99, 90, 0, 0], keyScaleBreakpoint: 49, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 89, oscMode: 0, freqCoarse: 4, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 72, 71, 99], levels: [99, 97, 91, 98], keyScaleBreakpoint: 49, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 28, 27, 47], levels: [99, 90, 0, 0], keyScaleBreakpoint: 49, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: -1, lfoAmpModSens: 0, velocitySens: 2, volume: 85, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 72, 71, 99], levels: [99, 97, 91, 98], keyScaleBreakpoint: 64, keyScaleDepthL: 0, keyScaleDepthR: 46, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 28, 27, 47], levels: [99, 90, 0, 0], keyScaleBreakpoint: 49, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: -1, lfoAmpModSens: 0, velocitySens: 3, volume: 83, oscMode: 0, freqCoarse: 4, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 72, 71, 99], levels: [99, 97, 91, 98], keyScaleBreakpoint: 64, keyScaleDepthL: 0, keyScaleDepthR: 55, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 87, oscMode: 0, freqCoarse: 6, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'HARPSICH 1', lfoSpeed: 35, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 2, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [0, 0, 0, 0], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 3, feedback: 5, operators: [{ rates: [95, 92, 28, 60], levels: [99, 90, 0, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 1, lfoAmpModSens: 0, velocitySens: 3, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 95, 0, 0], levels: [99, 96, 89, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: -1, lfoAmpModSens: 0, velocitySens: 1, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [98, 87, 0, 0], levels: [87, 86, 0, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 21, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 71, oscMode: 0, freqCoarse: 4, freqFine: 50, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 92, 28, 60], levels: [99, 90, 0, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 95, 0, 0], levels: [99, 96, 89, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: -2, lfoAmpModSens: 0, velocitySens: 6, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [98, 87, 0, 0], levels: [87, 86, 0, 0], keyScaleBreakpoint: 32, keyScaleDepthL: 0, keyScaleDepthR: 21, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 78, oscMode: 0, freqCoarse: 8, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'CLAV 1', lfoSpeed: 30, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 2, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [0, 0, 0, 0], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 23, feedback: 5, operators: [{ rates: [99, 28, 99, 50], levels: [99, 25, 0, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 12, keyScaleDepthR: 12, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 50, oscMode: 0, freqCoarse: 4, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [80, 85, 24, 50], levels: [99, 90, 0, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 4, keyScaleDepthR: 12, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [80, 85, 43, 50], levels: [99, 74, 0, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 12, keyScaleDepthR: 12, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 4, volume: 72, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [80, 85, 24, 50], levels: [99, 90, 0, 0], keyScaleBreakpoint: 9, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 1, keyScaleCurveR: 1, keyScaleRate: 3, detune: -7, lfoAmpModSens: 0, velocitySens: 1, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [80, 85, 24, 50], levels: [99, 90, 42, 0], keyScaleBreakpoint: 9, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 1, keyScaleCurveR: 1, keyScaleRate: 3, detune: 7, lfoAmpModSens: 0, velocitySens: 5, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 48, 99, 50], levels: [99, 32, 0, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 12, keyScaleDepthR: 12, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 5, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 57, oscMode: 0, freqCoarse: 14, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'VIBE 1', lfoSpeed: 26, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 2, lfoWaveform: 0, lfoSync: 1, pitchEnvelope: { rates: [99, 98, 75, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 7, feedback: 0, operators: [{ rates: [95, 40, 49, 55], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 95, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 72, 0, 0], levels: [82, 48, 0, 0], keyScaleBreakpoint: 54, keyScaleDepthL: 0, keyScaleDepthR: 46, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 96, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 33, 49, 41], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 75, 0, 82], levels: [82, 48, 0, 0], keyScaleBreakpoint: 54, keyScaleDepthL: 0, keyScaleDepthR: 46, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 85, oscMode: 0, freqCoarse: 5, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 75, 0, 8], levels: [82, 48, 0, 0], keyScaleBreakpoint: 54, keyScaleDepthL: 0, keyScaleDepthR: 46, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 93, oscMode: 0, freqCoarse: 0, freqFine: 50, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [0, 63, 55, 0], levels: [78, 78, 0, 0], keyScaleBreakpoint: 41, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 4, freqFine: 13, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'MARIMBA', lfoSpeed: 35, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 3, lfoWaveform: 0, lfoSync: 1, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 2, feedback: 7, operators: [{ rates: [94, 62, 58, 34], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 6, detune: 0, lfoAmpModSens: 0, velocitySens: 3, volume: 90, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 68, 28, 48], levels: [99, 83, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 10, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 6, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 4, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [94, 64, 30, 33], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 5, detune: 0, lfoAmpModSens: 0, velocitySens: 3, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [90, 28, 17, 39], levels: [99, 76, 0, 0], keyScaleBreakpoint: 10, keyScaleDepthL: 0, keyScaleDepthR: 17, keyScaleCurveL: 0, keyScaleCurveR: 1, keyScaleRate: 6, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 82, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [91, 37, 29, 29], levels: [99, 90, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 5, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 6, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 83, oscMode: 0, freqCoarse: 4, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [82, 53, 37, 48], levels: [99, 81, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 5, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 6, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 81, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'KOTO', lfoSpeed: 30, lfoDelay: 40, lfoPitchModDepth: 17, lfoAmpModDepth: 15, lfoPitchModSens: 2, lfoWaveform: 4, lfoSync: 1, pitchEnvelope: { rates: [85, 99, 75, 0], levels: [49, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 16, feedback: 5, operators: [{ rates: [61, 67, 70, 65], levels: [93, 89, 98, 0], keyScaleBreakpoint: 41, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: -2, lfoAmpModSens: 0, velocitySens: 2, volume: 98, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 97, 62, 54], levels: [99, 99, 90, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 4, detune: 4, lfoAmpModSens: 0, velocitySens: 2, volume: 75, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [53, 38, 75, 61], levels: [88, 44, 24, 0], keyScaleBreakpoint: 46, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 0, detune: -3, lfoAmpModSens: 1, velocitySens: 0, volume: 76, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [61, 25, 25, 60], levels: [99, 99, 97, 0], keyScaleBreakpoint: 60, keyScaleDepthL: 10, keyScaleDepthR: 10, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 0, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [65, 38, 0, 61], levels: [99, 0, 0, 0], keyScaleBreakpoint: 53, keyScaleDepthL: 0, keyScaleDepthR: 43, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 56, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 64, 98, 61], levels: [99, 67, 52, 0], keyScaleBreakpoint: 46, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 0, detune: 4, lfoAmpModSens: 0, velocitySens: 2, volume: 83, oscMode: 0, freqCoarse: 1, freqFine: 53, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'FLUTE 1', lfoSpeed: 30, lfoDelay: 23, lfoPitchModDepth: 8, lfoAmpModDepth: 13, lfoPitchModSens: 1, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [94, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 5, feedback: 7, operators: [{ rates: [34, 42, 71, 34], levels: [99, 99, 99, 0], keyScaleBreakpoint: 15, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 1, keyScaleRate: 3, detune: 5, lfoAmpModSens: 0, velocitySens: 0, volume: 97, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 0, 0, 0], levels: [99, 99, 99, 0], keyScaleBreakpoint: 15, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 1, keyScaleRate: 7, detune: 5, lfoAmpModSens: 0, velocitySens: 0, volume: 87, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [80, 49, 17, 30], levels: [99, 95, 0, 0], keyScaleBreakpoint: 15, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 1, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [80, 70, 9, 12], levels: [88, 80, 0, 0], keyScaleBreakpoint: 15, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 1, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 3, volume: 91, oscMode: 0, freqCoarse: 2, freqFine: 57, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [41, 42, 71, 34], levels: [99, 99, 99, 0], keyScaleBreakpoint: 15, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 1, keyScaleRate: 3, detune: 7, lfoAmpModSens: 0, velocitySens: 0, volume: 98, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 0, 0, 0], levels: [99, 99, 99, 0], keyScaleBreakpoint: 15, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 1, keyScaleRate: 7, detune: -7, lfoAmpModSens: 0, velocitySens: 0, volume: 75, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'ORCH-CHIME', lfoSpeed: 30, lfoDelay: 0, lfoPitchModDepth: 5, lfoAmpModDepth: 0, lfoPitchModSens: 3, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [99, 99, 99, 99], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 5, feedback: 7, operators: [{ rates: [95, 33, 71, 25], levels: [99, 0, 32, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 2, lfoAmpModSens: 0, velocitySens: 0, volume: 95, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [98, 12, 71, 28], levels: [99, 0, 32, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 3, lfoAmpModSens: 0, velocitySens: 0, volume: 78, oscMode: 0, freqCoarse: 2, freqFine: 75, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [95, 33, 71, 25], levels: [99, 0, 32, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: -5, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [98, 12, 71, 28], levels: [99, 0, 32, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: -2, lfoAmpModSens: 0, velocitySens: 0, volume: 75, oscMode: 0, freqCoarse: 2, freqFine: 75, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [76, 78, 71, 70], levels: [99, 0, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 5, volume: 99, oscMode: 1, freqCoarse: 2, freqFine: 51, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [98, 91, 0, 28], levels: [99, 0, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 2, detune: -7, lfoAmpModSens: 0, velocitySens: 0, volume: 85, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'TUB BELLS', lfoSpeed: 35, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 1, lfoWaveform: 1, lfoSync: 0, pitchEnvelope: { rates: [67, 95, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 15, feedback: 5, operators: [{ rates: [99, 40, 33, 38], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 19, 20, 9], levels: [99, 87, 0, 0], keyScaleBreakpoint: 57, keyScaleDepthL: 0, keyScaleDepthR: 71, keyScaleCurveL: 2, keyScaleCurveR: 0, keyScaleRate: 2, detune: 0, lfoAmpModSens: 0, velocitySens: 2, volume: 64, oscMode: 0, freqCoarse: 1, freqFine: 70, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 30, 35, 42], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 3, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 44, 50, 21], levels: [91, 82, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 7, lfoAmpModSens: 0, velocitySens: 1, volume: 88, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 40, 38, 0], levels: [91, 82, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 64, oscMode: 0, freqCoarse: 4, freqFine: 33, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 49, 28, 12], levels: [91, 82, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 49, oscMode: 1, freqCoarse: 2, freqFine: 60, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'STEEL DRUM', lfoSpeed: 25, lfoDelay: 0, lfoPitchModDepth: 10, lfoAmpModDepth: 99, lfoPitchModSens: 2, lfoWaveform: 4, lfoSync: 0, pitchEnvelope: { rates: [50, 50, 50, 50], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 16, feedback: 7, operators: [{ rates: [99, 36, 98, 33], levels: [99, 0, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 3, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 74, 0, 0], levels: [99, 0, 0, 0], keyScaleBreakpoint: 41, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 1, keyScaleRate: 1, detune: 3, lfoAmpModSens: 0, velocitySens: 1, volume: 86, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 77, 26, 23], levels: [99, 72, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 1, keyScaleRate: 3, detune: -3, lfoAmpModSens: 0, velocitySens: 0, volume: 85, oscMode: 0, freqCoarse: 0, freqFine: 36, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 31, 17, 30], levels: [99, 75, 0, 0], keyScaleBreakpoint: 80, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 1, keyScaleRate: 7, detune: 0, lfoAmpModSens: 0, velocitySens: 7, volume: 87, oscMode: 0, freqCoarse: 0, freqFine: 75, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 50, 26, 19], levels: [99, 0, 0, 0], keyScaleBreakpoint: 80, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 1, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 73, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [98, 2, 26, 27], levels: [98, 0, 0, 0], keyScaleBreakpoint: 3, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 2, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 73, oscMode: 0, freqCoarse: 0, freqFine: 56, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'TIMPANI', lfoSpeed: 11, lfoDelay: 0, lfoPitchModDepth: 16, lfoAmpModDepth: 0, lfoPitchModSens: 2, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [99, 98, 75, 60], levels: [50, 51, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 18, feedback: 2, operators: [{ rates: [60, 39, 28, 49], levels: [99, 99, 99, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 1, volume: 90, oscMode: 1, freqCoarse: 3, freqFine: 32, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [60, 39, 28, 45], levels: [99, 99, 99, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 93, oscMode: 1, freqCoarse: 9, freqFine: 53, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [60, 39, 8, 0], levels: [99, 99, 99, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 4, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 66, oscMode: 1, freqCoarse: 1, freqFine: 67, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [94, 68, 24, 55], levels: [96, 89, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 75, oscMode: 1, freqCoarse: 7, freqFine: 82, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 0, 0, 0], levels: [99, 0, 0, 0], keyScaleBreakpoint: 41, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 64, oscMode: 1, freqCoarse: 4, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [94, 56, 24, 55], levels: [96, 78, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 1, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 78, oscMode: 1, freqCoarse: 5, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'REFS WHISL', lfoSpeed: 99, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 6, lfoWaveform: 5, lfoSync: 1, pitchEnvelope: { rates: [38, 67, 95, 60], levels: [39, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 7, feedback: 7, operators: [{ rates: [34, 20, 53, 57], levels: [99, 94, 97, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: -7, lfoAmpModSens: 0, velocitySens: 0, volume: 87, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [19, 26, 53, 25], levels: [51, 61, 76, 51], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 2, velocitySens: 2, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [33, 20, 53, 39], levels: [99, 94, 97, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 7, lfoAmpModSens: 0, velocitySens: 3, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [72, 19, 41, 12], levels: [48, 58, 20, 9], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 3, lfoAmpModSens: 0, velocitySens: 1, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 2, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [35, 21, 36, 63], levels: [99, 90, 85, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: -1, lfoAmpModSens: 0, velocitySens: 1, volume: 53, oscMode: 0, freqCoarse: 1, freqFine: 1, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [99, 72, 48, 17], levels: [99, 99, 99, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 1, lfoAmpModSens: 0, velocitySens: 0, volume: 55, oscMode: 0, freqCoarse: 5, freqFine: 2, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'VOICE 1', lfoSpeed: 35, lfoDelay: 35, lfoPitchModDepth: 11, lfoAmpModDepth: 2, lfoPitchModSens: 4, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [18, 60, 95, 60], levels: [48, 51, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 5, feedback: 7, operators: [{ rates: [65, 24, 19, 57], levels: [99, 85, 85, 0], keyScaleBreakpoint: 39, keyScaleDepthL: 0, keyScaleDepthR: 98, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 3, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 1, freqFine: 64, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [39, 13, 12, 72], levels: [99, 61, 66, 0], keyScaleBreakpoint: 52, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 5, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 72, oscMode: 0, freqCoarse: 3, freqFine: 1, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [98, 29, 28, 33], levels: [99, 0, 0, 0], keyScaleBreakpoint: 99, keyScaleDepthL: 98, keyScaleDepthR: 0, keyScaleCurveL: 1, keyScaleCurveR: 1, keyScaleRate: 0, detune: 2, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 1, freqCoarse: 22, freqFine: 57, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [98, 29, 28, 27], levels: [99, 0, 0, 0], keyScaleBreakpoint: 20, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 1, keyScaleCurveR: 1, keyScaleRate: 0, detune: -2, lfoAmpModSens: 0, velocitySens: 0, volume: 89, oscMode: 1, freqCoarse: 10, freqFine: 99, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [42, 17, 25, 53], levels: [99, 99, 99, 99], keyScaleBreakpoint: 36, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 0, detune: 3, lfoAmpModSens: 3, velocitySens: 0, volume: 83, oscMode: 0, freqCoarse: 9, freqFine: 0, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [49, 17, 25, 53], levels: [99, 99, 99, 98], keyScaleBreakpoint: 36, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 3, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 5, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'TRAIN', lfoSpeed: 39, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 99, lfoPitchModSens: 0, lfoWaveform: 0, lfoSync: 0, pitchEnvelope: { rates: [75, 67, 95, 60], levels: [50, 50, 50, 50] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}
	, {
	algorithm: 10, feedback: 0, operators: [{ rates: [9, 14, 17, 34], levels: [61, 96, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 4, freqFine: 1, pan: 0, idx: 0, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [82, 80, 19, 14], levels: [80, 95, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 96, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 25, idx: 1, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [76, 35, 99, 11], levels: [67, 38, 73, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 6, freqFine: 1, pan: -25, idx: 2, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [13, 14, 20, 30], levels: [99, 95, 99, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, idx: 3, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [88, 24, 23, 37], levels: [99, 90, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 96, oscMode: 0, freqCoarse: 2, freqFine: 1, pan: 25, idx: 4, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }
		, { rates: [89, 22, 20, 41], levels: [99, 92, 0, 0], keyScaleBreakpoint: 0, keyScaleDepthL: 0, keyScaleDepthR: 0, keyScaleCurveL: 0, keyScaleCurveR: 0, keyScaleRate: 0, detune: 0, lfoAmpModSens: 0, velocitySens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: -25, idx: 5, enabled: true, outputLevel: 0, freqRatio: 0, freqFixed: 0, ampL: 0, ampR: 0 }]
	, name: 'TAKE OFF', lfoSpeed: 65, lfoDelay: 0, lfoPitchModDepth: 0, lfoAmpModDepth: 0, lfoPitchModSens: 5, lfoWaveform: 2, lfoSync: 1, pitchEnvelope: { rates: [32, 30, 94, 16], levels: [50, 7, 81, 99] }, controllerModVal: 0, aftertouchEnabled: 0, fbRatio: 0
}];

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
			rates: [oscData.charCodeAt(0), oscData.charCodeAt(1), oscData.charCodeAt(2), oscData.charCodeAt(3)]
			, levels: [oscData.charCodeAt(4), oscData.charCodeAt(5), oscData.charCodeAt(6), oscData.charCodeAt(7)]
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
	if (audioContext) {
		//
	} else {
		audioContext = new window.AudioContext();
	}
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
}
class DX7Operator {

}
class DX7Envelope {

}
class DX7Sound {

}
