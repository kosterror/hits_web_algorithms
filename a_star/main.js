import { activeButtonsHandler, speedButtonsHandler } from './buttons_handler.js';
import { buttonsRenderClick, buttonsRenderMouseMove } from './buttons_render.js';
import { idButtons } from './temp.js';
import { createMaze } from './generate_and_draw_maze.js';
import { tableHandler } from './table_handler.js';

document.getElementById('table_container').addEventListener('click', (e) => { tableHandler(e) });

document.getElementById('change_size').addEventListener('click', () => { createMaze(-1) });
document.getElementById('generate_maze').addEventListener('click', () => { createMaze(-1) });
document.getElementById('generate_empty_maze').addEventListener('click', () => { createMaze(0) });

document.getElementById('add_wall').addEventListener('click', () => { activeButtonsHandler(0), buttonsRenderClick() });
document.getElementById('delete_wall').addEventListener('click', () => { activeButtonsHandler(1), buttonsRenderClick() });
document.getElementById('change_start').addEventListener('click', () => { activeButtonsHandler(2), buttonsRenderClick() });
document.getElementById('change_finish').addEventListener('click', () => { activeButtonsHandler(3), buttonsRenderClick() });
document.getElementById('launch').addEventListener('click', () => { activeButtonsHandler(4), buttonsRenderClick });

document.getElementById('speed_1').addEventListener('click', () => { speedButtonsHandler(0) }, buttonsRenderClick());
document.getElementById('speed_2').addEventListener('click', () => { speedButtonsHandler(1) }, buttonsRenderClick());
document.getElementById('speed_3').addEventListener('click', () => { speedButtonsHandler(2) }, buttonsRenderClick());
document.getElementById('speed_4').addEventListener('click', () => { speedButtonsHandler(3) }, buttonsRenderClick());
document.getElementById('speed_5').addEventListener('click', () => { speedButtonsHandler(4) }, buttonsRenderClick());

//живое наведение на кнопки
for (let i = 0; i < idButtons.length; i++) {
    document.getElementById(idButtons[i]).addEventListener('mouseover', (e) => { buttonsRenderMouseMove(e) });
    document.getElementById(idButtons[i]).addEventListener('mouseout', (e) => { buttonsRenderMouseMove(e) });
}