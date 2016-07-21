
import { CHANGE_SEQUENCE, CHANGE_WINDOW_SIZE, CHANGE_SCORING_MATRIX } from './actionTypes';
import { fillCanvas } from '../../DotterPanel/dotter';
import { SCORING_MATRICES } from '../../constants/constants';


let defaultState = {
    s1: "AAAAAAATTTCCCCCC",
    s2: "AAAGAAATTTC",
    scores: [],
    windowSize: 1,
    scoringMatrix: SCORING_MATRICES.IDENTITY,
};

let inputReducer = (state = defaultState, action) => { switch (action.type) {

    case CHANGE_SEQUENCE:
        var newState = Object.assign({}, state);
        let scores;
        if (action.seqn === 1) {
            scores = fillCanvas(action.sequence, state.s2, state.windowSize, state.scoringMatrix);
            newState.s1 = action.sequence;
        } else {
            scores = fillCanvas(state.s1, action.sequence, state.windowSize, state.scoringMatrix);
            newState.s2 = action.sequence;
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
