class NeuralNetwork {
	constructor(inputSize, hiddenSize, outputSize) {
		this.inputSize = inputSize;
		this.hiddenSize = hiddenSize;
		this.outputSize = outputSize;
		this.weightsInputToHidden = Array.from({
				length: hiddenSize
			}, () =>
				Array.from({
					length: inputSize
				}, () => Math.random() * 2 - 1));
		this.biasHidden = Array(hiddenSize).fill(0);
		this.weightsHiddenToOutput = Array.from({
				length: outputSize
			}, () =>
				Array.from({
					length: hiddenSize
				}, () => Math.random() * 2 - 1));
		this.biasOutput = Array(outputSize).fill(0);
		this.learningRate = document.querySelector('#learningRate').value; // Adjusted learning rate
		this.hiddenLayer = new Array(this.hiddenSize);
	}

	feedForward(inputs) {
		for (let i = 0; i < this.hiddenSize; i++) {
			this.hiddenLayer[i] = 0;
			for (let j = 0; j < this.inputSize; j++) {
				this.hiddenLayer[i] +=
				this.weightsInputToHidden[i][j] * inputs[j];
			}
			this.hiddenLayer[i] += this.biasHidden[i];
			this.hiddenLayer[i] = sigmoid(this.hiddenLayer[i]);
		}

		const output = new Array(this.outputSize);
		for (let i = 0; i < this.outputSize; i++) {
			output[i] = 0;
			for (let j = 0; j < this.hiddenSize; j++) {
				output[i] +=
				this.weightsHiddenToOutput[i][j] * this.hiddenLayer[j];
			}
			output[i] += this.biasOutput[i];
			output[i] = sigmoid(output[i]);
		}
		//console.log('neuralNetwork.hiddenLayer',neuralNetwork.hiddenLayer);
		return output;
	}

	train(inputs, target) {
		for (let i = 0; i < this.hiddenSize; i++) {
			this.hiddenLayer[i] = 0;
			for (let j = 0; j < this.inputSize; j++) {
				this.hiddenLayer[i] +=
				this.weightsInputToHidden[i][j] * inputs[j];
			}
			this.hiddenLayer[i] += this.biasHidden[i];
			this.hiddenLayer[i] = sigmoid(this.hiddenLayer[i]);
		}

		const output = new Array(this.outputSize);
		for (let i = 0; i < this.outputSize; i++) {
			output[i] = 0;
			for (let j = 0; j < this.hiddenSize; j++) {
				output[i] +=
				this.weightsHiddenToOutput[i][j] * this.hiddenLayer[j];
			}
			output[i] += this.biasOutput[i];
			output[i] = sigmoid(output[i]);
		}

		const errorsOutput = new Array(this.outputSize);
		const errorsHidden = new Array(this.hiddenSize);

		for (let i = 0; i < this.outputSize; i++) {
			errorsOutput[i] = target[i] - output[i];
			for (let j = 0; j < this.hiddenSize; j++) {
				this.weightsHiddenToOutput[i][j] +=
				this.learningRate *
				errorsOutput[i] *
				output[i] *
				(1 - output[i]) *
				this.hiddenLayer[j];
			}
			this.biasOutput[i] += this.learningRate * errorsOutput[i];
		}

		for (let i = 0; i < this.hiddenSize; i++) {
			errorsHidden[i] = 0;
			for (let j = 0; j < this.outputSize; j++) {
				errorsHidden[i] +=
				this.weightsHiddenToOutput[j][i] * errorsOutput[j];
			}
			this.biasHidden[i] += this.learningRate * errorsHidden[i];
			for (let j = 0; j < this.inputSize; j++) {
				this.weightsInputToHidden[i][j] +=
				this.learningRate *
				errorsHidden[i] *
				this.hiddenLayer[i] *
				(1 - this.hiddenLayer[i]) *
				inputs[j];
			}
		}
	}
}

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const pointRadius = 5; // Radius of the points

const trainingData = [];
const numDataPoints = document.querySelector('#trainingDataSize').value; // Adjust the number of data points as needed

for (let i = 0; i < numDataPoints; i++) {
	const x = Math.random() * 2 - 1; // Random x value between -1 and 1
	const y = Math.random() * 2 - 1; // Random y value between -1 and 1

	let label;
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
		x,
		y,
		label
	});
}

var hiddenNodes = parseInt(document.querySelector('#hiddenNodes').value);

var neuralNetwork = "";

function initialise() {
	console.log("HN", hiddenNodes);
	clearCanvas();
	neuralNetwork = new NeuralNetwork(2, hiddenNodes, 4);
}

function train() {
	for (let i = 0; i < parseInt(document.querySelector('#trainingIterations').value); i++) {
		const data =
			trainingData[Math.floor(Math.random() * trainingData.length)];
		neuralNetwork.train([data.x, data.y], oneHotEncode(data.label));
		if(i<5){
			console.log(i
	,'weightsInputToHidden',neuralNetwork.weightsInputToHidden
	,'weightsHiddenToOutput',neuralNetwork.weightsHiddenToOutput);
		}
	}
	console.log("Training complete");
}

function classifyPoints() {
	console.log('classifyPoints');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawAxes();
	this.points = [];
	for (let i = 0; i < parseInt(document.querySelector('#numPoints').value); i++) {
		const x = Math.random() * 2 - 1; // Random x-coordinate between -1 and 1
		const y = Math.random() * 2 - 1; // Random y-coordinate between -1 and 1
		const output = neuralNetwork.feedForward([x, y]);
		const predictedLabel = oneHotDecode(output);
		drawPoint(x, y, predictedLabel);
		points.push({
			x,
			y,
			predictedLabel
		});
	}
	console.log('points',points);
	//console.log('neuralNetwork.hiddenLayer',neuralNetwork.hiddenLayer);
}

function oneHotEncode(label) {
	const encoding = {
		blue: [1, 0, 0, 0],
		red: [0, 1, 0, 0],
		green: [0, 0, 1, 0],
		purple: [0, 0, 0, 1]
	};
	return encoding[label];
}

function oneHotDecode(output) {
	const labels = ["blue", "red", "green", "purple"];
	const maxIndex = output.indexOf(Math.max(...output));
	return labels[maxIndex];
}

function sigmoid(x) {
	return 1 / (1 + Math.exp(-x));
}
function drawPoint(x, y, color) {
	ctx.beginPath();
	ctx.arc(
		((x + 1) * canvas.width) / 2,
		canvas.height - ((y + 1) * canvas.height) / 2,
		pointRadius,
		0,
		2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawAxes() {
	ctx.beginPath();
	ctx.moveTo(0, canvas.height / 2);
	ctx.lineTo(canvas.width, canvas.height / 2); // X-axis
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height); // Y-axis
	ctx.strokeStyle = "black";
	ctx.stroke();
	ctx.closePath();
}
function visualizeNeuronsAndWeights() {
	clearCanvas(); // Clear the canvas
	visualizeLayer(100, 100, neuralNetwork.inputSize, 'grey', 'Input');
	visualizeLayer(300, 100, neuralNetwork.hiddenSize, 'aqua', 'Hidden', true);
	visualizeLayer(500, 100, neuralNetwork.outputSize, 'red', 'Output');
	visualizeWeights();
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function visualizeLayer(startX, startY, neuronCount, color, label, showBias) {
	const neuronSpacing = 100;
	const neuronRadius = 20;

	for (let i = 0; i < neuronCount; i++) {
		const x = startX;
		const y = startY + i * neuronSpacing;
		drawNeuron(x, y, neuronRadius, color, label);
		if (showBias) {
			drawBias(x, y, neuralNetwork.biasHidden[i]);
		}
		if (label === 'Input') {
			drawInputToHiddenWeights(x, y);
		}
	}
}

function drawInputToHiddenWeights(inputX, hiddenY) {
	for (let i = 0; i < neuralNetwork.inputSize; i++) {
		for (let j = 0; j < neuralNetwork.hiddenSize; j++) {
			const weight = neuralNetwork.weightsInputToHidden[j][i];
			const fromX = inputX;
			const fromY = hiddenY;
			const toX = 300;
			const toY = 100 + (j * 100);
			drawWeight(fromX, fromY, toX, toY, weight, "red");
		}
	}
}

function visualizeWeights() {
	for (let i = 0; i < neuralNetwork.outputSize; i++) {
		for (let j = 0; j < neuralNetwork.hiddenSize; j++) {
			const weight = neuralNetwork.weightsHiddenToOutput[i][j];
			const fromX = 300;
			const fromY = 100 + j * 100; // Increase vertical spacing
			const toX = 500;
			const toY = 100 + i * 100; // Increase vertical spacing
			drawWeight(fromX, fromY, toX, toY, weight);
		}
	}
}

function drawNeuron(x, y, radius, color, label) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.strokeStyle = 'black';
	ctx.stroke();
	ctx.font = '14px Arial';
	ctx.fillStyle = 'black';
	ctx.fillText(label, x - 15, y + 5);
	ctx.closePath();
}

function drawBias(x, y, bias) {
	ctx.font = '14px Arial';
	ctx.fillStyle = 'black';
	ctx.fillText('Bias: ' + bias.toFixed(2), x - 50, y + 30);
}

var yOffset = 0;

function drawWeight(fromX, fromY, toX, toY, weight, color) {
	ctx.beginPath();
	ctx.moveTo(fromX, fromY);
	ctx.lineTo(toX, toY);
	ctx.strokeStyle = color || 'green';
	ctx.stroke();

	const textX = (fromX + toX) / 2;
	const textY = (fromY + toY) / 2 + (toY / 3);
	ctx.font = '14px Arial';
	ctx.fillStyle = 'green';
	ctx.fillText(weight.toFixed(2), textX, textY);
	ctx.closePath();
}

