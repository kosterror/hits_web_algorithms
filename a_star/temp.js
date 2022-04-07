export let activeMode = [0, 0, 0, 0, 0];    //[0] - добавить стену
//[1] - удалить стену
//[2] - выбрать старт
//[3] - выбрать финиш
//[4] - работа алгоритма
export let idButtons = ['change_size', 'generate_maze', 'generate_empty_maze', 'add_wall', 'delete_wall', 'change_start', 'change_finish', 'launch', 'speed_1', 'speed_2', 'speed_3', 'speed_4', 'speed_5', 'break'];
export let idIntrectionButtons = ['add_wall', 'delete_wall', 'change_start', 'change_finish', 'launch'];
export const COLOR_ACTIVE_BTN = '#666969';
export const COLOR_INACTIVE_BTN = '#8D9091';

export const COLOR_WALL = '#51585a';
export const COLOR_ROAD = '#bbc6ca';
export const COLOR_START = 'yellow';
export const COLOR_FINISH = 'red';
export const COLOR_PATH = '#6ddf8f';
export const COLOR_CURRENT_CELL = '#66ff33';
export const COLOR_CONSIDER_CELL = '#ff99cc';
export const COLOR_CONSIDERED_CELL = '#6dc2df';

export let idSpeedButtons = ['speed_1', 'speed_2', 'speed_3', 'speed_4', 'speed_5'];
export let currentSpeed = [0, 0, 0, 0, 0];