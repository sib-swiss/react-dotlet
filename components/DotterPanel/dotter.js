
import { MATCH, MISMATCH, CANVAS_SIZE } from './constants/constants';
import { IDENTITY } from './constants/scoring_matrices/dna';

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

/*
 * In DNA-DNA comparison, sum the number of matches/mismatches.
 */
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

/*
 * In DNA-DNA comparison, return the similarity score.
 */
function DnaScoreMatches(s1, s2, scoreMatrix) {
    let sums = DnaSumMatches(s1, s2);
    let score = scoreMatrix[MATCH] * sums[MATCH]
              + scoreMatrix[MISMATCH] * sums[MISMATCH];
    return score;
}

/*
 * Return the index on the sequence `seq` corresponding to pixel coordinate `px` (approximately).
 */
function seqPosFromCoordinate(px, seq) {
    let ratio = px / CANVAS_SIZE;  // x or y: the canvas is square
    let index = Math.floor(seq.length * ratio);
    return index;
}

/*
 * Fill the dotter canvas with similarity scores; return the scores density.
 */
function fillCanvas(s1, s2, window_size) {
    /* Init blank canvas */
    let cv = document.getElementById("dotter-canvas");
    if (cv === null) { throw "Canvas not found"; }
    let ctx = cv.getContext('2d');
    let canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let ws = Math.floor(window_size / 2);   // # of nucleotides on each side
    let scores = {};

    let ls1 = s1.length;
    let ls2 = s2.length;
    let L = Math.min(ls1, ls2);
    let canvas_pt = getCanvasPt(CANVAS_SIZE, L);
    let npoints = CANVAS_SIZE / canvas_pt;
    let step = L / npoints;                 // n points -> n-1 steps. What if not int?

    //console.log(window_size, ws, L, canvas_pt, step)

    for (let i=0; i <= npoints; i++) {      // n-1 steps
        let q1 = i * step;                  // position on seq1. First is 0, last is L
        let l1 = Math.max(q1 - ws, 0),
            r1 = q1 + ws + 1;               // nucleotides window on seq1
        //console.log(s1, [l1,r1], s1.slice(l1, r1))
        let subseq1 = s1.slice(l1, r1);

        for (let j=0; j <= npoints; j++) {  // i steps
            let q2 = j * step;              // position on seq2
            let l2 = Math.max(q2 - ws, 0),
                r2 = q2 + ws + 1;           // nucleotides window on seq2
            let subseq2 = s2.slice(l2, r2);
            let score = DnaScoreMatches(subseq1, subseq2, IDENTITY);
            if (! (score in scores)) {
                scores[score] = 0;
            } else {
                scores[score] += 1;
            }
            //console.log([i, j], [q1, q2], [l1,r1], [l2,r2], subseq1, subseq2, score)
            if (score > 0) {
                ctx.globalAlpha = score / window_size;
                ctx.fillRect(q1 * canvas_pt, q2 * canvas_pt, canvas_pt, canvas_pt)
            }
        }
    }
    return scores
}


export {
    getCanvasPt,
    DnaSumMatches,
    DnaScoreMatches,
    fillCanvas,
    seqPosFromCoordinate,
};
