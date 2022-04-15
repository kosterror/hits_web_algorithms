import { data_points } from "./main.js";

import { calculateDistance, showOldPoints } from "./canvas_handler.js";
import {
    disableButtons,
    enableButtons
} from "./buttons_handler.js";

import {
    checkingOnError,
    deepCopy
} from "./func_for_algo.js";

export { startGraph }

let adjMatrix = [];

function startGraph() {
    debugger;
    if (!checkingOnError()) {
        showOldPoints();
        disableButtons();

        createAdjMatrix(deepCopy(data_points));
        Graph(deepCopy(data_points));

        enableButtons();
    }
}

function Graph(points) {
    let span_tree = getSpanTree(points);

    ZEMST(points, span_tree);
}

function getSpanTree(points) {
    let set_visit = [];
    for (let i = 0; i < points.length; i++) {
        set_visit.push(false);
    }

    let spanning_tree = [];
    for (let i = 0; i < points.length; i++) {
        spanning_tree.push(new Array(points.length));
    }

    let edge_count = 0;

    set_visit[0] = true;

    while (edge_count < points.length - 1) {
        let mini = Infinity,
            ind_cur_ver1 = -1,
            ind_cur_ver2 = -1;

        for (let i = 0; i < points.length; i++) {
            if (set_visit[i] === true) {
                for (let j = 0; j < points.length; j++) {
                    if (adjMatrix[i][j] !== 0 && adjMatrix[i][j] < mini) {
                        if (checkOnValidEdge(set_visit.slice(), i, j)) {
                            ind_cur_ver1 = i;
                            ind_cur_ver2 = j;
                            mini = adjMatrix[i][j];
                        }
                    }
                }
            }
        }

        if (ind_cur_ver1 !== -1 && ind_cur_ver2 !== -1) {
            spanning_tree[ind_cur_ver1][ind_cur_ver2] = mini;
            spanning_tree[ind_cur_ver2][ind_cur_ver1] = mini;
            points[ind_cur_ver1]

            edge_count++;
            set_visit[ind_cur_ver2] = true;
        }
    }

    return spanning_tree;
}

function ZEMST(points, span_tree) { // The Zahn’s maximum spanning tree
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points.length; j++) {
            if (span_tree[i][j] != undefined) {
                let sub_tree1 = findSubTree(i, j, points, span_tree);
                let sub_tree2 = findSubTree(j, i, points, span_tree);

                let aver_weight_sub_tree1 = calculateAverageWeightEdge(sub_tree2, span_tree);
                let aver_weight_sub_tree2 = calculateAverageWeightEdge(sub_tree1, span_tree);

                let dev_weight_sub_tree1 = calculateStandartDeviationWeight(aver_weight_sub_tree1, sub_tree2, span_tree);
                let dev_weight_sub_tree2 = calculateStandartDeviationWeight(aver_weight_sub_tree2, sub_tree1, span_tree);

                if (span_tree[i][j] > aver_weight_sub_tree1 - dev_weight_sub_tree1) {
                    span_tree[i][j] = 0;
                    span_tree[i][j] = 0;
                    definitionCluster(sub_tree2, points);

                } else if (adjMatrix[i][j] > aver_weight_sub_tree2 - dev_weight_sub_tree2) {
                    span_tree[i][j] = 0;
                    span_tree[i][j] = 0;
                    definitionCluster(sub_tree2, points);

                } else if (adjMatrix[i][j] > ((calculateSumWeightEdges(sub_tree1, span_tree) + calculateSumWeightEdges(sub_tree2, span_tree)) / (sub_tree1.length + sub_tree2.length))) {
                    span_tree[i][j] = 0;
                    span_tree[i][j] = 0;
                    definitionCluster(sub_tree2, points);
                }
            }
        }
    }
}

function findSubTree(ind_p1, ind_p2, points, span_tree) {
    let sub_tree = [ind_p1];
    let ind_cur_p = ind_p1;
    let flag = true;
    let used_points = [];
    for (let i = 0; i < points.length; i++) {
        used_points.push(false);
    }

    while (flag) {
        flag = false;

        for (let i = 0; i < points.length; i++) {
            if (span_tree[ind_cur_p][i] !== undefined && used_points[i] === false && i !== ind_p2) {
                sub_tree.push(i);
                used_points[ind_cur_p] = true;

                flag = true;
                ind_cur_p = i;
                break;
            }
        }
    }

    return sub_tree;
}

function calculateAverageWeightEdge(sub_tree, span_tree) {
    let sum_weight_edges = calculateSumWeightEdges(sub_tree.slice(), span_tree);

    return (sum_weight_edges / (sub_tree.length - 1));
}

function calculateStandartDeviationWeight(aver_weight_sub_tree1, sub_tree2, span_tree) {
    let sum = 0;
    for (let i = 0; i < sub_tree2.length - 1; i++) {
        sum += Math.pow(span_tree[sub_tree2[i]][sub_tree2[i + 1]] - aver_weight_sub_tree1, 2);
    }

    return (Math.sqrt(sum / (sub_tree2.length - 1)));
}

function calculateSumWeightEdges(tree, span_tree) {
    let sum = 0;
    for (let i = 0; i < tree.length - 1; i++) {
        if (span_tree[tree[i]][tree[i + 1]] != 'empty') {
            sum += span_tree[tree[i]][tree[i + 1]];
        }
    }

    return sum;
}

function definitionCluster(sub_tree2, points) {
    let count_clusters = points[sub_tree2[0]].cluster;
    for (let i = 0; i < sub_tree2.length; i++) {
        points[sub_tree2[i]].cluster = count_clusters + 1;
    }

    drawPoints(points, sub_tree2);
}

function checkOnValidEdge(set_visit, ind_p1, ind_p2) {
    if (ind_p1 === ind_p2)
        return false;

    if (set_visit[ind_p1] == true && set_visit[ind_p2] == true)
        return false;

    return true;
}

function createAdjMatrix(points) {
    for (let i = 0; i < points.length; i++) {
        adjMatrix.push(new Array(points.length));
    }

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            let dist = calculateDistance(points[i].x, points[i].y, points[j].x, points[j].y);
            adjMatrix[i][j] = dist;
            adjMatrix[j][i] = dist;
        }
    }
}

function drawPoints(points, tree) {
    for (let i = 0; i < tree.length; i++) {
        points[tree[i]].draw();
    }
}