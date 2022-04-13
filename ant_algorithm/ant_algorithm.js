import { verticesList, activeMode } from "./main.js";
import updateRendering from "./render.js";

let adjMatrix;
let pheromonesMatrix;
let tabuMatrix;

let antsCount = 300;            //количество муравьев
let iterationsCount = 300;      //количество итераций
let pheromonesInitValue = 10;   //начальное значение феромонов на ребрах
let ALPHA = 1;  //коэффициент стадности муравьев
let BETA = 2.5; //коэффициент жадности муравьев
let RHO = 0.4;  //столько феромонов будет оставаться после испарение
let Q = 50;     //коэффициент, регулирующий, силу феромонов при распылении

//обертка для алгоритма
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

//алгоритм
async function antAlgorithm() {
    createAdjMatrix();
    createPheromonesMatrix();
    let minLengthPath = -1;
    let minPath;

    for (let i = 0; i < iterationsCount; i++) {
        createTabuMatrix();
        // let minLength;
        // let path;
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

//расстояние по пифагору
function calculateDistance(ver1, ver2) {
    return Math.sqrt(Math.pow(ver1.x - ver2.x, 2) + Math.pow(ver1.y - ver2.y, 2));
}

//считаем длину пути муравья antNumber, используем для этого матрицу запретов
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

//матрциа смежности, используем при каждом запуске алгоритма
function createAdjMatrix() {
    adjMatrix = new Array(verticesList.length);

    for (let i = 0; i < verticesList.length; i++) {
        adjMatrix[i] = new Array(verticesList.length);

        for (let j = 0; j < verticesList.length; j++) {
            adjMatrix[i][j] = i != j ? calculateDistance(verticesList[i], verticesList[j]) : 0;
        }
    }
}

//количество феромонов, которое оставит каждый муравей
function calculateDeltaPheromones(pathLengths) {    
    let delta = new Array(antsCount);

    for (let i = 0; i < antsCount; i++) {
        delta[i] = Q / pathLengths[i];
    }

    return delta;
}

//матрциа с феромонами
function createPheromonesMatrix() {
    pheromonesMatrix = new Array(verticesList.length);

    for (let i = 0; i < verticesList.length; i++) {
        pheromonesMatrix[i] = new Array(verticesList.length);

        for (let j = 0; j < verticesList.length; j++) {
            pheromonesMatrix[i][j] = i != j ? pheromonesInitValue : 0;
        }
    }
}

//матрица с посещенными вершинами, i-строка - список посещенных вершин i-го муравья
function createTabuMatrix() {
    tabuMatrix = new Array(antsCount);

    for (let i = 0; i < antsCount; i++) {
        tabuMatrix[i] = new Array(verticesList.length);
    }
}

//испарение феромонов, это происходит после каждой итерации алгоритма
function evaporationPheromones() {
    for (let i = 0; i < pheromonesMatrix.length; i++) {             //здесь проходимся
        for (let j = 0; j < pheromonesMatrix[i].length; j++) {      //по всем ребрам, кроме петель
            if (i != j) {
                pheromonesMatrix[i][j] = pheromonesMatrix[i][j] * RHO;  //испарили феромоны на ребре i-j, осталось RHO * 100 процентов, т.е. если RHO = 0.9, то останется 90% 
            }
        }
    }
}

//индекс следующей вершины, для конкретного муравья
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

//посстанавливаем путь по списки посещенных вершин (где-то это называется список запретов)
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

//индекс ячейки с минимальным значением массива 
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

//распыление феромонов на ребра (запускаем после каждой итерации алгоритма)
function sprayPheromones(pathLengths) {
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

//испарение и распыление феромонов
async function updatePheromones(pathLengths) {
    await evaporationPheromones();
    await sprayPheromones(pathLengths);
}

export default antAlgorithmWrapper;
