import { drawTable, matrix, table, start, finish, isInitTable, SIZE } from './generate_and_draw_maze.js';
import { Cell } from './classes.js';
import { COLOR_CURRENT_CELL, COLOR_CONSIDER_CELL, COLOR_CONSIDERED_CELL, COLOR_PATH, delay } from './vatiables.js';
import { activeButtonsHandler } from './handler_buttons.js';

let queue;
let isVisited;
let parents;
let isEnd;

export async function aStarWrapper() {
    if (check()) {
        drawTable();
        await aStarSearch();
        activeButtonsHandler(-1);
    }

    else {
        activeButtonsHandler(-1);
    }
}

async function aStarSearch() {
    createSupportMatrix();
    isEnd = false;

    queue.push(new Cell(start.x, start.y, 0));
    isVisited[start.y][start.x] = true;

    while (queue.length > 0 && !isEnd) {
        let index = getIndex();
        let currentCell = queue[index];
        queue.splice(index, 1);

        renderCell(currentCell.y, currentCell.x, COLOR_CURRENT_CELL, false);
        await sleep(delay.value);

        let neighbors = [new Cell(currentCell.x, currentCell.y - 1, currentCell.cost + 1), new Cell(currentCell.x + 1, currentCell.y, currentCell.cost + 1), new Cell(currentCell.x, currentCell.y + 1, currentCell.cost + 1), new Cell(currentCell.x - 1, currentCell.y, currentCell.cost + 1)];

        for (let i = 0; i < 4; i++) {
            if (isValidCell(neighbors[i])) {
                if (matrix[neighbors[i].y][neighbors[i].x] != -1) {
                    if (neighbors[i].x == finish.x && neighbors[i].y == finish.y) {
                        isVisited[neighbors[i].y][neighbors[i].x] = true;

                        parents[neighbors[i].y][neighbors[i].x].y = currentCell.y;
                        parents[neighbors[i].y][neighbors[i].x].x = currentCell.x;

                        isEnd = true;
                        break;
                    }

                    if (!isVisited[neighbors[i].y][neighbors[i].x]) {
                        queue.push(neighbors[i]);
                        isVisited[neighbors[i].y][neighbors[i].x] = true;

                        parents[neighbors[i].y][neighbors[i].x].y = currentCell.y;
                        parents[neighbors[i].y][neighbors[i].x].x = currentCell.x;

                        renderCell(neighbors[i].y, neighbors[i].x, COLOR_CONSIDER_CELL, false);
                        await sleep(delay.value);
                    }
                }
            }
        }

        renderCell(currentCell.y, currentCell.x, COLOR_CONSIDERED_CELL, false);
        await sleep(delay.value);
    }

    if (isEnd) {
        let path = getPath(parents);
        renderPath(path);
    }

    else {
        alert('Не нашёл(');
    }
}

function createSupportMatrix() {
    queue = new Array();
    isVisited = new Array(SIZE);
    parents = new Array(SIZE);

    for (let i = 0; i < SIZE; i++) {
        isVisited[i] = new Array(SIZE);
        parents[i] = new Array(SIZE);

        for (let j = 0; j < SIZE; j++) {
            isVisited[i][j] = false;
            parents[i][j] = { y: -1, x: -1 };
        }
    }
}

function check() {
    if (isInitTable && start.isInit && finish.isInit) {
        return true;
    }

    else {
        return false;
    }
}

function getIndex() {
    let minF = -1;
    let index = -1;

    for (let i = 0; i < queue.length; i++) {
        if (minF == -1) {
            minF = queue[i].f;
            index = i;
        }

        else if (queue[i].f < minF) {
            minF = queue[i].f;
            index = i;
        }
    }

    return index;
}

function renderCell(row, col, color, renderSF) {
    if (0 <= row && row < SIZE && 0 <= col && col < SIZE) {
        if (renderSF) {
            table[row][col].style.backgroundColor = color;
        }

        else {
            if (!((row == start.y && col == start.x || row == finish.y && col == finish.x))) {
                table[row][col].style.backgroundColor = color;
            }
        }
    }
}

function isValidCell(cell) {
    return 0 <= cell.y && cell.y < SIZE && 0 <= cell.x && cell.x < SIZE ? true : false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getPath(parents) {
    let path = [];

    let parentY = Number(parents[finish.y][finish.x].y);
    let parentX = Number(parents[finish.y][finish.x].x);

    while (!(parentY == start.y && parentX == start.x)) {
        path.push({ y: parentY, x: parentX });
        let newParentY = Number(parents[parentY][parentX].y);
        let newParentX = Number(parents[parentY][parentX].x);

        parentY = newParentY;
        parentX = newParentX;
    }

    path.reverse();
    return path;
}

async function renderPath(path) {
    for (let i = 0; i < path.length; i++) {
        renderCell(path[i].y, path[i].x, COLOR_PATH, true);
        await sleep(20);
    }
}

export default aStarWrapper;