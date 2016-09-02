
import { CANVAS_ID } from '../constants/constants';
import { SCORING_MATRIX_NAMES } from '../constants/constants';
import { SCORING_MATRICES } from '../constants/scoring_matrices/scoring_matrices';
import { MATCH, MISMATCH, AA_MAP, PROTEIN, DNA } from '../constants/constants';
import { translateProtein } from '../common/genetics';
import { viewRectangleCoordinates } from '../common/helpers';
import * as d3scale from 'd3-scale';

/**
 * Plotting functions in the main canvas.
 */


class Dotter {
    constructor(canvasSize, windowSize, s1,s2, scoringMatrixName) {

        /* Shortcut to pass the state in as unique argument.
           Stupid JS does not support alternative constructors */
        if (arguments.length === 1) {
            let state = canvasSize; // first argument, forget the name
            canvasSize = state.canvasSize;
            windowSize = state.windowSize;
            s1 = state.s1;
            s2 = state.s2;
            scoringMatrixName = state.scoringMatrix;
        }

        /* Pure input */
        this.canvasId = CANVAS_ID;
        this.topCanvasId = CANVAS_ID +'-topLayer';
        this.canvasSize = canvasSize;
        this.windowSize = windowSize;
        this.scoringMatrixName = scoringMatrixName;
        this.s1 = s1;
        this.s2 = s2;
        this.minScore = Infinity;
        this.maxScore = -Infinity;

        /* Shorteners for window size bits */
        this.hws = ~~ (windowSize / 2);   // # of nucleotides on each side
        this.ws2 = windowSize - 1;

        /* What depends on input sequences */
        this.ls1 = s1.length;
        this.ls2 = s2.length;
        this.L = Math.max(this.ls1, this.ls2);
        this.smallSequence = this.L < canvasSize;
        this.scaleToPx = canvasSize / (this.L - windowSize + 1);
        this.scaleToSeq = (this.L - windowSize + 1) / canvasSize;
        this.lastRowIndex = this.coordinateFromSeqIndex(this.ls2 - 2*this.hws);
        this.lastColIndex = this.coordinateFromSeqIndex(this.ls1 - 2*this.hws);

        /* Init scores array (depends only on canvas size) */
        this.CS2 = canvasSize * canvasSize;
        this.scores = new Int16Array(this.CS2);
        this.MIN_INT16 = -32767;
        for (let k=0; k < this.CS2; k++) {
            this.scores[k] = this.MIN_INT16;
        }

        /* Scoring functions */
        this.isIdentityMatrix = scoringMatrixName === SCORING_MATRIX_NAMES.IDENTITY;
        this.scoringMatrix = SCORING_MATRICES[scoringMatrixName];
        this.scoringFunction = this.isIdentityMatrix ?
            this.calculateMatches.bind(this) : this.calculateScore.bind(this);
        this.scoringOneFunction = this.isIdentityMatrix ?
            this.calculateOneMatch.bind(this) : this.calculateOneScore.bind(this);
    }

    /**
     * Returns the (approximate, integer) pixel coordinate corresponding to that sequence `index`.
     */
    coordinateFromSeqIndex(index) {
        return ~~ (this.scaleToPx * index);
    }

    /**
     * Returns the (approximate, integer) sequence index corresponding to that pixel coordinate `px`.
     */
    seqIndexFromCoordinate(px) {
        return ~~ (this.scaleToSeq * px);
    }

    /**
     * Check that the canvas exists, and if so clear it.
     * @param canvasId
     * @returns {Element} the canvas.
     */
    clearCanvas(canvasId) {
        let canvas = document.getElementById(canvasId);
        if (canvas === null) { throw new ReferenceError("Canvas not found"); }
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        return canvas;
    }

    /**
     * Returns the similarity score when the Identity comparison is used.
     * @param ss1: first sub-sequence.
     * @param ss2: second sub-sequence.
     */
    calculateMatches(ss1, ss2) {
        //if (ss1.length === 0) throw new Error("First sub-sequence is empty")
        //if (ss2.length === 0) throw new Error("Second sub-sequence is empty")
        let L = Math.min(ss1.length, ss2.length);
        let match = 0, mismatch = 0;
        for (let i=0; i < L; i++) {
            if (ss1[i] === ss2[i]) { match ++; }
            else { mismatch ++; }
        }
        return this.scoringMatrix[MATCH] * match
             + this.scoringMatrix[MISMATCH] * mismatch;
    }

    calculateOneMatch(char1, char2) {
        return char1 === char2 ? this.scoringMatrix[MATCH] : this.scoringMatrix[MISMATCH];
    }

    /**
     * In proteins comparison, return the similarity score.
     * @param ss1: first sub-sequence.
     * @param ss2: second sub-sequence.
     */
    calculateScore(ss1, ss2) {
        //if (ss1.length === 0) throw new Error("First sub-sequence is empty")
        //if (ss2.length === 0) throw new Error("Second sub-sequence is empty")
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

    calculateOneScore(char1, char2) {
        let i = AA_MAP[char1];
        let j = AA_MAP[char2];
        return this.scoringMatrix[i][j];
    }

    /**
     * Get the slice of `seq` centered on `index` with `hws` elements on each side.
     * @param seq: full sequence.
     * @param index: zero-based index of the center char in `seq`.
     */
    getSequenceAround(seq, index) {
        return seq.slice(Math.max(index - this.hws, 0), index + this.hws + 1);
    }

    /**
     * Calculates the alignment score at position (i,j) with the current window size.
     * Returns the score (Int16).
     * @param i: index in sequence 2 (vertical).
     * @param j: index in sequence 1 (horizontal).
     */
    scoreAround(i,j) {
        let ss1 = this.getSequenceAround(this.s1, j);
        let ss2 = this.getSequenceAround(this.s2, i);
        let score = this.scoringFunction(ss1, ss2);
        return score;
    }

    /**
     * Fill the `scores` array at the (pixel-)position corresponding to sequence indices (i,j).
     * If it already has a value, take the max.
     * If the canvas is bigger than the longest sequence, fill squares between pixels with the same score.
     * @param i: index in sequence 2 (vertical).
     * @param j: index in sequence 1 (horizontal).
     * @param score: alignment score (Int16).
     * @returns {undefined}
     */
    pushPixel(i,j, score) {
        let v = this.coordinateFromSeqIndex(i);
        let h = this.coordinateFromSeqIndex(j);
        let idx = v * this.canvasSize + h;
        let maxScore = Math.max(score, this.scores[idx]);
        this.scores[idx] = maxScore;
        if (this.smallSequence) {
            for (let m=0; m < this.scaleToPx; m++) {
                for (let n=0; n < this.scaleToPx; n++) {
                    this.scores[(v+m) * this.canvasSize + (h+n)] = score;
                }
            }
        }
    }

    /**
     * Common code to the two diagonal functions below.
     * Since we go along one diagonal, the two full sequences are always aligned with the same shift.
     * To get the next score, remove the score component of the leftmost pair,
     * and add the score component of the new pair.
     * Update minScore, maxScore, and the scores array.
     * Returns the score at this diagonal position.
     */
    _oneDiagonalScore(prevScore, di, dj) {
        var score = prevScore
            + this.scoringOneFunction(this.s1[dj + this.ws2], this.s2[di + this.ws2])
            - this.scoringOneFunction(this.s1[dj-1], this.s2[di-1]);
        if (score > this.maxScore) this.maxScore = score;
        else if (score < this.minScore) this.minScore = score;
        this.pushPixel(di, dj, score);
        return score;
    }

    /**
     * Draw the diagonals starting from the top border of the canvas, towards bottom-right.
     * @returns {undefined}
     */
    topDiagonals() {
        console.log("TopDiagonals");
        let hws = this.hws, windowSize = this.windowSize;
        let ls1 = this.ls1, ls2 = this.ls2;
        let hlimit = ls1 - hws;
        let vsize = ls2 - this.ws2;
        let hsize = ls1 - this.ws2;
        for (let j=hws; j<hlimit; j++) {
            let prevScore = this.scoreAround(hws,j); // di,dj = 0
            this.pushPixel(0, j-hws, prevScore);
            for (let dj = j-hws+1, di = 1;  // di,dj: leftmost index of the sliding window
                     dj < hsize && di < vsize;
                     dj++, di++) {
                let score = this._oneDiagonalScore(prevScore, di, dj);
                prevScore = score;
            }
        }
    }

    /**
     * Draw the diagonals starting from the left border of the canvas, towards bottom-right.
     * @returns {undefined}.
     */
    leftDiagonals() {
        console.log("LeftDiagonals");
        let hws = this.hws, windowSize = this.windowSize;
        let ls1 = this.ls1, ls2 = this.ls2;
        let scoringFunction = this.scoringFunction;
        let vlimit = ls2 - hws;
        let vsize = ls2 - this.ws2;
        let hsize = ls1 - this.ws2;
        for (let i=hws+1; i<vlimit; i++) {
            let prevScore = this.scoreAround(i,hws); // di,dj = 0
            this.pushPixel(i-hws, 0, prevScore);
            for (let di = i-hws+1, dj = 1;  // di,dj: leftmost index of the sliding window
                     dj < hsize && di < vsize;
                     dj++, di++) {
                let score = this._oneDiagonalScore(prevScore, di, dj);
                prevScore = score;
            }
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
     * Return alpha values corresponding to the (max-)alignemnt scores.
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
     * `[{x: <score>, y: <count>}, ...]`.
     * It is not calculated from all scores, but only the ones displayed in the canvas
     * (i.e. max scores), so it can skew the distribution (Gaussian -> Gumbel),
     * but at least it mirrors what we see.
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
     * Zoom on an ImageData using a temporary unmounted canvas.
     * Source: http://stackoverflow.com/questions/3448347/how-to-scale-an-imagedata-in-html-canvas
     * Equivalent to ``ctx.putImageData(imageData, 0, 0)``
     * if the `scalingFactor` is 1.
     */
    _zoom(ctx, imageData, scalingFactor) {
        let tempCanvas = document.createElement("canvas");
        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
        tempCanvas.getContext("2d").putImageData(imageData, 0, 0);
        ctx.scale(scalingFactor, scalingFactor);
        ctx.drawImage(tempCanvas, 0, 0);
    }

    /**
     * Fill the dotter canvas with similarity scores; return the scores density.
     * It never stores the matrix in memory: it draws a point and forgets about it.
     * @param alphas: a (canvasSize x canvasSize) Uint8ClampedArray.
     * @param zoom: relative scaling factor, usually in [0.5, 1, 2].
     * @returns {undefined}
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

    //drawPositionLines(i, j, zoom) {
    //    let x = this.coordinateFromSeqIndex(i);
    //    let y = this.coordinateFromSeqIndex(j);
    //    //let rect = viewRectangleCoordinates(i, j, this.L, this.canvasSize, zoom);
    //    //console.debug([i,j], [x,y], rect)
    //    //x = x - rect.x;
    //    //y = y - rect.y;
    //    console.debug("->", [x,y])
    //    // If the point size is > 1, make the lines pass in the middle.
    //    if (this.smallSequence) {
    //        x += this.scaleToPx / 2 + 1;
    //        y += this.scaleToPx / 2 + 1;
    //    }
    //    let canvas = this.clearCanvas(this.topCanvasId);
    //    let ctx = canvas.getContext('2d');
    //    ctx.fillStyle = "red";
    //    ctx.fillRect(x, 1, 1, this.lastRowIndex);
    //    ctx.fillRect(1, y, this.lastColIndex, 1);
    //}

    //---------------------- GREY SCALE ------------------------//


    /**
     * Rescale and clamp alpha values between `minBound` and `maxBound`:
     * All shades below `minBound` become white, and all shades above `maxBound` become black.
     * All shades in-between are rescaled to use the whole 0-255 range.
     * If `minBound` becomes bigger than `maxBound`, colors are inverted.
     * @param initialAlphas: a (canvasSize x canvasSize) Uint8ClampedArray.
     * @param minBound: (uint8)
     * @param maxBound: (uint8)
     * @returns {Uint8ClampedArray}
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
     * @returns {undefined}
     */
    greyScale(initialAlphas, minBound, maxBound) {
        let canvas = document.getElementById(this.canvasId);
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



class DotterWithTranslation extends Dotter {
    constructor(canvasSize, windowSize, s1,s2, scoringMatrixName, s1Type, s2Type) {
        super(canvasSize, windowSize, s1,s2, scoringMatrixName);

        console.debug(11, this.L);

        if (s1Type === DNA) {
            console.debug("translating s1");
            this.ls1 = ~~ (this.ls1 / 3);
            //s1 = translateProtein(s1, 0)
            //s1 = translateProtein(s1, 1)
            //s1 = translateProtein(s1, 2)
        } else {
            console.debug("translating s2");
            this.ls2 = ~~ (this.ls2 / 3);
            //s2 = translateProtein(s2)
        }
        this.L = Math.max(this.ls1, this.ls2);
        this.smallSequence = this.L < canvasSize;

        console.debug(22, this.L)

    }
}





export default Dotter;
