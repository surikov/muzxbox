class FileLoaderAlpha {
	constructor(inputFile) {
		var file = inputFile.files[0];
		var fileReader = new FileReader();
		let me = this;

		fileReader.onload = function (progressEvent: any) {
			if (progressEvent != null) {
				let title: string = file.name;
				let dat = '' + file.lastModifiedDate;
				try {
					let last: Date = file.lastModifiedDate;
					dat = '' + last.getFullYear();
					if (last.getMonth() < 10) {
						dat = dat + '-' + last.getMonth();
					} else {
						dat = dat + '-0' + last.getMonth();
					}
					if (last.getDate() < 10) {
						dat = dat + '-' + last.getDate();
					} else {
						dat = dat + '-0' + last.getDate();
					}
				} catch (xx) {
					console.log(xx);
				}
				let comment: string = ', ' + file.size / 1000 + 'kb, ' + dat;
				var arrayBuffer: ArrayBuffer = progressEvent.target.result as ArrayBuffer;

				let uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
				//console.log('uint8Array', uint8Array);
				let data: ByteBuffer = ByteBuffer.fromBuffer(uint8Array);
				let settings: Settings = new Settings();

				let path: string = inputFile.value;
				path=path.toLowerCase().trim();
				if (path.endsWith('.gp3') || path.endsWith('.gp4') || path.endsWith('.gp5')) {
					let scoreImporter: Gp3To5Importer = new Gp3To5Importer();
					settings.importer.encoding = 'windows-1251';
					scoreImporter.init(data, settings);
					let score = scoreImporter.readScore();
					console.log(score);
				}else{
					console.log('wrong path',path);
				}

				
				//let proj = new Projectr();
				//me.parsedProject = proj.parseRawMIDIdata(arrayBuffer, title, comment);
				//console.log('done zproject', me.parsedProject);
			}
		};
		fileReader.readAsArrayBuffer(file);
	}
}
console.log('test');


