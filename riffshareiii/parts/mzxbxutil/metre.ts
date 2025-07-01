class MZXBX_MetreMathUtil implements Zvoog_MetreMathType {
	count: number;
	part: number;
	set(from: Zvoog_Metre): MZXBX_MetreMathUtil {
		this.count = from.count;
		this.part = from.part;
		return this;
	}
	calculate(duration: number, tempo: number): MZXBX_MetreMathUtil {
		this.part = 1024.0;
		let tempPart = new MZXBX_MetreMathUtil().set({ count: 1, part: this.part }).duration(tempo);
		this.count = Math.round(duration / tempPart);
		return this.simplyfy();
		//return this;
	}
	metre(): Zvoog_Metre {
		return { count: this.count, part: this.part };
	}
	simplyfy(): MZXBX_MetreMathUtil {
		let cc = this.count;
		let pp = this.part;
		if (cc > 0 && pp > 0) {
			while (cc % 2 == 0 && pp % 2 == 0) {
				cc = cc / 2;
				pp = pp / 2;
			}
		}
		return new MZXBX_MetreMathUtil().set({ count: cc, part: pp });
	}
	strip(toPart: number): MZXBX_MetreMathUtil {
		let cc = this.count;
		let pp = this.part;
		let rr = pp / toPart;
		cc = Math.round(cc / rr);
		//cc = Math.floor(cc / rr);
		pp = toPart;
		//if (cc < 1) {
		//    cc = 1;
		//}
		let r = new MZXBX_MetreMathUtil().set({ count: cc, part: pp }).simplyfy();
		return r;
	}
	equals(metre: Zvoog_Metre): boolean {
		let countMe = this.count * metre.part;
		let countTo = metre.count * this.part;
		if (countMe == countTo) {
			return true;
		} else {
			return false;
		}
	}
	less(metre: Zvoog_Metre): boolean {
		let countMe = this.count * metre.part;
		let countTo = metre.count * this.part;
		if (countMe < countTo) {
			return true;
		} else {
			return false;
		}
	}
	more(metre: Zvoog_Metre): boolean {
		let countMe = this.count * metre.part;
		let countTo = metre.count * this.part;
		if (countMe > countTo) {
			return true;
		} else {
			return false;
		}
	}
	plus(metre: Zvoog_Metre): MZXBX_MetreMathUtil {
		let countMe = this.count * metre.part;
		let countTo = metre.count * this.part;
		let rr = { count: countMe + countTo, part: metre.part * this.part };
		return new MZXBX_MetreMathUtil().set(rr).simplyfy();
	}
	minus(metre: Zvoog_Metre): MZXBX_MetreMathUtil {
		let countMe = this.count * metre.part;
		let countTo = metre.count * this.part;
		let rr = { count: countMe - countTo, part: metre.part * this.part };
		return new MZXBX_MetreMathUtil().set(rr).simplyfy();
	}
	/*duration(metre: MZXBX_Metre, tempo: number): number {
		let wholeNoteSeconds = (4 * 60) / tempo;
		let meterSeconds = (wholeNoteSeconds * metre.count) / metre.part;
		return meterSeconds;
	}*/
	duration(tempo: number): number {
		let wholeNoteSeconds = (4 * 60) / tempo;
		let meterSeconds = (wholeNoteSeconds * this.count) / this.part;
		return meterSeconds;
	}
	width(tempo: number, ratio: number): number {
		return this.duration(tempo) * ratio;
	}

}
function MMUtil(): Zvoog_MetreMathType {
	return new MZXBX_MetreMathUtil().set({ count: 0, part: 1 });
}