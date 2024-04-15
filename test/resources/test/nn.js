//https://dev.to/grahamthedev/a-noob-learns-ai-my-first-neural-networkin-vanilla-jswith-no-libraries-1f92#the-demo
var NeuralNetwork = /** @class */ (function () {
    function NeuralNetwork(inputLayerSize, hiddenLayerSize, outputLayerSize) {
        this.learningRate = 0.03;
        this.inputSize = inputLayerSize;
        this.hiddenSize = hiddenLayerSize;
        this.outputSize = outputLayerSize;
        //this.weightsInputToHidden = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, () => Math.random() * 2 - 1));
        this.weightsInputToHidden = [];
        for (var hh = 0; hh < this.hiddenSize; hh++) {
            this.weightsInputToHidden[hh] = [];
            for (var ii = 0; ii < this.inputSize; ii++) {
                this.weightsInputToHidden[hh][ii] = Math.random() * 2 - 1;
            }
        }
        //console.log('weightsInputToHidden', this.weightsInputToHidden);
        //this.biasHidden = Array(hiddenSize).fill(0);
        this.biasHidden = [];
        for (var hh = 0; hh < this.hiddenSize; hh++) {
            this.biasHidden[hh] = 0;
        }
        //this.weightsHiddenToOutput = Array.from({ length: outputSize }, () => Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1));
        this.weightsHiddenToOutput = [];
        for (var oo = 0; oo < this.outputSize; oo++) {
            this.weightsHiddenToOutput[oo] = [];
            for (var hh = 0; hh < this.hiddenSize; hh++) {
                this.weightsHiddenToOutput[oo][hh] = Math.random() * 2 - 1;
            }
        }
        //console.log('weightsHiddenToOutput', this.weightsHiddenToOutput);
        //this.biasOutput = Array(outputSize).fill(0);
        this.biasOutput = [];
        for (var oo = 0; oo < this.outputSize; oo++) {
            this.biasOutput[oo] = 0;
        }
        //this.learningRate = document.querySelector('#learningRate').value; // Adjusted learning rate
        //this.hiddenLayer = new Array(this.hiddenSize);
    }
    NeuralNetwork.prototype.findByPattern = function (inputs) {
        var hiddenLayer = new Array(this.hiddenSize);
        for (var hh = 0; hh < this.hiddenSize; hh++) {
            hiddenLayer[hh] = 0;
            for (var ii = 0; ii < this.inputSize; ii++) {
                hiddenLayer[hh] = hiddenLayer[hh] + this.weightsInputToHidden[hh][ii] * inputs[ii];
            }
            hiddenLayer[hh] = hiddenLayer[hh] + this.biasHidden[hh];
            hiddenLayer[hh] = sigmoid(hiddenLayer[hh]);
        }
        var output = new Array(this.outputSize);
        for (var oo = 0; oo < this.outputSize; oo++) {
            output[oo] = 0;
            for (var hh = 0; hh < this.hiddenSize; hh++) {
                output[oo] = output[oo] + this.weightsHiddenToOutput[oo][hh] * hiddenLayer[hh];
            }
            output[oo] = output[oo] + this.biasOutput[oo];
            output[oo] = sigmoid(output[oo]);
        }
        //console.log('feedForward', inputs, output);
        return output;
    };
    NeuralNetwork.prototype.singleTrain = function (inputs, righrAnswer) {
        var output = new Array(this.outputSize);
        var errorsOutput = new Array(this.outputSize);
        var errorsHidden = new Array(this.hiddenSize);
        var hiddenLayer = new Array(this.hiddenSize);
        for (var hh = 0; hh < this.hiddenSize; hh++) {
            hiddenLayer[hh] = 0;
            for (var ii = 0; ii < this.inputSize; ii++) {
                hiddenLayer[hh] = hiddenLayer[hh] + this.weightsInputToHidden[hh][ii] * inputs[ii];
            }
            hiddenLayer[hh] = hiddenLayer[hh] + this.biasHidden[hh];
            hiddenLayer[hh] = sigmoid(hiddenLayer[hh]);
        }
        for (var oo = 0; oo < this.outputSize; oo++) {
            output[oo] = 0;
            for (var hh = 0; hh < this.hiddenSize; hh++) {
                output[oo] = output[oo] + this.weightsHiddenToOutput[oo][hh] * hiddenLayer[hh];
            }
            output[oo] = output[oo] + this.biasOutput[oo];
            output[oo] = sigmoid(output[oo]);
        }
        for (var oo = 0; oo < this.outputSize; oo++) {
            errorsOutput[oo] = righrAnswer[oo] - output[oo];
            for (var hh = 0; hh < this.hiddenSize; hh++) {
                this.weightsHiddenToOutput[oo][hh] = this.weightsHiddenToOutput[oo][hh] + this.learningRate * errorsOutput[oo] * output[oo] * (1 - output[oo]) * hiddenLayer[hh];
            }
            this.biasOutput[oo] = this.biasOutput[oo] + this.learningRate * errorsOutput[oo];
        }
        for (var hh = 0; hh < this.hiddenSize; hh++) {
            errorsHidden[hh] = 0;
            for (var oo = 0; oo < this.outputSize; oo++) {
                errorsHidden[hh] = errorsHidden[hh] + this.weightsHiddenToOutput[oo][hh] * errorsOutput[oo];
            }
            this.biasHidden[hh] = this.biasHidden[hh] + this.learningRate * errorsHidden[hh];
            for (var ii = 0; ii < this.inputSize; ii++) {
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
    };
    return NeuralNetwork;
}());
//const canvas = document.getElementById("graph");
//const ctx = canvas.getContext("2d");
//const pointRadius = 5; // Radius of the points
function createTrainingData(numDataPoints) {
    var trainingData = [];
    //const numDataPoints = 50000;//document.querySelector('#trainingDataSize').value; // Adjust the number of data points as needed
    for (var i = 0; i < numDataPoints; i++) {
        var x = Math.random() * 2 - 1; // Random x value between -1 and 1
        var y = Math.random() * 2 - 1; // Random y value between -1 and 1
        var label = void 0;
        if (x <= 0 && y < 0) {
            label = "blue";
        }
        else if (x <= 0 && y > 0) {
            label = "green";
        }
        else if (x > 0 && y <= 0) {
            label = "red";
        }
        else {
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
function initialise(inputSize, hiddenNodesCount, outputSize) {
    console.log("initialise", hiddenNodesCount);
    //clearCanvas();
    var neuralNetwork = new NeuralNetwork(inputSize, hiddenNodesCount, outputSize);
    return neuralNetwork;
}
function train(neuralNetwork, trainingData) {
    console.log('train');
    var trainingIterations = 3210;
    //for (let i = 0; i < parseInt(document.querySelector('#trainingIterations').value); i++) {
    for (var i = 0; i < trainingIterations; i++) {
        var data = trainingData[Math.floor(Math.random() * trainingData.length)];
        //let data = trainingData[i];
        //console.log(i, data, oneHotEncode(data.label));
        neuralNetwork.singleTrain([data.x, data.y], oneHotEncode(data.label));
    }
    //console.log("Training complete");
    console.log('weightsInputToHidden', neuralNetwork.weightsInputToHidden);
    console.log('weightsHiddenToOutput', neuralNetwork.weightsHiddenToOutput);
}
function classifyPoints(neuralNetwork) {
    console.log('classifyPoints');
    //console.log('weightsInputToHidden', neuralNetwork.weightsInputToHidden);
    //console.log('weightsHiddenToOutput', neuralNetwork.weightsHiddenToOutput);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawAxes();
    //this.points = [];
    var points = [];
    var numPoints = 33; //00
    //for (let i = 0; i < parseInt(document.querySelector('#numPoints').value); i++) {
    for (var i = 0; i < numPoints; i++) {
        var x = Math.random() * 2 - 1; // Random x-coordinate between -1 and 1
        var y = Math.random() * 2 - 1; // Random y-coordinate between -1 and 1
        //const output = neuralNetwork.feedForward([x, y]);
        //const predictedLabel: string = oneHotDecode(output);
        //drawPoint(x, y, predictedLabel);
        points.push({ x: x, y: y, label: '?' /*predictedLabel*/ });
    }
    for (var i = 0; i < numPoints; i++) {
        var output = neuralNetwork.findByPattern([points[i].x, points[i].y]);
        //console.log(i,output);
        var predictedLabel = oneHotDecode(output);
        points[i].label = predictedLabel;
    }
    console.log('points', points);
    //console.log(neuralNetwork.hiddenLayer);
}
function oneHotEncode(label) {
    var encoding = {
        blue: [1, 0, 0, 0],
        red: [0, 1, 0, 0],
        green: [0, 0, 1, 0],
        purple: [0, 0, 0, 1]
    };
    return encoding[label];
}
function oneHotDecode(output) {
    var labels = ["blue", "red", "green", "purple"];
    var maxIndex = output.indexOf(Math.max.apply(Math, output));
    return labels[maxIndex];
}
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}
//var hiddenNodes = 8;//parseInt(document.querySelector('#hiddenNodes').value);
//let inputSize = 2;
//let outputSize = 4;
//var neuralNetwork: NeuralNetwork;
var neuralNetwork = initialise(2, 8, 4);
train(neuralNetwork, createTrainingData(12345));
classifyPoints(neuralNetwork);
