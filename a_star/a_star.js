let TABLE_IS_INIT = false;
let SIZE = 15;
let matrix;
let table;
let tableID;
let tableHTML;
const colorWall = '#51585a';
const colorRoad = '#bbc6ca';
const colorStart = 'red';
const colorFinish = 'blue';

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
add_wall.addEventListener('click', event => { activeMode = 1 });
delete_wall.addEventListener('click', event => { activeMode = 2 });
change_start.addEventListener('click', event => { activeMode = 3 });
change_finish.addEventListener('click', event => { activeMode = 4 });

document.getElementById('table').addEventListener('click', tableAPI);


function tableAPI() {
    if (event.path[0].tagName == 'TD' && event.path[1].tagName == 'TR') {   //дополнительный уровень защиты от пользователя
        let x = event.path[0].id;
        let y = event.path[1].id;
        // console.log(y + ' ' + x)

        if (activeMode == 0) {
            alert('Выберите режим взаимодействия с таблицей слева!');
        }

        else if (activeMode == 1) { //add wall
            matrix[y][x] = -1;
            table[y][x].style.backgroundColor = colorWall;
        }

        else if (activeMode == 2) { //delete wall
            matrix[y][x] = 0;
            table[y][x].style.backgroundColor = colorRoad;
        }

        else if (activeMode == 3) { //change start
            if (start.isInit) {
                table[start.y][start.x].style.backgroundColor = matrix[start.y][start.x] == -1 ? colorWall : colorRoad;
                start.x = x;
                start.y = y;
                table[y][x].style.backgroundColor = colorStart;
            }

            else {
                start.isInit = true;
                start.x = x;
                start.y = y;
                table[y][x].style.backgroundColor = colorStart;
            }
        }

        else if (activeMode == 4) { //change finish
            if (finish.isInit) {
                table[finish.y][finish.x].style.backgroundColor = matrix[finish.y][finish.x] == -1 ? colorWall : colorRoad;
                finish.x = x;
                finish.y = y;
                table[y][x].style.backgroundColor = colorFinish;
            }

            else {
                finish.isInit = true;
                finish.x = x;
                finish.y = y;
                table[y][x].style.backgroundColor = colorFinish;
            }
        }

        else {

        }
    }
    else {
        alert('Не двигайте мышкой во время нажатия ЛКМ!');
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
        //на самом деле этот isOpenDirection работает только для SIZE % 2 != 0, иначе ломается
        //TO DO: пофиксить 
        let isOpenDirection = [rubber.y > 0, rubber.x < SIZE - 1, rubber.y < SIZE - 1, rubber.x > 0];

        while (true) {   //таким образом мы никогда не отправимся за границы матрицы
            direction = Math.floor(Math.random() * 4);

            if (isOpenDirection[direction]) {
                break;
            }
        }

        rubber.x = rubber.x + 2 * (direction == 1) - 2 * (direction == 3);
        rubber.y = rubber.y - 2 * (direction == 0) + 2 * (direction == 2);

        if (matrix[rubber.y][rubber.x] == -1) {
            matrix[rubber.y][rubber.x] = 0;
            matrix[rubber.y + 1 * (direction == 0) - 1 * (direction == 2)][rubber.x - 1 * (direction == 1) + 1 * (direction == 3)] = 0;
            counter++;
        }

    }

    createTable();
}

function generateEmptyMaze() {
    createMatrix(0);
    createTable();
}

function changeStart() {
    activeMode = 3;
}

function changeFinish() {
    activeMode = 4;
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

            table[i][j].style.backgroundColor = matrix[i][j] == -1 ? colorWall : colorRoad;
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