import { CHANGE_SEQUENCE, CHANGE_WINDOW_SIZE, CHANGE_SCORING_MATRIX,
         INSPECT_COORDINATE, CHANGE_GREY_SCALE, RESIZE_CANVAS } from './actionTypes';
import * as dotter from '../DotterPanel/dotter';
import { guessSequenceType, commonSeqType } from '../InputPanel/input';
import { PROTEIN, DNA, CANVAS_SIZE } from '../constants/constants';
//import { translateProtein } from '../common/genetics';
import defaultState from './defaultState';


let updateScores = function(s1, s2, windowSize, scoringMatrix, greyScale, canvasSize) {
    let scoresObject = dotter.calculateScores(s1, s2, windowSize, scoringMatrix, canvasSize);
    let density = dotter.densityFromScores(scoresObject);
    let alphas = dotter.alphasFromScores(scoresObject);
    let addToState = {
        density: density,
        greyScale : {initialAlphas: alphas, minBound: greyScale.minBound, maxBound: greyScale.maxBound},
    };
    return addToState;
};


let reducer = (state = defaultState, action) => {
    let newState, addToState;  // because reused in many switch cases
    let density;
    let scores;

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
        newState.i = 0; newState.j = 0;
        let ls1 = newState.s1.length;
        let ls2 = newState.s2.length;
        addToState = updateScores(newState.s1, newState.s2, state.windowSize, state.scoringMatrix, state.greyScale, state.canvasSize);
        Object.assign(newState, addToState);
        return newState;

    /*
     * When the user changes the size of the sliding window.
     * Expects `action.windowSize`.
     */
    case CHANGE_WINDOW_SIZE:
        let winsize = action.windowSize || 1;
        addToState = updateScores(state.s1, state.s2, winsize, state.scoringMatrix, state.greyScale, state.canvasSize);
        return Object.assign({}, state, addToState, {windowSize: parseInt(winsize)});

    /*
     * When the user changes the scoring matrix.
     * Expects `action.scoringMatrix`.
     */
    case CHANGE_SCORING_MATRIX:
        addToState = updateScores(state.s1, state.s2, state.windowSize, action.scoringMatrix, state.greyScale, state.canvasSize);
        return Object.assign({}, state, addToState, {scoringMatrix: action.scoringMatrix});

    /*
     * When we change the inspected position on the canvas (mouse or keyboard).
     * Expects `action.i`, `action.j`.
     */
    case INSPECT_COORDINATE:
        return Object.assign({}, state, {i: action.i, j: action.j});

    /*
     * When the grey scale slider is moved.
     * Expects `action.minBound`, `action.maxBound`.
     */
    case CHANGE_GREY_SCALE:
        newState = Object.assign({}, state);
        dotter.greyScale(state.greyScale.initialAlphas, action.minBound, action.maxBound, state.s1.length, state.s2.length);
        newState.greyScale.minBound = action.minBound;
        newState.greyScale.maxBound = action.maxBound;
        return newState;

    case RESIZE_CANVAS:
        addToState = updateScores(state.s1, state.s2, state.windowSize, state.scoringMatrix, state.greyScale, action.canvasSize);
        return Object.assign({}, state, addToState, {canvasSize: action.canvasSize});

    default:
        return state;
}};


export default reducer;
