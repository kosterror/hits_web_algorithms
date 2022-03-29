//разработка canvas для создания точек пользователем на плоскости
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const WIDTH = 1400;
const HEIGHT = 580;
const POINT_RADIUS = 6;

canvas.width = WIDTH;
canvas.height = HEIGHT;

function animation(obj) {
    const { update, render } = obj;
    let pTimestamp = 0;

    requestAnimationFrame(tick);

    function tick(timestamp) {
        requestAnimationFrame(tick);

        const diff = timestamp - pTimestamp;
        pTimestamp = timestamp;

        const parametrs = {
            timestamp,
            pTimestamp
        }

        update(parametrs);
        render(parametrs);
    }
}

const mouse = {
    x: 0,
    y: 0,
    left: false,
    pLeft: false,
    right: false,
    pRight: false,
    over: false,
    draw: false
}

function mouseTick() {
    mouse.pLeft = mouse.left;
    mouse.pRight = mouse.right;
}

canvas.addEventListener('mousemove', mousemoveHandler);
canvas.addEventListener('mousedown', mousedownHandler);
canvas.addEventListener('mouseup', mouseupHandler);


function mousemoveHandler(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
}

function mousedownHandler(event) {
    if (event.buttons === 1) {
        mouse.left = true;
    } else if (event.buttons === 2) {
        mouse.right = true;
    }
}

function mouseupHandler(event) {
    if (event.button === 0) {
        mouse.left = false;
    } else if (event.button === 2) {
        mouse.right = false;
    }
}

colors = {
    0: 'black',
    1: 'blue',
    2: 'green',
    3: 'red',
    4: 'yellow',
    5: 'orange',
    6: 'brown',
    7: 'gray',
    8: 'purple',
    9: 'pink',
    10: 'mint'
}

class Point {
    constructor(x, y, num_klas) {
        this.x = x;
        this.y = y;
        this.klaster = num_klas;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, POINT_RADIUS, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = colors[this.klaster];
        context.fill();
    }
}

let data_points = [];

animation({
    update() {
        if (mouse.left && !mouse.pLeft) {
            mouse.draw = true;
        }

        mouseTick();
    },

    render() {
        if (mouse.draw) {
            data_points[data_points.length] = new Point(mouse.x, mouse.y, 0);
            data_points[data_points.length - 1].draw();

            mouse.draw = false;
        }
    }
})


//кнопки
var but1 = document.getElementById("startAlg");
var but2 = document.getElementById("restartAlg");
let count_clasters;

but1.onclick = function() { //запуск алгоритма
    count_clasters = document.getElementById("numKlasters").value;

    if ((count_clasters > 10) || (count_clasters === 0) || (count_clasters == NaN)) {
        alert("Вы ввели недопустимое значение количества кластеров")
    } else {
        if (data_points.length < count_clasters) {
            alert("Вы ввели кол-во групп больше, чем точек. Добавьте точки или измените кол-во кластеров")
        } else {

            kMeansPlusPlus(); //запуск кластеризации
        }
    }
}

but2.onclick = function() { //перезапуск страницы
    window.location.reload();
}

let centroids = [];

function kMeansPlusPlus() {
    findFirstCentroids() //получили массив первоначальных центроид

    for (let i = 0; i < centroids.length; i++) {
        console.log(centroids[i].x, centroids[i].y, centroids.klaster);
    }

    //далее выполняется основной алгоритм k-means

    isChange = true; // флажок, отслеживающий изменился ли хотя бы один кластер
    //let i = 0;
    isChange = changeKlastersPoints();

    // while (isChange) {
    //     isChange = changeKlastersPoints(); //переопределяем у точек кластеры
    //     changeCentroids(); //вычисляем новый кластерный центроид для каждого К
    //     console.log(`iteration ${i}`);
    //     i++;
    // }

    // if (!isChange) {
    //     alert('АЛГОРИТМ ЗАКОНЧИЛ РАБОТУ');
    // }

    alert('АЛГОРИТМ ЗАКОНЧИЛ РАБОТУ');
}

function findFirstCentroids() {
    let distance = [],
        SumDx = 0;

    data_points[0].klaster = 1;
    centroids[0] = data_points[0]; //выбрали первый центроид
    centroids[0].draw();

    for (let i = 0; i < count_clasters - 1; i++) {
        for (let j = 0; j < data_points.length; j++) {
            distance[j] = DistanceSquared(data_points[j], centroids[i]);
            SumDx += distance[j];
        }

        let k = findIndexNextCentroid(distance, SumDx);
        let flag = false; //флажок для отслеживания изменения массива центроидов

        while (!flag) {
            if (isCanCentroids(data_points[k])) {
                data_points[k].klaster = i + 2;
                centroids[centroids.length] = data_points[k];
                centroids[centroids.length - 1].draw();
                flag = true;
                console.log(flag);

            } else {
                k = findIndexNextCentroid(distance, SumDx);
            }
        }
    }
}

function changeKlastersPoints() {
    flag = false;
    const porog = 0;

    for (let i = 0; i < data_points.length; i++) {
        let min_dist = Infinity;
        let num_klast;
        for (let j = 0; j < centroids.length; j++) {
            tmp = Math.sqrt(DistanceSquared(data_points[i], centroids[j]));
            if (min_dist > tmp) {
                min_dist = tmp;
                num_klast = centroids[j].klaster;
            }
        }

        if (min_dist > porog && data_points[i].klaster != num_klast) {
            data_points[i].klaster = num_klast;
            data_points[i].draw();

            flag = true;
        }
    }

    return flag;
}

function changeCentroids() {
    let SumX = [],
        SumY = [],
        count = [];

    for (let i = 0; i < data_points.length; i++) {
        SumX[data_points[i].klaster - 1] += data_points[i].x;
        SumY[data_points[i].klaster - 1] += data_points[i].x;
        count[data_points[i].klaster - 1]++;
    }

    for (let i = 0; i < centroids.length; i++) {
        centroids[i].x = SumX[i] / count[i];
        centroids[i].y = SumY[i] / count[i];
        centroids[i].draw();
    }
}

function findIndexNextCentroid(distance, SumDx) {
    Rnd = Math.random() * SumDx;

    console.log(Rnd);

    SumDx = 0;
    let ind = 0;
    while (SumDx <= Rnd && ind < data_points.length - 1) {
        SumDx += distance[ind];
        ind++;
    }

    return ind;
}

function isCanCentroids(point) {
    for (let i = 0; i < centroids.length; i++) {
        if (centroids[i].x == point.x & centroids[i].y == point.y) {
            return false;
        }
    }

    return true;
}

function DistanceSquared(point1, point2) {
    difX = Math.abs(point1.x - point2.x);
    difY = Math.abs(point1.y - point2.y);
    return Math.pow(difX, 2) + Math.pow(difY, 2);;
}