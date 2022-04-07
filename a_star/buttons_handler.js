import { activeMode, currentSpeed } from "./temp.js";

export function activeButtonsHandler(id) {
    changeActiveMode(id);
}

export function speedButtonsHandler(id){
    changeCurrentSpeed(id);
}

export function changeActiveMode(id) {
    //сбрасываем все кнопки, активируем текущую
    for (let i = 0; i < activeMode.length; i++) {
        activeMode[i] = 0;
    }
    activeMode[id] = 1;
}

function changeCurrentSpeed(id){
    for (let i = 0; i < currentSpeed.length; i++){
        currentSpeed[i] = 0;
    }
    currentSpeed[id] = 1;
}



