
import { CHANGE_SEQUENCE, CHANGE_WINDOW_SIZE } from './actionTypes';
import { fillCanvas } from '../../DotterPanel/dotter';


let defaultState = {
    s1: "AAAAAAATTTCCCCCCTTGC",
    s2: "AAAGAAATTTCCCCCCATGC",
    scores: [],
    window_size: 1,
};

let inputReducer = (state = defaultState, action) => { switch (action.type) {

    case CHANGE_SEQUENCE:
        var newState = Object.assign({}, state);
        let scores;
        if (action.seqn === 1) {
            scores = fillCanvas(action.sequence, state.s2, state.window_size);
            newState.s1 = action.sequence;
        } else {
            scores = fillCanvas(state.s1, action.sequence, state.window_size);
            newState.s2 = action.sequence;
        }
        newState.scores = scores;
        return newState;

    case CHANGE_WINDOW_SIZE:
        var newState = Object.assign({}, state);
        let winsize = action.window_size;
        if (winsize === '') {
            winsize = 1;
        }
        scores = fillCanvas(state.s1, state.s2, winsize);
        newState.scores = scores;
        return newState;

    default:
        return state;
}};


export default inputReducer;
