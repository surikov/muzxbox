/*
class MusicMetreMath {
    count: number;
    part: number;
    constructor(from: MusicMetre) {
        this.count = from.count;
        this.part = from.part;
    }
    metre(): MusicMetre {
        return {
            count: this.count
            , part: this.part
        };
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
        return new MusicMetreMath({
            count: cc
            , part: pp
        });
    }
    equals(metre: MusicMetre): boolean {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe == countTo) {
            return true;
        } else {
            return false;
        }
    }
    less(metre: MusicMetre): boolean {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe < countTo) {
            return true;
        } else {
            return false;
        }
    }
    more(metre: MusicMetre): boolean {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe > countTo) {
            return true;
        } else {
            return false;
        }
    }
    plus(metre: MusicMetre): MusicMetreMath {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = {
            count: countMe + countTo
            , part: metre.part * this.part
        };
        return new MusicMetreMath(rr).simplyfy();
    }
    minus(metre: MusicMetre): MusicMetreMath {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = { count: countMe - countTo, part: metre.part * this.part };
        return new MusicMetreMath(rr).simplyfy();
    }
    duration(tempo: number): number {
        let wholeNoteSeconds = (4 * 60) / tempo;
        let meterSeconds = (wholeNoteSeconds * this.count) / this.part;
        return meterSeconds;
    }
    width(tempo: number, ratio: number): number {
        return this.duration(tempo) * ratio;
    }
}
*/