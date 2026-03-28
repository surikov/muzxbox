function loadAudioWorkletCode(audioworkletcode: string, audioContext: AudioContext, onDone: () => void) {
	let blob = new Blob([audioworkletcode], { type: 'application/javascript' });
	let reader = new FileReader();
	reader.onloadend = function () {
		let blobURL = reader.result as string;
		audioContext.audioWorklet.addModule(blobURL)
			.then((vv) => {
				onDone();
			});
	}
	reader.readAsDataURL(blob);
}
