
import { CANVAS_ID } from '../constants/constants';
import * as helpers from '../common/helpers';
import { SCORING_MATRIX_NAMES } from '../constants/constants';
import { SCORING_MATRICES, MIN_MAX } from '../constants/scoring_matrices/scoring_matrices';
import { calculateMatches, calculateScore } from '../common/scoring';
import * as d3scale from 'd3-scale';

/**
 * Plotting functions in the main canvas.
 */


/**
 * Get the position (in px) on the canvas representing the given index in the sequence.
 * @param index: (int) the index of a char in the sequence.
 * @param L: (int) matrix size (max sequence length).
 */
function coordinateFromSeqIndex(index, L, canvasSize) {
    return ~~ ((canvasSize / L) * index);
}

/**
 * Return the index on the sequence `seq` corresponding to pixel coordinate `px`.
 * The problem is that if the sequence length is not a multiple of the canvas size,
 * there is an empty margin that must not count. So round it up to a multiple,
 * then cut down if necessary.
 * @param px (float): position clicked on the canvas (in pixels, != `npoints`!).
 * @param L (int): matrix size (max sequence length).
 */
function seqIndexFromCoordinate(px, L, canvasSize) {
    return ~~ ((L / canvasSize) * px);
}

function clearCanvas(canvasId) {
    let canvas = document.getElementById(canvasId);
    if (canvas === null) { throw new ReferenceError("Canvas not found"); }
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return canvas;
}

/**
 * Calculate the local alignment scores.
 */
function calculateScores(s1, s2, windowSize, scoringMatrixName, canvasSize) {
    let ws = ~~ (windowSize / 2);   // # of nucleotides on each side
    let density = {};
    let alphas = new Uint8ClampedArray(canvasSize * canvasSize);

    let ls1 = s1.length;
    let ls2 = s2.length;
    let L = Math.max(ls1, ls2);

    let scoringFunction;
    if (scoringMatrixName === SCORING_MATRIX_NAMES.IDENTITY) {
        scoringFunction = calculateMatches;
    } else {
        scoringFunction = calculateScore;
    }
    let matrix = SCORING_MATRICES[scoringMatrixName];
    let minMax = MIN_MAX[scoringMatrixName];
    let minScore = minMax[0] * windowSize;
    let maxScore = minMax[1] * windowSize;
    let scoresRange = maxScore - minScore;   // now any (score / scoresRange) is between 0 and 1

    let lastRowIndex = coordinateFromSeqIndex(ls2, L, canvasSize);
    let lastColIndex = coordinateFromSeqIndex(ls1, L, canvasSize);
    let minAlpha = 255;
    let maxAlpha = 0;

    function maxScoreInSquare(i, j, scoringFunction) {
        let q2min = seqIndexFromCoordinate(i, L, canvasSize);
        let q2max = seqIndexFromCoordinate(i+1, L, canvasSize);
        let q1min = seqIndexFromCoordinate(j, L, canvasSize);
        let q1max = seqIndexFromCoordinate(j+1, L, canvasSize);
        let maxScore = -100000;
        if (q2max === q2min) { q2max = q2min+1; }
        if (q1max === q1min) { q1max = q1min+1; }
        for (let q2=q2min; q2<q2max; q2++) {
            let subseq2 = helpers.getSequenceAround(s2, q2, ws);
            for (let q1=q1min; q1<q1max; q1++) {
                let subseq1 = helpers.getSequenceAround(s1, q1, ws);
                let score = scoringFunction(subseq1, subseq2, matrix);
                if (score > maxScore) {
                    maxScore = score;
                }
            }
        }
        return maxScore;
    }

    /* Iterate over pixels. At worst it is several times the same char,
     * but as soon as the sequence is as big as the canvas, there will be that
     * many computations anyway, so it must be fast in all cases.
     */
    for (let i=0; i < lastRowIndex; i++) {   // i [px]
        for (let j=0; j < lastColIndex; j++) {   // j [px]
            let score = maxScoreInSquare(i, j, scoringFunction);
            if (! (score in density)) {
                density[score] = 0;
            } else {
                density[score] += 1;
            }
            let alpha = Math.round(255 * (score - minScore) / scoresRange);
            if (alpha > maxAlpha) {
                maxAlpha = alpha;
            } else if (alpha < minAlpha) {
                minAlpha = alpha;
            }
            alphas[i * canvasSize + j] = alpha;
        }
    }
    /* Rescale greys so that the min score is at 0 and the max at 255 */
    rescaleInitAlphas(alphas, lastRowIndex, lastColIndex, canvasSize);

    return {
        density,
        alphas,
    };
}


/**
 * Fill the dotter canvas with similarity scores; return the scores density.
 * It never stores the matrix in memory: it draws a point and forgets about it.
 */
function fillCanvas(alphas) {
    let canvas = clearCanvas(CANVAS_ID);
    let ctx = canvas.getContext('2d');
    console.debug("fillCanvas:", canvas.width, canvas.height)
    let imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    for (let k=0; k < 4 * alphas.length; k += 4) {
        imageData.data[k+3] = alphas[k/4];
    }
    ctx.putImageData(imageData, 0, 0);
}


/**
 * Draw the vertical and horizontal lines showing the current position (i,j) on the canvas.
 */
function drawPositionLines(i, j, ls1, ls2, canvasSize) {
    let canvas = clearCanvas(CANVAS_ID +'-topLayer');
    let ctx = canvas.getContext('2d');
    let L = Math.max(ls1, ls2);
    let x = coordinateFromSeqIndex(i, L, canvasSize);
    let y = coordinateFromSeqIndex(j, L, canvasSize);
    // If the point size is > 1, make the lines pass in the middle.
    if (L < canvasSize) {
        let canvasPt = canvasSize / L;
        x += canvasPt/2;
        y += canvasPt/2;
    }
    ctx.fillStyle = "red";
    ctx.fillRect(x, 1, 1, (ls2/L) * canvasSize);
    ctx.fillRect(1, y, (ls1/L) * canvasSize, 1);
}


//---------------------- GREY SCALE ------------------------//


/**
 * Return the min and max alpha values among the `alphas` that are
 * in the rectangle `(0, 0, lastColIndex, lastRowIndex)`.
 * This is because we don't want to take the uncomputed scores (0)
 * outside of this area into account.
 */
function getMinMaxAlpha(alphas, lastRowIndex, lastColIndex, canvasSize) {
    let minAlpha = 255;
    let maxAlpha = 0;
    for (let i=0; i < lastRowIndex; i++) {
        for (let j=0; j < lastColIndex; j++) {
            let k = i * canvasSize + j;
            if (alphas[k] < minAlpha) {
                minAlpha = alphas[k];
            } else if (alphas[k] > maxAlpha) {
                maxAlpha = alphas[k];
            }
        }
    }
    return {
        minAlpha,
        maxAlpha,
    };
}


/**
 * Rescale and clamp alpha values between `minBound` and `maxBound`:
 * All shades below `minBound` become white, and all shades above `maxBound` become black.
 * All shades in-between are rescaled to use the whole 0-255 range.
 * If `minBound` becomes bigger than `maxBound`, colors are inverted.
 **/
function rescaleAlphas(initialAlphas, minBound, maxBound) {
    let N = initialAlphas.length;
    let scale = d3scale.scaleLinear()
        .domain([minBound, maxBound])
        .range([0, 255]);
    let black, white;
    // Usual case, min < max.
    if (minBound <= maxBound) {
        black = (a) => a >= maxBound;
        white = (a) => a <= minBound;
        // Reversed case, when the sliders cross: reverse colors.
    } else {
        black = (a) => a <= maxBound;
        white = (a) => a >= minBound;
    }
    let newAlphas = new Uint8ClampedArray(N);
    for (let i=0; i < N; i++) {
        let alpha = initialAlphas[i];
        if (white(alpha)) {
            newAlphas[i] = 0;
        } else if (black(alpha)) {
            newAlphas[i] = 255;
        } else {
            newAlphas[i] = scale(alpha);
        }
    }
    return newAlphas;
}

/**
 * At the beginning, alpha values are scaled according to the minimal and
 * maximal *possible* scores. Here we scale them according to the actual min and max values,
 * to improve contrast. i.e. min alpha -> 0, max alpha -> 255.
 * @param alphas: a canvasSize x canvasSize Uint8ClampedArray.
 * @param lastColIndex: last horizontal pixel index to consider.
 * @param lastRowIndex: last vertical pixel index to consider.
 * @param minBound: (uint8, default 0) min alpha value in the result.
 * @param maxBnd: (uint8, default 255) max alpha value in the result.
 */
function rescaleInitAlphas(alphas, lastRowIndex, lastColIndex, canvasSize) {
    /* Rescale to fill the interval 0-255 */
    let minmax = getMinMaxAlpha(alphas, lastRowIndex, lastColIndex, canvasSize);
    let scale = d3scale.scaleLinear()
        .domain([minmax.minAlpha, minmax.maxAlpha])
        .range([0, 255]);
    for (let i = 0; i < alphas.length; i++) {
        alphas[i] = ~~ (scale(alphas[i]) + 0.5);
    }
}

/**
 * Redraw the canvas after clamping the alpha values and rescaling the remaining scores interval.
 *  We need to keep the initialAlphas in store because clamping loses data,
 *  but we need to be able to go back to the initial state.
 * @param initialAlphas: a canvasSize x canvasSize Uint8ClampedArray.
 * @param minBound: (uint8) all alphas lower than `minBound` become equal to `minBound`.
 * @param maxBound: (uint8) all alphas bigger than `maxBound` become equal to `maxBound`.
 */
function greyScale(initialAlphas, minBound, maxBound, ls1, ls2) {
    let canvas = document.getElementById(CANVAS_ID);
    let ctx = canvas.getContext('2d');
    let imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    let data = imageData.data;
    let newAlphas = rescaleAlphas(initialAlphas, minBound, maxBound);
    for (let i = 0; i < newAlphas.length; i++) {
        data[4*i+3] = newAlphas[i];
    }
    ctx.putImageData(imageData, 0, 0);
}


export {
    coordinateFromSeqIndex,
    seqIndexFromCoordinate,

    calculateScores,
    fillCanvas,
    drawPositionLines,

    getMinMaxAlpha,
    rescaleAlphas,
    rescaleInitAlphas,
    greyScale,
};
