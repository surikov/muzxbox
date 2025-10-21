declare function require(a);
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

function readOneFile(path, name) {
	let buff = fs.readFileSync(path + name);
	let arrayBuffer = toArrayBuffer(buff);
	try {
		let mifi: MIDIReader = new MIDIReader(name, arrayBuffer.byteLength, arrayBuffer);
		console.log(''//, //name, Math.round(buff.length / 1000)
			, mifi.info.fileName, '-', Math.round(mifi.info.fileSize / 1000), 'kb'
			//, mifi.info.durationCategory//, (Math.floor(mifi.info.duration / 60000) + "'" + (Math.floor(mifi.info.duration / 1000) % 60) + '"')
			//, mifi.info.avgTempoCategory + ','
			//, 'drums:', mifi.info.baseDrumCategory + ','//, mifi.info.baseDrumPerBar
			//, 'chords:', mifi.info.guitarChordCategory//, Math.round(mifi.info.guitarChordDuration * 100)
			, 'bass:', mifi.info.bassTone50//, mifi.info.bassLine
		);
		//console.log(mifi.info);
	} catch (xx) {
		//console.log('/*');
		//console.log(xx);
		//console.log('*/');
	}
}

function readFiles(path) {
	fs.readdir(path, function (error, filenames) {
		console.log('error', error);
		for (let ii = 0; ii < filenames.length; ii++) {
			let filename = filenames[ii];
			if (filename.toLowerCase().trim().endsWith('mid')) {
				//console.log(ii, filename);
				readOneFile(path, filename);
			}
			//

		}

	});
}
//readOneFile(folder, 'oasis-supersonic.mid');
readFiles(folder);
