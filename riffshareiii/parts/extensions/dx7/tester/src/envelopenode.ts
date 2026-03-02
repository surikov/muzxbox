//let slopeRatio = 1;
//function fullSlopeDuration(preLevel: number, nextLevel: number, sloperate: number) {
/*
	var rate_scaling = 0;
	let qr = Math.min(63, rate_scaling + ((sloperate * 41) >> 6)); // 5 -> 3; 49 -> 31; 99 -> 63
	let decayIncrement = Math.pow(2, qr / 4) / 2048;
	console.log(decayIncrement, '=', Math.pow(2, sloperate * 16 / 100 - 11), 1 / Math.pow(2, sloperate * 16 / 100 - 9));
	
	let rate = (sloperate > 0) ? sloperate : 1;
	let volDiff = Math.abs(preLevel - nextLevel) / 100;
	let radians = rate * ((Math.PI * 0.5) / 100);
	let timeDiff = volDiff / Math.tan(radians);//a = b / tg(β)
	return slopeRatio * timeDiff;
	*/
//let part = Math.abs(preLevel - nextLevel) / 100;
//let fullH = 1 / Math.pow(2, sloperate * 16 / 100 - 9);
//return part * fullH;
//}
/*
console.log(1, ':', fullSlopeDuration(0, 99, 96));
console.log(2, ':', fullSlopeDuration(96, 75, 25));
console.log(3, ':', fullSlopeDuration(75, 0, 25));
*/
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
class EnvelopeNode {
	minTimeDelta: number = 0.005;
	maxReleaseDelta: number = 0.5;
	envelopeContext: AudioContext;
	envelopeGain: GainNode;
	//slopeRatio = 0.25;
	constructor(ctx: AudioContext) {
		this.envelopeContext = ctx;
		this.envelopeGain = this.envelopeContext.createGain();
	}
	down0now() {
		this.envelopeGain.gain.cancelScheduledValues(this.envelopeContext.currentTime);
		this.envelopeGain.gain.linearRampToValueAtTime(0, this.envelopeContext.currentTime + this.minTimeDelta);
	}
	slopeDuration(preLevel: number, nextLevel: number, sloperate: number) {
		/*
		let rate = (sloperate > 0) ? sloperate : 1;
		let volDiff = Math.abs(preLevel - nextLevel) / 100;
		let radians = rate * ((Math.PI * 0.5) / 100);
		let timeDiff = volDiff / Math.tan(radians);//a = b / tg(β)
		return timeDiff;//slopeRatio * timeDiff;
		*/
		let part = Math.abs(preLevel - nextLevel) / 100;
		let steep = 123.45;
		if (sloperate > 0 && sloperate < 100) {
			steep = Math.pow(2, sloperate * 16 / 100 - 5);
		}
		return part / steep;
	}
	mapOutputLevel(input: number, volume: number) {
		let idx = Math.min(99, Math.max(0, Math.floor(input)));
		let level = OUTPUT_LEVEL_TABLE[idx] / 16;//* 1.27;
		let full = level * volume / 100;
		return full;
	};
	setLevelRate(level1: number, rate1: number
		, level2: number, rate2: number
		, level3: number, rate3: number
		, level4: number, rate4: number
		, when: number, duration: number
		, volume: number
	) {
		let slope1 = this.slopeDuration(level4, level1, rate1);
		let slope2 = this.slopeDuration(level1, level2, rate2);
		let slope3 = this.slopeDuration(level2, level3, rate3);
		let slope4 = this.slopeDuration(level3, level4, rate4);
		//console.log('slopes', slope1, slope2, slope3, slope4);
		let volume1 = this.mapOutputLevel(level1, volume);
		let volume2 = this.mapOutputLevel(level2, volume);
		let volume3 = this.mapOutputLevel(level3, volume);
		let volume4 = this.mapOutputLevel(level4, volume);

		this.envelopeGain.gain.linearRampToValueAtTime(volume4, when);
		console.log('start', volume4, when);
		this.envelopeGain.gain.linearRampToValueAtTime(volume1, when + slope1);
		console.log(volume1, when + slope1);
		if (slope1 < duration) {
			this.envelopeGain.gain.linearRampToValueAtTime(volume2, when + slope1 + slope2);
			console.log(volume2, when + slope1 + slope2);
			if (slope1 + slope2 < duration) {
				this.envelopeGain.gain.linearRampToValueAtTime(volume3, when + slope1 + slope2 + slope3);
				console.log(volume3, when + slope1 + slope2 + slope3);
			}
		}
		this.envelopeGain.gain.cancelAndHoldAtTime(when + duration);
		this.envelopeGain.gain.linearRampToValueAtTime(volume4, when + duration + slope4 + this.minTimeDelta);
		console.log('end', volume4, when + duration + slope4 + this.minTimeDelta);
		this.envelopeGain.gain.linearRampToValueAtTime(0, when + duration + slope4 + 2 * this.minTimeDelta);
		/*
		let whenLevel1 = when + this.slopeDuration(level4, level1, rate1);
		let whenLevel2 = whenLevel1 + this.slopeDuration(level1, level2, rate2);
		let whenLevel3 = whenLevel2 + this.slopeDuration(level2, level3, rate3);
		let whenLevel4 = when + duration + this.slopeDuration(level3, level4, rate4);
		if (whenLevel2 <= whenLevel1) whenLevel2 = whenLevel1 + this.minTimeDelta;
		if (whenLevel3 <= whenLevel2) whenLevel3 = whenLevel2 + this.minTimeDelta;
		this.down0now();
		this.envelopeGain.gain.linearRampToValueAtTime(level4 / 100, when);

		this.envelopeGain.gain.linearRampToValueAtTime(level1 / 100, whenLevel1);
		this.envelopeGain.gain.linearRampToValueAtTime(level2 / 100, whenLevel2);
		this.envelopeGain.gain.linearRampToValueAtTime(level3 / 100, whenLevel3);
		this.envelopeGain.gain.cancelAndHoldAtTime(when + duration);
		this.envelopeGain.gain.linearRampToValueAtTime(level4 / 100, whenLevel4);
		this.envelopeGain.gain.linearRampToValueAtTime(0, whenLevel4 + this.minTimeDelta);
		console.log('start', level4, when, 'duration', duration);
		console.log('1	', level1, rate1, (whenLevel1 - when), this.slopeDuration(level4, level1, rate1), level4, level1, rate1);
		console.log('2	', level2, rate2, (whenLevel2 - whenLevel1));
		console.log('3	', level3, rate3, (whenLevel3 - whenLevel2));
		console.log('4	', level4, rate4, (whenLevel4 - when - duration));
		console.log('done', 0, (whenLevel4 + this.minTimeDelta));
*/
	}
}
