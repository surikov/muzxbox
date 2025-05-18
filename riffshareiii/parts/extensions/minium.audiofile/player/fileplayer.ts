console.log('Audio File v1.0');
class AudiFileSamplerTrackImplementation implements MZXBX_AudioPerformerPlugin {
	audioContext: AudioContext;
	outputNode: GainNode;
	freqRatio: number = 0;
	fileURL: string = '';
	volumeLevel: number = 0;
	ratio: number = 0;
	path = '';
	//constructor(){
	//	console.log('audiofile lauch');
	//}
	launch(context: AudioContext, parameters: string): void {
		console.log('audiofile lauch');
		if (this.audioContext) {
			//
		} else {
			this.audioContext = context;
			this.outputNode = this.audioContext.createGain();

		}
		let parsed = new AudioFileParametersUrility().parse(parameters);
		this.ratio = parsed.ratio;
		this.volumeLevel = parsed.volume;
		this.path = parsed.url;
		this.startLoadFile();
	}
	strum(when: number, pitches: number[], tempo: number, slides: MZXBX_SlideItem[]): void {

	}
	cancel(): void {

	};
	busy(): null | string {
		return 'testing';
	}
	output(): AudioNode | null {
		return this.outputNode;
	}
	startLoadFile() {
		let loadedFile = window[this.path];
		console.log('loadedFile', loadedFile);
	}
	/*parseParameters(parameters: string) {

		this.fileURL = this.fileURL ? this.fileURL : '';
		if (this.freqRatio >= -100 && this.freqRatio <= 100) {
			//
		} else {
			this.freqRatio = 0;
		}
	}*/
}
function newAudiFileSamplerTrack(): MZXBX_AudioPerformerPlugin {
	console.log('audiofile newAudiFileSamplerTrack');
	return new AudiFileSamplerTrackImplementation();
}
