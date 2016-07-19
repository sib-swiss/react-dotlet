
import { COMPUTE_DENSITY, INSPECT_COORDINATE } from './actionTypes';


let dotterDefaultState = {
    scores: [],
};

let dotterReducer = (state = dotterDefaultState, action) => { switch (action.type) {

    case COMPUTE_DENSITY:
        var newState = Object.assign({}, state);
        newState.scores = action.scores;
        return newState;

    case INSPECT_COORDINATE:
        var newState = Object.assign({}, state);
        return newState;


    default:
        console.log("dotter store :: default", action.type);
        return state;

}};


export default dotterReducer;
