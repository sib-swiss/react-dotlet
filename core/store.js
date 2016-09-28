
/*
 * Redux store
 */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from '../components/actions/reducers';


/*
 * store.getState() will return an object of the form
 * { <reducer1> input: ...,
 *   <reducer2> dotter: ...,
 *   ...
 *  }
 */

const logger = createLogger({
    collapsed: true,
    diff: false,
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
