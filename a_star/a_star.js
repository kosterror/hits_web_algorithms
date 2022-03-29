class Cell {
    constructor(x, y, cost) {
        this.x = Number(x);
        this.y = Number(y);
        this.heuristics = Math.abs(Number(finish.x) - Number(this.x)) + Math.abs(Number(finish.y) - Number(this.y));
        this.cost = Number(cost);
        this.f = Number(this.heuristics) + Number(this.cost);
    }
}


let TABLE_IS_INIT = false;
let SIZE = 15;
let matrix;
let table;
let tableID;
let tableHTML;
const COLOR_WALL = '#51585a';
const COLOR_ROAD = '#bbc6ca';
const COLOR_START = 'yellow';
const COLOR_FINISH = 'red';
const COLOR_PATH = '#6ddf8f';
const COLOR_CURRENT_CELL = '#66ff33';
const COLOR_CONSIDER_CELL = '#ff99cc';
const COLOR_CONSIDERED_CELL = '#6dc2df';
const TIME_SLEEP_PATH = 50;
const TIME_SLEEP_RENDER = 50;

let activeMode = 0;

let start = {
    y: -1,
    x: -1,
    isInit: false,
};

let finish = {
    y: -1,
    x: -1,
    isInit: false,
};


change_size.addEventListener('click', changeSize);
generate_maze.addEventListener('click', generateMaze);
generate_empty_maze.addEventListener('click', generateEmptyMaze);
add_wall.addEventListener('click', () => { activeMode = 1 });
delete_wall.addEventListener('click', () => { activeMode = 2 });
change_start.addEventListener('click', () => { activeMode = 3 });
change_finish.addEventListener('click', () => { activeMode = 4 });
document.getElementById('start').addEventListener('click', aStarSearch);
document.getElementById('break').addEventListener('click', () => { location.href = location.href });

document.getElementById('table').addEventListener('click', actionsTable);


async function aStarSearch() {
    if (TABLE_IS_INIT && start.isInit && finish.isInit) {
        let = queue = new Array();      //очередь
        let isVisited = new Array(SIZE);    //здесь будем отмечать, где мы были
        let parents = new Array(SIZE);      //здесь будем указывать родителей
        let isEnd = false;

        for (let i = 0; i < SIZE; i++) {
            isVisited[i] = new Array(SIZE);
            parents[i] = new Array(SIZE);

            for (let j = 0; j < SIZE; j++) {
                isVisited[i][j] = false;
                parents[i][j] = { y: -1, x: -1 };
            }
        }

        queue.push(new Cell(start.x, start.y, 0));  //пушим в очередь старт
        isVisited[start.y][start.x] = true;         //отмечаем, что были в старте

        while (queue.length > 0 && !isEnd) {
            let index = getIndex(queue);
            let currentCell = queue[index];
            queue.splice(index, 1);

            renderCell(currentCell.y, currentCell.x, COLOR_CURRENT_CELL, false);
            await sleep(TIME_SLEEP_RENDER*2);

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
                            await sleep(TIME_SLEEP_RENDER);
                        }
                    }
                }
            }
            renderCell(currentCell.y, currentCell.x, COLOR_CONSIDERED_CELL, false);
            await sleep(TIME_SLEEP_RENDER*2);
        }

        if (isEnd) {
            let path = getPath(parents);
            renderPath(path);
        }

        else {
            alert('Не существует маршрута');
        }
    }
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
        await sleep(TIME_SLEEP_PATH);
    }
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

function actionsTable() {
    if (event.path[0].tagName == 'TD' && event.path[1].tagName == 'TR') {
        let x = event.path[0].id;
        let y = event.path[1].id;

        if (activeMode == 0) {
            alert('Выберите режим взаимодействия с таблицей!');
        }

        else if (activeMode == 1) { //add wall
            matrix[y][x] = -1;
            table[y][x].style.backgroundColor = COLOR_WALL;
        }

        else if (activeMode == 2) { //delete wall
            matrix[y][x] = 0;
            table[y][x].style.backgroundColor = COLOR_ROAD;
        }

        else if (activeMode == 3) { //change start
            if (start.isInit) {
                table[start.y][start.x].style.backgroundColor = matrix[start.y][start.x] == -1 ? COLOR_WALL : COLOR_ROAD;
                start.x = x;
                start.y = y;
                table[y][x].style.backgroundColor = COLOR_START;
            }

            else {
                start.isInit = true;
                start.x = x;
                start.y = y;
                table[y][x].style.backgroundColor = COLOR_START;
            }
        }

        else if (activeMode == 4) { //change finish
            if (finish.isInit) {
                table[finish.y][finish.x].style.backgroundColor = matrix[finish.y][finish.x] == -1 ? COLOR_WALL : COLOR_ROAD;
                finish.x = x;
                finish.y = y;
                table[y][x].style.backgroundColor = COLOR_FINISH;
            }

            else {
                finish.isInit = true;
                finish.x = x;
                finish.y = y;
                table[y][x].style.backgroundColor = COLOR_FINISH;
            }
        }
    }
}

function changeSize() {
    //временная затычка, пусть хотя бы так работает
    let inputSize = prompt('Это временная затычка (наверное)!\nEnter the size of the map');

    deleteTable();

    if (inputSize < 5 || inputSize > 100) {
        alert('Try again. The size should be in the range from 5 to 100');
        changeSize();
    }

    else {
        SIZE = Number(inputSize);
        TABLE_IS_INIT = false;
    }
}

function generateMaze() {
    createMatrix(-1);

    let result = (SIZE % 2 == 0 ? SIZE * SIZE : (SIZE + 1) * (SIZE + 1)) / 4;
    let counter = 0;

    rubber = {
        x: 0,
        y: 0,
    };

    while (counter != result) {
        if (moveRubber(rubber)) {
            counter++;
        }
    }

    resetStart();   //лишним не будет
    resetFinish();

    start.isInit = true;
    start.y = 0;
    start.x = 0;

    finish.isInit = true;
    finish.y = SIZE - 1;
    finish.x = SIZE - 1;

    createTable();
}

function moveRubber(rubber) {
    let top = rubber.y == SIZE - 1 && SIZE % 2 == 0 ? 3 : 2;
    let right = rubber.x == SIZE - 4 && SIZE % 2 == 0 ? 3 : 2;
    let bottom = rubber.y == SIZE - 4 && SIZE % 2 == 0 ? 3 : 2;
    let left = rubber.x == SIZE - 1 && SIZE % 2 == 0 ? 3 : 2;

    let step = [top, right, bottom, left];
    let openDirection = [rubber.y - step[0] >= 0, rubber.x + step[1] < SIZE, rubber.y + step[2] < SIZE, rubber.x - step[3] >= 0];

    let direction;

    while (true) {
        direction = Math.floor(Math.random() * 4);

        if (openDirection[direction]) { break; }
    }

    let oldX = rubber.x;
    let oldY = rubber.y;

    rubber.x = rubber.x + step[1] * (direction == 1) - step[3] * (direction == 3);
    rubber.y = rubber.y - step[0] * (direction == 0) + step[2] * (direction == 2);

    if (0 > rubber.x || rubber.x >= SIZE || 0 > rubber.y || rubber.y >= SIZE) {
        console.log('Выход за границы карты при генерации лабиринта');
    }


    if (matrix[rubber.y][rubber.x] == -1) {
        matrix[rubber.y][rubber.x] = 0;

        if (rubber.y - oldY != 0) {
            for (let i = oldY - 1 * (direction == 0) + 1 * (direction == 2); i != rubber.y; i = i - 1 * (direction == 0) + 1 * (direction == 2)) {
                matrix[i][rubber.x] = 0;
            }
        }

        if (rubber.x - oldX != 0) {
            for (let i = oldX + 1 * (direction == 1) - 1 * (direction == 3); i != rubber.x; i = i + 1 * (direction == 1) - 1 * (direction == 3)) {
                matrix[rubber.y][i] = 0;
            }
        }

        return true;
    }

    return false;
}

function generateEmptyMaze() {
    resetStart();
    resetFinish();

    createMatrix(0);
    createTable();
}

function createTable() {
    deleteTable();

    TABLE_IS_INIT = true;
    let tableHTML = document.getElementById('table');

    for (let i = 0; i < SIZE; i++) {
        table[i] = document.createElement('tr');
        table[i].id = i;
        tableHTML.appendChild(table[i]);

        for (let j = 0; j < SIZE; j++) {
            table[i][j] = document.createElement('td');
            table[i][j].id = j;
            table[i].appendChild(table[i][j]);

            if (i == start.y && j == start.x) {
                table[i][j].style.backgroundColor = COLOR_START;
            }

            else if (i == finish.y && j == finish.x) {
                table[i][j].style.backgroundColor = COLOR_FINISH;
            }

            else {
                table[i][j].style.backgroundColor = matrix[i][j] == -1 ? COLOR_WALL : COLOR_ROAD;
            }
        }
    }
}

function deleteTable() {
    if (TABLE_IS_INIT) {
        for (let i = 0; i < SIZE; i++) {
            document.getElementById(i).remove();
        }
    }
}

function createMatrix(value) {
    matrix = new Array(SIZE);
    table = new Array(SIZE);

    for (let i = 0; i < SIZE; i++) {
        matrix[i] = new Array(SIZE);
        table[i] = new Array(SIZE);

        for (let j = 0; j < SIZE; j++) {
            matrix[i][j] = value;
        }
    }
}

function getIndex(queue) {
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

function calculetaHeuristicsDistance(x1, y1, x2, y2) { return Math.abs((x1 - x2) + (y1 - y2)); };

function isValidCell(cell) { return 0 <= cell.y && cell.y < SIZE && 0 <= cell.x && cell.x < SIZE ? true : false; }

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function resetStart() { start.isInit = false; start.x = -1; start.y = -1; };

function resetFinish() { finish.isInit = false, finish.x = -1; finish.y = -1; };