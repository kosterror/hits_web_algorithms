import { Chromosome } from "./classes.js";

import { getRandomInt } from "./func_for_algo.js";
import { findFitness } from "./func_for_algo.js";
import { createDescendant } from "./func_for_algo.js";
import { mutation } from "./func_for_algo.js";

import { POPULATION_SIZE } from "./main.js";
import { population } from "./main.js";
import { vertexList } from "./main.js";
import { MUTATION_PERCENTAGE } from "./main.js";

export { InitialPopulationGeneration, algorithmsStart }


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

function algorithmsStart() {
    CrossingAlgorithm();
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

        let descendant1 = createDescendant(chrom1, chrom2).slice(0, population[0].length) //формируем 1 потомка
        let descendant2 = createDescendant(chrom2, chrom1).slice(0, population[0].length) //формируем 2 потомка

        MutationAlgorithm(descendant1.slice(), descendant2.slice());

        i++;
    }
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

    population.sort((a, b) => a.fitness - b.fitness);

    let k = 0,
        t = population.length - POPULATION_SIZE;
    while (k < t) {
        population.pop();
        k++;
    }
}