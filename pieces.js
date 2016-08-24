'use strict';

// rotations: clockwise from spawn



module.exports = [
    {
        name: 't',
        offset: -40,
        width: 3,
        char: 1,
        rotations: [
            [ 23, 11, 12, 13 ],
            [ 23, 12, 13, 1 ],
            [ 11, 12, 13, 1 ],
            [ 23, 11, 12, 1 ]
        ]
    },
    {
        name: 'l',
        offset: -40,
        width: 3,
        char: 2,
        rotations: [
            [24, 11, 12, 13],
            [23, 12, 1, 2],
            [11, 12, 13, 0],
            [22, 23, 12, 1]
        ]
    },
    {
        name: 'j',
        offset: -40,
        width: 3,
        char: 1,
        rotations: [
            [22, 11, 12, 13],
            [23, 24, 12, 1],
            [11, 12, 13, 2],
            [23, 12, 0, 1]
        ]
    },
    {
        name: 'z',
        offset: -40,
        width: 3,
        char: 2,
        rotations: [
            [22, 23, 12, 13],
            [24, 12, 13, 1],
            [11, 12, 1, 2],
            [23, 11, 12, 0]
        ]
    }
];