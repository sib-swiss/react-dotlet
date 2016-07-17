/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { createStore, combineReducers } from 'redux';
import inputPanelActionTypes from '../components/InputPanel/actionTypes';
import dotterPanelActionTypes from '../components/DotterPanel/constants/actionTypes';


/*
 * Redux store: action handlers ("reducers")
 */

let defaultState = {
    input: {
        s1: "AAAAAAATTTCCCCCCTTGC",
        s2: "AAAGAAATTTCCCCCCATGC",
    },
    dotter: {
        scores: [],
    }
};

let inputDefaultState = {
    s1: "AAAAAAATTTCCCCCCTTGC",
    s2: "AAAGAAATTTCCCCCCATGC",
};

let dotterDefaultState = {
    scores: [],
};

let input = (state = inputDefaultState, action) => { switch (action.type) {

    case inputPanelActionTypes.CHANGE_SEQUENCE:
        //console.log("store :: CHANGE_SEQUENCE", action.seqn, action.sequence);
        let newState = Object.assign({}, state);
        if (action.seqn === 1) {
            newState.s1 = action.sequence;
        } else {
            newState.s2 = action.sequence;
        }
        return newState;

    default:
        console.log("store input :: ", action.type)
        console.log("store input :: ", action.type === dotterPanelActionTypes.COMPUTE_DENSITY)
        console.log("store input :: ", state)
        return state;
}};


let dotter = (state = dotterDefaultState, action) => { switch (action.type) {

    case dotterPanelActionTypes.COMPUTE_DENSITY:
        console.log(action)
        console.log("store :: COMPUTE_DENSITY", action.scores.size);
        let newState = Object.assign({}, state);
        newState.scores = action.scores;
        return newState;

    default:
        console.log("dotter store :: default", action.type);
        return state;

}};


let reducer = combineReducers({
    input,
    dotter,
});


const store = createStore(reducer, defaultState);

export default store;
