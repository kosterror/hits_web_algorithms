import {
    calculateDistance,
    showOldPoints
} from "./canvas_handler.js";
import { data_points } from "./main.js";
import {
    disableButtons,
    enableButtons
} from "./buttons_handler.js";

import {
    checkingOnError,
    deepCopy,
    getRandomInt
} from "./func_for_algo.js";

export { startkMeans };

export let count_clusters;

function startkMeans() {
    count_clusters = Number(document.getElementById('getClusters').value);

    if (!checkingOnError(count_clusters)) {
        showOldPoints();
        disableButtons();

        kMeans(deepCopy(data_points));

        enableButtons();
    }
}

function kMeans(points) {
    let centroids = [];
    points = findFirstCentroids(points.slice(), centroids) //create array the first centroids

    let counter = 0;
    while (counter < 50) {
        let points_new = assignPointsToCluster(points.slice(), centroids.slice());

        if (points == points_new) {
            break;
        }
        points = points_new.slice();

        centroids = calculateNewPositionClusters(points.slice(), centroids.slice());
        counter++;
    }
}

function findFirstCentroids(points, centroids) {
    let ind = getRandomInt(0, points.length);
    points[ind].cluster = 1;
    centroids[0] = points[ind];
    centroids[0].draw();

    for (let i = 0; i < count_clusters - 1; i++) {
        let ind_next_centr;
        if (i == 0) {
            let max_dist = 0;

            for (let j = 0; j < points.length; j++) {
                let d = calculateDistance(centroids[i].x, centroids[i].y, points[j].x, points[j].y);

                if (d > max_dist && isCanCentroids(points[j], centroids)) {
                    max_dist = d;
                    ind_next_centr = j;
                }

            }
            points[ind_next_centr].cluster = i + 2;
            centroids[i + 1] = points[ind_next_centr];
            centroids[i + 1].draw();

        } else {
            let sum_max_dist = 0;
            for (let j = 0; j < points.length; j++) {
                let s = 0;
                for (let k = 0; k < centroids.length; k++) {
                    let d = calculateDistance(centroids[k].x, centroids[k].y, points[j].x, points[j].y);
                    s += d;
                }

                if (sum_max_dist < s && isCanCentroids(points[j], centroids)) {
                    sum_max_dist = s;
                    ind_next_centr = j;
                }
            }

            points[ind_next_centr].cluster = i + 2;
            centroids[i + 1] = points[ind_next_centr];
            centroids[i + 1].draw();

        }
    }

    return points;
}

function assignPointsToCluster(points, centroids) {
    for (let i = 0; i < points.length; i++) {
        let min_dist = Infinity;
        let num_clust;
        for (let j = 0; j < centroids.length; j++) {
            let tmp = calculateDistance(points[i].x, points[i].y, centroids[j].x, centroids[j].y);
            if (min_dist > tmp) {
                min_dist = tmp;
                num_clust = centroids[j].cluster;
            }
        }

        if (points[i].cluster !== num_clust && ChangeCluster(points[i], num_clust, points, centroids)) {
            points[i].cluster = num_clust;
            points[i].draw();
        }
    }

    return points;
}

function calculateNewPositionClusters(points, centroids) {
    let centroids_new = centroids.slice();
    let SumX = [],
        SumY = [],
        count = [];

    for (let i = 0; i < count_clusters; i++) {
        SumX.push(0);
        SumY.push(0);
        count.push(0);
    }

    for (let i = 0; i < points.length; i++) {
        SumX[points[i].cluster - 1] += points[i].x;
        SumY[points[i].cluster - 1] += points[i].y;
        count[points[i].cluster - 1]++;
    }

    for (let i = 0; i < centroids_new.length; i++) {
        centroids_new[i].x = SumX[i] / count[i];
        centroids_new[i].y = SumY[i] / count[i];
    }

    return centroids_new;
}

function ChangeCluster(point, num_clust, points, centroids) { //проверка на то, стоит ли менять кластер у точки
    let dist1 = calculateDistance(point, centroids[point.cluster - 1]);
    for (let i = 0; i < points.length; i++) {
        if (points[i].cluster == point.cluster && calculateDistance(point, points[i])) {

        }
    }

    let dist2 = calculateDistance(point, centroids[num_clust - 1]);

    if (dist1 < dist2) {
        return false;
    } else {
        return true;
    }
}

function isCanCentroids(point, centroids) {
    for (let i = 0; i < centroids.length; i++) {
        if (centroids[i].x == point.x & centroids[i].y == point.y) {
            return false;
        }
    }

    return true;
}