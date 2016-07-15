import inputPanelActionTypes from './actionTypes';


/*
 * Change one of the input sequences.
 * @param seqn: sequence nr, 1 or 2
 * @param sequence: sequence string
 */
function changeSequence(seqn, sequence) {
    return {
        type: inputPanelActionTypes.CHANGE_SEQUENCE,
        seqn: seqn,
        sequence: sequence,
    }
}


export {
    changeSequence,
};
