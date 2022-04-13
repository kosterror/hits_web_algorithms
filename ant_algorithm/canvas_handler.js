import Vertex from './class_vertex.js';
import { HEIGHT, VERTEX_RADIUS, WIDTH, activeMode, verticesList } from './main.js'


function canvasHandler(x, y) {
    let index = getIndexHitVertex(x, y);

    if (activeMode.value == 1 && canAddVertex(x, y)) {
        addVertex(x, y);
    }

    if (activeMode.value == 2 && index != -1) {
        removeVertex(index);
    }
}

function addVertex(x, y) {
    verticesList.push(new Vertex(x, y, verticesList.length));
    verticesList[verticesList.length - 1].draw();
}

function canAddVertex(x, y) {
    if (x > VERTEX_RADIUS && x < WIDTH - VERTEX_RADIUS && y > VERTEX_RADIUS && y < HEIGHT - VERTEX_RADIUS) {
        let index = getIndexNearestVertex(x, y);

        if (index == -1) {
            return true;
        }

        else if (calculateDistance(verticesList[index].x, verticesList[index].y, x, y) > (3 * VERTEX_RADIUS)) {
            return true;
        }
    }
    return false;
}

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function removeVertex(index) {
    verticesList[index].remove();
    verticesList.splice(index, 1);

    renumberVertices();
}

function renumberVertices() {
    for (let i = 0; i < verticesList.length; i++) {
        verticesList[i].number = i;
        verticesList[i].draw();
    }
}

function getIndexHitVertex(x, y) {
    let index = getIndexNearestVertex(x, y);

    if (index != -1 && calculateDistance(verticesList[index].x, verticesList[index].y, x, y) < VERTEX_RADIUS) {
        return index;
    }

    return -1;

}

function getIndexNearestVertex(x, y) {
    let minDistance = -1;
    let index = -1;

    for (let i = 0; i < verticesList.length; i++) {
        let distance = calculateDistance(verticesList[i].x, verticesList[i].y, x, y);

        if (minDistance == -1) {
            index = i;
            minDistance = distance;
        }

        else if (distance < minDistance) {
            index = i;
            minDistance = distance;
        }
    }

    return index;
}

export default canvasHandler;