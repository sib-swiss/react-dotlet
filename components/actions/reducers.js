import { CHANGE_SEQUENCE, CHANGE_WINDOW_SIZE, CHANGE_SCORING_MATRIX,
         INSPECT_COORDINATE, CHANGE_GREY_SCALE, RESIZE_CANVAS, OPEN_TOAST,
         ZOOM, DRAG_MINIMAP, CHANGE_VIEW_POSITION } from './actionTypes';
import Dotter from '../DotterPanel/dotter';
import defaultState from './defaultState';
import { commonSeqType } from '../InputPanel/input';
import { viewRectangleCoordinates } from '../common/helpers';
import { MINIMAP_SIZE } from '../constants/constants';


let reducer = (state = defaultState, action) => {

    /**
     * Called every time an action involving the zoom is fired.
     */
    function updateView({
        i = state.i,
        j = state.j,
        zoomLevel = state.zoomLevel,
    }) {
        let L = state.L;
        let s1 = state.s1, s2 = state.s2;
        let windowSize = state.windowSize;
        // Minimap view square
        let miniRect = viewRectangleCoordinates(i, j, L, MINIMAP_SIZE, windowSize, zoomLevel);
        let minimapView = {x: miniRect.x, y: miniRect.y, size: miniRect.size};
        // View square
        let d = new Dotter(state);
        var rect = viewRectangleCoordinates(i, j, L, state.canvasSize, windowSize, zoomLevel);
        var xx = d.seqIndexFromCoordinate(rect.x);
        var yy = d.seqIndexFromCoordinate(rect.y);
        let view = {i: xx, j: yy, L: L/zoomLevel,
                    x: rect.x, y: rect.y, size: rect.size};
        // Recalculate the view with subsequences, without changing state.s1 and state.s2
        if (zoomLevel !== 1) {
            s1 = s1.slice(xx, Math.round(xx + L/zoomLevel) + 1);
            s2 = s2.slice(yy, Math.round(yy + L/zoomLevel) + 1);
        }
        return {s1, s2, view, minimapView};
    }

    /**
     * Called every time an action triggering a redraw is fired.
     */
    function updateScores({
         s1 = state.s1,
         s2 = state.s2,
         windowSize = state.windowSize,
         scoringMatrix = state.scoringMatrix,
         greyScale = state.greyScale,
         canvasSize = state.canvasSize,
    }) {
        //let commonType = commonSeqType(s1Type, s2Type);
        console.log("UPDATE_SCORES");
        let d = new Dotter(canvasSize, windowSize, s1, s2, scoringMatrix);  // the possibly zoomed s1 and s2
        d.calculateScores();
        let density = d.densityFromScores();
        let alphas = d.alphasFromScores();
        let addToState = {
            density: density,
            greyScale : {initialAlphas: alphas, minBound: greyScale.minBound, maxBound: greyScale.maxBound},
            toast: defaultState.toast,  // reset
            scoresUpdated: !state.scoresUpdated,  // signal to all listening components that it was updated
        };
        return addToState;
    }


    switch (action.type) {

        /*
         * When the sequence changes, draw to the canvas as a side-effect, but actually compute
         * scores and store the latter. Also compute the max seq length, as many methods require it.
         * Expects `action.seqn` in [1|2]: the sequence number,
         * and `action.sequence`, the new string.
         */
        case CHANGE_SEQUENCE: {
            let newState = Object.assign({}, state);
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
            let L = Math.max(ls1, ls2);
            newState.L = L;
            let addToState = updateScores({s1: newState.s1, s2:newState.s2});
            Object.assign(newState, addToState);
            return newState;
        }

        /*
         * When the user changes the size of the sliding window.
         * Expects `action.windowSize`.
         */
        case CHANGE_WINDOW_SIZE: {
            let winsize = action.windowSize;
            let addToState = updateScores({windowSize: winsize});
            return Object.assign({}, state, addToState, {windowSize: winsize});
        }

        /*
         * When the user changes the scoring matrix.
         * Expects `action.scoringMatrix`.
         */
        case CHANGE_SCORING_MATRIX: {
            let addToState = updateScores({scoringMatrix: action.scoringMatrix});
            return Object.assign({}, state, addToState, {scoringMatrix: action.scoringMatrix});
        }

        /*
         * When we change the inspected position on the canvas (mouse or keyboard).
         * Expects `action.i`, `action.j`.
         */
        case INSPECT_COORDINATE: {
            return Object.assign({}, state, {i: action.i, j: action.j});
        }

        /*
         * When the grey scale slider is moved.
         * Expects `action.minBound`, `action.maxBound`.
         */
        case CHANGE_GREY_SCALE: {
            let newState = Object.assign({}, state);
            let d = new Dotter(state.canvasSize, state.windowSize, state.s1, state.s2, state.scoringMatrix);
            d.greyScale(state.greyScale.initialAlphas, action.minBound, action.maxBound);
            newState.greyScale.minBound = action.minBound;
            newState.greyScale.maxBound = action.maxBound;
            return newState;
        }

        case RESIZE_CANVAS: {
            let addToState = updateScores({canvasSize: action.canvasSize});
            return Object.assign({}, state, addToState, {canvasSize: action.canvasSize});
        }

        /*
         * When a message is sent to be open in a Toast (bottom screen temp messager).
         * Expects `action.message`.
         */
        case OPEN_TOAST: {
            return Object.assign({}, state, {toast: {open: true, message: action.message}});
        }

        /*
         * Expects `action.x` and `action.y`, the new top-left coordinates of the minimap square view.
         */
        case DRAG_MINIMAP: {
            let minimapView = {x: action.x, y: action.y, size: state.minimapView.size};
            return Object.assign({}, state, {minimapView: minimapView});
        }

        /*
         * Expects `action.scalingFactor`.
         */
        case ZOOM: {
            let zoomLevel = action.zoomLevel;
            let uv = updateView({zoomLevel});
            let addToState = updateScores({s1: uv.s1, s2: uv.s2});
            let newState = {zoomLevel: zoomLevel, view: uv.view, minimapView: uv.minimapView};
            return Object.assign({}, state, newState, addToState);
        }

        case CHANGE_VIEW_POSITION: {
            let i = Math.min(Math.max(0, action.i), state.s2.length-1);
            let j = Math.min(Math.max(0, action.j), state.s1.length-1);
            let uv = updateView({i, j});
            let addToState = updateScores({s1: uv.s1, s2: uv.s2});
            let newState = {i: i, j: j, view: uv.view, minimapView: uv.minimapView};
            return Object.assign({}, state, newState, addToState);
        }

        default:
            return state;
}};


export default reducer;
