
import { CANVAS_SIZE, CANVAS_ID } from '../constants/constants';
import * as helpers from '../common/helpers';
import { SCORING_MATRIX_NAMES } from '../constants/constants';
import { SCORING_MATRICES, MIN_MAX } from '../constants/scoring_matrices/scoring_matrices';
import { calculateMatches, calculateScore } from '../common/scoring';
import * as d3scale from 'd3-scale';

/**
 * Plotting functions in the main canvas.
 */

/**
 * Caclulate the size in px of a "point" on the canvas
 * (bigger if the sequence is shorter than the canvas' dimensions in px,
 * to fill it completely).
 * It does not need to be rounded because we round the final pixel value anyway;
 * moreover, it will be used to divide other arbitrary integer values.
 */
function getCanvasPtSize(canvasSize, L) {
    var canvasPt;
    if (L < canvasSize) {
        canvasPt = canvasSize / L;
    } else {
        canvasPt = 1;
    }
    return canvasPt;
}

/**
 * Calculate the number of points in the canvas given its size in px and the desired point size.
 * @param canvasSize: (int) canvas size, in pixels.
 * @param canvasPt: (float) size of a 'point', in pixels.
 */
function getNpoints(canvasSize, canvasPt) {
    return ~~ (canvasSize / canvasPt);
}

/**
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

/**
 * Get the position (in px) on the canvas representing the given index in the sequence.
 * @param index: (int) the index of a char in the sequence.
 * @param L: (int) matrix size (max sequence length).
 */
function coordinateFromSeqIndex(index, L, canvasSize=CANVAS_SIZE) {
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
function seqIndexFromCoordinate(px, L, canvasSize=CANVAS_SIZE) {
    return ~~ ((L / canvasSize) * px);
}

function initBlankCanvas(canvasId) {
    let canvas = document.getElementById(canvasId);
    if (canvas === null) { throw new ReferenceError("Canvas not found"); }
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return canvas;
}

/**
 * Add a grey value for position (i, j) to the initial array `alphas`,
 * i.e. at position `i * width + j`.
 * @param alphas: initial Uint8ClampedArray of grey values (0-255).
 * @param i: pixel vertical coordinate (row index).
 * @param j: pixel horizontal coordinate (col index).
 * @param a: int8 alpha value (0-255).
 * @param _: to imitate the signature of `fillAlphas`.
 * @param canvasSize
 */
function addAlpha(alphas, i, j, a, canvasSize=CANVAS_SIZE) {
    alphas[i * canvasSize + j] = a;
}


/**
 * Calculate the local alignment scores.
 */
function calculateScores(s1, s2, windowSize, scoringMatrixName, greyScale, canvasSize=CANVAS_SIZE) {
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

    /* Iterate over pixels. At worst it is several times the same char,
     * but as soon as the sequence is as big as the canvas, there will be that
     * many computations anyway, so it must be fast in all cases.
     */
    for (let i=0; i < lastRowIndex; i++) {
        let q2 = seqIndexFromCoordinate(i, L, canvasSize);
        let subseq2 = helpers.getSequenceAround(s2, q2, ws);      // nucleotides window on seq2
        for (let j=0; j < lastColIndex; j++) {
            let q1 = seqIndexFromCoordinate(j, L, canvasSize);
            let subseq1 = helpers.getSequenceAround(s1, q1, ws);  // nucleotides window on seq2
            let score = scoringFunction(subseq1, subseq2, matrix);  // always an int
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
            addAlpha(alphas, i, j, alpha);
        }
    }
    console.debug(greyScale.minBound, greyScale.maxBound)
    /* Rescale greys so that the min score is at 0 and the max at 255 */
    rescaleInitAlphas(alphas, lastRowIndex, lastColIndex, greyScale.minBound, greyScale.maxBound);

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
    let canvas = initBlankCanvas(CANVAS_ID);
    let ctx = canvas.getContext('2d');
    let imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    for (let k=0; k < 4 * alphas.length; k += 4) {
        imageData.data[k+3] = alphas[k/4];
    }
    ctx.putImageData(imageData, 0, 0);
}


/**
 * Draw the vertical and horizontal lines showing the current position on the canvas.
 */
function drawPositionLines(i, j, ls1, ls2, canvasSize=CANVAS_SIZE) {
    let canvas = initBlankCanvas(CANVAS_ID +'-topLayer');
    let ctx = canvas.getContext('2d');
    let L = Math.max(ls1, ls2);
    let x = coordinateFromSeqIndex(i, L, canvasSize);
    let y = coordinateFromSeqIndex(j, L, canvasSize);
    // If the point size is > 1, make the lines pass in the middle.
    if (L < CANVAS_SIZE) {
        let canvasPt = getCanvasPtSize(canvasSize, L);
        x += canvasPt/2;
        y += canvasPt/2;
    }
    ctx.fillStyle = "red";
    ctx.fillRect(x, 1, 1, (ls2/L) * canvasSize);
    ctx.fillRect(1, y, (ls1/L) * canvasSize, 1);
}


//---------------------- GREY SCALE ------------------------//

/**
 * Return the ImageData corresponding to the non-empty region of the canvas
 * (when one sequence is shorter than the other, a region is blank; its
 *  zero alpha values mess up with scaling).
 * @param ls1: length of sequence 1.
 * @param ls2: length of sequence 2.
 * @param canvasSize
 */
function getImageData(ls1, ls2, canvasSize=CANVAS_SIZE) {
    let canvas = document.getElementById(CANVAS_ID);
    let ctx = canvas.getContext('2d');
    let L = Math.max(ls1, ls2);
    let lastRowIndex = coordinateFromSeqIndex(ls1, L, canvasSize);
    let lastColIndex = coordinateFromSeqIndex(ls2, L, canvasSize);
    let imageData = ctx.getImageData(0,0, lastRowIndex, lastColIndex);
    return imageData;
}

/**
 * Return an array of the grey intensities of all points in the canvas, in the same
 * order as in `ctx.getImageData().data`.
 * @param ls1: length of sequence 1.
 * @param ls2: length of sequence 2.
 */
function getAlphaValues(ls1, ls2) {
    let imageData = getImageData(ls1, ls2);
    let data = imageData.data;  // [red,green,blue,alpha, red,green,blue,alpha, ...] each 0-255
    let alphas = new Uint8ClampedArray(data.length / 4);
    for (let i = 0; i < data.length; i += 4) {
        alphas[i/4] = data[i + 3];
    }
    return alphas;
}

/**
 * At the beginning, alpha values are scaled according to the minimal and
 * maximal *possible* scores. Here we scale them according to the actual min and max values,
 * to improve contrast. i.e. min alpha -> 0, max alpha -> 255.
 * @param lastx: last horizontal pixel index to consider.
 * @param lasty: last vertical pixel index to consider.
 * @param minBound: (int8, default 0) min alpha value in the result.
 * @param maxBnd: (int8, default 255) max alpha value in the result.
 */
function rescaleInitAlphas(alphas, lastRowIndex, lastColIndex, minBound=0, maxBound=255, canvasSize=CANVAS_SIZE) {
    /* Get the current min and max */
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
    /* Rescale to fill the interval 0-255 */
    let scale = d3scale.scaleLinear()
        .domain([minAlpha, maxAlpha])
        .range([0, 255]);
    for (let i = 0; i < alphas.length; i++) {
        alphas[i] = Math.round(scale(alphas[i]));
    }
    /* Rescale to clamp to minBound-maxBound */
    console.debug(minBound, maxBound)
}

/**
 * Redraw the canvas after clamping the alpha values and rescaling the remaining scores interval.
 * @param initialAlphas: initial alpha values
 *  (saved in store in order to come back to the initial state.
 *   Otherwise we could read them directly from the canvas with `ctx.getImageData()`).
 * @param minBound: (int8) all alphas lower than `minBound` become equal to `minBound`.
 * @param maxBound: (int8) all alphas bigger than `maxBound` become equal to `maxBound`.
 */
function greyScale(initialAlphas, minBound, maxBound, ls1, ls2) {
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
    let imageData = getImageData(ls1, ls2);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let alpha = initialAlphas[i/4];
        if (white(alpha)) {
            data[i+3] = 0;
        } else if (black(alpha)) {
            data[i+3] = 255;
        } else {
            data[i+3] = scale(alpha);
        }
    }
    let canvas = document.getElementById(CANVAS_ID);
    let ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
}


export {
    getCanvasPtSize,
    getStep,
    getNpoints,
    coordinateFromSeqIndex,
    seqIndexFromCoordinate,
    calculateScores,
    fillCanvas,
    drawPositionLines,
    getAlphaValues,
    greyScale,
};
