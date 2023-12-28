

class Neuron {
    /* A neuron is a simple functional component of the deep neural net.
     * It is basically the eqn Z = Bias + W1X1 + W2X2 + …+ WnXn
     * These neurons in parallel make up a layer
    */
    constructor(numInputs) {
        this.weights = new Array(numInputs);
        this.bias = Math.random() * 2 - 1;
        for (let i = 0; i < numInputs; i++) {
            this.weights[i] = Math.random() * 2 - 1;
        }
    }

    forward(inputs) {
        let sum = 0;
        // Z = W1X1 + W2X2 + …+ WnXn
        for (let i = 0; i < inputs.length; i++) {
            sum += inputs[i] * this.weights[i];
        }
        // Y = relu(Z + b)
        return this.relu(sum + this.bias);
    }

    relu(x) {
        return Math.max(0, x)
    }
}

class Layer {
    constructor(numNeurons, numInputPerNeuron) {
        this.neurons = new Array(numNeurons);
        for (let i = 0; i < numNeurons; i++) {
            this.neurons[i] = new Neuron(numInputPerNeuron);
        }
    }

    forward(inputs) {
        let outputs = new Array(this.neurons.length);
        for (let i = 0; i < this.neurons.length; i++) {
            outputs[i] = this.neurons[i].forward(inputs)
        }
        return outputs
    }
}

class FNN {
    constructor(topology) {
        // FNN topology coding
        this.layers = new Array(topology.length - 1);
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i] = new Layer(topology[i+1], topology[i])
        }
    }

    saveModel(filename) {
        const fs = require('fs');
        let stringifiedMLP = JSON.stringify(this);
        
        fs.writeFile(filename, stringifiedMLP, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Model saves successfully');
        });
    }

    loadModel(filename) {
        const fs = require('fs');
        let data = fs.readFileSync(filename);
        let parsedData = JSON.parse(data);
        return parsedData;
    }

    train(inputs, targets) {
        // feed forward step of the FNN
        let outputs = [];
        for (let i = 0; i < this.layers.length; i++) {
            if (i === 0) {
                // First layer
                outputs[i] = this.layers[i].forward(inputs)
            } else {
                // successive layers
                outputs[i] = this.layers[i].forward(outputs[i - 1])
            }
        }
        
        // Error calculation
        let outputErrors = new Array(targets.length);
        for (let i = 0; i < targets.length; i++) {
            outputErrors[i] = targets[i] - outputErrors[outputs.length - 1][i];
        }

        for (let i = this.layers.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.layers[i].neurons.length; j++) {
                let neuron = this.layers[i].neurons[j];
                let error = 0;
                if (i === this.layers.length - 1) {
                    error = outputErrors[j];
                } else {
                    let nextLayerErrors = new Array(this.layers[i + 1].neurons.length);
                    for (let k = 0; k < this.layers[i + 1].neurons.length; k++) {
                        nextLayerErrors[k] = this.layers[i + 1].neurons[k].weights[j];
                    }
                    error = Neuron.relu(neuron.weights.dot(nextLayerErrors));
                }

                for (let k = 0; k < neuron.weights.length; k++) {
                    neuron.weights[k] += error * outputs[i - 1][k];
                }
                neuron.bias += error;
            }
        }
    }

    predict(inputs) {
        let outputs = [];
        for (let i = 0; i < this.layers.length; i++) {
            if (i == 0) {
                output[i] = this.layers[i].forward(inputs);
            } else {
                outputs[i] = this.layers[i].forward(outputs[i - 1]);
            }
        }

        return outputs[outputs.length - 1];
    }
}

function createFNN() {
    let trainingInputs = [];
    let trainingTargets = [];

    let topology = []
}