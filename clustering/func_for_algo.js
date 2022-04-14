import { count_clusters } from "./kMeans.js";
import { LIMIT_COUNT_KLUSTERS } from "./main.js";
import { data_points } from "./main.js";

import { Point } from "./Objects.js";

export {
    checkingOnError,
    deepCopy,
    getRandomInt
}

function checkingOnError(count_clusters) {
    if ((count_clusters > LIMIT_COUNT_KLUSTERS) || (count_clusters === 0) || (count_clusters == NaN)) {
        alert("Превышен лимит кластеров (максимум 10)");
        return true;
    } else if (data_points.length < count_clusters) {
        alert("Вы ввели кол-во групп больше, чем точек. Добавьте точки или измените кол-во кластеров");
        return true;
    } else {
        return false;
    }
}

function deepCopy(mas) {
    let new_mas = [];

    for (let i = 0; i < mas.length; i++) {
        if (typeof mas[i] === 'object') {
            new_mas[i] = new Point(mas[i].x, mas[i].y, 0);
        }
    }

    return new_mas;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}