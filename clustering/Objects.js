import { POINT_RADIUS } from "./main.js";
import { ctx } from "./main.js";

export {
    colors,
    Point
}


class Point {
    constructor(x, y, cluster) {
        this.x = x;
        this.y = y;
        this.cluster = cluster;
        this.core = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, POINT_RADIUS, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = colors[this.cluster];
        ctx.fill();
    }

    redraw(color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, POINT_RADIUS, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
}

const colors = {
    0: 'black',
    1: 'blue',
    2: 'green',
    3: 'red',
    4: 'yellow',
    5: 'orange',
    6: 'brown',
    7: 'gray',
    8: 'purple',
    9: 'pink',
    10: 'violet'
}