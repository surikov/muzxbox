
//https://mzxbox.ru/minium/tmpload.html?key=72469234
//let params: URLSearchParams = new URLSearchParams(document.location.search);
//let keypar = params.get('key');
//let fileurl = 'https://mzxbox.ru/minium/tmp/' + keypar + '.json';
console.log('tmploader');
function starttmpload(keypar) {
	let fileurl = 'https://mzxbox.ru/minium/tmp/' + keypar + '.json';
	console.log('startload', fileurl);
	//if (fileurl) {
		let xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", fileurl);
		xmlHttpRequest.onload = (event) => {
			let json:Zvoog_Project=JSON.parse(xmlHttpRequest.responseText) as Zvoog_Project;
			saveProject(json);
			goedit();
		};
		xmlHttpRequest.send(null);
	//}
}
function saveProject(parsedProject: Zvoog_Project) {
	console.log('parsedProject', parsedProject);
	let lastprojectdata = readLzObjectFromlocalStorage('lastprojectdata');
	console.log('lastprojectdata', lastprojectdata);
	let txtdata = JSON.stringify(parsedProject);
	saveLzText2localStorage('lastprojectdata', txtdata);
	saveRawText2localStorage('undocommands', JSON.stringify([]));
	saveRawText2localStorage('redocommands', JSON.stringify([]));
}
function readLzObjectFromlocalStorage(name: string): any {
	try {
		let cmpr = localStorage.getItem(name);
		let lzu = new LZUtil();
		let txt = lzu.decompressFromUTF16(cmpr);
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
}
function saveRawText2localStorage(name: string, text: string) {
	localStorage.setItem(name, text);
}
function goedit() {
	window.open('../minium.studio.html', "_self");
}
