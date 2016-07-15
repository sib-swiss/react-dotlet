/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { createStore } from 'redux';
import inputPanelActionTypes from '../components/InputPanel/actionTypes';


/*
 * Redux store: action handlers ("reduces")
 */

let defaultState = {
    input: {
        s1: "AAAAAAATTTCCCCCCTTGC",
        s2: "AAAGAAATTTCCCCCCATGC",
    },
};


let inputReducer = (state, action) => { switch (action.type) {

    case inputPanelActionTypes.CHANGE_SEQUENCE:
        //console.log("store :: CHANGE_SEQUENCE", action.seqn, action.sequence);
        let newState = Object.assign({}, state);
        if (action.seqn === 1) {
            newState.input.s1 = action.sequence;
        } else {
            newState.input.s2 = action.sequence;
        }
        return newState;

    default:
        return state;
}};


const store = createStore(inputReducer, defaultState);

export default store;
