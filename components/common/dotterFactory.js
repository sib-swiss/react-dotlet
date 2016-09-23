
import Dotter from './Dotter';
import store from '../../core/store';
import { MINIMAP_SIZE, CANVAS_SIZE } from '../constants/constants';

/*
 * Define ways to obtain a Dotter object from different inputs.
 */


/**
 * Shortcut by passing an object that has all the properties below,
 * - like store.getState() has.
 */
function DotterFromState(state) {
    return new Dotter(state.canvasSize, state.windowSize, state.s1, state.s2, state.scoringMatrix);
}

/**
 * Shortcut the above to use the store's current state.
 */
function DotterFromStore() {
    let state = store.getState();
    return DotterFromState(state);
}

/**
 * Everything remains as in the store state except the canvas size,
 * - which is most likely the minimap's.
 */
function DotterFromCS(canvasSize) {
    let state = store.getState();
    return new Dotter(canvasSize, state.windowSize, state.s1, state.s2, state.scoringMatrix);
}

/**
 * Shortcut of the above to use the minimap's size.
 */
function DotterForMinimap() {
    return DotterFromCS(MINIMAP_SIZE);
}

/**
 * Same but for the main dot plot.
 */
function DotterForDotplot() {
    return DotterFromCS(CANVAS_SIZE);
}



export {
    DotterFromState,
    DotterFromStore,
    DotterFromCS,
    DotterForMinimap,
    DotterForDotplot,
};
