
import { CHANGE_SEQUENCE, CHANGE_WINDOW_SIZE, CHANGE_SCORING_MATRIX } from './actionTypes';
import { fillCanvas } from '../../DotterPanel/dotter';
import { SCORING_MATRICES, DNA, PROTEIN } from '../../constants/constants';

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
    scoringMatrix: SCORING_MATRICES.IDENTITY,
};

let inputReducer = (state = defaultState, action) => { switch (action.type) {

    /*
     * When the sequence changes, draw to the canvas as a side-effect, but actually compute
     * scores and store only the latter.
     */
    case CHANGE_SEQUENCE:
        var newState = Object.assign({}, state);
        let scores;
        if (action.seqn === 1) {
            scores = fillCanvas(action.sequence, state.s2, state.windowSize, state.scoringMatrix, action.seqtype);
            newState.s1 = action.sequence;
            newState.s1Type = action.seqtype;
        } else {
            scores = fillCanvas(state.s1, action.sequence, state.windowSize, state.scoringMatrix, action.seqtype);
            newState.s2 = action.sequence;
            newState.s2Type = action.seqtype;
        }
        newState.scores = scores;
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

    default:
        return state;
}};


export default inputReducer;
