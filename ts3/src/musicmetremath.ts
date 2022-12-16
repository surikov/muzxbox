namespace Surikov {
	export type Metre = {
		count: number
		, part: number
	};
	export class MusicMetreMath {
		count: number;
		part: number;
		constructor(from: Metre) {
			this.count = from.count;
			this.part = from.part;
		}
		metre(): Metre {
			return { count: this.count, part: this.part };
		}
		simplyfy(): MusicMetreMath {
			let cc = this.count;
			let pp = this.part;
			if (cc > 0 && pp > 0) {
				while (cc % 2 == 0 && pp % 2 == 0) {
					cc = cc / 2;
					pp = pp / 2;
				}
			}
			return new MusicMetreMath({ count: cc, part: pp });
		}
		strip(toPart: number): MusicMetreMath {
			let cc = this.count;
			let pp = this.part;
			let rr = pp / toPart;
			cc = Math.round(cc / rr);
			pp = toPart;
			return new MusicMetreMath({ count: cc, part: pp });
		}
		equals(metre: Metre): boolean {
			let countMe = this.count * metre.part;
			let countTo = metre.count * this.part;
			if (countMe == countTo) {
				return true;
			} else {
				return false;
			}
		}
		less(metre: Metre): boolean {
			let countMe = this.count * metre.part;
			let countTo = metre.count * this.part;
			if (countMe < countTo) {
				return true;
			} else {
				return false;
			}
		}
		more(metre: Metre): boolean {
			let countMe = this.count * metre.part;
			let countTo = metre.count * this.part;
			if (countMe > countTo) {
				return true;
			} else {
				return false;
			}
		}
		plus(metre: Metre): MusicMetreMath {
			let countMe = this.count * metre.part;
			let countTo = metre.count * this.part;
			let rr = { count: countMe + countTo, part: metre.part * this.part };
			return new MusicMetreMath(rr).simplyfy();
		}
		minus(metre: Metre): MusicMetreMath {
			let countMe = this.count * metre.part;
			let countTo = metre.count * this.part;
			let rr = { count: countMe - countTo, part: metre.part * this.part };
			return new MusicMetreMath(rr).simplyfy();
		}
		duration(metre: Metre, tempo: number): number {
			return 0;
		}
	}
}
