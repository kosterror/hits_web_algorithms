class Circle {
    constructor(xPoint, yPoint, radius) {
        this.xPoint = xPoint;
        this.yPoint = yPoint;
        this.radius = radius;
    }

    draw(fillColor, strokeColor, doFill, doStroke, lineWidth) {
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.arc(this.xPoint, this.yPoint, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();

        if (doFill) {
            ctx.fill();
        }

        if (doStroke) {
            ctx.stroke();
        }
    }
}

class Square {
    constructor(x, y, length, padding, radius) {
        this.x = x;
        this.y = y;
        this.length = length;   //длина стороны квадрата
        this.padding = padding; //отступ от квадратной клетки, которая могла быть нарисована с параметрами x, y, length
        this.radius = radius;   //чем вышем параметр, тем менее острые углы
    }

    draw(fillColor, strokeColor, doFill, doStroke, lineWidth) {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(this.x + this.radius, this.y + this.radius, this.radius - this.padding, Math.PI, -Math.PI / 2);
        ctx.lineTo(this.x + this.length - this.radius - this.padding, this.y + this.padding);
        ctx.arc(this.x + this.length - this.radius, this.y + this.radius, this.radius - this.padding, -Math.PI / 2, 0);
        ctx.lineTo(this.x + this.length - this.padding, this.y + this.length - this.radius - this.padding);
        ctx.arc(this.x + this.length - this.radius, this.y + this.length - this.radius, this.radius - this.padding, 0, Math.PI / 2);
        ctx.lineTo(this.x + this.radius - this.padding, this.y + this.length - this.padding);
        ctx.arc(this.x + this.radius, this.y + this.length - this.radius, this.radius - this.padding, Math.PI / 2, Math.PI);
        ctx.lineTo(this.x + this.padding, this.y + this.radius - this.padding);
        ctx.closePath();

        if (doFill) {   //заполняем
            ctx.fill();
        }

        if (doStroke) { //обводим
            ctx.stroke();
        }

    }

    isInside(xPoint, yPoint, row, col) {

        let outsideWall = {                 //координаты стен клетки
            left: col * this.length,
            right: col * this.length + this.length,
            top: row * this.length,
            bottom: row * this.length + this.length,
        }

        let insideWall = {                  //координаты стен !закрашенного! квадрата
            left: outsideWall.left + this.padding,
            right: outsideWall.right - this.padding,
            top: outsideWall.top + this.padding,
            bottom: outsideWall.bottom - this.padding,
        };

        let circleOne = {
            x: insideWall.left + this.radius,
            y: insideWall.top + this.radius,
        };

        let circleTwo = {
            x: insideWall.right - this.radius,
            y: insideWall.top + this.radius,
        };

        let circleThree = {
            x: insideWall.right - this.radius,
            y: insideWall.bottom - this.radius,
        };

        let circleFour = {
            x: insideWall.left + this.radius,
            y: insideWall.bottom - this.radius,
        };

        let isInsideCircleOne = Math.sqrt(Math.pow(circleOne.x - xPoint, 2) + Math.pow(circleOne.y - yPoint, 2)) <= this.radius;
        let isInsideCircleTwo = Math.sqrt(Math.pow(circleTwo.x - xPoint, 2) + Math.pow(circleTwo.y - yPoint, 2)) <= this.radius;
        let isInsideCircleThree = Math.sqrt(Math.pow(circleThree.x - xPoint, 2) + Math.pow(circleThree.y - yPoint, 2)) <= this.radius;
        let isInsideCircleFour = Math.sqrt(Math.pow(circleFour.x - xPoint, 2) + Math.pow(circleFour.y - yPoint, 2)) <= this.radius;

        let isInsideRec1 = (insideWall.left <= xPoint) && (xPoint <= insideWall.right) && (insideWall.top + this.radius <= yPoint) && (yPoint <= insideWall.bottom - this.radius);
        let isInsideRec2 = (insideWall.left + this.radius <= xPoint) && (xPoint <= insideWall.right - this.radius) && (insideWall.top <= yPoint) && (yPoint <= insideWall.bottom);


        if (isInsideRec1 || isInsideRec2 || isInsideCircleOne || isInsideCircleTwo || isInsideCircleThree || isInsideCircleFour) {
            return true;
        }

        else {
            return false;
        }
    }

    redraw(xPoint, yPoint, row, col){
        if (this.isInside(xPoint, yPoint, row, col)){
            this.draw('#1891AC', '#1891AC', true, false, 10);
        }
    }
}

function drawGrid(length) {
    let row = canvas.height / length;
    let col = canvas.width / length;
    let padding = 10;
    let radius = 50;
    let color = '#66A6C2';

    matrixSquare = new Array(row);

    for (let i = 0; i < row; i++) {
        matrixSquare[i] = new Array(col);

        for (let j = 0; j < col; j++) {
            var square = new Square(length * j, length * i, length, padding, radius);
            matrixSquare[i][j] = square;
            matrixSquare[i][j].draw(color, color, true, false, 10);
        }
    }
};

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 600;

let matrixSquare;
let length = 200;
drawGrid(length);

canvas.addEventListener('click', (event) => {
    const x = event.offsetX;
    const y = event.offsetY;

    let col = Math.trunc(x / length);   //если мы попали в квадрат, то мы попали в тот, который лежит в этой ячейке
    let row = Math.trunc(y / length);

    matrixSquare[row][col].redraw(x, y, row, col);
})
