function createNewTestFilterPlugin() {
	let audioContext = null;
	let inputGainNode;
	let outputGainNode;
	let flanger;
	let properties = {
		speed: 1
	};

	function flangerNode(audioContext, fromNode, toNode) {
		this.nodes = {
			inputGainNode: audioContext.createGain(), // Create the input gain-node
			wetGainNode: audioContext.createGain(), // Create the wetness controll gain-node
			delayNode: audioContext.createDelay(), // Create the delay node
			gainNode: audioContext.createGain(), // Create the gain controll gain-node
			feedbackGainNode: audioContext.createGain(), // Create the feedback controll gain-node
			oscillatorNode: audioContext.createOscillator() // Create the oscilator node
		};
		this.nodes['oscillatorNode'].connect(this.nodes['gainNode']);
		this.nodes['gainNode'].connect(this.nodes['delayNode'].delayTime);
		this.nodes['inputGainNode'].connect(this.nodes['wetGainNode']);
		this.nodes['inputGainNode'].connect(this.nodes['delayNode']);
		this.nodes['delayNode'].connect(this.nodes['wetGainNode']);
		this.nodes['delayNode'].connect(this.nodes['feedbackGainNode']);
		this.nodes['feedbackGainNode'].connect(this.nodes['inputGainNode']);
		// Setup the oscillator
		this.nodes['oscillatorNode'].type = 'sine';
		this.nodes['oscillatorNode'].start(0);
		// Set the input gain-node as the input-node.
		this.node = this.nodes['inputGainNode'];
		// Set the output gain-node as the output-node.
		this.output = this.nodes['wetGainNode'];
		// Set the default delay of 0.005 seconds
		this.delay = 0.005;
		// Set the default depth to 0.002;
		this.depth = 0.01;//0.002;
		// Set the default feedback to 0.5
		this.feedback = 0.5;
		// Set the default speed to 0.25Hz
		this.speed = 0.25;
		this.reset = function () {
			this.nodes['delayNode'].delayTime.value = this.delay;
			this.nodes['gainNode'].gain.value = this.depth;
			this.nodes['feedbackGainNode'].gain.value = this.feedback;
			this.nodes['oscillatorNode'].frequency.value = this.speed;
		};
		fromNode.connect(this.node);
		this.output.connect(toNode);
		this.reset();
		return this;
	}
	return {
		launch: (context, parameters) => {
			if (!(inputGainNode)) {
				audioContext = context;

				inputGainNode = audioContext.createGain();
				outputGainNode = audioContext.createGain();
				flanger = flangerNode(audioContext, inputGainNode, outputGainNode);
			}
			if (parameters) {
				properties = JSON.parse(parameters);
			}
		},
		busy: () => {
			return false;
		},
		schedule: (when, tempo, parameters) => {
			if (parameters) {
				let point = JSON.parse(parameters);
				flanger.speed=properties.speed * 60 / tempo;
				
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