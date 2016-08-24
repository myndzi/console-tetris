'use strict';

var Matrix = require('./matrix'),
    Controller = require('./controller'),
    pieces = require('./pieces');

setInterval(() => { }, 10000);

var controller = new Controller(),
    matrix = new Matrix(10, 20),
    timer = null;


function setGravity(delay) {
    if (timer !== null) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        matrix.shift(-matrix.realWidth);
        matrix.print();
    }, delay);
}

function exit() {
    clearInterval(timer);
    controller.destroy();
    process.exit(0);
}
function spawn() {
    var piece = pieces[
        Math.floor(Math.random() * pieces.length)
    ];
    matrix.spawn(piece);
    matrix.print();
}

setGravity(200);
spawn();

matrix.print();

matrix.on('lock', spawn);
matrix.on('gameOver', function () {
    console.log('Game over!');
    exit();
});

controller.on('key', function (str) {
    switch (str) {
        case 'q':
        case 'esc':
            exit();
        break;

        case 'left':
            matrix.shift(-1);
        break;

        case 'right':
            matrix.shift(1);
        break;

        case 'down':
            matrix.shift(-matrix.realWidth);
        break;

        case ' ':
            while (!matrix.shift(-matrix.realWidth)) { }
        break;

        case 'u':
        case 'f':
            matrix.rotate(1);
        break;

        case 'e':
        case 'd':
            matrix.rotate(3);
        break;

        case 'o':
        case 's':
            matrix.rotate(2);
        break;

        default:
        break;
    }

    matrix.print();
});