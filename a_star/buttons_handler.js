import { activeMode } from "./temp.js";

export function changeActiveMode(id) {
    //сбрасываем все кнопки, активируем текущую
    for (let i = 0; i < activeMode.length; i++) {
        activeMode[i] = 0;
    }
    activeMode[id] = 1;
}

export function buttonsHandler(id) {
    changeActiveMode(id);
}
