import canvasHandler from './canvas_handler.js';
import btnsHandler from './buttons_handler.js';
import {buttonsRenderEvent} from './buttons_render.js';

const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export const WIDTH = 600;
export const HEIGHT = 600;
export const VERTEX_RADIUS = 20;
export const doc = document;

canvas.width = WIDTH;
canvas.height = HEIGHT;

export let activeMode = { value: 0 }; //сделал в виде объекта, так как хочется обращаться по ссылке
export let verticesList = [];

document.getElementById('canvas').addEventListener('click', (e) => { canvasHandler(e.offsetX, e.offsetY); });
document.getElementById('add_vertex').addEventListener('click', (e) => { btnsHandler(1, e); buttonsRenderEvent(e) });
document.getElementById('remove_vertex').addEventListener('click', (e) => { btnsHandler(2, e); buttonsRenderEvent(e) });
document.getElementById('launch_algorithm').addEventListener('click', (e) => {  btnsHandler(3, e); buttonsRenderEvent(e) });
document.getElementById('reload').addEventListener('click', () => { location.href = location.href });

document.getElementById('add_vertex').addEventListener('mouseover', (e) => { buttonsRenderEvent(e) })
document.getElementById('remove_vertex').addEventListener('mouseover', (e) => { buttonsRenderEvent(e) })
document.getElementById('launch_algorithm').addEventListener('mouseover', (e) => { buttonsRenderEvent(e) })
document.getElementById('reload').addEventListener('mouseover', (e) => { buttonsRenderEvent(e) })

document.getElementById('add_vertex').addEventListener('mouseout', (e) => { buttonsRenderEvent(e) })
document.getElementById('remove_vertex').addEventListener('mouseout', (e) => { buttonsRenderEvent(e) })
document.getElementById('launch_algorithm').addEventListener('mouseout', (e) => { buttonsRenderEvent(e) })
document.getElementById('reload').addEventListener('mouseout', (e) => { buttonsRenderEvent(e) })