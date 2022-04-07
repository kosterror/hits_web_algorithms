import { activeMode, currentSpeed } from "./temp.js";
import { buttonsRenderClick, buttonsRenderMouseMove } from "./render_buttons.js";

export async function activeButtonsHandler(id) {
    await changeActiveMode(id);
    buttonsRenderClick()
}

export async function speedButtonsHandler(id) {
    await changeCurrentSpeed(id);
    buttonsRenderClick()
}

export function changeActiveMode(id) {
    //сбрасываем все кнопки, активируем текущую
    for (let i = 0; i < activeMode.length; i++) {
        activeMode[i] = 0;
    }
    if (id != -1) {         //когда ни одна кнопка не активна
        activeMode[id] = 1;
    }
}

function changeCurrentSpeed(id) {
    for (let i = 0; i < currentSpeed.length; i++) {
        currentSpeed[i] = 0;
    }
    currentSpeed[id] = 1;
}



