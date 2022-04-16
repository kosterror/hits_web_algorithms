const CANVAS = document.querySelector('canvas');
const ANSWER_TEXT = document.getElementById('answer');
const TOOL_TEXT = document.getElementById("changeTool_button");
const ctx = CANVAS.getContext('2d');
const CANVAS_SIZE = 600;
CANVAS.width = CANVAS_SIZE;
CANVAS.height = CANVAS_SIZE;
const PIXEL_PER_SIDE = 56;
const PEN_WIDTH = 4;
const ERASER_WIDTH = 3;

const VIEW_MODE = 2;
const PEN_MODE = 1;
const ERASER_MODE = 0;
let activeMode = VIEW_MODE;

let isMouseDown;

let inputMatrix = new Array(PIXEL_PER_SIDE);
for(let i = 0; i<PIXEL_PER_SIDE; i++) {
    inputMatrix[i] = new Array(PIXEL_PER_SIDE);
    for(let j = 0 ; j<PIXEL_PER_SIDE; j++) {
        inputMatrix[i][j] = 0;
    }
}

CANVAS.addEventListener('mousedown', startDrawing);
CANVAS.addEventListener('mouseup', stopDrawing);
CANVAS.addEventListener('mouseleave', stopDrawing);
CANVAS.addEventListener('click', handler);
flushScreen_button.addEventListener('click', flush);
changeTool_button.addEventListener('click', changeTool);

// on and off drawing
function startDrawing() {
    isMouseDown = true;
    CANVAS.addEventListener('mousemove', handler);
}
function stopDrawing() {
    CANVAS.removeEventListener('mousemove', handler);
    if((isMouseDown)&&(activeMode!==VIEW_MODE)) {
        ANSWER_TEXT.value = 'Ответ: ' + makeGuess(inputMatrix);
        isMouseDown = false;
    }
}

// functions that drawing on canvas and put your drawing to matrix
function handler(event) {
    //ANSWER_TEXT.value = 'Ответ: ' + makeGuess(inputMatrix);
    if(activeMode != VIEW_MODE){
        let pixelSize = Math.ceil(CANVAS_SIZE/PIXEL_PER_SIDE);
        let x = event.offsetX;
        let y = event.offsetY;
        x = x - (x % pixelSize);
        y = y - (y % pixelSize);
        if(activeMode == PEN_MODE){ 
            let color = "black";
            draw(x, y, color, PEN_WIDTH, pixelSize, activeMode);
        }
        if(activeMode == ERASER_MODE) { 
            let color = "white";
            draw(x, y, color, ERASER_WIDTH, pixelSize, activeMode);
        }
    }
}
function draw(x, y, color, width, pixelSize, mode) {
    ctx.fillStyle = color;
    for(let i = 0; i<width; i++) {
        for(let j = 0; j<width; j++) {
            if(inMatrix(x + i*pixelSize, y + j*pixelSize)) {
                ctx.fillRect(x + i*pixelSize, y + j*pixelSize, pixelSize, pixelSize);
                inputMatrix[parseInt(y/pixelSize + j)][parseInt(x/pixelSize + i)] = mode;
            }
        }
    }
}
function inMatrix(x, y, pixel) {
    if((0 <= x && x < CANVAS_SIZE)
     &&(0 <= y && y < CANVAS_SIZE)) {
        
        return true;
    }
    return false;
}

// event that clear canvas where you can draw numbers
function flush() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    for(let i = 0; i<PIXEL_PER_SIDE; i++) {
        for(let j = 0; j<PIXEL_PER_SIDE; j++) {
            inputMatrix[i][j] = 0;
        }
    }
    activeMode = VIEW_MODE;
    TOOL_TEXT.value = "Взять ручку";
    ANSWER_TEXT.value = "Здесь будет ответ"
}

// event that change your tool
function changeTool() {
    if(activeMode === PEN_MODE) {
        activeMode = ERASER_MODE;
        TOOL_TEXT.value = "Взять ручку";
    }
    else {
        activeMode = PEN_MODE;
        TOOL_TEXT.value = "Взять ластик";
    }
}