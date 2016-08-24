'use strict';

// left to right, bottom to top

var EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits;

var pieces = require('./pieces'),
    { isBlocked } = require('./util');

const CHARS = {
    0: '  ',
    1: '░░',
    2: '▓▓',
    99: 'xx'
};

function Matrix(width, height) {
    EventEmitter.call(this);

    this.width = width;
    this.height = height;
    this.size = width * height;

    this.realWidth = width + 1;
    this.realHeight = height + 2;
    this.realSize = this.realWidth * this.realHeight;

    this.blankLine = new Array(this.realWidth).fill(0);
    this.blankLine[0] = 99;
    this.blankLine.unshift(-this.realWidth, 0);

    this.initData();

    this.activePiece = null;
    this.activeRotation = 0;
    this.activePos = null;
}
inherits(Matrix, EventEmitter);

Matrix.prototype.initData = function () {
    this.data = new Array(this.realSize).fill(0);

    let i;
    for (i = 0; i < this.realWidth; i++) {
        this.data[i] = 99;
        this.data[this.realSize - this.realWidth + i] = 99;
    }
    for (i = 0; i < this.realSize; i += this.realWidth) {
        this.data[i] = 99;
    }
};
Matrix.prototype.print = function () {
    process.stdout.write('\x1b[2J\x1b[1;1H');
    let data = this.data.slice(),
        piece = this.activePiece,
        rot = this.activeRotation,
        pos = this.activePos;

    if (piece !== null) {
        piece.rotations[rot].forEach(offset => {
            data[pos + offset] = piece.char;
        });
    }

    console.log(new Array(this.width*2+2).fill('+').join(''));
    for (let row = this.realHeight - 2; row > 0; row--) {
        console.log('+'+
            data.slice(
                row * this.realWidth + 1,
                row * this.realWidth + this.width + 1
            ).map(v => CHARS[v]).join('')+
        '+');
    }
    console.log(new Array(this.width*2+2).fill('+').join(''));
};
Matrix.prototype.spawn = function (piece) {
    let pos = this.realSize + piece.offset;

    if (isBlocked(this.data, pos, piece.rotations[0])) {
        this.emit('gameOver');
        return;
    }

    this.activePiece = piece;
    this.activePos = pos;
    this.activeRotation = 0;
    this.print();
};
// rotate = counterclockwise from 0 (no rotation)
Matrix.prototype.rotate = function (dir) {
    let newRotation = (this.activeRotation + dir) % this.activePiece.rotations.length;
    if (!isBlocked(
        this.data,
        this.activePos,
        this.activePiece.rotations[newRotation])
    ) {
        this.activeRotation = newRotation;
    }
};

// 1 = right, -1 = left, -11 = down
Matrix.prototype.shift = function (dir) {
    let piece = this.activePiece,
        offsets = piece.rotations[this.activeRotation],
        pos = this.activePos;

    if (!isBlocked(this.data, pos + dir, offsets)) {
        this.activePos += dir;
        return false;
    } else if (dir <= -this.realWidth) {
        this.lock();
        return true;
    }
};

Matrix.prototype.lock = function () {
    let piece = this.activePiece,
        offsets = piece.rotations[this.activeRotation],
        pos = this.activePos;

    offsets.forEach(offset => {
        this.data[pos + offset] = piece.char;
    });

    this.activePiece = null;
    this.activePos = null;
    this.activeRotation = null;

    this.clearLines();

    this.emit('lock');
};

Matrix.prototype.clearLines = function () {
    let cleared = 0, row, tmp;

    for (row = this.realHeight - 2; row > 0; row--) {
        tmp = this.data.slice(
            row * this.realWidth + 1,
            row * this.realWidth + this.width + 1
        );
        if (tmp.findIndex(v => v === 0) === -1) {
            cleared++;
            this.data.splice(
                row * this.realWidth,
                this.realWidth
            );
        }
    }

    while (cleared--) {
        Array.prototype.splice.apply(this.data, this.blankLine);
    }
};

module.exports = Matrix;
/*
var m = new Matrix(10, 20);
//m.data[174] = 9;
m.on('gameOver', () => console.log('game over'));
m.spawn(pieces[0]);
m.shift(-1);
m.shift(-1);
m.shift(-1);

while (!m.shift(-11)) { }

m.spawn(pieces[0]);

while (!m.shift(-11)) { }

m.spawn(pieces[0]);

m.shift(1);
m.shift(1);
m.shift(1);

while (!m.shift(-11)) { }

m.spawn(pieces[0]);

m.rotate(3);
m.shift(1);
m.shift(1);
m.shift(1);
m.shift(1);
m.shift(1);

while (!m.shift(-11)) { }

m.print();
*/