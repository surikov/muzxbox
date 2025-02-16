/*
type MusicMetre = {
	count: number
	, part: number
};
type TimeBar = {
	tempo: number
	, metre: MusicMetre
};
type PitchedTrack = {
	title: string
};
type DrumsTrack = {
	title: string
};
type MixerData = {
	title: string
	, timeline: TimeBar[]
	, notePathHeight: number
	, widthDurationRatio: number
	, pitchedTracks: PitchedTrack[]
	//, drumsTracks: DrumsTrack[]
};
*/
function saveText2localStorage(name: string, text: string) {
	//console.log('saveText2localStorage', name, text);
	localStorage.setItem(name, text);
}

function readTextFromlocalStorage(name: string): string {
	try {
		let o = localStorage.getItem(name);
		if (o) {
			return o;
		} else {
			return '';
		}
	} catch (ex) {
		console.log(ex);
	}
	return '';
}
function readObjectFromlocalStorage(name: string): any {
	try {
		let txt = localStorage.getItem(name);
		if (txt) {
			let o = JSON.parse(txt);
			return o;
		} else {
			return null;
		}
	} catch (ex) {
		console.log(ex);

	}
	return null;
}