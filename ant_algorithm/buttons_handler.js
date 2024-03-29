import { activeMode } from './main.js';
import antAlgorithmWrapper from './ant_algorithm.js';
import { buttonsRender } from './buttons_render.js';

async function btnsHandler(handlerNumber, e) {
    if (activeMode.value != 3) {
        activeMode.value = handlerNumber;
        buttonsRender()

        if (activeMode.value == 3) {
            buttonsRender();
            await antAlgorithmWrapper(); 
            buttonsRender();
        }
    }
}

export default btnsHandler;