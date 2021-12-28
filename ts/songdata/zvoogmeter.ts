type ZvoogMeter = {
	count: number
	, division: number
};
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
		while (r.division % 2 == 0 && r.count % 2 == 0) {
			r.division = r.division / 2;
			r.count = r.count / 2;
		}
		return r;
	}
}