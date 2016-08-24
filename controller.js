'use strict';

var EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits;

const keys = {
    '1b5b41': 'up',
    '1b5b43': 'right',
    '1b5b42': 'down',
    '1b5b44': 'left',
    '1b': 'esc'
};

function Controller() {
    EventEmitter.call(this);

    this.onKeypress = this.onKeypress.bind(this);

    process.stdin.setRawMode(true);
    process.stdin.on('data', this.onKeypress);
}
inherits(Controller, EventEmitter);

Controller.prototype.onKeypress = function (chunk) {
    let hex = chunk.toString('hex');
    if (hex in keys) {
        this.emit('key', keys[hex]);
    } else {
        this.emit('key', chunk.toString());
    }
};
Controller.prototype.destroy = function () {
    process.stdin.setRawMode(false);
    process.stdin.removeListener('data', this.onKeypress);
};

module.exports = Controller;