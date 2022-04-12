import {ctx, WIDTH, HEIGHT} from './main.js';

function updateRendering(verticesList, path, isEnd) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawPath(verticesList, path, isEnd);
    drawVertices(verticesList);
}

function drawPath(verticesList, path, isEnd) {
    for (let i = 0; i < path.length; i++) {
        ctx.strokeStyle = isEnd ? '#247ABF' : '#8FC7F3';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(verticesList[path[i].start].x, verticesList[path[i].start].y);
        ctx.lineTo(verticesList[path[i].finish].x, verticesList[path[i].finish].y);
        ctx.stroke();
        ctx.closePath();
    }
}

function drawVertices(verticesList) {
    for (let i = 0; i < verticesList.length; i++) {
        verticesList[i].draw();
    }
}

export default updateRendering;