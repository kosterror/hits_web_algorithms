const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 500;
context.fillStyle = 'black';

context.fill();

for (var i = 0; i < 1000; i = i + 50) {
    for (var j = 0; j <= 500; j = j + 50) {
        var n = i / 50;
        var k = j / 50;
        if ((n + k) % 2 == 0) {
            context.beginPath();
            context.rect(i, j, 50, 50)
            context.fill();
        }
    }
}