import { CHANGE_SEQUENCE, CHANGE_WINDOW_SIZE, CHANGE_SCORING_MATRIX } from './actionTypes';


/*
 * Change one of the input sequences.
 * @param seqn: sequence nr, 1 or 2
 * @param sequence: sequence string
 */
function changeSequence(seqn, sequence) {
    return {
        type: CHANGE_SEQUENCE,
        seqn: seqn,
        sequence: sequence,
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


export {
    changeSequence,
    changeWindowSize,
    changeScoringMatrix,
};
