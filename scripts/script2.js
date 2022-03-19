const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function animation(obj) {
    const { clear, update, render } = obj;
    let pTimestamp = 0;

    requestAnimationFrame(tick);

    function tick(timestamp) {
        requestAnimationFrame(tick);

        const diff = timestamp - pTimestamp;
        pTimestamp = timestamp;

        const parametrs = {
            timestamp,
            pTimestamp
        }

        clear();
        update(parametrs);
        render(parametrs);
    }
}

const mouse = {
    x: 0,
    y: 0,
    left: false,
    pLeft: false,
    right: false,
    pRight: false,
}

function mouseTick() {
    mouse.pLeft = mouse.left;
    mouse.pRight = mouse.right;
}

canvas.addEventListener('mouseenter', mouseenterHandler);
canvas.addEventListener('mousemove', mousemoveHandler);
canvas.addEventListener('mouseleave', mouseleaveHandler);
canvas.addEventListener('mousedown', mousedownHandler);
canvas.addEventListener('mouseup', mouseupHandler);

function mouseenterHandler(event) {
    mouse.over = true;
}

function mousemoveHandler(even) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
}

function mouseleaveHandler(event) {
    mouse.over = false;
}

function mousedownHandler(event) {
    if (event.buttons === 1) {
        mouse.left = true;
    }

    console.log(event);
}

function mouseupHandler(event) {
    if (event.button === 0) {
        mouse.left = false;
    }
}

let draw = false;

animation({
    clear() {
        //     context.beginPath();
        //     context.rect(0, 0, canvas.width, canvas.height);
        //     context.fillStyle = "#0b5c8b3a";
        //     context.fill();
    },

    update() {
        if (mouse.left && !mouse.pLeft) {
            draw = true;
        }

        mouseTick();
    },

    render() {
        if (draw) {
            context.beginPath();
            context.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2, false);
            context.closePath();
            context.fillStyle = "yellow";
            context.fill();

            draw = false;
            console.log("НИХУЯ");
        }
    }
})