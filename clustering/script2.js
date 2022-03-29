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
let mas_centroids = [];

but1.onclick = function() { //запуск алгоритма
    count_clasters = document.getElementById("klasters").value;

    if ((count_clasters > 10) && (count_clasters === 0)) {
        alert("Вы ввели недопустимое кол-во кластеров")
    } else {
        if (data_points.length < count_clasters) {
            alert("Вы ввели кол-во групп больше, чем точек. Добавьте точки или измените кол-во кластеров")
        } else {

            // for (let i = 0; i < data_points.length; i++) {
            //     console.log(data_points[i].x, data_points[i].y, data_points[i].klastrers);
            // }

            klasterization();
        }
    }
}

but2.onclick = function() { //перезапуск страницы
    window.location.reload();
}


// сам алгоритм кластеризации
function klasterization() {
    mas_centroids = firstCentroids() // определить первоначальные центроиды

    isChange = true; // флажок, отслеживающий изменился ли хотя бы один кластер
    isChange = changeKlastersPoints(mas_centroids);

    // while (isChange) {
    //     isChange = changeKlastersPoints(mas_centroids); //переопределяем у точек кластеры
    //     sleep(1000);
    //     mas_centroids = findCentroids(mas_centroids); //вычисляем новый кластерный центроид для каждого К
    //     sleep(1000);
    // }

    // if (!isChange) {
    //     for (let i = 0; i < mas_centroids.length; i++) {
    //         console.log(mas_centroids[i].x, mas_centroids[i].y);
    //     }
    //     debugger;
    //     alert('АЛГОРИТМ ЗАКОНЧИЛ РАБОТУ');
    // }
}

function firstCentroids() {
    let centroids = [],
        cur_centr;

    centroids[0] = new Point(data_points[0].x + 1, data_points[0].y + 1, 1)

    for (let i = 1; i < count_clasters; i++) {
        max_distance = 0;
        let index_point;

        for (let j = 0; j < data_points.length; j++) {
            let tmp = Distance(centroids[i - 1], data_points[j]);
            if (tmp > max_distance) {
                max_distance = tmp;
                index_point = j;
            }
        }

        if (isCanCentroids(centroids, data_points[index_point].x, data_points[index_point].y)) {
            centroids[centroids.length] = new Point(data_points[index_point].x + 1, data_points[index_point].y + 1, i + 1);
        } else {
            i--;
        }
    }

    return centroids;
}

function isCanCentroids(centroids, x, y) {
    for (let i = 0; i < centroids.length; i++) {
        if (centroids[i].x == x & centroids[i].y == y) {
            return false;
        }
    }

    return true;
}

function findCentroids(centroids) {
    let sumX = 0,
        sumY = 0,
        count = 0;

    for (let i = 0; i < centroids.length; i++) {
        for (let j = 0; j < data_points; j++) {
            if (data_points[j].klaster == centroids[i].klaster) {
                sumX = data_points[j].x;
                sumY = data_points[j].y;
                count++;
            }
        }

        let tmp = new Point(sumX / count, sumY / count, centroids[i].klaster);

        if (centroids[i] != tmp) {
            centroids[i] = tmp;
        }
    }

    return centroids;
}

function changeKlastersPoints(centoroids) {
    flag = false;
    const porog = 0;

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

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

//promise sleep

// function randomDrawPoints() {
//     let i = 0,
//         j = 1;
//     while (i < data_points.length) {

//         data_points[i].klaster = j;
//         data_points[i].draw();
//         i++;
//         j++;

//         if (j - 1 == count_clasters) {
//             j = 1;
//         }
//     }
// }

// function findCentroids() {
//     let sumX = 0,
//         sumY = 0,
//         count = 0,
//         centroids = [],
//         num_klas = 1;

//     while (num_klas <= count_clasters) {
//         for (let i = 0; i < data_points.length; i++) {
//             if (data_points[i].klaster == num_klas) {
//                 sumX = data_points[i].x;
//                 sumY = data_points[i].y;
//                 count++;

//             }
//         }

//         centroids[centroids.length] = new Point(sumX / count, sumY / count, num_klas);
//         num_klas++;
//     }

//     console.log(centroids.length);

//     return centroids;
// }