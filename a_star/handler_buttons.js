import {
    activeMode,
    currentSpeed,
    delay
} from "./variables.js";
import { buttonsRenderClick } from "./render_buttons.js";
import { createMaze } from "./generate_and_draw_maze.js";
import { aStarWrapper } from "./algorithm_a_star.js";

export async function activeButtonsHandler(id) {
    await changeActiveMode(id);
    buttonsRenderClick()
}

export async function speedButtonsHandler(id) {
    await changeCurrentSpeed(id);
    buttonsRenderClick()
}

export async function generateMazeButtonsHandler(type) {
    if (activeMode[4] != 1) {
        await createMaze(type);
    }
}

function changeActiveMode(id) {
    if (id == -1) {
        //сброс всех кнопок
        for (let i = 0; i < activeMode.length; i++) {
            activeMode[i] = 0;
        }
    }

    else if (activeMode[4] == 0) {
        //алгоритм не работает, активируем кнопку id
        for (let i = 0; i < activeMode.length; i++) {
            activeMode[i] = 0;
        }
        activeMode[id] = 1;

        if (id == 4) {
            aStarWrapper();
        }
    }
}

function changeCurrentSpeed(id) {
    for (let i = 0; i < currentSpeed.length; i++) {
        currentSpeed[i] = 0;
    }
    currentSpeed[id] = 1;

    if (id == 0) {
        delay.value = 500;
    }

    else if (id == 1) {
        delay.value = 250;
    }
    else if (id == 2) {
        delay.value = 100;
    }

    else if (id == 3) {
        delay.value = 25;
    }

    else if (id == 4) {
        delay.value = 1;
    }
}
