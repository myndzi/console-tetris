'use strict';

function isBlocked(data, position, offsets) {
    return offsets.reduce((acc, offset) =>
        acc || data[offset + position] > 0
    , false);
}

module.exports = { isBlocked };