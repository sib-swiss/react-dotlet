import inputPanelActionTypes from './actionTypes';

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
