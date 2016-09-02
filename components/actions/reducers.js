import { CHANGE_SEQUENCE, CHANGE_WINDOW_SIZE, CHANGE_SCORING_MATRIX,
         INSPECT_COORDINATE, CHANGE_GREY_SCALE, RESIZE_CANVAS, OPEN_TOAST,
         ZOOM, DRAG_MINIMAP } from './actionTypes';
import Dotter from '../DotterPanel/dotter';
import defaultState from './defaultState';
import { commonSeqType } from '../InputPanel/input';
import { viewRectangleCoordinates } from '../common/helpers';


let reducer = (state = defaultState, action) => {
    let newState, addToState;  // because reused in many switch cases
    let density;
    let scores;

    let updateScores = function({
         s1 = state.s1,
         s2 = state.s2,
         s1Type = state.s1Type,
         s2Type = state.s2Type,
         windowSize = state.windowSize,
         scoringMatrix = state.scoringMatrix,
         greyScale = state.greyScale,
         canvasSize = state.canvasSize,
         zoomLevel = state.zoomLevel,
    }) {
        //let commonType = commonSeqType(s1Type, s2Type);
        console.log("UPDATE_SCORES")
        let L = Math.max(s1.length, s2.length);
        let view = state.view;
        let d;
        if (zoomLevel !== state.zoomLevel) {
            d = new Dotter(canvasSize, windowSize, s1, s2, scoringMatrix);
            let rect = viewRectangleCoordinates(state.i, state.j, L, canvasSize, zoomLevel);
            let yy = d.seqIndexFromCoordinate(rect.y);
            let xx = d.seqIndexFromCoordinate(rect.x);
            s1 = s1.slice(xx, xx + ~~(L/zoomLevel));
            s2 = s2.slice(yy, yy + ~~(L/zoomLevel));
            view = {i: xx, j: yy, L: ~~(L/zoomLevel),
                    x: rect.x, y: rect.y, size: rect.size};
        }
        //console.debug(commonType)
        d = new Dotter(canvasSize, windowSize, s1, s2, scoringMatrix);
        d.calculateScores();
        let density = d.densityFromScores();
        let alphas = d.alphasFromScores();
        let addToState = {
            density: density,
            greyScale : {initialAlphas: alphas, minBound: greyScale.minBound, maxBound: greyScale.maxBound},
            toast: defaultState.toast,  // reset
            view: view,
            L: L,
        };
        return addToState;
    };


    switch (action.type) {

    /*
     * When the sequence changes, draw to the canvas as a side-effect, but actually compute
     * scores and store the latter. Also compute the max seq length, as many methods require it.
     * Expects `action.seqn` in [1|2]: the sequence number,
     * and `action.sequence`, the new string.
     */
    case CHANGE_SEQUENCE:
        newState = Object.assign({}, state);
        let s1, s2;
        let seqtype;
        let seq = action.sequence;
        if (action.seqn === 1) {
            newState.s1 = seq;
            newState.s1Type = action.seqtype;
        } else {
            newState.s2 = seq;
            newState.s2Type = action.seqtype;
        }
        seq = undefined;  // free space
        newState.i = 0; newState.j = 0;
        let ls1 = newState.s1.length;
        let ls2 = newState.s2.length;
        addToState = updateScores({s1: newState.s1, s2:newState.s2});
        Object.assign(newState, addToState);
        return newState;

    /*
     * When the user changes the size of the sliding window.
     * Expects `action.windowSize`.
     */
    case CHANGE_WINDOW_SIZE:
        let winsize = action.windowSize || 1;
        addToState = updateScores({windowSize: winsize});
        return Object.assign({}, state, addToState, {windowSize: parseInt(winsize)});

    /*
     * When the user changes the scoring matrix.
     * Expects `action.scoringMatrix`.
     */
    case CHANGE_SCORING_MATRIX:
        addToState = updateScores({scoringMatrix: action.scoringMatrix});
        return Object.assign({}, state, addToState, {scoringMatrix: action.scoringMatrix});

    /*
     * When we change the inspected position on the canvas (mouse or keyboard).
     * Expects `action.i`, `action.j`.
     */
    case INSPECT_COORDINATE:
        return Object.assign({}, state, {i: action.i, j: action.j});

    /*
     * When the grey scale slider is moved.
     * Expects `action.minBound`, `action.maxBound`.
     */
    case CHANGE_GREY_SCALE:
        newState = Object.assign({}, state);
        let d = new Dotter(state.canvasSize, state.windowSize, state.s1, state.s2, state.scoringMatrix);
        d.greyScale(state.greyScale.initialAlphas, action.minBound, action.maxBound);
        newState.greyScale.minBound = action.minBound;
        newState.greyScale.maxBound = action.maxBound;
        return newState;

    case RESIZE_CANVAS:
        addToState = updateScores({canvasSize: action.canvasSize});
        return Object.assign({}, state, addToState, {canvasSize: action.canvasSize});

    /*
     * When a message is sent to be open in a Toast (bottom screen temp messager).
     * Expects `action.message`.
     */
    case OPEN_TOAST:
        return Object.assign({}, state, {toast: {open: true, message: action.message}});

    /*
     * Expects `action.scalingFactor`.
     */
    case ZOOM:
        addToState = updateScores({zoomLevel: action.zoomLevel});
        return Object.assign({}, state, {zoomLevel: action.zoomLevel}, addToState);

    case DRAG_MINIMAP:
        let view = Object.assign({}, state.view);
        view.x = view.x + action.xShift;
        view.y = view.y + action.yShift;
        return Object.assign({}, state, {view: view});

    default:
        return state;
}};


export default reducer;
