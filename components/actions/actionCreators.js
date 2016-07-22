import { CHANGE_SEQUENCE, CHANGE_WINDOW_SIZE, CHANGE_SCORING_MATRIX,
         INSPECT_COORDINATE, KEYBOARD_DIRECTION, SLIDE_TWO_SEQS } from './actionTypes';


/*
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

/*
 * When the canvas is clicked.
 */
function inspectCoordinate(i, j) {
    return {
        type: INSPECT_COORDINATE,
        i: i,
        j: j,
    };
}


export {
    changeSequence,
    changeWindowSize,
    changeScoringMatrix,
    inspectCoordinate,
};
