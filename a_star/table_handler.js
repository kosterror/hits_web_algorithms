import { activeMode } from "./temp.js";
import { matrix, drawTable, start, finish } from "./generate_and_draw_maze.js";

export function tableHandler(e) {
    if (e.target.tagName == 'TD') {
        let row = e.target.parentNode.id;
        let col = e.target.id;
        // console.log(row + ' ' + col);

        let currentActiveMode = calculateActiveMode();

        if (currentActiveMode == 0) {
            //добавляем стену
            matrix[row][col] = -1;
            drawTable();
        }

        if (currentActiveMode == 1) {
            //удаляем стену
            matrix[row][col] = 0;
            drawTable();
        }

        if (currentActiveMode == 2) {
            //выбираем старт
            start.define(row, col);
            drawTable();
        }

        if (currentActiveMode == 3) {
            //выбираем финиш
            finish.define(row, col);
            drawTable();
        }

        if (currentActiveMode == 4) {
            //тут надо подумать что следует делать, скорее всего ничего...
        }
    }
}

function calculateActiveMode() {
    let index = -1;

    for (let i = 0; i < activeMode.length; i++) {
        if (activeMode[i] != 0) {
            index = i;
        }
    }

    return index;
}