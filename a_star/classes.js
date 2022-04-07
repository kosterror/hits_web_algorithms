import { COLOR_START, COLOR_FINISH } from './temp.js';
import { table, start, finish } from './generate_and_draw_maze.js';

export class SpecialCell {
    constructor(type) {
        this.x = -1;
        this.y = -1;
        this.isInit = false;
        this.type = type;
    }

    draw() {
        if (this.isInit) {
            table[this.y][this.x].style.backgroundColor = this.type == 'start' ? COLOR_START : COLOR_FINISH;
        }

        else {
            console.log(this.type + ' не инициализирован, но ты пытаешься нарисовать его');
        }
    }

    define(x, y) {
        this.x = x;
        this.y = y;
        this.isInit = true;
    }

    reset() {
        this.isInit = false;
    }
}

export class Cell{
    constructor(x, y, cost){
        this.x = Number(x);
        this.y = Number(y);
        this.heuristics = Math.abs(Number(finish.x) - Number(this.x)) + Math.abs(Number(finish.y) - Number(this.y));
        this.cost = Number(cost);
        this.f = Number(this.heuristics) + Number(this.cost);
    }
}