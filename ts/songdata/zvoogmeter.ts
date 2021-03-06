type ZvoogMeter = {
	count: number
	, division: number
};
type ZvoogStepIndex = {
	measure: number
	, step: number
};
function point2seconds(song: ZvoogSchedule, point: ZvoogCurvePoint): number {
	let ss = 0;
	for (let i = 0; i < point.skipMeasures; i++) {
		ss = ss + meter2seconds(song.measures[i].tempo, song.measures[i].meter);
	}
	if (point.skipMeasures < song.measures.length) {
		ss = ss + meter2seconds(song.measures[point.skipMeasures].tempo, point.skipSteps);
	}
	return ss;
}
function points2meter(points: ZvoogCurvePoint[]): ZvoogCurvePoint {
	let r: ZvoogCurvePoint = {
		skipMeasures: 0
		, skipSteps: {
			count: 0
			, division: 1
		}
		, velocity: 0
	};
	for (let i = 0; i < points.length; i++) {
		if (points[i].skipMeasures > 0) {
			r.skipMeasures = r.skipMeasures + points[i].skipMeasures;
			r.skipSteps = points[i].skipSteps;
		} else {
			r.skipSteps = DUU(r.skipSteps).plus(points[i].skipSteps);
		}
		r.velocity = points[i].velocity;
	}
	return r;
}
function meter2seconds(bpm: number, meter: ZvoogMeter): number {
	let wholeNoteSeconds = 4 * 60 / bpm;
	let meterSeconds = wholeNoteSeconds * meter.count / meter.division;
	return meterSeconds;
}
function seconds2meterRound(bpm: number, seconds: number): ZvoogMeter {
	//let note32Seconds = (4*60 / bpm)/32;
	let note16Seconds = (4 * 60 / bpm) / 16;
	//let part=seconds/note32Seconds;
	let part = seconds / note16Seconds;
	//return {count: Math.floor(part) , division: 32};
	return { count: Math.round(part), division: 16 };
}
/*function duration2seconds(bpm: number, duration384: number): number {
	let n4 = 60 / bpm;
	//let part = duration.division / (4 * duration.count);
	let part = 384 / (4 * duration384);
	return n4 / part;
}
function durations2time(measures: ZvoogMeasure[]): number {
	let t = 0;
	for (let i = 0; i < measures.length; i++) {
		t = t + duration2seconds(measures[i].tempo, duration384(measures[i].meter));
	}
	return t;
}
function seconds2Duration384(time: number, bpm: number): number {
	let n4 = 60 / bpm;
	let n384 = n4 / 96;
	return Math.round(time / n384);
}
function duration384(meter: ZvoogMeter): number {
	return meter.count * (384 / meter.division);
}*/
function calculateEnvelopeDuration(envelope: ZvoogEnvelope): ZvoogMeter {
	let d: ZvoogMeter = { count: 0, division: 1 };
	for (let i = 0; i < envelope.pitches.length; i++) {
		//d = plusMeter(d, envelope.pitches[i].duration);
		d = DUU(d).plus(envelope.pitches[i].duration);
	}
	return d;
}
function DUU(u: ZvoogMeter) {
	return new DurationUnitUtil(u);
}
class DurationUnitUtil {
	_unit: ZvoogMeter;
	constructor(u: ZvoogMeter) {
		this._unit = u;
	}
	clone(): ZvoogMeter {
		return { count: this._unit.count, division: this._unit.division };
	}
	plus(b: ZvoogMeter): ZvoogMeter {
		if (this._unit.division == b.division) {
			return { count: this._unit.count + b.count, division: this._unit.division };
		} else {
			let r = { count: this._unit.count * b.division + b.count * this._unit.division, division: this._unit.division * b.division };
			return r;
		}
	}
	minus(b: ZvoogMeter): ZvoogMeter {
		if (this._unit.division == b.division) {
			return { count: this._unit.count - b.count, division: this._unit.division };
		} else {
			let r = { count: this._unit.count * b.division - b.count * this._unit.division, division: this._unit.division * b.division };
			return r;
		}
	}
	_meterMore(b: ZvoogMeter): number {
		let a1 = this.plus({ count: 0, division: b.division });
		let b1 = DUU(b).plus({ count: 0, division: this._unit.division });
		if (a1.count == b1.count) {
			return 0;
		} else {
			if (a1.count > b1.count) {
				return 1;
			} else {
				return -1;
			}
		}
	}
	moreThen(b: ZvoogMeter): boolean {
		if (this._meterMore(b) == 1) {
			return true;
		} else {
			return false;
		}
	}
	notMoreThen(b: ZvoogMeter): boolean {
		if (this._meterMore(b) == 1) {
			return false;
		} else {
			return true;
		}
	}
	lessThen(b: ZvoogMeter): boolean {
		if (this._meterMore(b) == -1) {
			return true;
		} else {
			return false;
		}
	}
	notLessThen(b: ZvoogMeter): boolean {
		if (this._meterMore(b) == -1) {
			return false;
		} else {
			return true;
		}
	}
	equalsTo(b: ZvoogMeter): boolean {
		if (this._meterMore(b) == 0) {
			return true;
		} else {
			return false;
		}
	}
	simplify(): ZvoogMeter {
		//let r = { count: meter.count, division: meter.division };
		let r = this.clone();
		while (r.division % 3 == 0) {
			r.division = r.division / 3;
			r.count = Math.round(r.count / 3);
		}
		while (r.division % 2 == 0 && r.count % 2 == 0) {
			r.division = r.division / 2;
			r.count = Math.round(r.count / 2);
		}
		if (r.division % r.count == 0) {
			r.division = r.division / r.count;
			r.count = 1;
		}
		return r;
	}
}