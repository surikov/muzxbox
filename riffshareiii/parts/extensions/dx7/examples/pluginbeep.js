console.log('Minium Beep Test v1.0.2');

function MiniumPluginBeepForTesting() {
	let beep = {};
	beep.launch = function (context, parameters) {
		beep.context = context;
		beep.outputNode = context.createGain();
		return 0;
	};
	beep.busy = function () {
		return null;
	};
	beep.cancel = function () {
		beep.outputNode.gain.value = 0;
	};
	beep.output = function () {
		return beep.outputNode;
	};
	beep.strum = function (when, pitches, tempo, slides) {
		beep.outputNode.gain.value = 1;
		for (let pp = 0; pp < pitches.length; pp++) {

			let duration = slides.reduce((sm, val) => {
				return sm + val.duration;
			}, 0);
			let frequency = 440 * Math.pow(2, (pitches[pp] - 69) / 12);
			console.log('strum', when, frequency, duration);

			let oscillator = beep.context.createOscillator();
			oscillator.connect(beep.outputNode);
			oscillator.frequency.value = frequency;
			oscillator.start(when);
			oscillator.stop(when + duration);

		}
	};
	return beep;
}