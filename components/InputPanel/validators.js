
import { AA_CHARS, DNA_CHARS } from '../constants/constants'
import { DNA, PROTEIN } from '../constants/constants';


function isIntegerString(s) {
    return (/^(0|[1-9][0-9]*)$/).test(s);
}

/**
 * Input sequences only accept characters representing DNA, RNA or aminoacids.
 */
function isValidInputSequence(s, type) {
    let valid = true;
    let wrongChar = null;
    let charset = (type === PROTEIN) ? AA_CHARS : DNA_CHARS;
    for (let char of s) {
        if (! charset.has(char)) {
            valid = false;
            wrongChar = char;
            break;
        }
    }
    return {valid, wrongChar};
}

function validateWindowSize(s) {
    if (! isIntegerString(s)) {
        return false;
    }
    let val = parseInt(s);
    if (val <= 0) {
        return false;
    }
    return true;
}


export {
    isIntegerString,
    isValidInputSequence,
    validateWindowSize,
};
