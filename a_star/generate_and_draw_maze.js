import { COLOR_WALL, COLOR_ROAD } from './temp.js';
import { SpecialCell } from './classes.js'

export let matrix;
export let table;
export let start;
export let finish;

let isInitTable = false;
let SIZE;

export function createMaze(type) {
    start = new SpecialCell('start');
    finish = new SpecialCell('finish');

    //type = -1 //лабиринт со стенами
    //type = 0  //пустой лабиринт

    //TO DO: добавить проверку SIZE

    SIZE = Number(document.getElementById('change_size_input').value);

    createTable();
    createMatrix(type);

    if (type == -1) {
        generateMaze();
    }

    drawTable();
}

function createTable() {
    if (isInitTable) {
        document.getElementById('table').remove();
    }

    isInitTable = true;

    table = document.createElement('table');
    table.id = 'table';
    document.getElementById('table_container').appendChild(table);

    for (let i = 0; i < SIZE; i++) {
        table[i] = document.createElement('tr');
        table[i].id = i;
        table.appendChild(table[i]);

        for (let j = 0; j < SIZE; j++) {
            table[i][j] = document.createElement('td');
            table[i][j].id = j;
            table[i].appendChild(table[i][j]);
        }
    }
}

function createMatrix(type) {
    matrix = new Array(SIZE);

    for (let i = 0; i < SIZE; i++) {
        matrix[i] = new Array(SIZE);

        for (let j = 0; j < SIZE; j++) {
            matrix[i][j] = type;
        }
    }
}

export function drawTable() {
    if (isInitTable) {  //доп защита, пока не понятно необходима ли она
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                table[i][j].style.backgroundColor = matrix[i][j] == 0 ? COLOR_ROAD : COLOR_WALL;
            }
        }
        if (start.isInit) {
            start.draw();
        }
        if (finish.isInit) {
            finish.draw();
        }

    }
}

function generateMaze() {
    let result = (SIZE % 2 == 0 ? SIZE * SIZE : (SIZE + 1) * (SIZE + 1)) / 4;
    let counter = 0;
    let rubber = { x: 0, y: 0, };

    while (counter != result) {
        if (moveRubber(rubber)) {
            counter++;
        }
    }
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