import {ctx} from './main.js';

import {VERTEX_RADIUS} from "./main.js";
const VERTEX_BORDER = 2;
const STROKE_COLOR = 'black';
const FILL_COLOR = '#908E4A';

export default class Vertex {
    constructor(x, y, number) {
        this.x = x;
        this.y = y;
        this.number = number;
        this.radius = VERTEX_RADIUS;
        this.fillStyle = FILL_COLOR;
        this.strokeStyle = STROKE_COLOR;
        this.lineWidth = VERTEX_BORDER;
        this.context = ctx;
    }

    draw() {
        this.context.fillStyle = this.fillStyle;
        this.context.strokeStyle = this.strokeStyle;
        this.context.lineWidth = this.lineWidth;

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();

        this.drawNumber();
    }

    drawNumber() {
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = 'black';
        this.context.font = 'bold ' + this.radius + 'px sans-serif';

        this.context.beginPath();
        this.context.fillText(this.number, this.x, this.y);
        this.context.closePath();
    }

    remove() {
        this.context.fillStyle = '#f1f1f1';

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius + this.radius * 0.1, 0, 2 * Math.PI);   //стирает на 0.1 радиуса больше, чем надо
        this.context.fill();
        this.context.closePath();
    }
}