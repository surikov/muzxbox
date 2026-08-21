function createNewTestFilterPlugin() {
	let audioContext = null;
	let inputGainNode;
	let outputGainNode;
	let delayNode;
	let oscillatorGainNode;
	let feedbackGainNode;
	let oscillatorNode;
	let properties = {
		speed: 1
	};
	return {
		launch: (context, parameters) => {
			if (!(inputGainNode)) {
				audioContext = context;
				
				inputGainNode = audioContext.createGain();
				outputGainNode = audioContext.createGain();
				delayNode = audioContext.createDelay();
				oscillatorGainNode = audioContext.createGain();
				feedbackGainNode = audioContext.createGain();
				oscillatorNode = audioContext.createOscillator();

				oscillatorNode.connect(oscillatorGainNode);
				oscillatorGainNode.connect(delayNode);
				//inputGainNode.connect(outputGainNode);
				inputGainNode.connect(delayNode);
				delayNode.connect(outputGainNode);
				delayNode.connect(feedbackGainNode);
				feedbackGainNode.connect(inputGainNode);

				oscillatorNode.type = 'sine';
				oscillatorNode.start(0);
				delayNode.delayTime.value = 0.1;
				oscillatorGainNode.gain.value = 0.1;
				feedbackGainNode.gain.value = 0.5;
				oscillatorNode.frequency.value = 0.25; //properties.speed * 60 / 120;
			}
			if (parameters) {
				properties = JSON.parse(parameters);
			}
		},
		busy: () => {
			return false;
		},
		duration: () => {
			return 0.25;
		},
		start: (when, tempo, parameters) => {
			if (parameters) {
				let point = JSON.parse(parameters);
				oscillatorNode.frequencysetValueAtTime(0.25); //properties.speed * 60 / tempo);
			}
		},
		output: () => {
			return outputGainNode;
		},
		input: () => {
			return inputGainNode;
		}
	};
}