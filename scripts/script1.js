class Square {
    constructor(x, y, length, radius, padding) { //radius > padding!
        this.x = x;
        this.y = y;
        this.length = length;   //длина стороны квадрата
        this.radius = radius;   //чем вышем параметр, тем менее острые углы
        this.padding = padding; //отступ от квадратной клетки, которая могла быть нарисована с параметрами x, y, length
        this.color;
    }

    draw(fillColor) {
        ctx.fillStyle = fillColor;
        this.color = fillColor;

        ctx.clearRect(this.x, this.y, this.length, this.length);

        ctx.beginPath();

        ctx.arc(this.x + this.radius, this.y + this.radius, this.radius - this.padding, Math.PI, -Math.PI / 2);
        ctx.lineTo(this.x + this.length - this.radius - this.padding, this.y + this.padding);
        ctx.arc(this.x + this.length - this.radius, this.y + this.radius, this.radius - this.padding, -Math.PI / 2, 0);
        ctx.lineTo(this.x + this.length - this.padding, this.y + this.length - this.radius - this.padding);
        ctx.arc(this.x + this.length - this.radius, this.y + this.length - this.radius, this.radius - this.padding, 0, Math.PI / 2);
        ctx.lineTo(this.x + this.radius - this.padding, this.y + this.length - this.padding);
        ctx.arc(this.x + this.radius, this.y + this.length - this.radius, this.radius - this.padding, Math.PI / 2, Math.PI);
        ctx.lineTo(this.x + this.padding, this.y + this.radius - this.padding);
        ctx.fill();

        ctx.closePath();
    }

    isHitIcon(xPoint, yPoint, row, col) {
        //сам квадрат можно разбить на несколько фигур, которые пересекаются, но не выходят за пределы самого квадрата
        //так будет удобнее чтобы проверить входит ли в него какая-то точка или нет
        //фигуры: 4 окружности, 2 прямоугольника (вертикальный и горизонтальный)

        let outsideWall = {                 //координаты стен клетки, которую должен занимать этот квадрат без отступов и радиусов
            left: col * this.length,
            right: col * this.length + this.length,
            top: row * this.length,
            bottom: row * this.length + this.length,
        }

        let insideWall = {                  //координаты стен !закрашенного! квадрата, это стены с учетом padding (отступа) от занимаемой клетки
            left: outsideWall.left + this.padding,
            right: outsideWall.right - this.padding,
            top: outsideWall.top + this.padding,
            bottom: outsideWall.bottom - this.padding,
        };

        let circleOne = {                       //центр левой верхней окружности
            x: insideWall.left + this.radius,
            y: insideWall.top + this.radius,
        };

        let circleTwo = {                       //центр правой верхней окружности
            x: insideWall.right - this.radius,
            y: insideWall.top + this.radius,
        };

        let circleThree = {                     //центр правой нижней окружности                                    
            x: insideWall.right - this.radius,
            y: insideWall.bottom - this.radius,
        };

        let circleFour = {                     //центр левой нижней окружности
            x: insideWall.left + this.radius,
            y: insideWall.bottom - this.radius,
        };

        let isInsideCircleOne = Math.sqrt(Math.pow(circleOne.x - xPoint, 2) + Math.pow(circleOne.y - yPoint, 2)) <= this.radius;        //по теореме пифагора для каждой окружности проверяем
        let isInsideCircleTwo = Math.sqrt(Math.pow(circleTwo.x - xPoint, 2) + Math.pow(circleTwo.y - yPoint, 2)) <= this.radius;        //лежит ли точки в самой окружности
        let isInsideCircleThree = Math.sqrt(Math.pow(circleThree.x - xPoint, 2) + Math.pow(circleThree.y - yPoint, 2)) <= this.radius;
        let isInsideCircleFour = Math.sqrt(Math.pow(circleFour.x - xPoint, 2) + Math.pow(circleFour.y - yPoint, 2)) <= this.radius;

        let isInsideRec1 = (insideWall.left <= xPoint) && (xPoint <= insideWall.right) && (insideWall.top + this.radius <= yPoint) && (yPoint <= insideWall.bottom - this.radius); //лежит ли точка в первой прямоугольника 
        let isInsideRec2 = (insideWall.left + this.radius <= xPoint) && (xPoint <= insideWall.right - this.radius) && (insideWall.top <= yPoint) && (yPoint <= insideWall.bottom); //лежит ли точка во второгом прямоугольнике

        // console.log(isInsideCircleOne);
        // console.log(isInsideCircleTwo);
        // console.log(isInsideCircleThree);
        // console.log(isInsideCircleFour);

        if (isInsideRec1 || isInsideRec2 || isInsideCircleOne || isInsideCircleTwo || isInsideCircleThree || isInsideCircleFour) {
            return true;    //достаточно, чтобы точка лежала в каком-либо тряугольника или в какой-либо окружности
        }

        else {
            return false;
        }
    }
}

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = 1200;
const height = 600;

canvas.width = width;
canvas.height = height;

// ctx.beginPath();
// ctx.fillRect(0, 0, 100, 100);
// ctx.closePath();

const colorWall = '#51585a';
const colorRoad = '#bbc6ca';
const colorBackground = 'aliceblue';

let start = {
    row: -1,
    col: -1,
    isInit: false,
};

let finish = {
    col: -1,
    row: -1,
    isInit: false
};

let length = 100;       //длина стороны квадрата
let matrixNumber;       //двумерный массив, на котором будет работать алгоритм
let matrixSquare;       //двумерный массив, в котором будут хранится квадраты
let matrixIsVisited;
let matrixDistanceFromStart;
let ROW = height / length - 1;
let COL = width / length - 1;
let radius = 20;
let padding = 2;
let activeMode = 0;     //текущий режим

canvas.addEventListener('click', handler);
generate.addEventListener('click', generateMaze);
fillwall.addEventListener('click', fillWall);
fillroad.addEventListener('click', fillRoad);
addwall.addEventListener('click', addWall);
addroad.addEventListener('click', addRoad);
changestart.addEventListener('click', changeStart);
changefinish.addEventListener('click', changeFinish);
changesize50.addEventListener('click', changeSize50);
changesize75.addEventListener('click', changeSize75);
changesize100.addEventListener('click', changeSize100);
changesize150.addEventListener('click', changeSize150);
launch.addEventListener('click', aStar);

function handler(event) {
    const x = event.offsetX - length / 2;
    const y = event.offsetY - length / 2;

    let col = Math.trunc(x / length);   //чтобы понять попали ли мы в сам квадрат: надо понять в каком квадрате надо искать попадание
    let row = Math.trunc(y / length);   //для найдем единственные возможные row и col для матрицы
    if (activeMode === 1) {
        //затычка
        //можно печатать текст с призывом пользователя к выбору чего-либо
    }

    if (activeMode === 2) {    //добавляем стену
        if (matrixSquare[row][col].isHitIcon(x, y, row, col)) {
            matrixNumber[row][col] = -1;
            matrixSquare[row][col].draw(colorWall);
        }
    }

    else if (activeMode === 3) {    //добавляем дорогу
        if (matrixSquare[row][col].isHitIcon(x, y, row, col)) {
            matrixNumber[row][col] = 0;
            matrixSquare[row][col].draw(colorRoad);
        }
    }

    else if (activeMode === 4) {    //выбираем стартовую клетку
        if (matrixSquare[row][col].isHitIcon(x, y, row, col)) {
            defineStart(row, col);
            activeMode = 4;
        }
    }

    else if (activeMode === 5) {    //выбираем финишную клетку
        if (matrixSquare[row][col].isHitIcon(x, y, row, col)) {
            defineFinish(row, col);

            activeMode = 5;
        }
    }
}

function findHeuristicDistance(cell) {
    return Math.abs(finish.row - cell.row) + Math.abs(finish.col - cell.col);
}

function calculateF(cell) {
    return findHeuristicDistance(cell) + matrixDistanceFromStart[cell.row][cell.col];
}

function getIndex(list) {
    let index = -1;
    let minF = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < list.length; i++) {
        if (calculateF(list[i]) < minF) {
            minF = calculateF(list[i]);
            index = i;
        }
    }

    return index;
}

function isValidCell(cell) {
    return (0 <= cell.row && cell.row < ROW && 0 <= cell.col && cell.col < COL) ? true : false;
}

function aStar() {
    // alert('Ой, поиска нет...');
    //рассчитываем, что старт и финиш инициализированы
    //также в листе будут только дороги, не стены

    let list = [new Cell(start.row, start.col)];
    let isFinish = false;
    // let counter = 0;
    while (!isFinish && list.length > 0) {

        let index = getIndex(list);
        let currentCell = list[index];
        list.splice(index, 1);

        let neighbors = [new Cell(currentCell.row - 1, currentCell.col), new Cell(currentCell.row, currentCell.col + 1), new Cell(currentCell.row + 1, currentCell.col), new Cell(currentCell.row, currentCell.col - 1)];

        for (let i = 0; i < 4; i++) {
            if (neighbors[i].row == finish.row && neighbors[i].col == finish.col) {
                matrixParents[neighbors[i].row][neighbors[i].col] = currentCell;
                isFinish = true;
            }

            if (isValidCell(neighbors[i])) {
                if (matrixNumber[neighbors[i].row][neighbors[i].col] == 0) {    //условие на проверку отсутствия стены
                    if (!matrixIsVisited[neighbors[i].row][neighbors[i].col]) {
                        matrixIsVisited[neighbors[i].row][neighbors[i].col] = true;
                        matrixDistanceFromStart[neighbors[i].row][neighbors[i].col] = matrixDistanceFromStart[currentCell.row][currentCell.col] + 1;
                        matrixParents[neighbors[i].row][neighbors[i].col] = currentCell;
                        list.push(neighbors[i]);
                    }
                }
            }
        }
    }

    matrixSquare[finish.row][finish.col].draw(isFinish ? 'yellow' : 'black');

}

function generateMaze() {
    createNumberMaze();
    createMatrixSquare();
    createSupportingMatrix();
    drawMatrixSquare();

    defineStart(0, 0);
    defineFinish(ROW - 1, COL - 1);

    activeMode = 1;
}

function createSupportingMatrix() {
    matrixDistanceFromStart = Array(ROW);
    matrixIsVisited = new Array(ROW);
    matrixParents = new Array(ROW);

    for (let i = 0; i < ROW; i++) {
        matrixDistanceFromStart[i] = Array(COL);
        matrixIsVisited[i] = Array(COL);
        matrixParents[i] = new Array(COL);

        for (let j = 0; j < COL; j++) {
            matrixDistanceFromStart[i][j] = 0;
            matrixIsVisited[i][j] = false;
            matrixParents[i] = new Cell(-1, -1);
        }
    }
}

function createNumberMaze() {
    createMatrixNumber(-1);

    let result = (ROW + 1) * (COL + 1) / 4;
    let counter = 0;

    rubber = {
        x: 0,
        y: 0,
    }

    while (counter != result) {
        let openDirection = [rubber.y > 0, rubber.x < COL - 1, rubber.y < ROW - 1, rubber.x > 0];
        let direction;

        while (true) {   //таким образом мы никогда не отправимся за границы матрицы
            direction = getDirection();
            if (openDirection[direction] == true) {
                break;
            }
        }

        rubber.x = rubber.x + 2 * (direction == 1) - 2 * (direction == 3);
        rubber.y = rubber.y - 2 * (direction == 0) + 2 * (direction == 2);

        if (matrixNumber[rubber.y][rubber.x] == -1) {
            matrixNumber[rubber.y][rubber.x] = 0;
            matrixNumber[rubber.y + 1 * (direction == 0) - 1 * (direction == 2)][rubber.x - 1 * (direction == 1) + 1 * (direction == 3)] = 0;
            counter++;
        }
    }
}

function createMatrixNumber(value) {
    matrixNumber = new Array(ROW);

    for (let i = 0; i < ROW; i++) {
        matrixNumber[i] = new Array(COL);

        for (let j = 0; j < COL; j++) {
            matrixNumber[i][j] = value;
        }
    }
}

function createMatrixSquare() {
    matrixSquare = new Array(ROW);

    for (let i = 0; i < ROW; i++) {
        matrixSquare[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            matrixSquare[i][j] = new Square(length * (j + 0.5), length * (i + 0.5), length, radius, padding);
        }
    }
}

function drawMatrixSquare() {
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            if (matrixNumber[i][j] == -1) {
                matrixSquare[i][j].draw(colorWall);
            }

            else if (matrixNumber[i][j] == 0) {
                matrixSquare[i][j].draw(colorRoad);
            }

            else {
                console.log('Ошибочка вышла, непонятное состояние клетки, это не стена и не дорога');
            }
        }
    }
}

function drawLetter(row, col, letter) {
    // matrixSquare[row][col].draw(colorRoad);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black'
    ctx.font = length / 2 + 'px s';
    ctx.fillText(letter, (col + 1) * length, (row + 1) * length);
}

function drawStart() {
    if (start.isInit) {
        matrixSquare[start.row][start.col].draw(colorRoad);
        drawLetter(start.row, start.col, 'S');
    }
    else {
        console.log('Ошибка, старт не инициализирован, но ты хочешь его нарисовать');
    }
}

function drawFinish() {
    if (finish.isInit) {
        matrixSquare[finish.row][finish.col].draw(colorRoad);
        drawLetter(finish.row, finish.col, 'F');
    }
    else {
        console.log('Ошибка, финиш не инициализирован, но ты хочешь его нарисовать');
    }
}

function defineStart(row, col) {
    resetStart();

    start.row = row;
    start.col = col;
    start.isInit = true;

    drawStart();
}

function defineFinish(row, col) {
    resetFinish();

    finish.row = row;
    finish.col = col;
    finish.isInit = true;

    drawFinish();
}

function resetStart(isNewMap) {
    if (isNewMap && start.isInit) {
        matrixSquare[start.row][start.col].draw(colorBackground);
    }
    else {
        if (start.isInit) {
            matrixNumber[start.row][start.col] = 0;
            matrixSquare[start.row][start.col].draw(colorRoad);
        }
    }
    start.col = -1;
    start.row = -1;
    start.isInit = false;
}

function resetFinish(isNewMap) {
    if (isNewMap && finish.isInit) {
        matrixSquare[finish.row][finish.col].draw(colorBackground);
    }
    else {
        if (finish.isInit) {
            matrixNumber[finish.row][finish.col] = 0;
            matrixSquare[finish.row][finish.col].draw(colorRoad);
        }
    }
    finish.col = -1;
    finish.row = -1;
    finish.isInit = false;
}

function getDirection() {
    return Math.floor(Math.random() * 4);
}

function fillWall() {
    resetStart(true);
    resetFinish(true);

    createMatrixNumber(-1);
    createMatrixSquare();

    drawMatrixSquare();

    activeMode = 1;
}

function fillRoad() {
    resetStart(true);
    resetFinish(true);

    createMatrixNumber(0);
    createMatrixSquare();

    drawMatrixSquare();

    activeMode = 1;
}

function addWall() {
    activeMode = 2;
}

function addRoad() {
    activeMode = 3;
}

function changeStart() {
    activeMode = 4;
}

function changeFinish() {
    activeMode = 5;
}

function changeSize50() {
    length = 50;
    COL = width / length - 1;
    ROW = height / length - 1;
    radius = 10;
    padding = 1.5;
    ctx.clearRect(0, 0, width, height);
}

function changeSize75() {
    length = 75;
    COL = width / length - 1;
    ROW = height / length - 1;
    radius = 15;
    padding = 3;
    ctx.clearRect(0, 0, width, height);
}

function changeSize100() {
    length = 100;
    COL = width / length - 1;
    ROW = height / length - 1;
    radius = 20;
    padding = 5;
    ctx.clearRect(0, 0, width, height);
}

function changeSize150() {
    length = 150;
    COL = width / length - 1;
    ROW = height / length - 1;
    radius = 25;
    padding = 5;
    ctx.clearRect(0, 0, width, height);
}