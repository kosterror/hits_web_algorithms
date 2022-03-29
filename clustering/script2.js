//разработка canvas для создания точек пользователем на плоскости
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1400;
canvas.height = 580;
const POINT_RADIUS = 6;

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
    count_clasters = document.getElementById("klasters").value;

    if (data_points.length < count_clasters) {
        alert("Вы ввели кол-во групп больше, чем точек. Добавьте точки или измените кол-во кластеров")
    }

    // for (let i = 0; i < data_points.length; i++) {
    //     console.log(data_points[i].x, data_points[i].y, data_points[i].klastrers);
    // }

    klasterization();
}

but2.onclick = function() { //перезапуск страницы
    window.location.reload();
}


// сам алгоритм кластеризации

function klasterization() {
    randomDrawPoints(); // раскрасили и распределили по кластерам произвольным образом точки

    isChange = true; // флажок, отслеживающий изменился ли хотя бы один кластер

    while (isChange) {
        let mas_centroids = findCentroids(); //вычисляем кластерный центроид для каждого К

        console.log(mas_centroids);

        isChange = changeKlastersPoints(mas_centroids); //переопределяем у точек кластеры
    }

    if (!isChange) {
        alert('АЛГОРИТМ ЗАКОНЧИЛ РАБОТУ');
    }
}

function randomDrawPoints() {
    let i = 0,
        j = 1;
    while (i < data_points.length) {

        data_points[i].klaster = j;
        data_points[i].draw();
        i++;
        j++;

        if (j - 1 == count_clasters) {
            j = 1;
        }
    }
}

function findCentroids() {
    let sumX = 0,
        sumY = 0,
        count = 0,
        centroids = [],
        num_klas = 1;

    while (num_klas <= count_clasters) {
        for (let i = 0; i < data_points.length; i++) {
            if (data_points[i].klaster == num_klas) {
                sumX = data_points[i].x;
                sumY = data_points[i].y;
                count++;

            }
        }

        centroids[centroids.length] = new Point(sumX / count, sumY / count, num_klas);
        num_klas++;
    }

    console.log(centroids.length);

    return centroids;
}

function changeKlastersPoints(centoroids) {
    //const MAX_DISTANCE = 350; //максимальная дистанция между точками одного кластера
    flag = false;
    const porog = 1;

    // for (let i = 0; i < centoroids.length; i++) {
    //     let dist = []; //массив для хранения расстояния от каждой точки до центроиды
    //     for (let j = 0; j < data_points.length; j++) {
    //         dist[dist.length] = Distance(centoroids[i], data_points[j]);
    //     }

    //     for (let n = 0; n < dist.length; n++) {
    //         // console.log(dist[n]);
    //         if (dist[n] <= MAX_DISTANCE) {
    //             data_points[n].klaster = i + 1;
    //             data_points[n].draw();

    //             flag = true;
    //         }
    //     }
    // }

    for (let i = 0; i < data_points.length; i++) {
        let min_dist = Infinity;
        let num_klast;
        for (let j = 0; j < centoroids.length; j++) {
            tmp = Distance(data_points[i], centoroids[j]);
            if (min_dist > tmp) {
                min_dist = tmp;
                num_klast = j + 1;
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

function Distance(point1, point2) {
    difX = Math.abs(point1.x - point2.x);
    difY = Math.abs(point1.y - point2.y);

    return (Math.sqrt(Math.pow(difX, 2) + Math.pow(difY, 2)));
}