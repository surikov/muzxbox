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
	let lzu = new LZUtil();
	let cmpr: string = lzu.compressToUTF16(text);
	//localStorage.setItem(name, text);
	localStorage.setItem(name, cmpr);
	console.log('saveText2localStorage', name, text.length, '->', cmpr.length);
}

function readTextFromlocalStorage(name: string): string {
	try {
		//let o = localStorage.getItem(name);
		let cmpr = localStorage.getItem(name);
		let lzu = new LZUtil();
		let o = lzu.decompressFromUTF16(cmpr);
		console.log('readTextFromlocalStorage', name, ('' + cmpr).length, '->', ('' + o).length);
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
		//let txt = localStorage.getItem(name);
		let cmpr = localStorage.getItem(name);
		let lzu = new LZUtil();
		let txt = lzu.decompressFromUTF16(cmpr);
		console.log('readObjectFromlocalStorage', name, ('' + cmpr).length, '->', ('' + txt).length);
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