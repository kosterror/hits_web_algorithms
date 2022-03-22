//разработка canvas для создания точек пользователем на плоскости
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1400;
canvas.height = 580;

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
    over: false,
    draw: false
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
    } else if (event.buttons === 2) {
        mouse.right = true;
    }

    //console.log(event);
}

function mouseupHandler(event) {
    if (event.button === 0) {
        mouse.left = false;
    } else if (event.button === 2) {
        mouse.right = false;
    }
}

animation({
    clear() {
        //     context.beginPath();
        //     context.rect(0, 0, canvas.width, canvas.height);
        //     context.fillStyle = "#0b5c8b3a";
        //     context.fill();
    },

    update() {
        if (mouse.left && !mouse.pLeft) {
            mouse.draw = true;
        }

        mouseTick();
    },

    render() {
        if (mouse.draw) {
            context.beginPath();
            context.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2, false);
            context.closePath();
            context.fillStyle = "black";
            context.fill();

            mouse.draw = false;
        }
    }
})

//сам алгоритм кластеризации



//кнопки
var but1 = document.getElementById("startAlg");
var but2 = document.getElementById("restartAlg");

but1.onclick = function() {
    alert("We're clicking this button");
    //запуск алгоритма
}

but2.onclick = function() {
    window.location.reload();
    //перезапуск страницы
}
