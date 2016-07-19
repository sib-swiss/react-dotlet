
import { INSPECT_COORDINATE } from './actionTypes';


let defaultState = {
    i: 0,
    j: 0,
};

let dotterReducer = (state = defaultState, action) => { switch (action.type) {

    case INSPECT_COORDINATE:
        return Object.assign({}, state, {i: action.i, j: action.j});

    default:
        return state;

}};


export default dotterReducer;
