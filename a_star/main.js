import {
    activeButtonsHandler,
    speedButtonsHandler,
    generateMazeButtonsHandler
} from './handler_buttons.js';

import { buttonsRenderMouseMove } from './render_buttons.js';
import { idButtons } from './variables.js';
import { tableHandler } from './handler_table.js';

speedButtonsHandler(3);
generateMazeButtonsHandler(-1);

document.getElementById('table_container').addEventListener('click', (e) => { tableHandler(e) });

document.getElementById('change_size').addEventListener('click', () => { generateMazeButtonsHandler(-1) });
document.getElementById('generate_maze').addEventListener('click', () => { generateMazeButtonsHandler(-1) });
document.getElementById('generate_empty_maze').addEventListener('click', () => { generateMazeButtonsHandler(0) });

document.getElementById('add_wall').addEventListener('click', () => { activeButtonsHandler(0) });
document.getElementById('delete_wall').addEventListener('click', () => { activeButtonsHandler(1) });
document.getElementById('change_start').addEventListener('click', () => { activeButtonsHandler(2) });
document.getElementById('change_finish').addEventListener('click', () => { activeButtonsHandler(3) });
document.getElementById('launch').addEventListener('click', () => { activeButtonsHandler(4) });

document.getElementById('speed_1').addEventListener('click', () => { speedButtonsHandler(0) });
document.getElementById('speed_2').addEventListener('click', () => { speedButtonsHandler(1) });
document.getElementById('speed_3').addEventListener('click', () => { speedButtonsHandler(2) });
document.getElementById('speed_4').addEventListener('click', () => { speedButtonsHandler(3) });
document.getElementById('speed_5').addEventListener('click', () => { speedButtonsHandler(4) });

document.getElementById('break').addEventListener('click', () => { location.reload() });

for (let i = 0; i < idButtons.length; i++) {
    document.getElementById(idButtons[i]).addEventListener('mouseover', (e) => { buttonsRenderMouseMove(e) });
    document.getElementById(idButtons[i]).addEventListener('mouseout', (e) => { buttonsRenderMouseMove(e) });
}