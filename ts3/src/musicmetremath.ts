type MusicMetre = {
	count: number
	, part: number
};
function MMM(metre: MusicMetre): MusicMetreMath {
	return new MusicMetreMath(metre);
}
class MusicMetreMath {
	count: number;
	part: number;
	constructor(from: MusicMetre) {
		this.count = from.count;
		this.part = from.part;
	}
	metre(): MusicMetre {
		return { count: this.count, part: this.part };
	}

}
