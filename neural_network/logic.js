let countLayers;
let layers;
let weights;
let layersSize;
let error;
//import { Weights } from "../scripts/NN/data_weights.js";

initNN();
function initNN() {
    countLayers = 3;
    layers = new Array(countLayers);
    weights = getWeight();
    error = new Array(countLayers-1);
    layersSize = [28*28 , 48, 10];
    for(var i = 0; i<countLayers; i++) {
        layers[i] = new Array(layersSize[i]);
        for(var j = 0; j<layersSize[i]; j++) {
            layers[i][j] = 0;
        }

        if(i<countLayers-1) {
            error[i] = new Array(layersSize[i+1]);
            for(var j = 0; j<layersSize[i+1]; j++) {
                error[i][j] = 0;
            }
        }
    }

}

function makeGuess(input) {
    var k = 0;
    for(var i = 0; i<input.length; i+=2) {
        for(var j = 0; j<input[i].length; j+=2) {
            layers[0][k] = (input[i][j] + input[i+1][j] + input[i][j+1] + input[i+1][j+1])/4;
            k++;
        }
    }

    for(var i = 1; i<countLayers; i++) {
        for(var j = 0; j<layersSize[i]; i++) {
            layers[i][j] = 0;
        }
    }

    forwardFeed()
    var max = -1;
    var answer;
    for(var i = 0; i<layersSize[countLayers-1]; i++) {
        if(max<layers[countLayers-1][i]) {
            max = layers[countLayers-1][i];
            answer = i;
        }
    }
    return answer;
}

function forwardFeed() {
    for(var i = 1; i<countLayers; i++) {
        for(var j = 0; j<layersSize[i]; j++) {
            for(var k = 0; k<layersSize[i-1]; k++) {
                layers[i][j] += layers[i-1][k]*weights[i-1][k][j];
            }
            layers[i][j] = activateFun(layers[i][j]);
        }
    }
}

function activateFun(num) {
    return 1/(1 + Math.exp(-num));
}

