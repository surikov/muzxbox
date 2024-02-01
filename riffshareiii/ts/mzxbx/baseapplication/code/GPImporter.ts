/*https://github.com/CoderLine/alphaTab
*/
class GPImporter {
	load(arrayBuffer: ArrayBuffer) {
		console.log('load',arrayBuffer);
		let gp3To5Importer: Gp3To5Importer = new Gp3To5Importer();
		let uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
		console.log('uint8Array',uint8Array);
		let data: ByteBuffer = ByteBuffer.fromBuffer(uint8Array);
		let settings: Settings = new Settings();
		gp3To5Importer.init(data, settings);
		console.log('gp3To5Importer',gp3To5Importer);
		let score: Score = gp3To5Importer.readScore();
		console.log("score", score);
	}
	convertProject(title: string, comment: string): MZXBX_Project {
		console.log('GPImporter.convertProject', this);
		let project: MZXBX_Project = {
			title: title + ' ' + comment
			, timeline: []
			, tracks: []
			, percussions: []
			, filters: []
			, comments: []
		};
		return project;
	}
}
function newGPparser(arrayBuffer: ArrayBuffer) {
	console.log("newGPparser");
	let pp = new GPImporter();
	pp.load(arrayBuffer);
	return pp;
}
