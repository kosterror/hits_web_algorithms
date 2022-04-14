import { Chromosome } from "./classes.js";
import { activeMode, COUNT_GENERATIONS } from "./main.js";

import {
    getRandomInt,
    findFitness,
    createDescendant,
    mutation
} from "./func_for_algo.js";

import { vertexList } from "./main.js";
import { MUTATION_PERCENTAGE } from "./main.js";

import {
    disableButtons,
    enableButtons
} from "./buttons_handler.js";

import { deleteEdge } from "./canvas_handler.js";
import { drawEdgeAnswer } from "./canvas_handler.js";

export {
    startAlgorithm
}

export let population = [], //массив хромосом
    POPULATION_SIZE;

function startAlgorithm() {
    if (vertexList.length === 0) {
        alert("Сначала нарисуйте вершины на плоскости");
        return;
    }
    disableButtons();

    POPULATION_SIZE = Math.pow(vertexList.length, 2);
    population = []; //при добавлении новых вершин обнуляем популяцию

    InitialPopulationGeneration();

    let count = 0, //счетчик поколений
        counter_stop = 0; //счетчик для остановки программы

    let id = setInterval(function() {
        if (count > COUNT_GENERATIONS || counter_stop == 250) {
            deleteEdge();
            drawEdgeAnswer('#247ABF');

            clearInterval(id);
        }

        let fit1 = population[0].fitness; //запоминаем лучшую хромосому

        CrossingAlgorithm();

        let fit2 = population[0].fitness; // запоминаем в измененной популяции лучшую хромосому

        if (fit2 != fit1) { // проверка на новую хромосому
            counter_stop = 0;
            deleteEdge();
            drawEdgeAnswer('#7AB0DC');
        }

        count++;
        counter_stop++;

    }, 0);

    enableButtons();

}

function InitialPopulationGeneration() {
    let arr = [];

    for (let i = 0; i < vertexList.length; i++) {
        arr[i] = i;
    }
    population[0] = new Chromosome(arr.slice(), 0);

    let i = 1;
    while (arr.length != 0 && i < POPULATION_SIZE) {
        i++;

        let j = 0;
        while (j < Math.pow(vertexList.length, 2)) {
            let ind1 = getRandomInt(0, vertexList.length);
            let ind2 = getRandomInt(0, vertexList.length);

            [arr[ind1], arr[ind2]] = [arr[ind2], arr[ind1]];

            j++;
        }

        population[population.length] = new Chromosome(arr.slice(), 0);
    }

    for (let i = 0; i < population.length; i++) {
        population[i].fitness = findFitness(population[i].chromosome.slice());
    }

    population.sort((a, b) => a.fitness - b.fitness); //сортируем популяцию по приспособленности
}

function CrossingAlgorithm() {
    let i = 0;
    while (i < Math.pow(vertexList.length, 2)) {
        let chrom1 = population[getRandomInt(0, population.length)].chromosome.slice(0, population[0].chromosome.length);
        let chrom2 = population[getRandomInt(0, population.length)].chromosome.slice(0, population[0].chromosome.length);

        while (chrom1 == chrom2) {
            chrom1 = population[getRandomInt(0, population.length)].chromosome.slice(0, population[0].chromosome.length);
            chrom2 = population[getRandomInt(0, population.length)].chromosome.slice(0, population[0].chromosome.length);
        }

        let point_break = getRandomInt(1, vertexList.length);
        let descendant1 = createDescendant(chrom1, chrom2, point_break).slice(0, population[0].length) //формируем 1 потомка
        let descendant2 = createDescendant(chrom2, chrom1, point_break).slice(0, population[0].length) //формируем 2 потомка

        MutationAlgorithm(descendant1.slice(), descendant2.slice());

        i++;
    }

    population.sort((a, b) => a.fitness - b.fitness);

    population.splice(POPULATION_SIZE, population.length);
}

function MutationAlgorithm(descendant1, descendant2) {
    let num = getRandomInt(0, 101);
    let ind1;
    let ind2;

    if (num < MUTATION_PERCENTAGE) {
        descendant1 = mutation(descendant1.slice());
        descendant2 = mutation(descendant2.slice());
    }

    AddDescendantsToPopulation(descendant1.slice(), descendant2.slice());
}

function AddDescendantsToPopulation(descendant1, descendant2) {
    population[population.length] = new Chromosome(descendant1, 0);
    population[population.length] = new Chromosome(descendant2, 0);

    for (let i = 0; i < population.length; i++) {
        population[i].fitness = findFitness(population[i].chromosome.slice());
    }
}