import { CHANGE_SEQUENCE,
         CHANGE_WINDOW_SIZE,
         CHANGE_SCORING_MATRIX,
         INSPECT_COORDINATE,
         RESIZE_CANVAS,
         CHANGE_GREY_SCALE,
         OPEN_TOAST,
         ZOOM,
         DRAG_MINIMAP,
       } from './actionTypes';

/**
 * Change one of the input sequences.
 * @param seqn: sequence nr, 1 or 2
 * @param sequence: sequeinspectCoordinatence string
 */
function changeSequence(seqn, sequence, seqtype) {
    return {
        type: CHANGE_SEQUENCE,
        seqn: seqn,
        sequence: sequence,
        seqtype: seqtype,
    };
}

function changeWindowSize(windowSize) {
    return {
        type: CHANGE_WINDOW_SIZE,
        windowSize: windowSize,
    };
}

function changeScoringMatrix(scoringMatrix) {
    return {
        type: CHANGE_SCORING_MATRIX,
        scoringMatrix: scoringMatrix,
    };
}

function inspectCoordinate(i, j) {
    return {
        type: INSPECT_COORDINATE,
        i: i,
        j: j,
    };
}

function changeGreyScale(minBound, maxBound) {
    return {
        type: CHANGE_GREY_SCALE,
        minBound: minBound,
        maxBound: maxBound,
    };
}

function resizeCanvas(canvasSize) {
    return {
        type: RESIZE_CANVAS,
        canvasSize: canvasSize,
    };
}

function openToast(message) {
    return {
        type: OPEN_TOAST,
        message: message,
    };
}

function zoom(zoomLevel, direction) {
    return {
        type: ZOOM,
        zoomLevel: zoomLevel,
        direction: direction,
    };
}

function dragMinimap(xShift, yShift) {
    return {
        type: DRAG_MINIMAP,
        xShift: xShift,
        yShift: yShift,
    };
}



export {
    changeSequence,
    changeWindowSize,
    changeScoringMatrix,
    inspectCoordinate,
    changeGreyScale,
    resizeCanvas,
    openToast,
    zoom,
    dragMinimap,
};
