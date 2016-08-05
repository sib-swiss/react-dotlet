import { CHANGE_SEQUENCE,
         CHANGE_WINDOW_SIZE,
         CHANGE_SCORING_MATRIX,
         INSPECT_COORDINATE,
         KEYBOARD_DIRECTION,
         SLIDE_TWO_SEQS,
         CHANGE_GREY_SCALE
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

/**
 * When the canvas is clicked.
 */
function inspectCoordinate(i, j) {
    return {
        type: INSPECT_COORDINATE,
        i: i,
        j: j,
    };
}

/**
 * When an arrow key is pressed to shift the position by 1 char int he sequence.
 */
function keyboardArrowShiftCoordinate(direction) {
    return {
        type: KEYBOARD_DIRECTION,
        direction: direction,
    };
}

/**
 * When the sliders above/below the TwoSeqsPanel are moved, to change the alignment.
 * @param seqn: sequence nr, 1 or 2
 */
function moveTwoSeqsSlider(seqn, shift) {
    return {
        type: SLIDE_TWO_SEQS,
        seqn: seqn,
        shift: shift,
    }
}

function changeGreyScale(minBound, maxBound) {
    return {
        type: CHANGE_GREY_SCALE,
        minBound: minBound,
        maxBound: maxBound,
    }
}



export {
    changeSequence,
    changeWindowSize,
    changeScoringMatrix,
    inspectCoordinate,
    keyboardArrowShiftCoordinate,
    moveTwoSeqsSlider,
    changeGreyScale,
};
