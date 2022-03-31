class Vertex {
    constructor(x, y, number) {
        this.x = x;
        this.y = y;
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

        this.drawNumber();
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

        this.drawNumber();
    }

    drawNumber() {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.font = 'bold ' + VERTEX_RADIUS + 'px sans-serif';

        ctx.beginPath();
        ctx.fillText(this.number, this.x, this.y);
        ctx.closePath();
    }

    remove (){
        ctx.fillStyle = 'aliceblue';

        
        ctx.beginPath();
        ctx.arc(this.x, this.y, VERTEX_RADIUS + VERTEX_RADIUS * 0.5, 0, 2 * Math.PI);   //стирает на 0.5 радиуса больше, чем надо
        ctx.fill();
        ctx.closePath();
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const SIZE_WIDTH = 1024;    //16*64     получается, что
const SIZE_HEIGHT = 576;    //9*64      соотношение 16/9, мб это хорошо
canvas.width = SIZE_WIDTH;
canvas.height = SIZE_HEIGHT;

const VERTEX_RADIUS = 20;
const STROKE_WIDTH = 2;         //толщина линии, которой рисуется вершина
const STROKE_COLOR = 'black';   //цвет линии, которой рисуется вершина
const DEFAULT_FILL_COLOR = 'yellow'; //цвет заливки вершины
const EDGE_COLOR = 'blue';          //цвет ребра
const EDGE_WIDTH = 5;               //толщина ребра
let DISTANCE_BETWEEN_VERTEX = 2;    //как много вершин могло бы поместиться между двумя ближайшими

let vertexList = [];
let adjMatrix = [];
let activeMode = 0;

document.getElementById('canvas').addEventListener('click', handler);
document.getElementById('add_vertex').addEventListener('click', () => { activeMode = 1 });
document.getElementById('delete_vertex').addEventListener('click', () => { activeMode = 2 });

function handler(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    if (activeMode == 1) {
        if (canAddVertex(x, y)) {
            vertexList.push(new Vertex(x, y, vertexList.length));
            vertexList[vertexList.length - 1].draw();
        }
    }

    else if (activeMode == 2) {
        let index = getIndexHitVertex(x, y);

        if (index != -1){
            removeVertex(index);
        }
    }
}

function getIndexHitVertex(x, y) {
    let index = getNearestVertexIndex(x, y);

    if (index != -1) {
        if (calculateDistance(vertexList[index].x, vertexList[index].y, x, y) < VERTEX_RADIUS) {
            return index;   //попали по вершине
        }
        else {
            return -1;      //не попали по вершине
        }
    }

    else {
        //эта ситуация должна появиться тогда и только тогда, когда пользователь не добавил ни одной вершины,
        //но он пытается что-то выбрать (наверное)
        return index;
    }
}

function canAddVertex(x, y) {
    if (x > VERTEX_RADIUS && x < SIZE_WIDTH - VERTEX_RADIUS && y > VERTEX_RADIUS && y < SIZE_HEIGHT - VERTEX_RADIUS) {
        let index = getNearestVertexIndex(x, y);

        if (index == -1) {
            return true;
        }

        else if (calculateDistance(vertexList[index].x, vertexList[index].y, x, y) > (2 * VERTEX_RADIUS + DISTANCE_BETWEEN_VERTEX * 2 * VERTEX_RADIUS)) {
            return true;
        }
    }
    return false;
}

function getNearestVertexIndex(x, y) {
    let minDistance = -1;
    let index = -1;

    for (let i = 0; i < vertexList.length; i++) {
        let distance = calculateDistance(vertexList[i].x, vertexList[i].y, x, y);

        if (minDistance == -1) {
            index = i;
            minDistance = distance;
        }

        else if (distance < minDistance) {
            index = i;
            minDistance = distance;
        }
    }

    return index;
}

function expandAdjMatrix() {
    if (adjMatrix.length == 0) { //первая вершина
        adjMatrix.push([0]);
    }

    else {
        let newROW = new Array(adjMatrix.length);
        newROW.fill(0);
        adjMatrix.push(newROW);

        for (let i = 0; i < adjMatrix.length; i++) {
            adjMatrix[i].push(0);
        }
    }
}

function renumberVertices() {
    for (let i = 0; i < vertexList.length; i++){
        vertexList[i].number = i;
        vertexList[i].draw(); 
    }
}

function removeVertex(index){
    vertexList[index].remove();
    vertexList.splice(index, 1);
    renumberVertices();
}

function calculateDistance(x1, y1, x2, y2) { return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)); }