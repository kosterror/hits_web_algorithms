const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const SIZE_WIDTH = 1200;
const SIZE_HEIGHT = 600;

canvas.width = SIZE_WIDTH;
canvas.height = SIZE_HEIGHT;


const VERTEX_RADIUS = 20;
const STROKE_WIDTH = 2;
const STROKE_COLOR = 'black';
const DEFAULT_FILL_COLOR = 'yellow'; //стандартный цвет, в который окрашивается вершина при создании, можно поменять
const EDGE_COLOR = 'blue';
const EDGE_WIDTH = 3;
const TIME_SLEEP_PATH = 50;
let TIME_SLEEP_RENDER;

let vertexList = []; //массив вершин
let adjMatrix = []; //матрица смежности
let activeMode = 0; //режим для взаимодействия с canvas


document.getElementById('canvas').addEventListener('click', handler);
document.getElementById('add_vertex').addEventListener('click', event => { activeMode = 1 });
document.getElementById('add_edjes').addEventListener('click', addEdgesWithWeight);
document.getElementById('remove_vertex').addEventListener('click', event => { activeMode = 3 });
document.getElementById('clear').addEventListener('click', () => { window.location.reload() }); // режим очистки поля
document.getElementById('start_algo').addEventListener('click', startAlgorithm);

class Vertex {
    constructor(x, y, name, number) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.number = number;
        this.color = DEFAULT_FILL_COLOR;
    }

    draw() {
        ctx.fillStyle = DEFAULT_FILL_COLOR;
        ctx.strokeStyle = STROKE_COLOR;
        ctx.lineWidth = STROKE_WIDTH;

        ctx.beginPath();
        ctx.arc(this.x, this.y, VERTEX_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        this.drawName();
    }

    redraw(fillColor) {
        this.color = fillColor;

        ctx.fillStyle = fillColor;
        ctx.strokeStyle = STROKE_COLOR;
        ctx.lineWidth = STROKE_WIDTH;

        ctx.beginPath();
        ctx.arc(this.x, this.y, VERTEX_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        this.drawName();
    }

    drawName() {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.font = 'bold ' + VERTEX_RADIUS + 'px sans-serif';

        ctx.beginPath();
        ctx.fillText(this.name, this.x, this.y);
        ctx.closePath();
    }
}

function handler(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    if (activeMode == 1) { //режим добавления вершин
        if (isCanAddVertex(x, y)) {
            vertexList.push(new Vertex(x, y, vertexList.length, vertexList.length));
            vertexList[vertexList.length - 1].draw();
            expandAdjMatrix();
        }

    } else if (activeMode == 2) { //режим добавления ребра 

        addEdgesWithWeight();

    } else if (activeMode == 3) { // режим удаления вершины

    }
}

function addEdgesWithWeight() {
    for (let i = 0; i < vertexList.length; i++) {
        for (let j = 0; j < vertexList.length; j++) {
            if (i != j && adjMatrix[i][j] == 0) {
                let weight_edge = calculateDistance(vertexList[i].x, vertexList[i].y, vertexList[j].x, vertexList[j].y);

                adjMatrix[vertexList[i].number][vertexList[j].number] = weight_edge;
                adjMatrix[vertexList[j].number][vertexList[i].number] = weight_edge;

                //далее рисуем ребро и вес ребра на ребре

                ctx.lineWidth = EDGE_WIDTH;

                ctx.beginPath();
                ctx.moveTo(vertexList[i].x, vertexList[i].y);
                ctx.lineTo(vertexList[j].x, vertexList[j].y);
                ctx.stroke();
                ctx.closePath();

                vertexList[i].draw();
                vertexList[j].draw();

                let x = vertexList[i].x + ((weight_edge / 2 * (vertexList[j].x - vertexList[i].x)) / weight_edge);
                let y = vertexList[i].y + ((weight_edge / 2 * (vertexList[j].y - vertexList[i].y)) / weight_edge);

                weight_edge = Math.round(weight_edge);

                ctx.beginPath();
                ctx.fillStyle = 'red';
                ctx.fillText(weight_edge, x, y);
                ctx.closePath();
            }
        }
    }
}

function isCanAddVertex(x, y) {
    if (x > VERTEX_RADIUS && x < SIZE_WIDTH - VERTEX_RADIUS && y > VERTEX_RADIUS && y < SIZE_HEIGHT - VERTEX_RADIUS) {
        let index = getNearestVertexIndex(x, y);

        if (index == -1) {
            return true;
        } else if (calculateDistance(vertexList[index].x, vertexList[index].y, x, y) > 2 * VERTEX_RADIUS) {
            return true;
        }
    }
    return false;
}

function getIndexHitVertex(x, y) {
    let index = getNearestVertexIndex(x, y);

    if (index != -1) {
        if (calculateDistance(vertexList[index].x, vertexList[index].y, x, y) < VERTEX_RADIUS) {
            return index; //попали по вершине
        } else {
            return -1; //не попали по вершине
        }
    } else {
        // пользователь не добавил ни одной вершины, но пытается что-то выбрать (наверное)
        return index;
    }
}

function getNearestVertexIndex(x, y) {
    let minDistance = -1;
    let index = -1;

    for (let i = 0; i < vertexList.length; i++) {
        let distance = calculateDistance(vertexList[i].x, vertexList[i].y, x, y);

        if (minDistance == -1) {
            index = i;
            minDistance = distance;
        } else if (distance < minDistance) {
            index = i;
            minDistance = distance;
        }
    }

    return index;
}

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function expandAdjMatrix() {
    //добавить вершину в матрицу смежности

    if (adjMatrix.length == 0) { //первая вершина
        adjMatrix.push([0]);
    } else {
        let newROW = new Array(adjMatrix.length);
        newROW.fill(0);
        adjMatrix.push(newROW);

        for (let i = 0; i < adjMatrix.length; i++) {
            adjMatrix[i].push(0);
        }
    }
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }


const MUTATION_PERCENTAGE = 90,
    COUNT_GENERATIONS = 500,
    START_VERTEX = 0;
let POPULATION_SIZE;
let population = [];

class Chromosome {
    constructor(chromosome, fitness) {
        this.chromosome = chromosome;
        this.fitness = fitness;
    }
}

function InitialPopulationGeneration() {
    let arr = [];

    for (let i = 0; i < vertexList.length; i++) {
        arr[i] = i;
    }
    population[0] = newChromosome(arr);

    while (arr != undefined) {
        let arr2 = arr.slice();

        population[population.length] = newChromosome(arr2);

        arr = permutation(arr2);
    }
    population.pop();
    POPULATION_SIZE = population.length;
    population.sort((a, b) => a.fitness - b.fitness); //отсортируем популяцию в порядке возрастания по приспособленности
}

function CrossingAlgorithm() {
    let chrom1 = population[getRandomInt(0, population.length)];
    let chrom2 = population[getRandomInt(0, population.length)];

    while (chrom1 == chrom2) {
        chrom1 = population[getRandomInt(0, population.length)];
        chrom2 = population[getRandomInt(0, population.length)];
    }

    let descendant1 = createDescendant(chrom1, chrom2) //формируем 1 потомка
    let descendant2 = createDescendant(chrom2, chrom1) //формируем 2 потомка

    MutationAlgorithm(descendant1, descendant2);
}

function MutationAlgorithm(descendant1, descendant2) {
    let num = getRandomInt(0, 101);

    if (num < MUTATION_PERCENTAGE) {
        let ind1 = getRandomInt(1, vertexList.length);
        let ind2 = getRandomInt(1, vertexList.length);

        while (ind1 == ind2) {
            ind1 = getRandomInt(1, vertexList.length);
            ind2 = getRandomInt(1, vertexList.length);
        }

        let tmp = ind1;
        descendant1.chromosome[ind1] = descendant2.chromosome[ind2];
        descendant2.chromosome[ind2] = descendant1.chromosome[tmp];
    }

    AddDescendantsToPopulation(descendant1, descendant2);
}

function AddDescendantsToPopulation(descendant1, descendant2) {
    population[population.length] = descendant1;
    population[population.length] = descendant2;

    population.sort((a, b) => a.fitness - b.fitness);

    let k = 0,
        t = population.length - POPULATION_SIZE;
    while (k < t) {
        population.pop();
        k++;
    }

    return population[0];
}

function newChromosome(mas) {
    fitness = 0;
    for (let i = 0; i < mas.length - 1; i++) {
        fitness += adjMatrix[mas[i]][mas[i + 1]];
    }
    fitness += adjMatrix[mas[0]][mas[mas.length - 1]];

    return new Chromosome(mas, fitness);
}

function permutation(arr) {
    let i = arr.length - 2;
    while (i != -1 && arr[i] >= arr[i + 1]) {
        i--;
    }

    if (i == -1) {
        return [];
    }

    let k = arr.length - 1;

    while (arr[i] >= arr[k]) {
        k--;
    }

    let tmp = arr[i];
    arr[i] = arr[k];
    arr[k] = tmp;

    let s = i + 1,
        e = arr.length - 1;

    while (s < e) {
        let t = arr[s];
        arr[s] = arr[e];
        arr[e] = t;

        s++;
    }

    if (arr[0] == 0) {
        return arr;
    }
}

function createDescendant(parent1, parent2) {
    let arr = [];
    let used_gene = [];
    let point_break = 2;

    for (let i = 0; i < vertexList.length; i++) {
        used_gene[i] = false;
    }

    for (let i = 0, k = 0; i < parent1.chromosome.length, k < used_gene.length; i++, k++) {
        if (i < point_break) {
            arr[k] = parent1.chromosome[i];
            used_gene[parent1.chromosome[i]] = true;

        } else {
            if (!used_gene[parent2.chromosome[i]]) {
                arr[k] = parent2.chromosome[i];
                used_gene[parent2.chromosome[i]] = true;
            } else {
                i--;
            }
        }
    }

    if (arr.length != vertexList.length) {
        for (let i = 0; i < parent1.chromosome.length; i++) {
            if (!used_gene[i]) {
                arr[arr.length] = i;
            }
        }
    }

    let descendant = newChromosome(arr);

    return descendant;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function startAlgorithm(event) {
    population = []; //при добавлении новых вершин обнуляем популяцию
    console.log(adjMatrix);
    InitialPopulationGeneration();

    let k = 0;
    while (k < COUNT_GENERATIONS) {
        let tmp = CrossingAlgorithm();

        if (tmp == population[0]) {
            k++;
        } else {
            edgeDelete();
            edgeDraw();
        }

        k++;

        //console.log(population[0]);
    }
    //alert("Найден кратчайший путь")
}

function edgeDelete() {
    ctx.clearRect(0, 0, SIZE_WIDTH, SIZE_HEIGHT);

    for (let i = 0; i < vertexList.length; i++) {
        vertexList[i].draw;
    }
}

async function edgeDraw() {
    for (let i = 0; i < population[0].chromosome.length; i++) {

        if (i == population[0].chromosome.length - 1) {
            ver_last = population[0].chromosome[population[0].chromosome.length - 1];
            ctx.lineWidth = EDGE_WIDTH + 2;
            ctx.beginPath();
            ctx.moveTo(vertexList[0].x, vertexList[0].y);
            ctx.lineTo(vertexList[ver_last].x, vertexList[ver_last].y);
            ctx.strokeStyle = "blue";
            ctx.stroke();
            ctx.closePath();

            for (let i = 0; i < vertexList.length; i++) {
                vertexList[i].draw();
            }

            break;
        }

        ver1 = population[0].chromosome[i];
        ver2 = population[0].chromosome[i + 1];

        ctx.lineWidth = EDGE_WIDTH + 2;
        ctx.beginPath();
        ctx.moveTo(vertexList[ver1].x, vertexList[ver1].y);
        ctx.lineTo(vertexList[ver2].x, vertexList[ver2].y);
        ctx.strokeStyle = "blue";
        ctx.stroke();
        ctx.closePath();

        for (let i = 0; i < vertexList.length; i++) {
            vertexList[i].draw();
        }

        let x = ver1.x + (((adjMatrix[ver1][ver2] / 2) * (ver2.x - ver1.x)) / adjMatrix[ver1][ver2]);
        let y = ver1.y + (((adjMatrix[ver1][ver2] / 2) * (ver2.y - ver1.y)) / adjMatrix[ver1][ver2]);

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.fillText(adjMatrix[ver1][ver2], x, y);
        ctx.closePath();

        await sleep(1000);
    }
}
