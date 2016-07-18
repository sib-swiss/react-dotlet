
import { COMPUTE_DENSITY } from './actionTypes';


let dotterDefaultState = {
    scores: [],
};

let dotterReducer = (state = dotterDefaultState, action) => { switch (action.type) {

    case COMPUTE_DENSITY:
        let newState = Object.assign({}, state);
        newState.scores = action.scores;
        return newState;

    default:
        console.log("dotter store :: default", action.type);
        return state;

}};


export default dotterReducer;
