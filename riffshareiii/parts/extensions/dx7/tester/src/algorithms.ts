type ConnectionSchemeDX7 = {
	outputMix: number[]
	, modulationMatrix: (number[])[]
};
let matrixAlgorithmsDX7: ConnectionSchemeDX7[] = [
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
	{ outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], [5]] }, //16 
	{ outputMix: [0], modulationMatrix: [[1, 2, 4], [1], [3], [], [5], []] }, //17
	{ outputMix: [0], modulationMatrix: [[1, 2, 3], [], [2], [4], [5], []] }, //18
	//rooting/tower combi
	{ outputMix: [0, 3, 4], modulationMatrix: [[1], [2], [], [5], [5], [5]] },    //19
	{ outputMix: [0, 1, 3], modulationMatrix: [[2], [2], [2], [4, 5], [], []] },   //20
	{ outputMix: [0, 1, 3, 4], modulationMatrix: [[2], [2], [2], [5], [5], []] },    //21

	{ outputMix: [0, 2, 3, 4], modulationMatrix: [[1], [], [5], [5], [5], [5]] },    //22 bass 1


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
let epiano1preset={
    "algorithm": 5,
    "feedback": 6,
    "operators": [
        {
            "rates": [
                96,
                25,
                25,
                67
            ],
            "levels": [
                99,
                75,
                0,
                0
            ],
            "keyScaleBreakpoint": 0,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": 3,
            "lfoAmpModSens": 0,
            "velocitySens": 2,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": 0,
            "idx": 0,
            "enabled": false
        },
        {
            "rates": [
                95,
                50,
                35,
                78
            ],
            "levels": [
                99,
                75,
                0,
                0
            ],
            "keyScaleBreakpoint": 0,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": 0,
            "lfoAmpModSens": 0,
            "velocitySens": 7,
            "volume": 58,
            "oscMode": 0,
            "freqCoarse": 14,
            "freqFine": 0,
            "pan": 25,
            "idx": 1,
            "enabled": false
        },
        {
            "rates": [
                95,
                20,
                20,
                50
            ],
            "levels": [
                99,
                95,
                0,
                0
            ],
            "keyScaleBreakpoint": 0,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": 0,
            "lfoAmpModSens": 0,
            "velocitySens": 2,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": -25,
            "idx": 2,
            "enabled": true
        },
        {
            "rates": [
                95,
                29,
                20,
                50
            ],
            "levels": [
                99,
                95,
                0,
                0
            ],
            "keyScaleBreakpoint": 0,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": 0,
            "lfoAmpModSens": 0,
            "velocitySens": 6,
            "volume": 89,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": 0,
            "idx": 3,
            "enabled": true
        },
        {
            "rates": [
                95,
                20,
                20,
                50
            ],
            "levels": [
                99,
                95,
                0,
                0
            ],
            "keyScaleBreakpoint": 0,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": -7,
            "lfoAmpModSens": 0,
            "velocitySens": 0,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": 25,
            "idx": 4,
            "enabled": false
        },
        {
            "rates": [
                95,
                29,
                20,
                50
            ],
            "levels": [
                99,
                95,
                0,
                0
            ],
            "keyScaleBreakpoint": 41,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 19,
            "keyScaleCurveL": 0,
            "keyScaleCurveR": 0,
            "keyScaleRate": 3,
            "detune": 7,
            "lfoAmpModSens": 0,
            "velocitySens": 6,
            "volume": 79,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": -25,
            "idx": 5,
            "enabled": false
        }
    ],
    "name": "E.PIANO 1 ",
    "lfoSpeed": 34,
    "lfoDelay": 33,
    "lfoPitchModDepth": 0,
    "lfoAmpModDepth": 0,
    "lfoPitchModSens": 3,
    "lfoWaveform": 4,
    "lfoSync": 0,
    "pitchEnvelope": {
        "rates": [
            94,
            67,
            95,
            60
        ],
        "levels": [
            50,
            50,
            50,
            50
        ]
    },
    "controllerModVal": 0,
    "aftertouchEnabled": 0
};
let defaultBrass1test = {
    "algorithm": 22,
    "feedback": 7,
    "operators": [
        {
            "rates": [
                72,
                76,
                99,
                71
            ],
            "levels": [
                99,
                88,
                96,
                0
            ],
            "keyScaleBreakpoint": 39,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 14,
            "keyScaleCurveL": 3,
            "keyScaleCurveR": 3,
            "keyScaleRate": 0,
            "detune": 7,
            "lfoAmpModSens": 0,
            "velocitySens": 0,
            "volume": 98,
            "oscMode": 0,
            "freqCoarse": 0,
            "freqFine": 0,
            "pan": 0,
            "idx": 0,
            "enabled": true
        },
        {
            "rates": [
                62,
                51,
                29,
                71
            ],
            "levels": [
                82,
                95,
                96,
                0
            ],
            "keyScaleBreakpoint": 27,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 7,
            "keyScaleCurveL": 3,
            "keyScaleCurveR": 1,
            "keyScaleRate": 0,
            "detune": 7,
            "lfoAmpModSens": 0,
            "velocitySens": 0,
            "volume": 86,
            "oscMode": 0,
            "freqCoarse": 0,
            "freqFine": 0,
            "pan": 25,
            "idx": 1,
            "enabled": true
        },
        {
            "rates": [
                77,
                76,
                82,
                71
            ],
            "levels": [
                99,
                98,
                98,
                0
            ],
            "keyScaleBreakpoint": 39,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 3,
            "keyScaleCurveR": 3,
            "keyScaleRate": 0,
            "detune": -2,
            "lfoAmpModSens": 0,
            "velocitySens": 2,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": -25,
            "idx": 2,
            "enabled": true
        },
        {
            "rates": [
                77,
                36,
                41,
                71
            ],
            "levels": [
                99,
                98,
                98,
                0
            ],
            "keyScaleBreakpoint": 39,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 3,
            "keyScaleCurveR": 3,
            "keyScaleRate": 0,
            "detune": 0,
            "lfoAmpModSens": 0,
            "velocitySens": 2,
            "volume": 99,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": 0,
            "idx": 3,
            "enabled": true
        },
        {
            "rates": [
                77,
                36,
                41,
                71
            ],
            "levels": [
                99,
                98,
                98,
                0
            ],
            "keyScaleBreakpoint": 39,
            "keyScaleDepthL": 0,
            "keyScaleDepthR": 0,
            "keyScaleCurveL": 3,
            "keyScaleCurveR": 3,
            "keyScaleRate": 0,
            "detune": 1,
            "lfoAmpModSens": 0,
            "velocitySens": 2,
            "volume": 98,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": 25,
            "idx": 4,
            "enabled": true
        },
        {
            "rates": [
                49,
                99,
                28,
                68
            ],
            "levels": [
                98,
                98,
                91,
                0
            ],
            "keyScaleBreakpoint": 39,
            "keyScaleDepthL": 54,
            "keyScaleDepthR": 50,
            "keyScaleCurveL": 1,
            "keyScaleCurveR": 1,
            "keyScaleRate": 4,
            "detune": 0,
            "lfoAmpModSens": 0,
            "velocitySens": 2,
            "volume": 82,
            "oscMode": 0,
            "freqCoarse": 1,
            "freqFine": 0,
            "pan": -25,
            "idx": 5,
            "enabled": true
        }
    ],
    "name": "BRASS   1 ",
    "lfoSpeed": 37,
    "lfoDelay": 0,
    "lfoPitchModDepth": 5,
    "lfoAmpModDepth": 0,
    "lfoPitchModSens": 3,
    "lfoWaveform": 4,
    "lfoSync": 0,
    "pitchEnvelope": {
        "rates": [
            84,
            95,
            95,
            60
        ],
        "levels": [
            50,
            50,
            50,
            50
        ]
    },
    "controllerModVal": 0,
    "aftertouchEnabled": 0
};
let _defaultBrass1test = {
	algorithm: 22,
	feedback: 7,
	operators: [
		{
			rates: [
				72,
				76,
				99,
				71
			],
			levels: [
				99,
				88,
				96,
				0
			],
			keyScaleBreakpoint: 39,
			keyScaleDepthL: 0,
			keyScaleDepthR: 14,
			keyScaleCurveL: 3,
			keyScaleCurveR: 3,
			keyScaleRate: 0,
			detune: 7,
			lfoAmpModSens: 0,
			velocitySens: 0,
			volume: 98,
			oscMode: 0,
			freqCoarse: 0,
			freqFine: 0,
			pan: 0,
			idx: 0,
			enabled: true,
			outputLevel: 15.282672,
			freqRatio: 0.5,
			ampL: 0.7071067811865476,
			ampR: 0.7071067811865475,
freqFixed:0
		},
		{
			rates: [
				62,
				51,
				29,
				71
			],
			levels: [
				82,
				95,
				96,
				0
			],
			keyScaleBreakpoint: 27,
			keyScaleDepthL: 0,
			keyScaleDepthR: 7,
			keyScaleCurveL: 3,
			keyScaleCurveR: 1,
			keyScaleRate: 0,
			detune: 7,
			lfoAmpModSens: 0,
			velocitySens: 0,
			volume: 86,
			oscMode: 0,
			freqCoarse: 0,
			freqFine: 0,
			pan: 25,
			idx: 1,
			enabled: true,
			outputLevel: 5.40323913,
			freqRatio: 0.5,
			ampL: 0.38268343236508984,
			ampR: 0.9238795325112867,
freqFixed:0
		},
		{
			rates: [
				77,
				76,
				82,
				71
			],
			levels: [
				99,
				98,
				98,
				0
			],
			keyScaleBreakpoint: 39,
			keyScaleDepthL: 0,
			keyScaleDepthR: 0,
			keyScaleCurveL: 3,
			keyScaleCurveR: 3,
			keyScaleRate: 0,
			detune: -2,
			lfoAmpModSens: 0,
			velocitySens: 2,
			volume: 99,
			oscMode: 0,
			freqCoarse: 1,
			freqFine: 0,
			pan: -25,
			idx: 2,
			enabled: true,
			outputLevel: 16.6658671,
			freqRatio: 1,
			ampL: 0.9238795325112867,
			ampR: 0.3826834323650898,
freqFixed:0
		},
		{
			rates: [
				77,
				36,
				41,
				71
			],
			levels: [
				99,
				98,
				98,
				0
			],
			keyScaleBreakpoint: 39,
			keyScaleDepthL: 0,
			keyScaleDepthR: 0,
			keyScaleCurveL: 3,
			keyScaleCurveR: 3,
			keyScaleRate: 0,
			detune: 0,
			lfoAmpModSens: 0,
			velocitySens: 2,
			volume: 99,
			oscMode: 0,
			freqCoarse: 1,
			freqFine: 0,
			pan: 0,
			idx: 3,
			enabled: true,
			outputLevel: 16.6658671,
			freqRatio: 1,
			ampL: 0.7071067811865476,
			ampR: 0.7071067811865475,
freqFixed:0
		},
		{
			rates: [
				77,
				36,
				41,
				71
			],
			levels: [
				99,
				98,
				98,
				0
			],
			keyScaleBreakpoint: 39,
			keyScaleDepthL: 0,
			keyScaleDepthR: 0,
			keyScaleCurveL: 3,
			keyScaleCurveR: 3,
			keyScaleRate: 0,
			detune: 1,
			lfoAmpModSens: 0,
			velocitySens: 2,
			volume: 98,
			oscMode: 0,
			freqCoarse: 1,
			freqFine: 0,
			pan: 25,
			idx: 4,
			enabled: true,
			outputLevel: 15.282672,
			freqRatio: 1,
			ampL: 0.38268343236508984,
			ampR: 0.9238795325112867,
freqFixed:0
		},
		{
			rates: [
				49,
				99,
				28,
				68
			],
			levels: [
				98,
				98,
				91,
				0
			],
			keyScaleBreakpoint: 39,
			keyScaleDepthL: 54,
			keyScaleDepthR: 50,
			keyScaleCurveL: 1,
			keyScaleCurveR: 1,
			keyScaleRate: 4,
			detune: 0,
			lfoAmpModSens: 0,
			velocitySens: 2,
			volume: 82,
			oscMode: 0,
			freqCoarse: 1,
			freqFine: 0,
			pan: -25,
			idx: 5,
			enabled: true,
			outputLevel: 3.8206667299999997,
			freqRatio: 1,
			ampL: 0.9238795325112867,
			ampR: 0.3826834323650898,
freqFixed:0
		}
	],
	name: "BRASS   1 ",
	lfoSpeed: 37,
	lfoDelay: 0,
	lfoPitchModDepth: 5,
	lfoAmpModDepth: 0,
	lfoPitchModSens: 3,
	lfoWaveform: 4,
	lfoSync: 0,
	pitchEnvelope: {
		rates: [
			84,
			95,
			95,
			60
		],
		levels: [
			50,
			50,
			50,
			50
		]
	},
	controllerModVal: 0,
	aftertouchEnabled: 0,

	fbRatio: 1
};
