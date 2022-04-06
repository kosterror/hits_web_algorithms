import { buttonsHandler, changeActiveMode } from './buttons_handler.js';
import { buttonsRenderClick, buttonsRenderMouseMove } from './buttons_render.js';
import { idButtons } from './temp.js';
import { createMaze } from './generate_maze.js';

document.getElementById('change_size').addEventListener('click', () => { createMaze(-1) });
document.getElementById('generate_maze').addEventListener('click', () => { createMaze(-1) });
document.getElementById('generate_empty_maze').addEventListener('click', () => { createMaze(0) });


document.getElementById('add_wall').addEventListener('click', () => { buttonsHandler(0), buttonsRenderClick() });
document.getElementById('delete_wall').addEventListener('click', () => { buttonsHandler(1), buttonsRenderClick() });
document.getElementById('change_start').addEventListener('click', () => { buttonsHandler(2), buttonsRenderClick() });
document.getElementById('change_finish').addEventListener('click', () => { buttonsHandler(3), buttonsRenderClick() });
document.getElementById('launch').addEventListener('click', () => { buttonsHandler(4), buttonsRenderClick });

for (let i = 0; i < idButtons.length; i++) {
    document.getElementById(idButtons[i]).addEventListener('mouseover', (e) => { buttonsRenderMouseMove(e) });
    document.getElementById(idButtons[i]).addEventListener('mouseout', (e) => { buttonsRenderMouseMove(e) });
}