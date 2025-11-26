
//let fileurl = 'some.local.path';
//http://127.0.0.1:8081/loader.html?url=./deff_leppard-hysteria.mid
let params: URLSearchParams = new URLSearchParams(document.location.search);
let fileurl = params.get('url'); // is the string "Jonathan"
let filetitle = params.get('title'); // is the string "Jonathan"
console.log('fileurl', fileurl);
function startload() {
	console.log('startload', fileurl);
	//let fileurl = 'https://mzxbox.ru/midi/midiru-archive-2022-02-25/music_files/100028.mid';
	//let fileurl = './deff_leppard-hysteria.mid';
	if (fileurl) {
		let xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", fileurl);
		xmlHttpRequest.responseType = "arraybuffer";
		xmlHttpRequest.onload = (event) => {
			let arrayBuffer: ArrayBuffer = xmlHttpRequest.response as ArrayBuffer; // Note: not req.responseText
			if (arrayBuffer) {
				loadFromArray(arrayBuffer);
			}
		};
		xmlHttpRequest.send(null);
	}
}
function loadFromArray(arrayBuffer: ArrayBuffer) {
	console.log(arrayBuffer);
	let title:string=filetitle?filetitle:'?';
	let mireader: MIDIReader = new MIDIReader(title, 123, arrayBuffer);
	let parsedProject: Zvoog_Project = mireader.project;

	//console.log(mireader.parser);
	//console.log(mireader.info);
	saveProject(parsedProject);
	goedit();
}
function saveProject(parsedProject: Zvoog_Project) {
	console.log('parsedProject',parsedProject);
	let lastprojectdata = readLzObjectFromlocalStorage('lastprojectdata');
	console.log('lastprojectdata',lastprojectdata);
	let txtdata = JSON.stringify(parsedProject);
	saveLzText2localStorage('lastprojectdata', txtdata);
	saveRawText2localStorage('undocommands', JSON.stringify([]));
	saveRawText2localStorage('redocommands', JSON.stringify([]));
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
function goedit() {
	//window.location.replace('minium.studio.html');
	window.open('minium.studio.html',"_self")
}
