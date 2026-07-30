function createSimpleBeeperPlugin1() {
	let audioContext = null;
	let outputNode = null;
	let volumePercent = 100;
	let waveKind = 'sine';
	return {
		launch: (context, parameters) => {
			audioContext = context;
			if (!outputNode) {
				outputNode = audioContext.createGain();
			}
			if (parameters) {
				volumePercent = parseInt(parameters.split('/')[0]);
				waveKind = parameters.split('/')[1];
			}
			outputNode.gain.value = volumePercent / 100;
			return 0;
		},
		strum: (when, pitches, tempo, slides) => {
			try {
				for (let ii = 0; ii < pitches.length; ii++) {
					let frequency = 440 * Math.pow(Math.pow(2, (1 / 12)), pitches[ii] - 48);
					let duration = slides[0].duration;
					let oscillator = audioContext.createOscillator();
					oscillator.type = waveKind;
					oscillator.frequency.value = frequency;
					oscillator.connect(outputNode);
					oscillator.start(when);
					oscillator.stop(when + duration);
				}
			} catch (ops) {
				console.log(ops);
			}
		},
		cancel: () => {
			//
		},
		busy: () => {
			return false;
		},
		output: () => {
			return outputNode;
		}
	}
};