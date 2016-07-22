
import { MATCH, MISMATCH, CANVAS_SIZE } from '../constants/constants';
import * as helpers from '../helpers';
import { SCORING_MATRICES } from '../constants/constants';
import { BLOSUM_45, BLOSUM_62, BLOSUM_80 } from '../constants/scoring_matrices/blosum';
import { PAM_30, PAM_70 } from '../constants/scoring_matrices/pam';
import { IDENTITY } from '../constants/scoring_matrices/dna';


const scoringMatrices = {
    [SCORING_MATRICES.IDENTITY]: IDENTITY,
    [SCORING_MATRICES.BLOSUM45]: BLOSUM_45,
    [SCORING_MATRICES.BLOSUM62]: BLOSUM_62,
    [SCORING_MATRICES.BLOSUM80]: BLOSUM_80,
    [SCORING_MATRICES.PAM30]: PAM_30,
    [SCORING_MATRICES.PAM70]: PAM_70,
};

/*
 * Caclulate the size in px of a "point" on the canvas
 * (bigger if the sequence is shorter than the canvas' dimensions in px,
 * to fill it completely).
 * @param round: whether to allow float sizes (with performance overhead).
 */
function getCanvasPt(canvasSize, lenSeq, round=true) {
    var canvasPt;
    if (lenSeq < canvasSize) {
        canvasPt = canvasSize / lenSeq;
        if (round) { canvasPt = Math.floor(canvasPt); }
    } else {
        canvasPt = 1;
    }
    return canvasPt;
}

/*
 * Calculate the number of points in the canvas given its size in px and the desired point size.
 * @param canvasSize: canvas size, in pixels.
 * @param canvasPt: size of a 'point', in pixels.
 */
function getNpoints(canvasSize, canvasPt) {
    let npoints = Math.floor(canvasSize / canvasPt)
    return npoints;
}

/*
 * Calculate the number of sequence characters represented by one point in the canvas.
 * @param round: whether to allow float sizes (with performance overhead).
 */
function getStep(npoints, lenSeq, round=true) {
    if (npoints > lenSeq + lenSeq % npoints) {
        throw new RangeError("There cannot be more canvas points than sequence elements. " +
                             "Increase points size instead.");
    }
    let step = lenSeq / npoints;
    if (round) { step = Math.ceil(step); }
    return step;
}

/*
 * In DNA-DNA comparison, sum the number of matches/mismatches.
 */
function sumMatches(s1, s2) {
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
function scoreMatches(s1, s2, scoreMatrix) {
    let sums = sumMatches(s1, s2);
    let score = scoreMatrix[MATCH] * sums[MATCH]
              + scoreMatrix[MISMATCH] * sums[MISMATCH];
    return score;
}

/*
 * Return the index on the sequence `seq` corresponding to pixel coordinate `px` (approximately).
 * The problem is that if the sequence length is not a multiple of the canvas size,
 * there is an empty margin that must not count. So round it up to a multiple,
 * then cut down if necessary.
 *
 * @param px (float): position clicked on the canvas (in pixels, != `npoints` !).
 * @param L (int): matrix size (max sequence length).
 */
function seqIndexFromCoordinate(px, L, canvasSize=CANVAS_SIZE) {
    let round = L > 2 * canvasSize;
    let canvasPt = getCanvasPt(canvasSize, L, round);
    let npoints = Math.floor(canvasSize / canvasPt);
    let step = getStep(npoints, L, round);
    let index = Math.ceil((px / canvasPt) * step) - 1;
    return index;
}

function initBlankCanvas(canvasId) {
    let cv = document.getElementById(canvasId);
    if (cv === null) { throw new ReferenceError("Canvas not found"); }
    let ctx = cv.getContext('2d');
    let canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return ctx;
}

/*
 * Fill the dotter canvas with similarity scores; return the scores density.
 */
function fillCanvas(s1, s2, windowSize, scoringMatrix, canvasSize=CANVAS_SIZE) {
    let ctx = initBlankCanvas("dotter-canvas");
    let ws = Math.floor(windowSize / 2);   // # of nucleotides on each side
    let scores = {};
    let matrix = scoringMatrices[scoringMatrix];

    let ls1 = s1.length;
    let ls2 = s2.length;
    let L = Math.max(ls1, ls2);
    let round = L > 2 * canvasSize;                    // For small sequences, use float pixel coordinates at the expense of performance
    let canvasPt = getCanvasPt(canvasSize, L, round);  // Size of a "dot" on the canvas, when L is small (else 1)
    let npoints = getNpoints(canvasSize, canvasPt);    // Number of points in one line when L is small (else CANVAS_SIZE)
    let step = getStep(npoints, L, round);             // 1 point -> `step` characters
    // n points -> n-1 steps. What if not int?

    //console.debug(windowSize, ws, L, canvasPt, step)

    for (let i=0; i <= npoints; i++) {
        let q1 = Math.round(i * step);                            // position on seq1. First is 0, last is L
        let subseq1 = helpers.getSequenceAround(s1, q1, ws);      // nucleotides window on seq1

        for (let j=0; j <= npoints; j++) {
            let q2 = Math.round(j * step);                        // position on seq2
            let subseq2 = helpers.getSequenceAround(s2, q2, ws);  // nucleotides window on seq2
            let score = scoreMatches(subseq1, subseq2, matrix);
            if (! (score in scores)) {
                scores[score] = 0;
            } else {
                scores[score] += 1;
            }

            //console.debug([i, j], [q1, q2], subseq1, subseq2, score)

            if (score > 0) {
                ctx.globalAlpha = score / windowSize;
                ctx.fillRect(q1 * canvasPt, q2 * canvasPt, canvasPt, canvasPt);
            }
        }
    }
    return scores;
}


export {
    scoreMatches,
    sumMatches,
    getCanvasPt,
    getStep,
    fillCanvas,
    seqIndexFromCoordinate,
};
