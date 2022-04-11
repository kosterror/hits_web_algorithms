export let activeMode = [0, 0, 0, 0, 0];
export let currentSpeed = [0, 0, 0, 0, 0];
export let delay = { value: 250 };

export let idButtons = ['change_size', 'generate_maze', 'generate_empty_maze', 'add_wall', 'delete_wall', 'change_start', 'change_finish', 'launch', 'speed_1', 'speed_2', 'speed_3', 'speed_4', 'speed_5', 'break'];
export let idIntrectionButtons = ['add_wall', 'delete_wall', 'change_start', 'change_finish', 'launch'];
export let idSpeedButtons = ['speed_1', 'speed_2', 'speed_3', 'speed_4', 'speed_5'];

export const COLOR_ACTIVE_BTN = '#7AB0DC';
export const COLOR_INACTIVE_BTN = '#247ABF';

export const COLOR_WALL = '#51585a';
export const COLOR_ROAD = '#bbc6ca';
export const COLOR_START = '#ECEC17';
export const COLOR_FINISH = '#F98C4F';
export const COLOR_PATH = '#8FC7F3';
export const COLOR_CURRENT_CELL = '#66ff33';
export const COLOR_CONSIDER_CELL = '#AA43DB';
export const COLOR_CONSIDERED_CELL = '#247ABF';