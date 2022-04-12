import {
    isCanAddPoint,
    removePoint,
    addPoint,
    disableButtons,
    enableButtons
} from "./func_for_canvas.js";

import { kMeansPlusPlus } from "./kMeans.js";

export {
    canvas,
    ctx,
    SIZE_HEIGHT,
    SIZE_WIDTH,
    POINT_RADIUS,
    data_points,
    centroids,
    count_clusters
};

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const SIZE_WIDTH = 1000,
    SIZE_HEIGHT = 580,
    POINT_RADIUS = 10,
    LIMIT_COUNT_KLUSTERS = 10;

let activeMode = 0;

let data_points = [],
    centroids = [],
    count_clusters,
    points;

canvas.width = SIZE_WIDTH;
canvas.height = SIZE_HEIGHT;

document.getElementById('canvas').addEventListener('click', handler);
// document.getElementById('canvas').addEventListener('click', (e) => { console.log(e.offsetX + ' ' + console.log(e.offsetY)); });
document.getElementById('add_point').addEventListener('click', () => { activeMode = 1 });
document.getElementById('remove_point').addEventListener('click', () => { activeMode = 2 });
document.getElementById('kMeans').addEventListener('click', startAlgorithm);
document.getElementById('clear').addEventListener('click', () => { window.location.reload() });
count_clusters = Number(document.getElementById('getClusters').value);


function handler(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    if (activeMode === 1 && isCanAddPoint(x, y)) {
        addPoint(x, y);
    } else if (activeMode === 2) {
        console.log('Ha-ha');
        removePoint(x, y);
    }
}

function startAlgorithm() {
    activeMode = 0;
    disableButtons();
    debugger;
    if (checking()) {
        debugger;
        points = data_points.slice();

        kMeansPlusPlus(points.slice(), centroids.slice());

        enableButtons();
        console.log(data_points);
    }
}

function checking() {
    if ((count_clusters > LIMIT_COUNT_KLUSTERS) || (count_clusters === 0) || (count_clusters == NaN)) {
        alert("Превышен лимит кластеров (максимум 10)");
        return false;
    } else if (data_points.length < count_clusters) {
        alert("Вы ввели кол-во групп больше, чем точек. Добавьте точки или измените кол-во кластеров");
        return false;
    } else {
        return true;
    }
}