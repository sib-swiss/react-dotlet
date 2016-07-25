import { CHANGE_SEQUENCE, CHANGE_WINDOW_SIZE, CHANGE_SCORING_MATRIX,
         INSPECT_COORDINATE, KEYBOARD_DIRECTION, SLIDE_TWO_SEQS } from './actionTypes';
import { fillCanvas, drawPositionLines } from '../DotterPanel/dotter';
import { commonSeqType } from '../InputPanel/input';
import { SCORING_MATRIX_NAMES, DNA, PROTEIN } from '../constants/constants';


// s1: YWHAB from Uniprot, len 246
// s2: YWHAZ Coelacant ortholog
let defaultState = {
    s1: "MTMDKSELVQKAKLAEQAERYDDMAAAMKAVTEQGHELSNEERNLLSVAYKNVVGARRSS" +
    "WRVISSIEQKTERNEKKQQMGKEYREKIEAELQDICNDVLELLDKYLIPNATQPESKVFY" +
    "LKMKGDYFRYLSEVASGDNKQTTVSNSQQAYQEAFEISKKEMQPTHPIRLGLALNFSVFY" +
    "YEILNSPEKACSLAKTAFDEAIAELDTLNEESYKDSTLIMQLLRDNLTLWTSENQGDEGD" +
    "AGEGEN",
    s2: "RKPLQTPTPIRRLWTMDTSELVQKAKLAEQAERYDDMAASMKAVTEQGAELSNEERNLLS" +
    "VAYKNVVGARRSSWRVISSIEQKTEGSEQKQQMAREYREKIEAELRDICNDVLGLLDKYL" +
    "IANASKAESKVFYLKMKGDYYRYLAEVAAGEDKKSTVDHSQQVYQEAFEISKKEMTSTHP" +
    "IRLGLALNFSVFYYEILNLPEQACGLAKTAFDDAISELDKLGDESYKDSTLIMQLLRDNL" +
    "TVST",
    s1Type: PROTEIN,
    s2Type: PROTEIN,
    scores: [],
    windowSize: 1,
    scoringMatrix: SCORING_MATRIX_NAMES.IDENTITY,
    i: 0,
    j: 0,
    matrixSize: 246,
};


let reducer = (state = defaultState, action) => {
    let newState;
    switch (action.type) {

    /*
     * When the sequence changes, draw to the canvas as a side-effect, but actually compute
     * scores and store the latter. Also compute the max seq length, as many methods require it.
     */
    case CHANGE_SEQUENCE:
        newState = Object.assign({}, state);
        let scores;
        let seqtype;
        if (action.seqn === 1) {
            seqtype = commonSeqType(action.seqtype, state.s2Type);
            scores = fillCanvas(action.sequence, state.s2, state.windowSize, state.scoringMatrix);
            newState.s1 = action.sequence;
            newState.s1Type = action.seqtype;
        } else {
            seqtype = commonSeqType(state.s1Type, action.seqtype);
            scores = fillCanvas(state.s1, action.sequence, state.windowSize, state.scoringMatrix);
            newState.s2 = action.sequence;
            newState.s2Type = action.seqtype;
        }
        newState.scores = scores;
        newState.matrixSize = Math.max(newState.s1.length, newState.s2.length);
        newState.i = 0; newState.j = 0;
        drawPositionLines(state.i, state.j, newState.matrixSize);
        return newState;

    case CHANGE_WINDOW_SIZE:
        let winsize = action.windowSize;
        if (! winsize) {
            winsize = 1;
        }
        scores = fillCanvas(state.s1, state.s2, winsize, state.scoringMatrix);
        return Object.assign({}, state, {scores: scores, windowSize: parseInt(winsize)});

    case CHANGE_SCORING_MATRIX:
        scores = fillCanvas(state.s1, state.s2, state.windowSize, action.scoringMatrix);
        return Object.assign({}, state, {scores: scores, scoringMatrix: action.scoringMatrix});

    /*
     * On click on the canvas.
     */
    case INSPECT_COORDINATE:
        drawPositionLines(action.i, action.j, state.matrixSize);
        return Object.assign({}, state, {i: action.i, j: action.j});

    /*
     * When keyboard direction arrows are pressed.
     * Expects `action.[right|left|top|down]`
     */
    case KEYBOARD_DIRECTION:
        let newDirection;
        if (action.direction === 'down') {
            newDirection = {j: state.j + 1};
        } else if (action.direction === 'up') {
            newDirection = {j: state.j - 1};
        } else if (action.direction === 'right') {
            newDirection = {i: state.i + 1};
        } else if (action.direction === 'left') {
            newDirection = {i: state.i - 1};
        }
        newState = Object.assign({}, state, newDirection);
        drawPositionLines(newState.i, newState.j, state.matrixSize);
        return newState;

    /*
     * When keyboard direction arrows are pressed.
     * Expects `action.seqn` in [1|2]: the sequence number,
     * and `action.shift`: the positive or negative shift.
     */
    case SLIDE_TWO_SEQS:
        let direction;
        if (action.seqn === 1) {
            direction = {i: state.i + action.shift};
        } else {
            direction = {j: state.j + action.shift};
        }
        newState = Object.assign({}, state, direction);
        drawPositionLines(newState.i, newState.j, state.matrixSize);
        return newState;

    default:
        return state;
}};


export default reducer;
