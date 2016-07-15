
import { MATCH, MISMATCH } from './constants/constants';

/* Caclulate the size in px of a "point" on the canvas
 * (bigger if the sequence is shorter than the canvas' dimensions in px,
 * to fill it completely).
 */
function getCanvasPt(canvasSize, lenSeq) {
    var canvas_pt;
    if (lenSeq < canvasSize) {
        canvas_pt = Math.floor(canvasSize / lenSeq);
    } else {
        canvas_pt = 1;
    }
    return canvas_pt;
}


function DnaSumMatches(s1, s2) {
    let L = Math.min(s1.length, s2.length);
    let match = 0, mismatch = 0;

    for (let i=0; i<L; i++) {
         if (s1[i] === s2[i]) { match ++; }
         else { mismatch ++; }
    }

    return {
        [MATCH]: match,
        [MISMATCH]: mismatch,
    };
}

function DnaScoreMatches(s1, s2, scoreMatrix) {
    let sums = DnaSumMatches(s1, s2);
    let score = scoreMatrix[MATCH] * sums[MATCH]
              + scoreMatrix[MISMATCH] * sums[MISMATCH];
    return score;
}


export {
    getCanvasPt,
    DnaSumMatches,
    DnaScoreMatches,
};
