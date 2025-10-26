declare function require(a);
declare var process;
var fs = require('fs');
//let folder = 'D:\\projects\\muzxbox\\test\\music\\';
//let folder = '/home/sss/Documents/GitHub/muzxbox/test/music/';
let folder = process.cwd();
console.log('start', folder);

function toArrayBuffer(buffer) {
	const arrayBuffer = new ArrayBuffer(buffer.length);
	const view = new Uint8Array(arrayBuffer);
	for (let i = 0; i < buffer.length; ++i) {
		view[i] = buffer[i];
	}
	return arrayBuffer;
}

function readOneFile(num: number, path: string, name: string) {
	let buff = fs.readFileSync(path + '/' + name);
	let arrayBuffer = toArrayBuffer(buff);
	try {
		let mifi: MIDIReader = new MIDIReader(name, arrayBuffer.byteLength, arrayBuffer);
		/*let cat = '';
		for (let kk = 0; kk < mifi.info.proCategories.length; kk++) {
			cat = cat + ' / ' + mifi.info.proCategories[kk].ratio + ' ' + mifi.info.proCategories[kk].title
		}*/
		//console.log(''//, //name, Math.round(buff.length / 1000)
		//, mifi.info.fileName//, '-', Math.round(mifi.info.fileSize / 1000), 'kb'
		//, mifi.info.durationCategory//, (Math.floor(mifi.info.duration / 60000) + "'" + (Math.floor(mifi.info.duration / 1000) % 60) + '"')
		//, mifi.info.avgTempoCategory + ','
		//, 'drums:', mifi.info.baseDrumCategory + ','//, mifi.info.baseDrumPerBar
		//, 'chords:', mifi.info.guitarChordCategory//, Math.round(mifi.info.guitarChordDuration * 100)
		//, 'bass:', mifi.info.bassTone50//, mifi.info.bassLine
		//, 'overdrive:', Math.round(100 * mifi.info.overDriveRatio)
		//, cat
		//);
		//console.log(mifi.info);
		let fname = name.trim();
		let parts = fname.split('\\.');
		let oname = parts[0];
		let mainTxt = 'file: "' + oname + '"';
		mainTxt = mainTxt + ", size: " + Math.round(buff.length / 1000) + 'kb';
		mainTxt = mainTxt + ", duration: " + mifi.info.durationCategory04;
		mainTxt = mainTxt + ", bpm: " + mifi.info.avgTempoCategory04;
		mainTxt = mainTxt + ", drums: " + mifi.info.baseDrumCategory03;
		mainTxt = mainTxt + ", guitar chords: " + mifi.info.guitarChordCategory03;
		mainTxt = mainTxt + ", bass: " + mifi.info.bassTone50;
		mainTxt = mainTxt + ", overdrive: " + Math.round(100 * mifi.info.overDriveRatio01);

		console.log(num + '. ' + mainTxt);
	} catch (xx) {
		console.log('/*');
		console.log(path, name);
		console.log(xx);
		console.log('*/');
	}
}

function readFiles(path) {
	fs.readdir(path, function (error, filenames) {
		console.log('error', error);
		console.log('count', filenames.length);
		for (let ii = 0; ii < filenames.length; ii++) {
			let filename = filenames[ii];
			if (filename.toLowerCase().trim().endsWith('mid')) {
				//console.log(ii, filename);
				readOneFile(ii, path, filename);
			}
			//

		}

	});
}
//readOneFile(folder, 'oasis-supersonic.mid');
readFiles(folder);
