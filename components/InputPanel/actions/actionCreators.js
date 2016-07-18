import { CHANGE_SEQUENCE, CHANGE_WINDOW_SIZE } from './actionTypes';


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
    }
}

function changeWindowSize(window_size) {
    return {
        type: CHANGE_WINDOW_SIZE,
        window_size: window_size,
    }
}


export {
    changeSequence,
    changeWindowSize,
};
