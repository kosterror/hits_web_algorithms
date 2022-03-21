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

    canRedraw(xPoint, yPoint, row, col) {
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

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = 1200;
const height = 600;

canvas.width = width;
canvas.height = height;

// let defaultColor = '#8D9091';
const colorWall = '#8D9091';
const colorRoad = '#1891AC';
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
let ROW = height / length - 1;
let COL = width / length - 1;
let radius = 20;
let padding = 2;
let activeMode = 0;     //текущий режим
//1 - лабиринт сгенерирован или не сгенерирован, кнопки не активированы
//данный режим включается после:
//генерации лабиринта
//запуска алгоритма
//паузы алгоритма
//отмены алгоритма
//выбора скорости 
//выбора размера поля
//2 - режим добавления стен
//3 - режим удаления стен
//4 - задать старт
//5 - задать финиш
//выбор размера карты и скорости не требует состояния, но после этих действий включается режим 0.


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
        if (matrixSquare[row][col].canRedraw(x, y, row, col)) {
            matrixSquare[row][col].draw(colorWall);
            //TO DO: прописать логику в матрице
        }
    }

    else if (activeMode === 3) {    //добавляем дорогу
        if (matrixSquare[row][col].canRedraw(x, y, row, col)) {
            matrixSquare[row][col].draw(colorRoad);
            //TO DO: прописать логику в матрице
        }
    }

    else if (activeMode === 4) {    //выбираем стартовую клетку
        if (matrixSquare[row][col].canRedraw(x, y, row, col)) {
            //TO DO: прописать логику в матрице
            matrixSquare[row][col].draw(colorRoad);

            let font = length / 2 + 'px s';

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'black'
            ctx.font = font;
            ctx.fillText('S', col * length + length / 2, row * length + length / 2);

            activeMode = 1;
        }
    }

    else if (activeMode === 5) {    //выбираем финишную клетку
        if (matrixSquare[row][col].canRedraw(x, y, row, col)) {
            //TO DO: прописать логику в матрице
            matrixSquare[row][col].draw(colorRoad);

            let font = length / 2 + 'px s';

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'black'
            ctx.font = font;
            ctx.fillText('F', col * length + length / 2, row * length + length / 2);

            activeMode = 1; //переключаем в стандартный режим
        }

    }
}

function generateMaze() {
    console.log(ROW + ' ' + COL);
    console.log(matrixSquare);



    activeMode = 1;
}

function fillWall() {
    matrixSquare = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        matrixSquare[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            matrixSquare[i][j] = new Square(j * length + length / 2, i * length + length / 2, length, radius, padding);
            matrixSquare[i][j].draw(colorWall);
        }
    }
    activeMode = 1;
}

function fillRoad() {
    matrixSquare = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        matrixSquare[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            matrixSquare[i][j] = new Square(j * length + length / 2, i * length + length / 2, length, radius, padding);
            matrixSquare[i][j].draw(colorRoad);
        }
    }
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