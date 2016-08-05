import { CHANGE_SEQUENCE, CHANGE_WINDOW_SIZE, CHANGE_SCORING_MATRIX,
         INSPECT_COORDINATE, KEYBOARD_DIRECTION, SLIDE_TWO_SEQS, CHANGE_GREY_SCALE } from './actionTypes';
import { fillCanvas, drawPositionLines, greyScale, getAlphaValues } from '../DotterPanel/dotter';
import { guessSequenceType, commonSeqType } from '../InputPanel/input';
//import { PROTEIN, DNA } from '../constants/constants';
//import { translateProtein } from '../common/genetics';
import defaultState from './defaultState';


let reducer = (state = defaultState, action) => {
    let newState;
    let density;

    switch (action.type) {

    /*
     * When the sequence changes, draw to the canvas as a side-effect, but actually compute
     * scores and store the latter. Also compute the max seq length, as many methods require it.
     * Expects `action.seqn` in [1|2]: the sequence number,
     * and `action.sequence`, the new string.
     */
    case CHANGE_SEQUENCE:
        newState = Object.assign({}, state);
        let s1, s2;
        let seqtype;
        let seq = action.sequence;
        let guessedType = guessSequenceType(seq, 200);
        if (action.seqn === 1) {
            seqtype = commonSeqType(guessedType, state.s2Type);
            newState.s1 = seq;
            newState.s1Type = action.seqtype;
        } else {
            seqtype = commonSeqType(state.s1Type, guessedType);
            newState.s2 = seq;
            newState.s2Type = action.seqtype;
        }
        seq = undefined;  // free space
        let ls1 = newState.s1.length;
        let ls2 = newState.s2.length;
        newState.matrixSize = Math.max(ls1, ls2);
        newState.i = 0; newState.j = 0;
        drawPositionLines(0, 0, ls1, ls2, newState.matrixSize);
        newState.density = fillCanvas(newState.s1, newState.s2, state.windowSize, state.scoringMatrix, state.greyScale);
        return newState;

    /*
     * When the user changes the size of the sliding window.
     * Expects `action.windowSize`.
     */
    case CHANGE_WINDOW_SIZE:
        let winsize = action.windowSize || 1;
        density = fillCanvas(state.s1, state.s2, winsize, state.scoringMatrix, state.greyScale);
        return Object.assign({}, state, {density: density, windowSize: parseInt(winsize)});

    /*
     * When the user changes the scoring matrix.
     * Expects `action.scoringMatrix`.
     */
    case CHANGE_SCORING_MATRIX:
        density = fillCanvas(state.s1, state.s2, state.windowSize, action.scoringMatrix, state.greyScale);
        return Object.assign({}, state, {density: density, scoringMatrix: action.scoringMatrix});

    /*
     * On click on the canvas.
     * Expects `action.i`, `action.j`.
     */
    case INSPECT_COORDINATE:
        drawPositionLines(action.i, action.j, state.s1.length, state.s2.length, state.matrixSize);
        return Object.assign({}, state, {i: action.i, j: action.j});

    /*
     * When keyboard direction arrows are pressed.
     * Expects `action.[right|left|top|down]`
     */
    case KEYBOARD_DIRECTION:
        let keybDirection;
        if (action.direction === 'down' && state.j < state.s2.length-1) {
            keybDirection = {j: state.j + 1};
        } else if (action.direction === 'up' && state.j > 0) {
            keybDirection = {j: state.j - 1};
        } else if (action.direction === 'right' && state.i < state.s1.length-1) {
            keybDirection = {i: state.i + 1};
        } else if (action.direction === 'left' && state.i > 0) {
            keybDirection = {i: state.i - 1};
        }
        newState = Object.assign({}, state, keybDirection);
        drawPositionLines(newState.i, newState.j, state.s1.length, state.s2.length, state.matrixSize);
        return newState;

    /*
     * When keyboard direction arrows are pressed.
     * Expects `action.seqn` in [1|2]: the sequence number,
     * and `action.shift`: the positive or negative shift.
     */
    case SLIDE_TWO_SEQS:
        let slideDirection;
        if (action.seqn === 1) {
            slideDirection = {i: state.i + action.shift};
        } else {
            slideDirection = {j: state.j + action.shift};
        }
        newState = Object.assign({}, state, slideDirection);
        drawPositionLines(newState.i, newState.j, state.s1.length, state.s2.length, state.matrixSize);
        return newState;

    /*
     * When the grey scale slider is moved.
     * Expects `action.minBound`, `action.maxBound`.
     */
    case CHANGE_GREY_SCALE:
        let defaultMinBound = defaultState.greyScale.minBound;
        let defaultMaxBound = defaultState.greyScale.maxBound;
        let scale = {
            minBound: action.minBound,
            maxBound: action.maxBound,
            initialAlphas: state.greyScale.initialAlphas,
            minAlpha: state.greyScale.minAlpha,
            maxAlpha: state.greyScale.maxAlpha,
        };
        // Back to default state: can forget about initialAlphas: they are stored in the canvas anyway. Just redraw.
        if (action.minBound === defaultMinBound && action.maxBound === defaultMaxBound) {
            scale.initialAlphas = new Uint8ClampedArray([0]);
            fillCanvas(state.s1, state.s2, state.windowSize, state.scoringMatrix, scale);
        // Otherwise, scale according to the new grey scale.
        } else {
            // Record intial state while slider is still at initial position.
            if (state.greyScale.minBound === defaultMinBound && state.greyScale.maxBound === defaultMaxBound) {
                scale.initialAlphas = getAlphaValues();
                scale.minAlpha = scale.initialAlphas.reduce((a,b) => Math.min(a,b));
                scale.maxAlpha = scale.initialAlphas.reduce((a,b) => Math.max(a,b));
            }
            // Update the canvas
            greyScale(scale.initialAlphas, scale.minBound, scale.maxBound)
        }
        return Object.assign({}, state, {greyScale: scale});

    default:
        return state;
}};


export default reducer;
