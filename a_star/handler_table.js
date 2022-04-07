import { activeMode } from "./variables.js";
import {
    matrix,
    drawTable,
    start,
    finish
} from "./generate_and_draw_maze.js";

export function tableHandler(e) {
    if (e.target.tagName == 'TD') {
        let row = e.target.parentNode.id;
        let col = e.target.id;

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
            start.define(col, row);
            drawTable();
        }

        if (currentActiveMode == 3) {
            //выбираем финиш
            finish.define(col, row);
            drawTable();
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