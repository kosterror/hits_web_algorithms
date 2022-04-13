import {
    isCanAddPoint,
    removePoint,
    addPoint,
    disableButtons,
    enableButtons
} from "./func_for_canvas.js";

import { kMeans } from "./kMeans.js";
import { DBSCAN } from "./DBSCAN.js";

import {
    checkingOnError,
    deepCopy
} from "./func_for_algos.js";

export {
    canvas,
    ctx,
    SIZE_HEIGHT,
    SIZE_WIDTH,
    POINT_RADIUS,
    LIMIT_COUNT_KLUSTERS,
    RADIUS_CHANGE,
    COUNT_NEIGHBOURS_POINTS,
    count_clusters,
    data_points
};

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const SIZE_WIDTH = 1000,
    SIZE_HEIGHT = 600,
    POINT_RADIUS = 10;

const LIMIT_COUNT_KLUSTERS = 10;

const RADIUS_CHANGE = 30,
    COUNT_NEIGHBOURS_POINTS = 4;

let activeMode = 0;

let data_points = [],
    count_clusters;

canvas.width = SIZE_WIDTH;
canvas.height = SIZE_HEIGHT;

document.getElementById('canvas').addEventListener('click', handler);
document.getElementById('add_point').addEventListener('click', () => { activeMode = 1 });
document.getElementById('remove_point').addEventListener('click', () => { activeMode = 2 });
document.getElementById('kMeans').addEventListener('click', startkMeans);
document.getElementById('DBSCAN').addEventListener('click', startDBSCAN);
// document.getElementById('Graph').addEventListener('click', startGraph);
document.getElementById('clear').addEventListener('click', () => { window.location.reload() });


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

function startkMeans() {
    activeMode = 0;
    disableButtons();

    if (!checkingOnError()) {
        count_clusters = Number(document.getElementById('getClusters').value);

        kMeans(deepCopy(data_points));

        enableButtons();
    }
}

function startDBSCAN() {
    activeMode = 0;
    disableButtons();
    debugger;
    if (!checkingOnError()) {
        DBSCAN(deepCopy(data_points));

        enableButtons();
    }
}