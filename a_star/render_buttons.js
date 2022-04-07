import { activeMode, currentSpeed, idIntrectionButtons, idSpeedButtons, idButtons, COLOR_ACTIVE_BTN, COLOR_INACTIVE_BTN } from "./vatiables.js";

export function buttonsRenderClick() {
    //изменяем цвет при клике нужных кнопок
    for (let i = 0; i < activeMode.length; i++) {
        document.getElementById(idIntrectionButtons[i]).style.backgroundColor = activeMode[i] == 1 ? COLOR_ACTIVE_BTN : COLOR_INACTIVE_BTN;
    }

    for (let i = 0; i < currentSpeed.length; i++){
        document.getElementById(idSpeedButtons[i]).style.backgroundColor = currentSpeed[i] == 1 ? COLOR_ACTIVE_BTN : COLOR_INACTIVE_BTN;
    }
}

export function buttonsRenderMouseMove(e) {
    //изменяем цвет при наведении/отведении на/от кнопки
    document.getElementById(e.target.id).style.backgroundColor = e.type == 'mouseover' ? COLOR_ACTIVE_BTN : COLOR_INACTIVE_BTN;
    
    if (e.type == 'mouseout'){
        buttonsRenderClick();
    }
    
    return 0;
}