console.log('https://github.com/mmontag/dx7-synth-js');

//src config.js

var LFO_SAMPLE_PERIOD = 100;
var BUFFER_SIZE = 1024;
var POLYPHONY = 12;

if (/iPad|iPhone|iPod|Android/.test(navigator.userAgent)) {
	BUFFER_SIZE = 4096;
	POLYPHONY = 8;
}

var Config = {
	sampleRate: 44100, // gets updated with audio context rate
	lfoSamplePeriod: LFO_SAMPLE_PERIOD,
	bufferSize: BUFFER_SIZE,
	polyphony: POLYPHONY
};

//module.exports = Config;

var config = Config;

//src operator.js
class Operator {
	//var config = require('./config');


	// http://www.chipple.net/dx7/fig09-4.gif
	OCTAVE_1024 = 1.0006771307; //Math.exp(Math.log(2)/1024);
	PERIOD = Math.PI * 2;

	phase = 0;
	val = 0;
	params;
	envelope;
	// TODO: Pitch envelope
	// this.pitchEnvelope = pitchEnvelope;
	lfo;
	phaseStep;
	outputLevel;

	constructor(params, baseFrequency, envelope, lfo) {
		this.phase = 0;
		this.val = 0;
		this.params = params;
		this.envelope = envelope;
		// TODO: Pitch envelope
		// this.pitchEnvelope = pitchEnvelope;
		this.lfo = lfo;
		this.updateFrequency(baseFrequency);
	}

	updateFrequency(baseFrequency) {
		var frequency = this.params.oscMode ?
			this.params.freqFixed :
			baseFrequency * this.params.freqRatio * Math.pow(this.OCTAVE_1024, this.params.detune);
		this.phaseStep = this.PERIOD * frequency / config.sampleRate; // radians per sample
	};

	render(mod) {
		this.val = Math.sin(this.phase + mod) * this.envelope.render() * this.lfo.renderAmp();
		//	this.phase += this.phaseStep * this.pitchEnvelope.render() * this.lfo.render();
		this.phase += this.phaseStep * this.lfo.render();
		if (this.phase >= this.PERIOD) {
			this.phase -= this.PERIOD;
		}
		return this.val;
	};

	noteOff() {
		this.envelope.noteOff();
	};

	isFinished() {
		return this.envelope.isFinished();
	};

	//module.exports = Operator;
}

//src voice-dx7.js
class FMVoice {
	//var Operator = require('./operator');
	//var EnvelopeDX7 = require('./envelope-dx7');
	//var LfoDX7 = require('./lfo-dx7');

	OUTPUT_LEVEL_TABLE = [
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
	OL_TO_MOD_TABLE = [ // TODO: use output level to modulation index table
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
	ALGORITHMS = [
		{ outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], [5]] },    //1
		{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3], [4], [5], []] },    //2
		{ outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [5]] },    //3
		{ outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [3]] },    //4
		{ outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [5]] },     //5
		{ outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [4]] },     //6
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
		{ outputMix: [0, 3, 4], modulationMatrix: [[1], [2], [], [5], [5], [5]] },    //19
		{ outputMix: [0, 1, 3], modulationMatrix: [[2], [2], [2], [4, 5], [], []] },   //20
		{ outputMix: [0, 1, 3, 4], modulationMatrix: [[2], [2], [2], [5], [5], []] },    //21
		{ outputMix: [0, 2, 3, 4], modulationMatrix: [[1], [], [5], [5], [5], [5]] },    //22
		{ outputMix: [0, 1, 3, 4], modulationMatrix: [[], [2], [], [5], [5], [5]] },     //23
		{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [5], [5], [5], [5]] },     //24
		{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [5], [5], [5]] },      //25
		{ outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], [5]] },    //26
		{ outputMix: [0, 1, 3], modulationMatrix: [[], [2], [2], [4, 5], [], []] },    //27
		{ outputMix: [0, 2, 5], modulationMatrix: [[1], [], [3], [4], [4], []] },     //28
		{ outputMix: [0, 1, 2, 4], modulationMatrix: [[], [], [3], [], [5], [5]] },      //29
		{ outputMix: [0, 1, 2, 5], modulationMatrix: [[], [], [3], [4], [4], []] },      //30
		{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [], [5], [5]] },       //31
		{ outputMix: [0, 1, 2, 3, 4, 5], modulationMatrix: [[], [], [], [], [], [5]] }         //32
	];

	//var params: any = {};
	params;
	down = true;
	note;
	frequency;
	velocity;
	operators;

	constructor(note, velocity) {
		this.down = true;
		this.note = parseInt(note, 10);
		this.frequency = this.frequencyFromNoteNumber(this.note);
		this.velocity = parseFloat(velocity);
		this.operators = new Array(6);
		for (var i = 0; i < 6; i++) {
			// Not sure about detune.
			// see https://github.com/smbolton/hexter/blob/621202b4f6ac45ee068a5d6586d3abe91db63eaf/src/dx7_voice.c#L789
			// https://github.com/asb2m10/dexed/blob/1eda313316411c873f8388f971157664827d1ac9/Source/msfa/dx7note.cc#L55
			// https://groups.yahoo.com/neo/groups/YamahaDX/conversations/messages/15919
			var opParams = this.params.operators[i];
			var op = new Operator(
				opParams,
				this.frequency,
				new EnvelopeDX7(opParams.levels, opParams.rates),
				new LfoDX7(opParams)
				//new EnvelopeDX7(params.pitchEnvelope.levels, params.pitchEnvelope.rates, true)
			);
			// TODO: DX7 accurate velocity sensitivity map
			op.outputLevel = (1 + (this.velocity - 1) * (opParams.velocitySens / 7)) * opParams.outputLevel;
			this.operators[i] = op;
		}
		this.updatePitchBend();
	}

	aftertouch = 0;
	mod = 0;
	bend = 0;

	frequencyFromNoteNumber(note) {
		return 440 * Math.pow(2, (note - 69) / 12);
	};

	setParams(globalParams) {
		this.setParams(globalParams);
		this.params = globalParams;
	};

	setFeedback(value) {
		this.params.fbRatio = Math.pow(2, (value - 7)); // feedback of range 0 to 7
	};

	setOutputLevel(operatorIndex, value) {
		this.params.operators[operatorIndex].outputLevel = this.mapOutputLevel(value);
	};

	updateFrequency(operatorIndex) {
		var op = this.params.operators[operatorIndex];
		if (op.oscMode == 0) {
			var freqCoarse = op.freqCoarse || 0.5; // freqCoarse of 0 is used for ratio of 0.5
			op.freqRatio = freqCoarse * (1 + op.freqFine / 100);
		} else {
			op.freqFixed = Math.pow(10, op.freqCoarse % 4) * (1 + (op.freqFine / 99) * 8.772);
		}
	};

	updateLFO() {
		new LfoDX7({}).update();
	};

	setPan(operatorIndex, value) {
		var op = this.params.operators[operatorIndex];
		op.ampL = Math.cos(Math.PI / 2 * (value + 50) / 100);
		op.ampR = Math.sin(Math.PI / 2 * (value + 50) / 100);
	};

	mapOutputLevel(input) {
		var idx = Math.min(99, Math.max(0, Math.floor(input)));
		return this.OUTPUT_LEVEL_TABLE[idx] * 1.27;
	};

	channelAftertouch(value) {
		this.aftertouch = value;
		this.updateMod();
	};

	modulationWheel(value) {
		this.mod = value;
		this.updateMod();
	};

	updateMod() {
		var aftertouch = this.params.aftertouchEnabled ? this.aftertouch : 0;
		this.params.controllerModVal = Math.min(1.27, aftertouch + this.mod); // Allow 27% overdrive
	};

	pitchBend(value) {
		this.bend = value;
	};

	render() {
		var algorithmIdx = this.params.algorithm - 1;
		var modulationMatrix = this.ALGORITHMS[algorithmIdx].modulationMatrix;
		var outputMix = this.ALGORITHMS[algorithmIdx].outputMix;
		var outputScaling = 1 / outputMix.length;
		var outputL = 0;
		var outputR = 0;
		for (var i = 5; i >= 0; i--) {
			var mod = 0;
			if (this.params.operators[i].enabled) {
				for (var j = 0, length = modulationMatrix[i].length; j < length; j++) {
					var modulator = modulationMatrix[i][j];
					if (this.params.operators[modulator].enabled) {
						var modOp = this.operators[modulator];
						if (modulator === i) {
							// Operator modulates itself; use feedback ratio
							// TODO: implement 2-sample feedback averaging (anti-hunting filter)
							// http://d.pr/i/1kuZ7/3h7jQN7w
							// https://code.google.com/p/music-synthesizer-for-android/wiki/Dx7Hardware
							// http://music.columbia.edu/pipermail/music-dsp/2006-June/065486.html
							mod += modOp.val * this.params.fbRatio;
						} else {
							mod += modOp.val * modOp.outputLevel;
						}
					}
				}
			}
			this.operators[i].render(mod);
		}
		for (var k = 0, length = outputMix.length; k < length; k++) {
			if (this.params.operators[outputMix[k]].enabled) {
				var carrier = this.operators[outputMix[k]];
				var carrierParams = this.params.operators[outputMix[k]];
				var carrierLevel = carrier.val * carrier.outputLevel;
				outputL += carrierLevel * carrierParams.ampL;
				outputR += carrierLevel * carrierParams.ampR;
			}
		}
		return [outputL * outputScaling, outputR * outputScaling];
	};

	noteOff() {
		this.down = false;
		for (var i = 0; i < 6; i++) {
			this.operators[i].noteOff();
		}
	};

	updatePitchBend() {
		var frequency = this.frequencyFromNoteNumber(this.note + this.bend);
		for (var i = 0; i < 6; i++) {
			this.operators[i].updateFrequency(frequency);
		}
	};

	isFinished() {
		var outputMix = this.ALGORITHMS[this.params.algorithm - 1].outputMix;
		for (var i = 0; i < outputMix.length; i++) {
			if (!this.operators[outputMix[i]].isFinished()) return false;
		}
		return true;
	};

	//module.exports = FMVoice;
}
//src lfo-dx7.js
class LfoDX7 {
	//var config = require('./config');


	PERIOD = Math.PI * 2;
	PERIOD_HALF = this.PERIOD / 2;
	PERIOD_RECIP = 1 / this.PERIOD;
	LFO_SAMPLE_PERIOD = config.lfoSamplePeriod;
	LFO_FREQUENCY_TABLE = [ // see https://github.com/smbolton/hexter/tree/master/src/dx7_voice.c#L1002
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
	LFO_AMP_MOD_TABLE = [ // TODO: use lfo amp mod table
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
	LFO_PITCH_MOD_TABLE = [
		0, 0.0264, 0.0534, 0.0889, 0.1612, 0.2769, 0.4967, 1
	];
	LFO_MODE_TRIANGLE = 0;
	LFO_MODE_SAW_DOWN = 1;
	LFO_MODE_SAW_UP = 2;
	LFO_MODE_SQUARE = 3;
	LFO_MODE_SINE = 4;
	LFO_MODE_SAMPLE_HOLD = 5;

	LFO_DELAY_ONSET = 0;
	LFO_DELAY_RAMP = 1;
	LFO_DELAY_COMPLETE = 2;

	// Private static variables
	phaseStep = 0;
	pitchModDepth = 0;
	ampModDepth = 0;
	sampleHoldRandom = 0;
	delayTimes = [0, 0, 0];
	delayIncrements = [0, 0, 0];
	delayVals = [0, 0, 1];
	params: any = {};

	opParams;
	phase = 0;
	pitchVal = 0;
	counter = 0;
	ampVal = 1;
	ampValTarget = 1;
	ampIncrement = 0;
	delayVal = 0;
	delayState;

	constructor(opParams) {
		this.opParams = opParams;
		this.phase = 0;
		this.pitchVal = 0;
		this.counter = 0;
		this.ampVal = 1;
		this.ampValTarget = 1;
		this.ampIncrement = 0;
		this.delayVal = 0;
		this.delayState = this.LFO_DELAY_ONSET;
		this.update();
	}

	render() {
		var amp;
		if (this.counter % LFO_SAMPLE_PERIOD === 0) {
			switch (this.params.lfoWaveform) {
				case this.LFO_MODE_TRIANGLE:
					if (this.phase < this.PERIOD_HALF)
						amp = 4 * this.phase * this.PERIOD_RECIP - 1;
					else
						amp = 3 - 4 * this.phase * this.PERIOD_RECIP;
					break;
				case this.LFO_MODE_SAW_DOWN:
					amp = 1 - 2 * this.phase * this.PERIOD_RECIP;
					break;
				case this.LFO_MODE_SAW_UP:
					amp = 2 * this.phase * this.PERIOD_RECIP - 1;
					break;
				case this.LFO_MODE_SQUARE:
					amp = (this.phase < this.PERIOD_HALF) ? -1 : 1;
					break;
				case this.LFO_MODE_SINE:
					amp = Math.sin(this.phase);
					break;
				case this.LFO_MODE_SAMPLE_HOLD:
					amp = this.sampleHoldRandom;
					break;
			}

			switch (this.delayState) {
				case this.LFO_DELAY_ONSET:
				case this.LFO_DELAY_RAMP:
					this.delayVal += this.delayIncrements[this.delayState];
					if (this.counter / LFO_SAMPLE_PERIOD > this.delayTimes[this.delayState]) {
						this.delayState++;
						this.delayVal = this.delayVals[this.delayState];
					}
					break;
				case this.LFO_DELAY_COMPLETE:
					break;
			}

			// if (this.counter % 10000 == 0 && this.operatorIndex === 0) console.log("lfo amp value", this.ampVal);
			amp *= this.delayVal;
			this.pitchModDepth = 1 +
				this.LFO_PITCH_MOD_TABLE[this.params.lfoPitchModSens] * (this.params.controllerModVal + this.params.lfoPitchModDepth / 99);
			this.pitchVal = Math.pow(this.pitchModDepth, amp);
			// TODO: Simplify ampValTarget calculation.
			// ampValTarget range = 0 to 1. lfoAmpModSens range = -3 to 3. ampModDepth range =  0 to 1. amp range = -1 to 1.
			var ampSensDepth = Math.abs(this.opParams.lfoAmpModSens) * 0.333333;
			var phase = (this.opParams.lfoAmpModSens > 0) ? 1 : -1;
			this.ampValTarget = 1 - ((this.ampModDepth + this.params.controllerModVal) * ampSensDepth * (amp * phase + 1) * 0.5);
			this.ampIncrement = (this.ampValTarget - this.ampVal) / LFO_SAMPLE_PERIOD;
			this.phase += this.phaseStep;
			if (this.phase >= this.PERIOD) {
				this.sampleHoldRandom = 1 - Math.random() * 2;
				this.phase -= this.PERIOD;
			}
		}
		this.counter++;
		return this.pitchVal;
	};

	renderAmp() {
		this.ampVal += this.ampIncrement;
		return this.ampVal;
	};

	setParams(globalParams) {
		this.params = globalParams;
	};

	update() {
		var frequency = this.LFO_FREQUENCY_TABLE[this.params.lfoSpeed];
		var lfoRate = config.sampleRate / LFO_SAMPLE_PERIOD;
		this.phaseStep = this.PERIOD * frequency / lfoRate; // radians per sample
		this.ampModDepth = this.params.lfoAmpModDepth * 0.01;
		// ignoring amp mod table for now. it seems shallow LFO_AMP_MOD_TABLE[params.lfoAmpModDepth];
		this.delayTimes[this.LFO_DELAY_ONSET] = (lfoRate * 0.001753 * Math.pow(this.params.lfoDelay, 3.10454) + 169.344 - 168) / 1000;
		this.delayTimes[this.LFO_DELAY_RAMP] = (lfoRate * 0.321877 * Math.pow(this.params.lfoDelay, 2.01163) + 494.201 - 168) / 1000;
		this.delayIncrements[this.LFO_DELAY_RAMP] = 1 / (this.delayTimes[this.LFO_DELAY_RAMP] - this.delayTimes[this.LFO_DELAY_ONSET]);
	};

	//module.exports = LfoDX7;
}
//src envelope-dx7.js
class EnvelopeDX7 {
	// Based on http://wiki.music-synthesizer-for-android.googlecode.com/git/img/env.html
	ENV_OFF = 4;
	outputlevel = [0, 5, 9, 13, 17, 20, 23, 25, 27, 29, 31, 33, 35, 37, 39,
		41, 42, 43, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
		62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
		81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
		100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
		115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127];

	outputLUT = [];
	levels;
	rates;
	level = 0; // should start here
	i = 0;
	down = true;
	decayIncrement = 0;
	state;
	rising;
	targetlevel;
	qr;
	constructor(levels, rates) {
		for (var i = 0; i < 4096; i++) {
			var dB = (i - 3824) * 0.0235;
			this.outputLUT[i] = Math.pow(20, (dB / 20));
		}

		this.levels = levels;
		this.rates = rates;
		this.level = 0; // should start here
		this.i = 0;
		this.down = true;
		this.decayIncrement = 0;
		this.advance(0);
	}

	render() {
		if (this.state < 3 || (this.state < 4 && !this.down)) {
			var lev;
			lev = this.level;
			if (this.rising) {
				lev += this.decayIncrement * (2 + (this.targetlevel - lev) / 256);
				if (lev >= this.targetlevel) {
					lev = this.targetlevel;
					this.advance(this.state + 1);
				}
			} else {
				lev -= this.decayIncrement;
				if (lev <= this.targetlevel) {
					lev = this.targetlevel;
					this.advance(this.state + 1);
				}
			}
			this.level = lev;
		}
		this.i++;

		// Convert DX7 level -> dB -> amplitude
		return this.outputLUT[Math.floor(this.level)];
		//		if (this.pitchMode) {
		//			return Math.pow(pitchModDepth, amp);
		//		}
	};

	advance(newstate) {
		this.state = newstate;
		if (this.state < 4) {
			var newlevel = this.levels[this.state];
			this.targetlevel = Math.max(0, (this.outputlevel[newlevel] << 5) - 224); // 1 -> -192; 99 -> 127 -> 3840
			this.rising = (this.targetlevel - this.level) > 0;
			var rate_scaling = 0;
			this.qr = Math.min(63, rate_scaling + ((this.rates[this.state] * 41) >> 6)); // 5 -> 3; 49 -> 31; 99 -> 63
			this.decayIncrement = Math.pow(2, this.qr / 4) / 2048;
			//      console.log("decayIncrement (", this.state, "): ", this.decayIncrement);
		}
		//		console.log("advance state="+this.state+", qr="+this.qr+", target="+this.targetlevel+", rising="+this.rising);
	};

	noteOff() {
		this.down = false;
		this.advance(3);
	};

	isFinished() {
		return this.state == this.ENV_OFF;
	};

	//module.exports = EnvelopeDX7;
}
//src synth.js
class Synth {
	PER_VOICE_LEVEL = 0.125 / 6; // nominal per-voice level borrowed from Hexter
	PITCH_BEND_RANGE = 2; // semitones (in each direction)

	MIDI_CC_MODULATION = 1;
	MIDI_CC_SUSTAIN_PEDAL = 64;
	voices = [];
	voiceClass;
	polyphony;
	sustainPedalDown = false;
	eventQueue = [];
	// TODO: Probably reduce responsibility to voice management; rename VoiceManager, MIDIChannel, etc.
	constructor(voiceClass, polyphony) {
		this.voices = [];
		this.voiceClass = voiceClass;
		this.polyphony = polyphony || 12;
		this.sustainPedalDown = false;
		this.eventQueue = [];
	}

	queueMidiEvent(ev) {
		this.eventQueue.push(ev);
	};

	processQueuedEventsUpToSampleTime(sampleTime) {
		if (this.eventQueue.length && this.eventQueue[0].timeStamp < sampleTime) {
			this.processMidiEvent(this.eventQueue.shift());
		}
	}

	processMidiEvent(ev) {
		var cmd = ev.data[0] >> 4;
		var channel = ev.data[0] & 0xf;
		var noteNumber = ev.data[1];
		var velocity = ev.data[2];
		// console.log( "" + ev.data[0] + " " + ev.data[1] + " " + ev.data[2])
		// console.log("midi: ch %d, cmd %d, note %d, vel %d", channel, cmd, noteNumber, velocity);
		if (channel === 9) // Ignore drum channel
			return;
		if (cmd === 8 || (cmd === 9 && velocity === 0)) { // with MIDI, note on with velocity zero is the same as note off
			this.noteOff(noteNumber);
		} else if (cmd === 9) {
			this.noteOn(noteNumber, velocity / 99.0); // changed 127 to 99 to incorporate "overdrive"
		} else if (cmd === 10) {
			//this.polyphonicAftertouch(noteNumber, velocity/127);
		} else if (cmd === 11) {
			this.controller(noteNumber, velocity / 127);
		} else if (cmd === 12) {
			//this.programChange(noteNumber);
		} else if (cmd === 13) {
			this.channelAftertouch(noteNumber / 127);
		} else if (cmd === 14) {
			this.pitchBend(((velocity * 128.0 + noteNumber) - 8192) / 8192.0);
		}

	};

	getLatestNoteDown() {
		var voice = this.voices[this.voices.length - 1] || { note: 64 };
		return voice.note;
	};

	controller(controlNumber, value) {
		// see http://www.midi.org/techspecs/midimessages.php#3
		switch (controlNumber) {
			case this.MIDI_CC_MODULATION:
				this.voiceClass.modulationWheel(value);
				break;
			case this.MIDI_CC_SUSTAIN_PEDAL:
				this.sustainPedal(value > 0.5);
				break;
		}
	};

	channelAftertouch(value) {
		this.voiceClass.channelAftertouch(value);
	};

	sustainPedal(down) {
		if (down) {
			this.sustainPedalDown = true;
		} else {
			this.sustainPedalDown = false;
			for (var i = 0, l = this.voices.length; i < l; i++) {
				if (this.voices[i] && this.voices[i].down === false)
					this.voices[i].noteOff();
			}
		}
	};

	pitchBend(value) {
		this.voiceClass.pitchBend(value * this.PITCH_BEND_RANGE);
		for (var i = 0, l = this.voices.length; i < l; i++) {
			if (this.voices[i])
				this.voices[i].updatePitchBend();
		}
	};

	noteOn(note, velocity) {
		var voice = new this.voiceClass(note, velocity);
		if (this.voices.length >= this.polyphony) {
			// TODO: fade out removed voices
			this.voices.shift(); // remove first
		}
		this.voices.push(voice);
	};

	noteOff(note) {
		for (var i = 0, voice; i < this.voices.length, voice = this.voices[i]; i++) {
			if (voice && voice.note === note && voice.down === true) {
				voice.down = false;
				if (this.sustainPedalDown === false)
					voice.noteOff();
				break;
			}
		}
	};

	panic() {
		this.sustainPedalDown = false;
		for (var i = 0, l = this.voices.length; i < l; i++) {
			if (this.voices[i])
				this.voices[i].noteOff();
		}
		this.voices = [];
	};

	render() {
		var output;
		var outputL = 0;
		var outputR = 0;

		for (var i = 0, length = this.voices.length; i < length; i++) {
			var voice = this.voices[i];
			if (voice) {
				if (voice.isFinished()) {
					// Clear the note after release
					this.voices.splice(i, 1);
					i--; // undo increment
				} else {
					output = voice.render();
					outputL += output[0];
					outputR += output[1];
				}
			}
		}
		return [outputL * this.PER_VOICE_LEVEL, outputR * this.PER_VOICE_LEVEL];
	};

	//module.exports = Synth;
}

//src sysex-dx7.js

class SysexDX7 {
	bin2hex(s) {
		var i, f = s.length, a = [];
		for (i = 0; i < f; i++) {
			a[i] = ('0' + s.charCodeAt(i).toString(16)).slice(-2);
		}
		return a.join(' ');
	}

	// Expects bankData to be a DX7 SYSEX Bulk Data for 32 Voices
	loadBank(bankData) {
		var presets = [];
		for (var i = 0; i < 32; i++) {
			presets.push(this.extractPatchFromRom(bankData, i));
		}
		return presets;
	}

	// see http://homepages.abdn.ac.uk/mth192/pages/dx7/sysex-format.txt
	// Section F: Data Structure: Bulk Dump Packed Format
	extractPatchFromRom(bankData, patchId) {
		var dataStart = 128 * patchId + 6;
		var dataEnd = dataStart + 128;
		var voiceData = bankData.substring(dataStart, dataEnd);
		var operators = [{}, {}, {}, {}, {}, {}];

		for (var i = 5; i >= 0; --i) {
			var oscStart = (5 - i) * 17;
			var oscEnd = oscStart + 17;
			var oscData = voiceData.substring(oscStart, oscEnd);
			//var operator = operators[i];
			var operator: any = {};
			operator.rates = [oscData.charCodeAt(0), oscData.charCodeAt(1), oscData.charCodeAt(2), oscData.charCodeAt(3)];
			operator.levels = [oscData.charCodeAt(4), oscData.charCodeAt(5), oscData.charCodeAt(6), oscData.charCodeAt(7)];
			operator.keyScaleBreakpoint = oscData.charCodeAt(8);
			operator.keyScaleDepthL = oscData.charCodeAt(9);
			operator.keyScaleDepthR = oscData.charCodeAt(10);
			operator.keyScaleCurveL = oscData.charCodeAt(11) & 3;
			operator.keyScaleCurveR = oscData.charCodeAt(11) >> 2;
			operator.keyScaleRate = oscData.charCodeAt(12) & 7;
			operator.detune = Math.floor(oscData.charCodeAt(12) >> 3) - 7; // range 0 to 14
			operator.lfoAmpModSens = oscData.charCodeAt(13) & 3;
			operator.velocitySens = oscData.charCodeAt(13) >> 2;
			operator.volume = oscData.charCodeAt(14);
			operator.oscMode = oscData.charCodeAt(15) & 1;
			operator.freqCoarse = Math.floor(oscData.charCodeAt(15) >> 1);
			operator.freqFine = oscData.charCodeAt(16);
			// Extended/non-standard parameters
			operator.pan = ((i + 1) % 3 - 1) * 25; // Alternate panning: -25, 0, 25, -25, 0, 25
			operator.idx = i;
			operator.enabled = true;

			operators[i] = operator;
		}

		return {
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
		}
	}
}

//module.exports = SysexDX7;

//src default-presets.js
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
};
var defaultPresets: ROMPresetData[] = [
	{
		name: "Init"
		, algorithm: 18
		, feedback: 7
		, lfoSpeed: 37
		, lfoDelay: 42
		, lfoPitchModDepth: 0
		, lfoAmpModDepth: 0
		, lfoPitchModSens: 4
		, lfoWaveform: 4
		, lfoSync: 0
		, pitchEnvelope: { rates: [0, 0, 0, 0], levels: [50, 50, 50, 50] }
		, controllerModVal: 0
		, aftertouchEnabled: 0
		, operators: [
			{ idx: 0, enabled: true, rates: [96, 0, 12, 70], levels: [99, 95, 95, 0], detune: 1, velocitySens: 0, lfoAmpModSens: 0, volume: 99, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 0, outputLevel: 13.12273 }
			, { idx: 1, enabled: true, rates: [99, 95, 0, 70], levels: [99, 96, 89, 0], detune: -1, velocitySens: 0, lfoAmpModSens: 0, volume: 99, oscMode: 0, freqCoarse: 0, freqFine: 0, pan: 0, outputLevel: 13.12273 }
			, { idx: 2, enabled: true, rates: [99, 87, 0, 70], levels: [93, 90, 0, 0], detune: 0, velocitySens: 0, lfoAmpModSens: 0, volume: 82, oscMode: 0, freqCoarse: 1, freqFine: 0, pan: 0, outputLevel: 3.008399 }
			, { idx: 3, enabled: true, rates: [99, 92, 28, 60], levels: [99, 90, 0, 0], detune: 2, velocitySens: 0, lfoAmpModSens: 0, volume: 71, oscMode: 0, freqCoarse: 2, freqFine: 0, pan: 0, outputLevel: 1.159897 }
			, { idx: 4, enabled: true, rates: [99, 99, 97, 70], levels: [99, 65, 60, 0], detune: -2, velocitySens: 0, lfoAmpModSens: 0, volume: 43, oscMode: 0, freqCoarse: 3, freqFine: 0, pan: 0, outputLevel: 0.102521 }
			, { idx: 5, enabled: true, rates: [99, 70, 60, 70], levels: [99, 99, 97, 0], detune: 0, velocitySens: 0, lfoAmpModSens: 0, volume: 47, oscMode: 0, freqCoarse: 17, freqFine: 0, pan: 0, outputLevel: 0.144987 }
		]
	}
];
