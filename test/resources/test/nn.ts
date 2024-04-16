//https://dev.to/grahamthedev/a-noob-learns-ai-my-first-neural-networkin-vanilla-jswith-no-libraries-1f92#the-demo

class NeuralNetwork {
	inputSize: number;
	hiddenSize: number;
	outputSize: number;
	weightsHiddenToOutput: number[][];
	weightsInputToHidden: number[][];
	biasOutput: number[];
	biasHidden: number[];
	constructor(inputLayerSize: number, hiddenLayerSize: number, outputLayerSize: number) {
		this.inputSize = inputLayerSize;
		this.hiddenSize = hiddenLayerSize;
		this.outputSize = outputLayerSize;
		this.weightsInputToHidden = this.create2DRandom(this.inputSize, this.hiddenSize);
		this.weightsHiddenToOutput = this.create2DRandom(this.hiddenSize, this.outputSize);
		this.biasOutput = this.createArrayZero(this.outputSize);
		this.biasHidden = this.createArrayZero(this.hiddenSize);
	}
	findByPattern(inputs: number[]): number[] {
		let hiddenLayer = new Array(this.hiddenSize);
		for (let hh = 0; hh < this.hiddenSize; hh++) {
			hiddenLayer[hh] = 0;
			for (let ii = 0; ii < this.inputSize; ii++) {
				hiddenLayer[hh] = hiddenLayer[hh] + this.weightsInputToHidden[hh][ii] * inputs[ii];
			}
			hiddenLayer[hh] = hiddenLayer[hh] + this.biasHidden[hh];
			hiddenLayer[hh] = this.sigmoid(hiddenLayer[hh]);
		}
		const output = new Array(this.outputSize);
		for (let oo = 0; oo < this.outputSize; oo++) {
			output[oo] = 0;
			for (let hh = 0; hh < this.hiddenSize; hh++) {
				output[oo] = output[oo] + this.weightsHiddenToOutput[oo][hh] * hiddenLayer[hh];
			}
			output[oo] = output[oo] + this.biasOutput[oo];
			output[oo] = this.sigmoid(output[oo]);
		}
		return output;
	}

	singleTrain(learningRate: number, inputs: number[], righrAnswer: number[]) {
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
			hiddenLayer[hh] = this.sigmoid(hiddenLayer[hh]);
		}
		for (let oo = 0; oo < this.outputSize; oo++) {
			output[oo] = 0;
			for (let hh = 0; hh < this.hiddenSize; hh++) {
				output[oo] = output[oo] + this.weightsHiddenToOutput[oo][hh] * hiddenLayer[hh];
			}
			output[oo] = output[oo] + this.biasOutput[oo];
			output[oo] = this.sigmoid(output[oo]);
		}
		for (let oo = 0; oo < this.outputSize; oo++) {
			errorsOutput[oo] = righrAnswer[oo] - output[oo];
			for (let hh = 0; hh < this.hiddenSize; hh++) {
				this.weightsHiddenToOutput[oo][hh] = this.weightsHiddenToOutput[oo][hh] + learningRate * errorsOutput[oo] * output[oo] * (1 - output[oo]) * hiddenLayer[hh];
			}
			this.biasOutput[oo] = this.biasOutput[oo] + learningRate * errorsOutput[oo];
		}
		for (let hh = 0; hh < this.hiddenSize; hh++) {
			errorsHidden[hh] = 0;
			for (let oo = 0; oo < this.outputSize; oo++) {
				errorsHidden[hh] = errorsHidden[hh] + this.weightsHiddenToOutput[oo][hh] * errorsOutput[oo];
			}
			this.biasHidden[hh] = this.biasHidden[hh] + learningRate * errorsHidden[hh];
			for (let ii = 0; ii < this.inputSize; ii++) {
				this.weightsInputToHidden[hh][ii] = this.weightsInputToHidden[hh][ii] + learningRate * errorsHidden[hh] * hiddenLayer[hh] * (1 - hiddenLayer[hh]) * inputs[ii];
			}
		}
	}
	createArrayZero(size: number): number[] {
		let arr: number[] = [];
		for (let ii = 0; ii < size; ii++) {
			arr[ii] = 0;
		}
		return arr;
	}
	create2DRandom(size1: number, size2: number): number[][] {
		let arr: number[][] = [];
		for (let s2 = 0; s2 < size2; s2++) {
			arr[s2] = [];
			for (let s1 = 0; s1 < size1; s1++) {
				arr[s2][s1] = Math.random() * 2 - 1;
			}
		}
		return arr;
	}
	sigmoid(x: number) {
		return 1 / (1 + Math.exp(-x));
	}
}

class NNTester {
	constructor() {
		var neuralNetwork = this.initialise(2, 8, 4);
		let data: { x: number, y: number, label: string }[] = this.createTrainingData(12345);
		this.train(0.03, neuralNetwork, data);
		this.classifyPoints(neuralNetwork);
	}
	initialise(inputSize: number, hiddenNodesCount: number, outputSize: number) {
		console.log("initialise", inputSize, hiddenNodesCount, outputSize);
		let neuralNetwork = new NeuralNetwork(inputSize, hiddenNodesCount, outputSize);
		return neuralNetwork;
	}
	createTrainingData(numDataPoints: number): { x: number, y: number, label: string }[] {
		const trainingData: { x: number, y: number, label: string }[] = [];
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
	train(learningRate: number, neuralNetwork: NeuralNetwork, trainingData: { x: number, y: number, label: string }[]) {
		console.log('train');
		let trainingIterations = 3210;
		for (let i = 0; i < trainingIterations; i++) {
			const data = trainingData[Math.floor(Math.random() * trainingData.length)];
			neuralNetwork.singleTrain(learningRate, [data.x, data.y], this.oneHotEncode(data.label));
		}
		//console.log('weightsInputToHidden', neuralNetwork.weightsInputToHidden);
		//console.log('weightsHiddenToOutput', neuralNetwork.weightsHiddenToOutput);
	}
	classifyPoints(neuralNetwork: NeuralNetwork) {
		console.log('classifyPoints');
		let points: { x: number, y: number, label: string }[] = [];
		let numPoints = 33;//00
		for (let i = 0; i < numPoints; i++) {
			const x = Math.random() * 2 - 1; // Random x-coordinate between -1 and 1
			const y = Math.random() * 2 - 1; // Random y-coordinate between -1 and 1
			points.push({ x: x, y: y, label: '?' /*predictedLabel*/ });
		}
		for (let i = 0; i < numPoints; i++) {
			const output = neuralNetwork.findByPattern([points[i].x, points[i].y]);
			const predictedLabel: string = this.oneHotDecode(output);
			points[i].label = predictedLabel;
		}
		console.log('points', points);
	}
	oneHotEncode(label: string) {
		const encoding = {
			blue: [1, 0, 0, 0],
			red: [0, 1, 0, 0],
			green: [0, 0, 1, 0],
			purple: [0, 0, 0, 1]
		};
		return encoding[label];
	}
	oneHotDecode(output: number[]): string {
		const labels = ["blue", "red", "green", "purple"];
		const maxIndex = output.indexOf(Math.max(...output));
		return labels[maxIndex];
	}
}

class Tester2 {
	constructor() {
		console.log('Tester2');
	}
}

//new NNTester();
new Tester2();

