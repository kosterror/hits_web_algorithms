import { count_clusters } from "./main.js";

import { calculateDistance } from "./func_for_canvas.js";

export { kMeansPlusPlus };


function kMeansPlusPlus(points, centroids) {
    points = findFirstCentroids(points.slice(), centroids) //create array the first centroids

    let counter = 0;
    while (counter < 50) {
        let points_new = assignPointsToCluster(points.slice(), centroids.slice());

        if (points === points_new) {
            break;
        }
        points = points_new.slice();

        centroids = calculateNewPositionClusters(points.slice(), centroids.slice());
        counter++;
    }

    console.log("END");
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
                let d = Math.sqrt(calculateDistance(centroids[i].x, centroids[i].y, points[j].x, points[j].y));

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
                    let d = Math.sqrt(calculateDistance(centroids[k].x, centroids[k].y, points[j].x, points[j].y));
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

    //create just K-means

    // let index = getRandomInt();
    // points[0].klaster = 1;
    // centroids[0] = points[0]; //выбрали первый центроид
    // centroids[0].draw();

    // for (let i = 0; i < count_clusters - 1; i++) {
    //     let SumDx = 0;
    //     for (let j = 0; j < points.length; j++) {
    //         distance[j] = calculateDistance(points[j], centroids[i]);
    //         SumDx += distance[j];
    //     }

    //     let k = findIndexNextCentroid(distance, SumDx);
    //     let flag = false; //флажок для отслеживания изменения массива центроидов

    //     while (!flag) {
    //         if (isCanCentroids(points[k], centroids.slice())) {
    //             points[k].klaster = i + 2;
    //             centroids[centroids.length] = points[k];
    //             centroids[centroids.length - 1].draw();
    //             flag = true;
    //             console.log(flag);

    //         } else {
    //             k = findIndexNextCentroid(distance, SumDx);
    //         }
    //     }
    // }

    // return points;

    // let distance = [];

    // for (let i = 0; i < count_clusters;) {
    //     let index = getRandomInt(0, points.length);
    //     if (isCanCentroids(points[index], centroids.slice())) {
    //         points[index].cluster = i + 1;
    //         centroids[i] = points[index]; //chose the first centroids
    //         i++;
    //     }
    // }

    // return points;
}

function assignPointsToCluster(points, centroids) {
    for (let i = 0; i < points.length; i++) {
        let min_dist = Infinity;
        let num_klast;
        for (let j = 0; j < centroids.length; j++) {
            let tmp = Math.sqrt(calculateDistance(points[i].x, points[i].y, centroids[j].x, centroids[j].y));
            if (min_dist > tmp) {
                min_dist = tmp;
                num_klast = centroids[j].cluster;
            }
        }

        if (points[i].cluster !== num_klast) {
            points[i].cluster = num_klast;
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
        SumX[i] = 0;
        SumY[i] = 0;
        count[i] = 0;
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

function findIndexNextCentroid(points_lenght, distance, SumDx) {
    let rand = Math.random(0.0, 1.0) * SumDx;

    SumDx = 0;
    let ind = 0;
    while (SumDx <= rand && ind < points_lenght - 1) {
        SumDx += distance[ind];
        ind++;
    }

    return ind;
}

function isCanCentroids(point, centroids) {
    for (let i = 0; i < centroids.length; i++) {
        if (centroids[i].x == point.x & centroids[i].y == point.y) {
            return false;
        }
    }

    return true;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

//K-means YEP

//graph 

//DBSCAN