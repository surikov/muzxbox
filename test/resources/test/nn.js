//https://dev.to/grahamthedev/a-noob-learns-ai-my-first-neural-networkin-vanilla-jswith-no-libraries-1f92#the-demo
var NeuralNetwork = /** @class */ (function () {
    function NeuralNetwork(inputLayerSize, hiddenLayerSize, outputLayerSize) {
        this.inputSize = inputLayerSize;
        this.hiddenSize = hiddenLayerSize;
        this.outputSize = outputLayerSize;
        this.weightsInputToHidden = this.create2DRandom(this.inputSize, this.hiddenSize);
        this.weightsHiddenToOutput = this.create2DRandom(this.hiddenSize, this.outputSize);
        this.biasOutput = this.createArrayZero(this.outputSize);
        this.biasHidden = this.createArrayZero(this.hiddenSize);
    }
    NeuralNetwork.prototype.findByPattern = function (inputs) {
        var hiddenLayer = new Array(this.hiddenSize);
        for (var hh = 0; hh < this.hiddenSize; hh++) {
            hiddenLayer[hh] = 0;
            for (var ii = 0; ii < this.inputSize; ii++) {
                hiddenLayer[hh] = hiddenLayer[hh] + this.weightsInputToHidden[hh][ii] * inputs[ii];
            }
            hiddenLayer[hh] = hiddenLayer[hh] + this.biasHidden[hh];
            hiddenLayer[hh] = this.sigmoid(hiddenLayer[hh]);
        }
        var output = new Array(this.outputSize);
        for (var oo = 0; oo < this.outputSize; oo++) {
            output[oo] = 0;
            for (var hh = 0; hh < this.hiddenSize; hh++) {
                output[oo] = output[oo] + this.weightsHiddenToOutput[oo][hh] * hiddenLayer[hh];
            }
            output[oo] = output[oo] + this.biasOutput[oo];
            output[oo] = this.sigmoid(output[oo]);
        }
        return output;
    };
    NeuralNetwork.prototype.singleTrain = function (learningRate, inputs, righrAnswer) {
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
            hiddenLayer[hh] = this.sigmoid(hiddenLayer[hh]);
        }
        for (var oo = 0; oo < this.outputSize; oo++) {
            output[oo] = 0;
            for (var hh = 0; hh < this.hiddenSize; hh++) {
                output[oo] = output[oo] + this.weightsHiddenToOutput[oo][hh] * hiddenLayer[hh];
            }
            output[oo] = output[oo] + this.biasOutput[oo];
            output[oo] = this.sigmoid(output[oo]);
        }
        for (var oo = 0; oo < this.outputSize; oo++) {
            errorsOutput[oo] = righrAnswer[oo] - output[oo];
            for (var hh = 0; hh < this.hiddenSize; hh++) {
                this.weightsHiddenToOutput[oo][hh] = this.weightsHiddenToOutput[oo][hh] + learningRate * errorsOutput[oo] * output[oo] * (1 - output[oo]) * hiddenLayer[hh];
            }
            this.biasOutput[oo] = this.biasOutput[oo] + learningRate * errorsOutput[oo];
        }
        for (var hh = 0; hh < this.hiddenSize; hh++) {
            errorsHidden[hh] = 0;
            for (var oo = 0; oo < this.outputSize; oo++) {
                errorsHidden[hh] = errorsHidden[hh] + this.weightsHiddenToOutput[oo][hh] * errorsOutput[oo];
            }
            this.biasHidden[hh] = this.biasHidden[hh] + learningRate * errorsHidden[hh];
            for (var ii = 0; ii < this.inputSize; ii++) {
                this.weightsInputToHidden[hh][ii] = this.weightsInputToHidden[hh][ii] + learningRate * errorsHidden[hh] * hiddenLayer[hh] * (1 - hiddenLayer[hh]) * inputs[ii];
            }
        }
    };
    NeuralNetwork.prototype.createArrayZero = function (size) {
        var arr = [];
        for (var ii = 0; ii < size; ii++) {
            arr[ii] = 0;
        }
        return arr;
    };
    NeuralNetwork.prototype.create2DRandom = function (size1, size2) {
        var arr = [];
        for (var s2 = 0; s2 < size2; s2++) {
            arr[s2] = [];
            for (var s1 = 0; s1 < size1; s1++) {
                arr[s2][s1] = Math.random() * 2 - 1;
            }
        }
        return arr;
    };
    NeuralNetwork.prototype.sigmoid = function (x) {
        return 1 / (1 + Math.exp(-x));
    };
    return NeuralNetwork;
}());
var NNTester = /** @class */ (function () {
    function NNTester() {
        var neuralNetwork = this.initialise(2, 8, 4);
        var data = this.createTrainingData(12345);
        this.train(0.03, neuralNetwork, data);
        this.classifyPoints(neuralNetwork);
    }
    NNTester.prototype.initialise = function (inputSize, hiddenNodesCount, outputSize) {
        console.log("initialise", inputSize, hiddenNodesCount, outputSize);
        var neuralNetwork = new NeuralNetwork(inputSize, hiddenNodesCount, outputSize);
        return neuralNetwork;
    };
    NNTester.prototype.createTrainingData = function (numDataPoints) {
        var trainingData = [];
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
    };
    NNTester.prototype.train = function (learningRate, neuralNetwork, trainingData) {
        console.log('train');
        var trainingIterations = 3210;
        for (var i = 0; i < trainingIterations; i++) {
            var data = trainingData[Math.floor(Math.random() * trainingData.length)];
            neuralNetwork.singleTrain(learningRate, [data.x, data.y], this.oneHotEncode(data.label));
        }
        //console.log('weightsInputToHidden', neuralNetwork.weightsInputToHidden);
        //console.log('weightsHiddenToOutput', neuralNetwork.weightsHiddenToOutput);
    };
    NNTester.prototype.classifyPoints = function (neuralNetwork) {
        console.log('classifyPoints');
        var points = [];
        var numPoints = 33; //00
        for (var i = 0; i < numPoints; i++) {
            var x = Math.random() * 2 - 1; // Random x-coordinate between -1 and 1
            var y = Math.random() * 2 - 1; // Random y-coordinate between -1 and 1
            points.push({ x: x, y: y, label: '?' /*predictedLabel*/ });
        }
        for (var i = 0; i < numPoints; i++) {
            var output = neuralNetwork.findByPattern([points[i].x, points[i].y]);
            var predictedLabel = this.oneHotDecode(output);
            points[i].label = predictedLabel;
        }
        console.log('points', points);
    };
    NNTester.prototype.oneHotEncode = function (label) {
        var encoding = {
            blue: [1, 0, 0, 0],
            red: [0, 1, 0, 0],
            green: [0, 0, 1, 0],
            purple: [0, 0, 0, 1]
        };
        return encoding[label];
    };
    NNTester.prototype.oneHotDecode = function (output) {
        var labels = ["blue", "red", "green", "purple"];
        var maxIndex = output.indexOf(Math.max.apply(Math, output));
        return labels[maxIndex];
    };
    return NNTester;
}());
var Tester2 = /** @class */ (function () {
    function Tester2() {
        console.log('Tester2');
    }
    return Tester2;
}());
//new NNTester();
new Tester2();
