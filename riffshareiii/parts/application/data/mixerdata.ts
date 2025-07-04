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
function saveLzText2localStorage(name: string, text: string) {
	let lzu = new LZUtil();
	let cmpr: string = lzu.compressToUTF16(text);
	localStorage.setItem(name, cmpr);
	//console.log('saveLzText2localStorage', name, text.length, '->', cmpr.length);
}
function saveRawText2localStorage(name: string, text: string) {
	localStorage.setItem(name, text);
	//console.log('saveRawText2localStorage', name);
}

function readLzTextFromlocalStorage(name: string): string {
	try {
		let cmpr = localStorage.getItem(name);
		let lzu = new LZUtil();
		let o = lzu.decompressFromUTF16(cmpr);
		//console.log('readTextFromlocalStorage', name, ('' + cmpr).length, '->', ('' + o).length);
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
function readRawTextFromlocalStorage(name: string): string {
	try {
		let txt = localStorage.getItem(name);
		return '' + txt;
	} catch (ex) {
		console.log(ex);
	}
	return '';
}
function readLzObjectFromlocalStorage(name: string): any {
	try {
		//let txt = localStorage.getItem(name);
		let cmpr = localStorage.getItem(name);
		let lzu = new LZUtil();
		let txt = lzu.decompressFromUTF16(cmpr);
		/*
		console.log('readLzObjectFromlocalStorage', name
			, Math.round(('' + cmpr).length / 1000) + 'kb'
			, '->', Math.round(('' + txt).length / 1000) + 'kb');
			*/
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
function readRawObjectFromlocalStorage(name: string): any {
	try {
		let txt = localStorage.getItem(name);
		//console.log('readRawObjectFromlocalStorage', name);
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
