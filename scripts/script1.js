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
    constructor(x, y, length, padding, radius, color) { //radius > padding!
        this.x = x;
        this.y = y;
        this.length = length;   //длина стороны квадрата
        this.padding = padding; //отступ от квадратной клетки, которая могла быть нарисована с параметрами x, y, length
        this.radius = radius;   //чем вышем параметр, тем менее острые углы
        this.color = color;
    }

    draw(fillColor) {
        ctx.fillStyle = fillColor;
        this.color = fillColor;

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

    isInside(xPoint, yPoint, row, col) {
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


        if (isInsideRec1 || isInsideRec2 || isInsideCircleOne || isInsideCircleTwo || isInsideCircleThree || isInsideCircleFour) {  
            return true;    //достаточно, чтобы точка лежала в каком-либо тряугольника или в какой-либо окружности
        }

        else {
            return false;
        }
    }

    redraw(xPoint, yPoint, row, col){   //сырая функция, которая в таком виде не существовать
        let defaultColor = '#66A6C2';
        let possibleColor = '#DB30D6';  //цвет для примера

        if (this.isInside(xPoint, yPoint, row, col)){

            if (this.color == defaultColor){
                this.color = possibleColor;
                this.draw(possibleColor);
            }

            else {
                this.color = defaultColor;
                this.draw(defaultColor);
            }
             
        }
    }
}

function drawGrid(length) {
    let row = canvas.height / length;
    let col = canvas.width / length;
    let padding = 10;
    let radius = 30;
    let color = '#66A6C2';

    console.log(row);
    console.log(col);

    matrixSquare = new Array(row);

    for (let i = 0; i < row; i++) {
        matrixSquare[i] = new Array(col);

        for (let j = 0; j < col; j++) {
            let square = new Square(length * j, length * i, length, padding, radius, color);
            matrixSquare[i][j] = square;
            matrixSquare[i][j].draw(color);
        }
    }
    console.log(matrixSquare);
};

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;    //ширина canvas
canvas.height = 600;    //высота canvas

var matrixSquare;       //двумерный массив с квадратами, которые мы будем рисовать
let length = 100;       //длина стороны этого квадрата

drawGrid(length);       //нарисовали сетку, теперь в matrixSquare квадраты 

canvas.addEventListener('click', (event) => {
    const x = event.offsetX;    //координаты курсора по x на самом Canvas
    const y = event.offsetY;    //координаты курсора по y на самом Canvas

    let col = Math.trunc(x / length);   //чтобы понять попали ли мы в сам квадрат: надо понять в каком квадрате надо искать попадание
    let row = Math.trunc(y / length);   //для найдем единственные возможные row и col для матрицы

    matrixSquare[row][col].redraw(x, y, row, col);  //если все таки попали в сам квадрат, то перекрасим его
})
