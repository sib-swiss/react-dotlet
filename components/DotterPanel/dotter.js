
import { CANVAS_ID } from '../constants/constants';
import { SCORING_MATRIX_NAMES } from '../constants/constants';
import { SCORING_MATRICES } from '../constants/scoring_matrices/scoring_matrices';
import { MATCH, MISMATCH, AA_MAP } from '../constants/constants';
import { calculateMatches, calculateScore } from '../common/scoring';
import * as d3scale from 'd3-scale';

/**
 * Plotting functions in the main canvas.
 */


class Dotter {
    constructor(canvasSize, windowSize, s1,s2, scoringMatrixName) {
        this.canvasId = CANVAS_ID;
        this.topCanvasId = CANVAS_ID +'-topLayer';
        this.canvasSize = canvasSize;
        this.windowSize = windowSize;
        this.s1 = s1;
        this.s2 = s2;
        this.ls1 = s1.length;
        this.ls2 = s2.length;
        this.L = Math.max(this.ls1, this.ls2);
        this.ws = ~~ (windowSize / 2);   // # of nucleotides on each side
        this.CS2 = canvasSize * canvasSize;
        this.scores = new Int16Array(this.CS2);
        for (let k=0; k < this.CS2; k++) {
            this.scores[k] = -32767;
        }
        this.minScore = Infinity;
        this.maxScore = -Infinity;
        this.scaleToPx = canvasSize / (this.L - windowSize);
        this.scaleToSeq = 1.0 / this.scaleToPx;
        console.debug(this.scaleToPx, this.scaleToSeq)
        this.lastRowIndex = this.coordinateFromSeqIndex(this.ls2);
        this.lastColIndex = this.coordinateFromSeqIndex(this.ls1);

        this.scoringMatrixName = scoringMatrixName;
        this.scoringMatrix = SCORING_MATRICES[scoringMatrixName];
        this.scoringFunction = (scoringMatrixName === SCORING_MATRIX_NAMES.IDENTITY) ?
            calculateMatches : calculateScore;
    }

    coordinateFromSeqIndex(index) {
        return ~~ (this.scaleToPx * index);
    }
    seqIndexFromCoordinate(px) {
        return ~~ (this.scaleToSeq * px);
    }

    clearCanvas(canvasId) {
        let canvas = document.getElementById(canvasId);
        if (canvas === null) { throw new ReferenceError("Canvas not found"); }
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return canvas;
    }

    /**
     * In DNA-DNA comparison, return the similarity score.
     * @param ss1: first sub-sequence.
     * @param ss2: second sub-sequence.
     */
    calculateMatches(ss1, ss2) {
        let L = Math.min(ss1.length, ss2.length);
        let match = 0, mismatch = 0;
        for (let i=0; i < L; i++) {
            if (ss1[i] === ss2[i]) { match ++; }
            else { mismatch ++; }
        }
        return this.scoringMatrix[MATCH] * match
             + this.scoringMatrix[MISMATCH] * mismatch;
    }

    /**
     * In proteins comparison, return the similarity score.
     * @param ss1: first sub-sequence.
     * @param ss2: second sub-sequence.
     */
    calculateScore(ss1, ss2) {
        let score = 0;
        let L = Math.min(ss1.length, ss2.length);
        for (let k=0; k < L; k++) {
            let c1 = ss1[k];
            let c2 = ss2[k];
            let i = AA_MAP[c1];
            let j = AA_MAP[c2];
            score += this.scoringMatrix[i][j];
        }
        return score;
    }

    /**
     * Get the slice of `seq` centered on `index` with `ws` elements on each side.
     * @param index: zero-based index of the center char in `seq`.
     */
    getSequenceAround(seq, index) {
        return seq.slice(Math.max(index - this.ws, 0), index + this.ws + 1);
    }

    scoreAround(i,j) {
        let ss1 = this.getSequenceAround(this.s1, j, this.ws);
        let ss2 = this.getSequenceAround(this.s2, i, this.ws);
        let score = this.scoringFunction(ss1, ss2, this.scoringMatrix);
        return score;
    }

    pushPixel(i,j, score) {
        let v = this.coordinateFromSeqIndex(i);
        let h = this.coordinateFromSeqIndex(j);
        let idx = v * this.canvasSize + h;
        if (v===0 && h<5) console.debug(this.scaleToPx, '---', i,j,h,v)
        this.scores[idx] = Math.max(score, this.scores[idx]);
    }

    topDiagonals() {
        let ws = this.ws, windowSize = this.windowSize;
        let s1 = this.s1, s2 = this.s2, ls1 = this.ls1, ls2 = this.ls2;
        let scoringFunction = this.scoringFunction, scoringMatrix = this.scoringMatrix;

        let hlimit = ls1 - ws;
        let vsize = ls2 - windowSize;
        let hsize = ls1 - windowSize;
        for (let j=ws; j<hlimit; j++) {
            let prevScore = this.scoreAround(s1,s2, ws,j); // di,dj = 0
            this.pushPixel(0, j-ws, score);
            for (let dj = j-ws+1, di = 1;  // di,dj: leftmost index of the sliding window
                 dj < hsize && di < vsize;
                 dj++, di++) {
                /* Add score for next pair, remove score of the first pair */
                var score = prevScore
                    + scoringFunction(s1[dj + windowSize], s2[di + windowSize], scoringMatrix)
                    - scoringFunction(s1[dj-1], s2[di-1], scoringMatrix);
                if (score > this.maxScore) this.maxScore = score;
                else if (score < this.minScore) this.minScore = score;
                this.pushPixel(di, dj, score);
                prevScore = score;
            }
            //if (j > ws + 2) break;
        }
    }
    leftDiagonals() {
        let ws = this.ws, windowSize = this.windowSize;
        let s1 = this.s1, s2 = this.s2, ls1 = this.ls1, ls2 = this.ls2;
        let scoringFunction = this.scoringFunction, scoringMatrix = this.scoringMatrix;

        let vlimit = ls2 - ws;
        let vsize = ls2 - windowSize;
        let hsize = ls1 - windowSize;
        for (let i=ws; i<vlimit; i++) {
            let prevScore = this.scoreAround(s1,s2, i,ws); // di,dj = 0
            this.pushPixel(i-ws, 0, score);
            for (let di = i-ws+1, dj = 1;  // di,dj: leftmost index of the sliding window
                 dj < hsize && di < vsize;
                 dj++, di++) {
                /* Add score for next pair, remove score of the first pair */
                var score = prevScore
                    + scoringFunction(s1[dj + windowSize], s2[di + windowSize], scoringMatrix)
                    - scoringFunction(s1[dj-1], s2[di-1], scoringMatrix);
                if (score > this.maxScore) this.maxScore = score;
                else if (score < this.minScore) this.minScore = score;
                this.pushPixel(di, dj, score);
                prevScore = score;
            }
            //if (i > ws + 2) break;
        }
    }

    /**
     * Calculate the local alignment scores.
     * Return only the array of scores that we will use to draw (i.e. one score per pixel of the canvas).
     * The latter are the local max of all alignments scaling to the same pixel.
     */
    calculateScores() {
        this.topDiagonals();
        this.leftDiagonals();
        let CS = this.canvasSize;

        console.debug(this.minScore, this.maxScore)
        console.debug(this.lastRowIndex, this.lastColIndex)
        for (let i=0; i<this.scores.length; i++) {
            if (this.scores[i] === -32767) {
                console.debug(' > ', i, i%CS)
                break;
            }
        }

        /* Fill the bottom margin with minScore */
        for (let k = this.lastRowIndex * CS; k < this.CS2; k++) {
            this.scores[k] = this.minScore;
        }
        /* Fill the right margin with minScore */
        for (let i=0; i < CS; i++) {
            for (let j=this.lastColIndex; j < CS; j++) {
                this.scores[i * CS + j] = this.minScore;
            }
        }
    }

    /**
     * Return alpha values corresponding to the alignemnt scores.
     * @param scoresObject: as returned by `calculateScores()`.
     * @returns {Uint8ClampedArray}
     */
    alphasFromScores() {
        let alphas = new Uint8ClampedArray(this.CS2);
        let scoresRange = this.maxScore - this.minScore;   // now any (score / scoresRange) is between 0 and 1
        let maxk = this.lastRowIndex * this.canvasSize;  // start of the bottom margin - special easier treatment from there on
        for (let k=0; k < maxk; k++) {
            alphas[k] = Math.round(255 * (this.scores[k] - this.minScore) / scoresRange);
        }
        for (let k=maxk; k < this.CS2; k++) {
            alphas[k] = 0;
        }
        return alphas;
    }

    /**
     * Return the distribution of alignment scores in the form of a JSON-like array
     * `[{x: <score>, y: <count>}, ...]`
     * @param scoresObject: as returned by `calculateScores()`.
     */
    densityFromScores() {
        let counts = {};
        for (let i=0; i < this.lastRowIndex; i++) {
            for (let j=0; j < this.lastColIndex; j++) {
                let score = this.scores[i * this.canvasSize + j];
                counts[score] = (counts[score] || 0) + 1;
            }
        }
        var data = [];
        for (var key of Object.keys(counts)) {
            data.push({x: parseInt(key), y: counts[key]});
        }
        return data;
    }


    /**
     * Fill the dotter canvas with similarity scores; return the scores density.
     * It never stores the matrix in memory: it draws a point and forgets about it.
     */
    fillCanvas(alphas) {
        let canvas = this.clearCanvas(this.canvasId);
        let ctx = canvas.getContext('2d');
        let imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
        let N = 4 * alphas.length;
        for (let k=0; k < N; k += 4) {
            imageData.data[k+3] = alphas[k/4];
        }
        ctx.imageSmoothingEnabled = false;
        ctx.putImageData(imageData, 0, 0);
    }


    /**
     * Draw the vertical and horizontal lines showing the current position (i,j) on the canvas.
     */
    drawPositionLines(i, j) {
        let canvas = this.clearCanvas(this.topCanvasId);
        let ctx = canvas.getContext('2d');
        let x = this.coordinateFromSeqIndex(i);
        let y = this.coordinateFromSeqIndex(j);
        let CS = this.canvasSize;
        // If the point size is > 1, make the lines pass in the middle.
        if (this.L < CS) {
            let canvasPt = CS / this.L;
            x += canvasPt/2;
            y += canvasPt/2;
        }
        ctx.fillStyle = "red";
        ctx.fillRect(x, 1, 1, this.ls2 * this.scaleToPx);
        ctx.fillRect(1, y, this.ls1 * this.scaleToPx, 1);
    }

    //---------------------- GREY SCALE ------------------------//

    /**
     * Return the min and max alpha values among the `alphas` that are
     * in the rectangle `(0, 0, lastColIndex, lastRowIndex)`.
     * This is because we don't want to take the uncomputed scores (0)
     * outside of this area into account.
     */
    getMinMaxAlpha(alphas) {
        let minAlpha = 255;
        let maxAlpha = 0;
        for (let i=0; i < this.lastRowIndex; i++) {
            for (let j=0; j < this.lastColIndex; j++) {
                let alphak = alphas[i * this.canvasSize + j];
                if (alphak < minAlpha) {
                    minAlpha = alphak;
                } else if (alphak > maxAlpha) {
                    maxAlpha = alphak;
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
    rescaleAlphas(initialAlphas, minBound, maxBound) {
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
        let N = initialAlphas.length;
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
     * Redraw the canvas after clamping the alpha values and rescaling the remaining scores interval.
     *  We need to keep the initialAlphas in store because clamping loses data,
     *  but we need to be able to go back to the initial state.
     * @param initialAlphas: a canvasSize x canvasSize Uint8ClampedArray.
     * @param minBound: (uint8) all alphas lower than `minBound` become equal to `minBound`.
     * @param maxBound: (uint8) all alphas bigger than `maxBound` become equal to `maxBound`.
     */
    greyScale(initialAlphas, minBound, maxBound) {
        let canvas = document.getElementById(CANVAS_ID);
        let ctx = canvas.getContext('2d');
        let imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
        let data = imageData.data;
        let newAlphas = this.rescaleAlphas(initialAlphas, minBound, maxBound);
        let N = newAlphas.length;
        for (let i = 0; i < N; i++) {
            data[4*i+3] = newAlphas[i];
        }
        ctx.putImageData(imageData, 0, 0);
    }

}





export default Dotter;
