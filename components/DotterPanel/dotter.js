
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
 * @param round: whether to allow float sizes (with performance overhead).
 */
function getCanvasPt(canvasSize, L, round=true) {
    var canvasPt;
    if (L < canvasSize) {
        canvasPt = canvasSize / L;
        if (round) {
            canvasPt = Math.floor(canvasPt);
        }
        //else {
        //    canvasPt = Math.round(canvasPt)
        //}
    } else {
        canvasPt = 1;
    }
    return canvasPt;
}

//function getDrawingSize(l, canvasSize, round=true) {
//    let drawingSize = canvasSize;
//    let margin = 0;
//    if (round) {
//        if (l <= canvasSize) {
//            let pixelsPerChar = Math.floor(canvasSize / l);
//            margin = canvasSize % l;
//            drawingSize = pixelsPerChar * l;
//        } else {
//            let charsPerPixel = Math.ceil(l / canvasSize);
//            let nPixels = l / charsPerPixel;
//        }
//    }
//    return drawingSize;
//}

function seqToPixelScale(ls1, ls2, canvasSize=CANVAS_SIZE) { //, round=true) {
    let L = Math.max(ls1, ls2);
    let seqToPixel = d3.scaleLinear()
        .domain([0, L-1])
        .rangeRound([0, canvasSize]);
}
function pixelToIndexScale(ls1, ls2, canvasSize=CANVAS_SIZE) { //, round=true) {
    let L = Math.max(ls1, ls2);
    let seqToPixel = d3.scaleLinear()
        .domain([0, canvasSize])
        .rangeRound([0, L-1]);
}

/**
 * Calculate the number of points in the canvas given its size in px and the desired point size.
 * @param canvasSize: canvas size, in pixels.
 * @param canvasPt: size of a 'point', in pixels.
 */
function getNpoints(canvasSize, canvasPt) {
    return Math.floor(canvasSize / canvasPt)
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
 * @param L (int): matrix size (max sequence length).
 */
function coordinateFromSeqIndex(index, L, canvasSize=CANVAS_SIZE, round=true) {
    let px = index * (canvasSize / L);
    if (round) px = Math.round(px);
    return px;
}

/**
 * Return *approximately* the index on the sequence `seq` corresponding to pixel coordinate `px`.
 * The problem is that if the sequence length is not a multiple of the canvas size,
 * there is an empty margin that must not count. So round it up to a multiple,
 * then cut down if necessary.
 *
 * @param px (float): position clicked on the canvas (in pixels, != `npoints`!).
 * @param L (int): matrix size (max sequence length).
 */
function seqIndexFromCoordinate(px, L, canvasSize=CANVAS_SIZE) {
    let round = roundPixels(L, canvasSize);
    let canvasPt = getCanvasPt(canvasSize, L, round);
    let npoints = Math.floor(canvasSize / canvasPt);
    let step = getStep(npoints, L, round);
    return Math.ceil((px / canvasPt) * step) - 1;
}

function initBlankCanvas(canvasId) {
    let canvas = document.getElementById(canvasId);
    if (canvas === null) { throw new ReferenceError("Canvas not found"); }
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return canvas;
}

function oneAlpha(alphas, i, j, a, _, canvasSize=CANVAS_SIZE) {
    alphas[i * canvasSize + j] = a;
}
function fillAlphas(alphas, i, j, a, size, canvasSize=CANVAS_SIZE) {
    i = Math.round(i)
    j = Math.round(j)
    size = Math.round(size)
    for (let x=i; x < i+size; x++) {
        for (let y=j; y < j+size; y++) {
            alphas[x * canvasSize + y] = a;
        }
    }
}

function roundPixels(L, canvasSize=CANVAS_SIZE) {
    //return L > 2 * canvasSize;
    return false;
}

/**
 * Calculate the local alignment scores.
 */
function calculateScores(s1, s2, windowSize, scoringMatrixName, greyScale, canvasSize=CANVAS_SIZE) {
    let ws = Math.floor(windowSize / 2);   // # of nucleotides on each side
    let density = {};
    let alphas = new Uint8ClampedArray(canvasSize * canvasSize);

    let ls1 = s1.length;
    let ls2 = s2.length;
    let L = Math.max(ls1, ls2);
    let round = roundPixels(L);                    // For small sequences, use float pixel coordinates at the expense of performance
    let canvasPt = getCanvasPt(canvasSize, L, round);  // Size of a "dot" on the canvas, when L is small (else 1)
    let npoints = getNpoints(canvasSize, canvasPt);    // Number of points in one line when L is small (else CANVAS_SIZE)
    let step = getStep(npoints, L, round);             // 1 point -> `step` characters

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

    let addAlpha = canvasPt === 1 ? oneAlpha : fillAlphas;
    let lastRowIndex = canvasSize-1;
    let lastColIndex = canvasSize-1;

    console.warn(npoints * canvasPt === canvasSize)

    for (let row=0; row < npoints; row++) {       // rows - seq2
        let i = row * canvasPt;
        let q2 = Math.round(row * step);                            // position on seq2. First is 0, last is L
        if (q2 >= ls2) {                          // bigger than sequence 2 - skip
            for (let col=0; col < npoints; col++) {
                let j = Math.floor(col * canvasPt);
                addAlpha(alphas, i, j, 255, canvasPt);  // fill in the bottom margin
            }
            lastRowIndex = i + canvasPt;
            continue;
        }
        let subseq2 = helpers.getSequenceAround(s2, q2, ws);      // nucleotides window on seq2

        for (let col=0; col < npoints; col++) {   // columns - seq1
            let j = col * canvasPt;
            let q1 = Math.round(col * step);                        // position on seq2
            if (q1 >= ls1) {                     // bigger than sequence 1 - skip
                addAlpha(alphas, i, j, 255, canvasPt);  // fill in the right margin, 255=black, 0=white
                lastColIndex = j + canvasPt;
                continue;
            }
            let subseq1 = helpers.getSequenceAround(s1, q1, ws);  // nucleotides window on seq2
            let score = scoringFunction(subseq1, subseq2, matrix);  // always an int
            if (! (score in density)) {
                density[score] = 0;
            } else {
                density[score] += 1;
            }
            let alpha = Math.round(255 * (score - minScore) / scoresRange);
            addAlpha(alphas, i, j, alpha, canvasPt);
        }
    }

    // Rescale greys so that the min score is at 0 and the max at 255
    rescaleInitAlphas(alphas, lastRowIndex, lastColIndex);

    return {
        density,
        alphas,
        lastRowIndex,
        lastColIndex,
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
    ctx.imageSmoothingEnabled = false;
    ctx.putImageData(imageData, 0, 0);
}


/**
 * Draw the vertical and horizontal lines showing the current position on the canvas.
 */
function drawPositionLines(i, j, ls1, ls2, canvasSize=CANVAS_SIZE) {
    let canvas = initBlankCanvas(CANVAS_ID +'-topLayer');
    let ctx = canvas.getContext('2d');
    let L = Math.max(ls1, ls2);
    let round = roundPixels(L, canvasSize);
    let x = coordinateFromSeqIndex(i, L, canvasSize, round);
    let y = coordinateFromSeqIndex(j, L, canvasSize, round);
    // If the point size is > 1, make the lines pass in the middle.
    if (L < CANVAS_SIZE) {
        let canvasPt = getCanvasPt(canvasSize, L, round);
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
    let d1 = coordinateFromSeqIndex(ls1, L, canvasSize);
    let d2 = coordinateFromSeqIndex(ls2, L, canvasSize);
    let imageData = ctx.getImageData(0,0, d1, d2);
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
 */
function rescaleInitAlphas(alphas, lastRowIndex, lastColIndex, canvasSize=CANVAS_SIZE) {
    // Get the current min and max
    console.debug(lastRowIndex, lastColIndex)
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
    console.debug(minAlpha, maxAlpha)
    // Rescale to fill the interval 0-255
    let scale = d3scale.scaleLinear()
        .domain([minAlpha, maxAlpha])
        .range([0, 255]);
    for (let i = 0; i < alphas.length; i++) {
        alphas[i] = Math.round(scale(alphas[i]));
    }
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
    getCanvasPt,
    getStep,
    coordinateFromSeqIndex,
    seqIndexFromCoordinate,
    calculateScores,
    fillCanvas,
    drawPositionLines,
    getAlphaValues,
    greyScale,
};
