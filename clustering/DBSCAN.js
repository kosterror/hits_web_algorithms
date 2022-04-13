import {
    RADIUS_CHANGE,
    COUNT_NEIGHBOURS_POINTS
} from "./main.js";

import { deepCopy, getRandomInt } from "./func_for_algos.js"
import { calculateDistance } from "./func_for_canvas.js";

export { DBSCAN }

function DBSCAN(points) {
    let count_clusters = 0;

    for (let i = 0; i < points.length; i++) {
        if (points[i].cluster == 0) {
            let neighbours = findNeighbours(points[i], points);

            if (neighbours.length >= COUNT_NEGHBOURS_POINTS) {
                points[i].core = true;
                count_clusters++;

                points.cluster = count_clusters;
                let queue = deepCopy(neighbours);

                for (let j = 0; j < neighbours.length; j++) {
                    if (points[j].core === false) {
                        points[j].core = true;
                    }

                    points[j].cluster = count_clusters;

                    neighbours = findNeighbours(points[j], points);
                    if (neighbours.length >= COUNT_NEGHBOURS_POINTS) {
                        queue.push(neighbours);
                    }

                }
            }
        }
    }
}

// function findNeighbours(point, points) {
//     let neighbours = [];
//     for (let i = 0; i < points.length; i++) {
//         if (calculateDistance(point.x, point.y, points[i].x, points[i].y) <= RADIUS_CHANGE) {
//             neighbours.push(points[i]);
//         }
//     }

//     return neighbours;
// }

// function DBSCAN(points) {
//     let core_points = [];
//     for (let i = 0; i < points.length; i++) {
//         if (isCorePoint(points[i], JSON.parse(JSON.stringify(points)))) {
//             points[i].core = true;
//             core_points.push(points[i]);
//         }
//     } //indentify core and non-core points

//     let ind = getRandomInt(0, core_points.length);

//     points[ind].clusters = 1;

//     let label_point = [];
//     for (let i = 0; i < points.length; i++) {
//         label_point.push(false);
//     }
// }

// function isCorePoint(p, points) {
//     let count_neighbours = 0;

//     for (let i = 0; i < points.length; i++) {
//         if (calculateDistance(p.x, p.y, points[i].x, points[i].y) <= RADIUS_CHANGE) {
//             count_neighbours++;
//         }

//         if (count_neighbours === COUNT_NEGHBOURS_POINTS) {
//             return true;
//         }
//     }

//     return false;
// }