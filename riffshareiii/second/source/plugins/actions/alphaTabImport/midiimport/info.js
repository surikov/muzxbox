var fs = require('fs');
let folder = 'D:\\projects\\muzxbox\\test\\music\\';
console.log('start', folder);

function toArrayBuffer(buffer) {
	const arrayBuffer = new ArrayBuffer(buffer.length);
	const view = new Uint8Array(arrayBuffer);
	for (let i = 0; i < buffer.length; ++i) {
		view[i] = buffer[i];
	}
	return arrayBuffer;
}

function readOneFile(path,name) {
	let buff=fs.readFileSync(path+name);
	let arrayBuffer=toArrayBuffer(buff);
	console.log('--', name, buff.length);
	//let mireader: MIDIReader = new MIDIReader(name, 0, arrayBuffer);
	
}

function readFiles(path) {
	fs.readdir(path, function (error, filenames) {
		console.log('error', error);
		for (ii = 0; ii < filenames.length; ii++) {
			let filename = filenames[ii];
			if (filename.toLowerCase().trim().endsWith('mid')) {
				//console.log(ii, filename);
				readOneFile(path , filename);
			}
			//

		}

	});
}
readFiles(folder);