
function startload() {
	console.log('startload');
	//let fileurl = 'https://mzxbox.ru/midi/midiru-archive-2022-02-25/music_files/100028.mid';
	let fileurl = './deff_leppard-hysteria.mid';
	let xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.open("GET", fileurl);
	xmlHttpRequest.responseType = "arraybuffer";

	xmlHttpRequest.onload = (event) => {
		let arrayBuffer: ArrayBuffer = xmlHttpRequest.response as ArrayBuffer; // Note: not req.responseText
		if (arrayBuffer) {
			console.log(arrayBuffer);
		}
	};

	xmlHttpRequest.send(null);
}
