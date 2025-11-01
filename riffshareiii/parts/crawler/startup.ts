//declare var v8;
//console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024));
//export NODE_OPTIONS="--max-old-space-size=8192" # Increase to 8 GB
//Set NODE_OPTIONS="--max-old-space-size=8192"
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
function sstr(txt: string): string {
	return '"' + txt.replace('"', '\'').replace('\n', ' ').replace('\r', ' ').replace('\]', ' ') + '"';
}

function readOneFile(num: number, path: string, name: string) {
	//console.log('readOneFile '+name);
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
		let parts = fname.split('\.');
		//console.log(parts[0],parts[1]);
		let oname = parts[0];
		/*
		let mainTxt = 'file: "' + oname + '"';
		mainTxt = mainTxt + ", size: " + Math.round(buff.length / 1000) + 'kb';
		
		mainTxt = mainTxt + ", duration: " + mifi.info.durationCategory04;
		mainTxt = mainTxt + ", bpm: " + mifi.info.avgTempoCategory04;
		mainTxt = mainTxt + ", drums: " + mifi.info.baseDrumCategory03;
		mainTxt = mainTxt + ", guitar chords: " + mifi.info.guitarChordCategory03;
		mainTxt = mainTxt + ", bass: " + mifi.info.bassTone50;
		mainTxt = mainTxt + ", overdrive: " + Math.round(100 * mifi.info.overDriveRatio01);
		mainTxt = mainTxt + ", meters: " + mifi.info.meters.reduce((last,it)=>last+', '+it.label+': '+it.count,'');
		*/
		//insert into parsedfile (filename,filepath,filesize,songduration,avgtempo,drums,chords,bass,overdrive) values;
		let sqlLine = 'insert into parsedfile (filename,filepath,filesize,songduration,avgtempo,drums,chords,bass,overdrive) values (';
		sqlLine = sqlLine + sstr(oname);
		sqlLine = sqlLine + ',' + sstr('');
		sqlLine = sqlLine + ',' + (buff.length < 25 ? 0 : buff.length < 90 ? 1 : 2);
		sqlLine = sqlLine + ',' + mifi.info.durationCategory04;
		sqlLine = sqlLine + ',' + mifi.info.avgTempoCategory04;
		sqlLine = sqlLine + ',' + mifi.info.baseDrumCategory03;
		sqlLine = sqlLine + ',' + mifi.info.guitarChordCategory03;
		sqlLine = sqlLine + ',' + mifi.info.bassTone50;
		sqlLine = sqlLine + ',' + Math.round(100 * mifi.info.overDriveRatio01);
		sqlLine = sqlLine + ');';
		console.log(sqlLine);
		/*
CREATE TABLE "parsecomments" (
	"id"	INTEGER NOT NULL,
	"fileid"	INTEGER,
	"txt"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
)
CREATE TABLE "parsedfile" (
	"id"	INTEGER NOT NULL,
	"filename"	TEXT,
	"filepath"	TEXT,
	"filesize"	INTEGER,
	"songduration"	INTEGER,
	"avgtempo"	INTEGER,
	"drums"	INTEGER,
	"chords"	INTEGER,
	"bass"	INTEGER,
	"overdrive"	INTEGER,
	"fileid"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
)
CREATE TABLE "parsedinstruments" (
	"id"	INTEGER NOT NULL,
	"fileid"	INTEGER,
	"inscat"	INTEGER,
	"inscount"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
)
CREATE TABLE "tempid" (
	"lastfileid"	INTEGER
)
		delete from tempid;
		insert into tempid (lastfileid) values (last_insert_rowid());
		insert into parsecomments (fileid,txt) select lastfileid as fileid, 'cmnt' as txt from tempid;
		insert into parsedinstruments (fileid,inscat,inscount) select lastfileid as fileid, 1321 as inscat, 33344 as inscount from tempid;

		*/
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
		//filenames.sort((a, b) => b.localeCompare(a) );
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
