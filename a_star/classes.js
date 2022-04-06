import { COLOR_START, COLOR_FINISH } from './temp.js';
import { table } from './generate_and_draw_maze.js';

export class SpecialCell {
    constructor(type) {
        this.row = -1;
        this.col = -1;
        this.isInit = false;
        this.type = type;
    }

    draw() {
        if (this.isInit) {
            table[this.row][this.col].style.backgroundColor = this.type == 'start' ? COLOR_START : COLOR_FINISH;
        }

        else {
            console.log(this.type + ' не инициализирован, но ты пытаешься нарисовать его');
        }
    }

    define(row, col) {
        this.row = row;
        this.col = col;
        this.isInit = true;
    }

    reset() {
        this.isInit = false;
    }
}