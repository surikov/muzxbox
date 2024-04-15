//https://dev.to/grahamthedev/a-noob-learns-ai-my-first-neural-networkin-vanilla-jswith-no-libraries-1f92#the-demo

class NeuralNetwork {
	inputSize: number;
	hiddenSize: number;
	outputSize: number;
	weightsHiddenToOutput: number[][];
	weightsInputToHidden: number[][];
	learningRate: number = 0.03;
	//hiddenLayer: number[];
	biasOutput: number[];
	biasHidden: number[];
	constructor(inputLayerSize: number, hiddenLayerSize: number, outputLayerSize: number) {
		this.inputSize = inputLayerSize;
		this.hiddenSize = hiddenLayerSize;
		this.outputSize = outputLayerSize;
		//this.weightsInputToHidden = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, () => Math.random() * 2 - 1));
		this.weightsInputToHidden = [];
		for (let hh = 0; hh < this.hiddenSize; hh++) {
			this.weightsInputToHidden[hh] = [];
			for (let ii = 0; ii < this.inputSize; ii++) {
				this.weightsInputToHidden[hh][ii] = Math.random() * 2 - 1;
			}
		}
		//console.log('weightsInputToHidden', this.weightsInputToHidden);
		//this.biasHidden = Array(hiddenSize).fill(0);
		this.biasHidden = [];
		for (let hh = 0; hh < this.hiddenSize; hh++) {
			this.biasHidden[hh] = 0;
		}
		//this.weightsHiddenToOutput = Array.from({ length: outputSize }, () => Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1));
		this.weightsHiddenToOutput = [];
		for (let oo = 0; oo < this.outputSize; oo++) {
			this.weightsHiddenToOutput[oo] = [];
			for (let hh = 0; hh < this.hiddenSize; hh++) {
				this.weightsHiddenToOutput[oo][hh] = Math.random() * 2 - 1;
			}
		}
		//console.log('weightsHiddenToOutput', this.weightsHiddenToOutput);
		//this.biasOutput = Array(outputSize).fill(0);
		this.biasOutput = [];
		for (let oo = 0; oo < this.outputSize; oo++) {
			this.biasOutput[oo] = 0;
		}
		//this.learningRate = document.querySelector('#learningRate').value; // Adjusted learning rate
		//this.hiddenLayer = new Array(this.hiddenSize);
	}

	findByPattern(inputs: number[]): number[] {
		let hiddenLayer = new Array(this.hiddenSize);
		for (let hh = 0; hh < this.hiddenSize; hh++) {
			hiddenLayer[hh] = 0;
			for (let ii = 0; ii < this.inputSize; ii++) {
				hiddenLayer[hh] = hiddenLayer[hh] + this.weightsInputToHidden[hh][ii] * inputs[ii];
			}
			hiddenLayer[hh] = hiddenLayer[hh] + this.biasHidden[hh];
			hiddenLayer[hh] = sigmoid(hiddenLayer[hh]);
		}
		const output = new Array(this.outputSize);
		for (let oo = 0; oo < this.outputSize; oo++) {
			output[oo] = 0;
			for (let hh = 0; hh < this.hiddenSize; hh++) {
				output[oo] = output[oo] + this.weightsHiddenToOutput[oo][hh] * hiddenLayer[hh];
			}
			output[oo] = output[oo] + this.biasOutput[oo];
			output[oo] = sigmoid(output[oo]);
		}
		//console.log('feedForward', inputs, output);
		return output;
	}

	singleTrain(inputs: number[], righrAnswer: number[]) {
		let output = new Array(this.outputSize);
		let errorsOutput = new Array(this.outputSize);
		let errorsHidden = new Array(this.hiddenSize);
		let hiddenLayer = new Array(this.hiddenSize);
		for (let hh = 0; hh < this.hiddenSize; hh++) {
			hiddenLayer[hh] = 0;
			for (let ii = 0; ii < this.inputSize; ii++) {
				hiddenLayer[hh] = hiddenLayer[hh] + this.weightsInputToHidden[hh][ii] * inputs[ii];
			}
			hiddenLayer[hh] = hiddenLayer[hh] + this.biasHidden[hh];
			hiddenLayer[hh] = sigmoid(hiddenLayer[hh]);
		}
		for (let oo = 0; oo < this.outputSize; oo++) {
			output[oo] = 0;
			for (let hh = 0; hh < this.hiddenSize; hh++) {
				output[oo] = output[oo] + this.weightsHiddenToOutput[oo][hh] * hiddenLayer[hh];
			}
			output[oo] = output[oo] + this.biasOutput[oo];
			output[oo] = sigmoid(output[oo]);
		}
		for (let oo = 0; oo < this.outputSize; oo++) {
			errorsOutput[oo] = righrAnswer[oo] - output[oo];
			for (let hh = 0; hh < this.hiddenSize; hh++) {
				this.weightsHiddenToOutput[oo][hh] = this.weightsHiddenToOutput[oo][hh] + this.learningRate * errorsOutput[oo] * output[oo] * (1 - output[oo]) * hiddenLayer[hh];
			}
			this.biasOutput[oo] = this.biasOutput[oo] + this.learningRate * errorsOutput[oo];
		}
		for (let hh = 0; hh < this.hiddenSize; hh++) {
			errorsHidden[hh] = 0;
			for (let oo = 0; oo < this.outputSize; oo++) {
				errorsHidden[hh] = errorsHidden[hh] + this.weightsHiddenToOutput[oo][hh] * errorsOutput[oo];
			}
			this.biasHidden[hh] = this.biasHidden[hh] + this.learningRate * errorsHidden[hh];
			for (let ii = 0; ii < this.inputSize; ii++) {
				this.weightsInputToHidden[hh][ii] = this.weightsInputToHidden[hh][ii] + this.learningRate * errorsHidden[hh] * hiddenLayer[hh] * (1 - hiddenLayer[hh]) * inputs[ii];
			}
		}
		/*
		console.log('weightsInputToHidden', this.weightsInputToHidden);
		console.log('weightsHiddenToOutput', this.weightsHiddenToOutput);
		console.log('this.hiddenLayer',this.hiddenLayer);
		console.log('output',output);
		console.log('errorsOutput',errorsOutput);
		console.log('errorsHidden',errorsHidden);
		*/
	}
}

//const canvas = document.getElementById("graph");
//const ctx = canvas.getContext("2d");
//const pointRadius = 5; // Radius of the points


function createTrainingData(numDataPoints: number) {
	const trainingData: { x: number, y: number, label: string }[] = [];
	//const numDataPoints = 50000;//document.querySelector('#trainingDataSize').value; // Adjust the number of data points as needed

	for (let i = 0; i < numDataPoints; i++) {
		const x = Math.random() * 2 - 1; // Random x value between -1 and 1
		const y = Math.random() * 2 - 1; // Random y value between -1 and 1

		let label: string;
		if (x <= 0 && y < 0) {
			label = "blue";
		} else if (x <= 0 && y > 0) {
			label = "green";
		} else if (x > 0 && y <= 0) {
			label = "red";
		} else {
			label = "purple";
		}

		trainingData.push({
			x: x,
			y: y,
			label: label
		});
	}
	return trainingData;
}


//console.log('trainingData', trainingData);



function initialise(inputSize: number, hiddenNodesCount: number, outputSize: number) {
	console.log("initialise", hiddenNodesCount);
	//clearCanvas();
	let neuralNetwork = new NeuralNetwork(inputSize, hiddenNodesCount, outputSize);
	return neuralNetwork;
}

function train(neuralNetwork: NeuralNetwork, trainingData: { x: number, y: number, label: string }[]) {
	console.log('train');
	let trainingIterations = 3210;
	//for (let i = 0; i < parseInt(document.querySelector('#trainingIterations').value); i++) {
	for (let i = 0; i < trainingIterations; i++) {
		const data = trainingData[Math.floor(Math.random() * trainingData.length)];
		//let data = trainingData[i];
		//console.log(i, data, oneHotEncode(data.label));
		neuralNetwork.singleTrain([data.x, data.y], oneHotEncode(data.label));
	}
	//console.log("Training complete");
	console.log('weightsInputToHidden', neuralNetwork.weightsInputToHidden);
	console.log('weightsHiddenToOutput', neuralNetwork.weightsHiddenToOutput);
}

function classifyPoints(neuralNetwork: NeuralNetwork) {
	console.log('classifyPoints');
	//console.log('weightsInputToHidden', neuralNetwork.weightsInputToHidden);
	//console.log('weightsHiddenToOutput', neuralNetwork.weightsHiddenToOutput);
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	//drawAxes();
	//this.points = [];
	let points: { x: number, y: number, label: string }[] = [];
	let numPoints = 33;//00
	//for (let i = 0; i < parseInt(document.querySelector('#numPoints').value); i++) {
	for (let i = 0; i < numPoints; i++) {
		const x = Math.random() * 2 - 1; // Random x-coordinate between -1 and 1
		const y = Math.random() * 2 - 1; // Random y-coordinate between -1 and 1
		//const output = neuralNetwork.feedForward([x, y]);
		//const predictedLabel: string = oneHotDecode(output);
		//drawPoint(x, y, predictedLabel);
		points.push({ x: x, y: y, label: '?' /*predictedLabel*/ });
	}
	for (let i = 0; i < numPoints; i++) {
		const output = neuralNetwork.findByPattern([points[i].x, points[i].y]);
		//console.log(i,output);
		const predictedLabel: string = oneHotDecode(output);
		points[i].label = predictedLabel;
	}
	console.log('points', points);
	//console.log(neuralNetwork.hiddenLayer);
}

function oneHotEncode(label: string) {
	const encoding = {
		blue: [1, 0, 0, 0],
		red: [0, 1, 0, 0],
		green: [0, 0, 1, 0],
		purple: [0, 0, 0, 1]
	};
	return encoding[label];
}

function oneHotDecode(output: number[]): string {
	const labels = ["blue", "red", "green", "purple"];
	const maxIndex = output.indexOf(Math.max(...output));
	return labels[maxIndex];
}

function sigmoid(x: number) {
	return 1 / (1 + Math.exp(-x));
}

//var hiddenNodes = 8;//parseInt(document.querySelector('#hiddenNodes').value);
//let inputSize = 2;
//let outputSize = 4;

//var neuralNetwork: NeuralNetwork;

var neuralNetwork = initialise(2, 8, 4);
train(neuralNetwork, createTrainingData(12345));
classifyPoints(neuralNetwork);

