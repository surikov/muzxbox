function MeterMath(u: SSSMeter) {
	return new DurationUnitUtil(u);
}
class DurationUnitUtil {
	_unit: SSSMeter;
	constructor(u: SSSMeter) {
		this._unit = u;
	}
	clone(): SSSMeter {
		return { count: this._unit.count, division: this._unit.division };
	}
	plus(b: SSSMeter): SSSMeter {
		if (this._unit.division == b.division) {
			return { count: this._unit.count + b.count, division: this._unit.division };
		} else {
			let r = { count: this._unit.count * b.division + b.count * this._unit.division, division: this._unit.division * b.division };
			return r;
		}
	}
	minus(b: SSSMeter): SSSMeter {
		if (this._unit.division == b.division) {
			return { count: this._unit.count - b.count, division: this._unit.division };
		} else {
			let r = { count: this._unit.count * b.division - b.count * this._unit.division, division: this._unit.division * b.division };
			return r;
		}
	}
	_meterCompare(b: SSSMeter): number {
		let a1 = this.plus({ count: 0, division: b.division });
		let b1 = MeterMath(b).plus({ count: 0, division: this._unit.division });
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
	moreThen(b: SSSMeter): boolean {
		if (this._meterCompare(b) == 1) {
			return true;
		} else {
			return false;
		}
	}
	notMoreThen(b: SSSMeter): boolean {
		if (this._meterCompare(b) == 1) {
			return false;
		} else {
			return true;
		}
	}
	lessThen(b: SSSMeter): boolean {
		if (this._meterCompare(b) == -1) {
			return true;
		} else {
			return false;
		}
	}
	notLessThen(b: SSSMeter): boolean {
		if (this._meterCompare(b) == -1) {
			return false;
		} else {
			return true;
		}
	}
	equalsTo(b: SSSMeter): boolean {
		if (this._meterCompare(b) == 0) {
			return true;
		} else {
			return false;
		}
	}
	simplify(): SSSMeter {
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