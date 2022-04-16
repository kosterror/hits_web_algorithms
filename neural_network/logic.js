let countLayers;
let layers;
let weights;
let layersSize;

initNN();
function initNN() {
    countLayers = 3;
    layers = new Array(countLayers);
    weights = getWeight();
    layersSize = [28*28 , 48, 10];
    for(let i = 0; i<countLayers; i++) {
        layers[i] = new Array(layersSize[i]);
    }
    clearMatrix(layers);
}

function clearMatrix(matrix) {
    for(let i = 0; i<matrix.length; i++) {
        for(let j = 0; j<matrix[i].length; j++) {
            matrix[i][j] = 0;
        }
    }
    return matrix;
}

function makeGuess(input) {
    let k = 0;
    clearMatrix(layers);
    for(let i = 0; i<input.length; i+=2) {
        for(let j = 0; j<input[i].length; j+=2) {
            layers[0][k] = (input[i][j] + input[i+1][j] + input[i][j+1] + input[i+1][j+1])/4;
            k++;
        }
    }

    forwardFeed()

    let max = -1;
    let answer;
    for(let i = 0; i<layersSize[countLayers-1]; i++) {
        if(max<layers[countLayers-1][i]) {
            max = layers[countLayers-1][i];
            answer = i;
        }
    }
    return answer;
}

function forwardFeed() {
    for(let i = 1; i<countLayers; i++) {
        for(let j = 0; j<layersSize[i]; j++) {
            for(let k = 0; k<layersSize[i-1]; k++) {
                layers[i][j] += layers[i-1][k]*weights[i-1][k][j];
            }
            layers[i][j] = activateFun(layers[i][j]);
        }
    }
}

function activateFun(num) {
    return 1/(1 + Math.exp(-num));
}