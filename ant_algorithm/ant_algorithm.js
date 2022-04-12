import { verticesList, activeMode } from "./main.js";
import updateRendering from "./render.js";

let adjMatrix;
let pheromonesMatrix;
let tabuMatrix;

let antsCount = 100;
let iterationsCount = 1000;
let pheromonesInitValue = 0.2;
let ALPHA = 1;
let BETA = 1;
let RHO = 0.64;
let Q = 1;

async function antAlgorithmWrapper() {
    if (verticesList.length < 2) {
        alert('Необходимо добавить хотя бы две вершины');
        activeMode.value = 0;
    }

    else {
        await antAlgorithm();
        activeMode.value = 0;
    }
}

async function antAlgorithm() {
    createAdjMatrix();
    createPheromonesMatrix();
    let minLengthPath = -1;
    let minPath;

    for (let i = 0; i < iterationsCount; i++) {
        createTabuMatrix();
        let minLength;
        let path;
        let pathLengths = new Array(antsCount);

        for (let antNumber = 0; antNumber < antsCount; antNumber++) {
            let currentVertex = 0;
            let counter = 0;

            while (counter != verticesList.length) {
                tabuMatrix[antNumber][counter] = currentVertex;
                currentVertex = getIndexNextVertex(currentVertex, antNumber);
                counter++;
            }
            pathLengths[antNumber] = calcluatePathLenght(antNumber);
        }

        updatePheromones(pathLengths);

        let indexMinLength = getIndexMinLength(pathLengths);

        if (minLengthPath == -1 || pathLengths[indexMinLength] < minLengthPath) {
            minLengthPath = pathLengths[indexMinLength];
            minPath = getPath(tabuMatrix[indexMinLength]);
            updateRendering(verticesList, minPath, false);
            await sleep(100);
        }
    }
    updateRendering(verticesList, minPath, true);
}

function calculateDistance(ver1, ver2) {
    return Math.sqrt(Math.pow(ver1.x - ver2.x, 2) + Math.pow(ver1.y - ver2.y, 2));
}

function calcluatePathLenght(antNumber) {
    let length = 0;

    let currentVertex = 0;
    let nextVertex = -1;

    for (let i = 1; i < tabuMatrix[antNumber].length; i++) {
        nextVertex = tabuMatrix[antNumber][i];
        length += adjMatrix[currentVertex][nextVertex];
        currentVertex = nextVertex;
    }

    length += adjMatrix[currentVertex][0];

    return length;
}

function createAdjMatrix() {
    adjMatrix = new Array(verticesList.length);

    for (let i = 0; i < verticesList.length; i++) {
        adjMatrix[i] = new Array(verticesList.length);

        for (let j = 0; j < verticesList.length; j++) {
            adjMatrix[i][j] = i != j ? calculateDistance(verticesList[i], verticesList[j]) : 0;
        }
    }
}

function calculateDeltaPheromones(pathLengths) {
    let delta = new Array(antsCount);

    for (let i = 0; i < antsCount; i++) {
        delta[i] = Q / pathLengths[i];
    }

    return delta;
}

function createPheromonesMatrix() {
    pheromonesMatrix = new Array(verticesList.length);

    for (let i = 0; i < verticesList.length; i++) {
        pheromonesMatrix[i] = new Array(verticesList.length);

        for (let j = 0; j < verticesList.length; j++) {
            pheromonesMatrix[i][j] = i != j ? pheromonesInitValue : 0;
        }
    }
}

function createTabuMatrix() {
    tabuMatrix = new Array(antsCount);

    for (let i = 0; i < antsCount; i++) {
        tabuMatrix[i] = new Array(verticesList.length);
    }
}

function evaporationPheromones() {
    //испарение феромонов 
    for (let i = 0; i < pheromonesMatrix.length; i++) {             //здесь проходимся
        for (let j = 0; j < pheromonesMatrix[i].length; j++) {      //по всем ребрам, кроме петель
            if (i != j) {
                pheromonesMatrix[i][j] = pheromonesMatrix[i][j] * RHO;  //испарили феромоны на ребре i-j, осталось RHO * 100 процентов, т.е. если RHO = 0.9, то останется 90% 
            }
        }
    }
}

function getIndexNextVertex(currentVertex, antNumber) {
    let possibleNextVertices = [];

    for (let i = 1; i < verticesList.length; i++) {
        if (!tabuMatrix[antNumber].includes(i)) {
            possibleNextVertices.push(i);
        }
    }

    if (possibleNextVertices.length == 0) { return 0 };

    let probability = new Array(possibleNextVertices.length);
    let numerator = new Array(possibleNextVertices.length);
    let denominator = 0;

    for (let k = 0; k < possibleNextVertices.length; k++) {

        let nextVertex = possibleNextVertices[k];
        let f = Math.pow(pheromonesMatrix[currentVertex][nextVertex], ALPHA);    //чисто воспользовался 
        let l = Math.pow(1 / (adjMatrix[currentVertex][nextVertex]), BETA);   //формулой с википедии

        numerator[k] = f * l;
        denominator += f * l;
    }

    for (let k = 0; k < probability.length; k++) {
        probability[k] = numerator[k] / denominator;     //вероятность выбора ребра currentVertex-possibleNextVertices[k]

    }

    let currentSum = probability[0];
    let randomNum = Math.random();

    for (let i = 1; i < probability.length; i++) {
        if (currentSum >= randomNum) {
            return possibleNextVertices[i - 1];
        }
        currentSum += probability[i];
    }
    return possibleNextVertices[possibleNextVertices.length - 1];
}

function getPath(tabuList) {
    let currentVertex = 0;
    let nextVertex = 0;
    let path = [];

    for (let i = 1; i < tabuList.length; i++) {
        nextVertex = tabuList[i];
        path.push({ start: currentVertex, finish: nextVertex });
        currentVertex = nextVertex;
    }
    path.push({ start: currentVertex, finish: 0 });
    return path;
}

function getIndexMinLength(pathLengths) {
    let index = -1;

    for (let i = 0; i < pathLengths.length; i++) {
        if (index == -1) {
            index = i;
        }
        if (pathLengths[i] < pathLengths[index]) {
            index = i;
        }
    }

    return index;
}

async function sprayPheromones(pathLengths) {
    let deltaList = calculateDeltaPheromones(pathLengths);

    for (let antNumber = 0; antNumber < antsCount; antNumber++) {       //проходимся по всем муравьям
        let currentVertex = 0;
        let nextVertex = -1;

        for (let j = 1; j < tabuMatrix[antNumber].length; j++) {
            nextVertex = tabuMatrix[antNumber][j];
            pheromonesMatrix[currentVertex][nextVertex] += deltaList[antNumber];
            currentVertex = nextVertex;
        }
        pheromonesMatrix[currentVertex][0] += deltaList[antNumber];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updatePheromones(pathLengths) {
    evaporationPheromones();
    sprayPheromones(pathLengths);
}

export default antAlgorithmWrapper;