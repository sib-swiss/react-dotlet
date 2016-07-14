
let GONNET = [
[  2, -8,  0,  0,  0, -2,  0, -1, -1, -8,  0, -1, -1,  0, -8,  0,  0, -1,  1,  1, -8,  0, -4,  0, -2, -8, -8],
[ -8,  1, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8],
[  0, -8, 12, -3, -3, -1, -2, -1, -1, -8, -3, -2, -1, -2, -8, -3, -2, -2,  0,  0, -8,  0, -1, -3,  0, -8, -8],
[  0, -8, -3,  5,  3, -4,  0,  0, -4, -8,  0, -4, -3,  2, -8, -1,  1,  0,  0,  0, -8, -3, -5, -1, -3, -8, -8],
[  0, -8, -3,  3,  4, -4, -1,  0, -3, -8,  1, -3, -2,  1, -8,  0,  2,  0,  0,  0, -8, -2, -4, -1, -3, -8, -8],
[ -2, -8, -1, -4, -4,  7, -5,  0,  1, -8, -3,  2,  2, -3, -8, -4, -3, -3, -3, -2, -8,  0,  4, -2,  5, -8, -8],
[  0, -8, -2,  0, -1, -5,  7, -1, -4, -8, -1, -4, -4,  0, -8, -2, -1, -1,  0, -1, -8, -3, -4, -1, -4, -8, -8],
[ -1, -8, -1,  0,  0,  0, -1,  6, -2, -8,  1, -2, -1,  1, -8, -1,  1,  1,  0,  0, -8, -2, -1, -1,  2, -8, -8],
[ -1, -8, -1, -4, -3,  1, -4, -2,  4, -8, -2,  3,  2, -3, -8, -3, -2, -2, -2, -1, -8,  3, -2, -1, -1, -8, -8],
[ -8, -8, -8, -8, -8, -8, -8, -8, -8,  1, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8],
[  0, -8, -3,  0,  1, -3, -1,  1, -2, -8,  3, -2, -1,  1, -8, -1,  2,  3,  0,  0, -8, -2, -4, -1, -2, -8, -8],
[ -1, -8, -2, -4, -3,  2, -4, -2,  3, -8, -2,  4,  3, -3, -8, -2, -2, -2, -2, -1, -8,  2, -1, -1,  0, -8, -8],
[ -1, -8, -1, -3, -2,  2, -4, -1,  2, -8, -1,  3,  4, -2, -8, -2, -1, -2, -1, -1, -8,  2, -1, -1,  0, -8, -8],
[  0, -8, -2,  2,  1, -3,  0,  1, -3, -8,  1, -3, -2,  4, -8, -1,  1,  0,  1,  0, -8, -2, -4,  0, -1, -8, -8],
[ -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8,  1, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8],
[  0, -8, -3, -1,  0, -4, -2, -1, -3, -8, -1, -2, -2, -1, -8,  8,  0, -1,  0,  0, -8, -2, -5, -1, -3, -8, -8],
[  0, -8, -2,  1,  2, -3, -1,  1, -2, -8,  2, -2, -1,  1, -8,  0,  3,  2,  0,  0, -8, -2, -3, -1, -2, -8, -8],
[ -1, -8, -2,  0,  0, -3, -1,  1, -2, -8,  3, -2, -2,  0, -8, -1,  2,  5,  0,  0, -8, -2, -2, -1, -2, -8, -8],
[  1, -8,  0,  0,  0, -3,  0,  0, -2, -8,  0, -2, -1,  1, -8,  0,  0,  0,  2,  2, -8, -1, -3,  0, -2, -8, -8],
[  1, -8,  0,  0,  0, -2, -1,  0, -1, -8,  0, -1, -1,  0, -8,  0,  0,  0,  2,  2, -8,  0, -4,  0, -2, -8, -8],
[ -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8,  1, -8, -8, -8, -8, -8, -8],
[  0, -8,  0, -3, -2,  0, -3, -2,  3, -8, -2,  2,  2, -2, -8, -2, -2, -2, -1,  0, -8,  3, -3, -1, -1, -8, -8],
[ -4, -8, -1, -5, -4,  4, -4, -1, -2, -8, -4, -1, -1, -4, -8, -5, -3, -2, -3, -4, -8, -3, 14, -4,  4, -8, -8],
[  0, -8, -3, -1, -1, -2, -1, -1, -1, -8, -1, -1, -1,  0, -8, -1, -1, -1,  0,  0, -8, -1, -4, -1, -2, -8, -8],
[ -2, -8,  0, -3, -3,  5, -4,  2, -1, -8, -2,  0,  0, -1, -8, -3, -2, -2, -2, -2, -8, -1,  4, -2,  8, -8, -8],
[ -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8,  1, -8],
[ -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8,  1],
];

export { GONNET };
