/*https://github.com/CoderLine/alphaTab
*/
class GPImporter {
	score: Score;
	load(arrayBuffer: ArrayBuffer, ext: string) {
		console.log('load', arrayBuffer);
		let scoreImporter: ScoreImporter | null = null;
		if (ext.toUpperCase() == 'GP3' || ext.toUpperCase() == 'GP4' || ext.toUpperCase() == 'GP5') {
			scoreImporter = new Gp3To5Importer();
			//let gp3To5Importer: Gp3To5Importer = new Gp3To5Importer();

		} else {
			if (ext.toUpperCase() == 'GPX') {
				scoreImporter = new GpxImporter();
			} else {

				console.log('Unknown file ' + ext);
			}
		}
		if (scoreImporter) {
			let uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
			//console.log('uint8Array', uint8Array);
			let data: ByteBuffer = ByteBuffer.fromBuffer(uint8Array);
			let settings: Settings = new Settings();
			settings.importer.encoding = 'windows-1251';
			scoreImporter.init(data, settings);
			//console.log('gp3To5Importer', gp3To5Importer);
			this.score = scoreImporter.readScore();
			//console.log("score", this.score);
		}
	}
	convertProject(title: string, comment: string): Zvoog_Project {
		//console.log('GPImporter.convertProject');
		let project: Zvoog_Project = score2schedule(title, comment, this.score);
		return project;
	}
}
function newGPparser(arrayBuffer: ArrayBuffer, ext: string) {
	console.log("newGPparser");
	let pp = new GPImporter();
	pp.load(arrayBuffer, ext);
	return pp;
}
