class MZXBX_MetreMath implements MZXBX_MetreMathType {
	count: number;
	part: number;
	set(from: MZXBX_Metre): MZXBX_MetreMath {
		this.count = from.count;
		this.part = from.part;
		return this;
	}
	metre(): MZXBX_Metre {
		return { count: this.count, part: this.part };
	}
	simplyfy(): MZXBX_MetreMath {
		let cc = this.count;
		let pp = this.part;
		if (cc > 0 && pp > 0) {
			while (cc % 2 == 0 && pp % 2 == 0) {
				cc = cc / 2;
				pp = pp / 2;
			}
		}
		return new MZXBX_MetreMath().set({ count: cc, part: pp });
	}
	strip(toPart: number): MZXBX_MetreMath {
		let cc = this.count;
		let pp = this.part;
		let rr = pp / toPart;
		cc = Math.ceil(cc / rr);
		pp = toPart;
		return new MZXBX_MetreMath().set({ count: cc, part: pp });
	}
	equals(metre: MZXBX_Metre): boolean {
		let countMe = this.count * metre.part;
		let countTo = metre.count * this.part;
		if (countMe == countTo) {
			return true;
		} else {
			return false;
		}
	}
	less(metre: MZXBX_Metre): boolean {
		let countMe = this.count * metre.part;
		let countTo = metre.count * this.part;
		if (countMe < countTo) {
			return true;
		} else {
			return false;
		}
	}
	more(metre: MZXBX_Metre): boolean {
		let countMe = this.count * metre.part;
		let countTo = metre.count * this.part;
		if (countMe > countTo) {
			return true;
		} else {
			return false;
		}
	}
	plus(metre: MZXBX_Metre): MZXBX_MetreMath {
		let countMe = this.count * metre.part;
		let countTo = metre.count * this.part;
		let rr = { count: countMe + countTo, part: metre.part * this.part };
		return new MZXBX_MetreMath().set(rr).simplyfy();
	}
	minus(metre: MZXBX_Metre): MZXBX_MetreMath {
		let countMe = this.count * metre.part;
		let countTo = metre.count * this.part;
		let rr = { count: countMe - countTo, part: metre.part * this.part };
		return new MZXBX_MetreMath().set(rr).simplyfy();
	}
	duration(metre: MZXBX_Metre, tempo: number): number {
		let wholeNoteSeconds = (4 * 60) / tempo;
		let meterSeconds = (wholeNoteSeconds * metre.count) / metre.part;
		return meterSeconds;
	}
}
