
import { AA_CHARS, DNA_CHARS } from '../constants/constants'
import { DNA, PROTEIN } from '../constants/constants';


function isNumeric(s) {
    return (/^(0|[1-9][0-9]*)$/).test(s);
}

/**
 * Input sequences only accept characters representing DNA, RNA or aminoacids.
 */
function isValidInputSequence(s, type) {
    var valid = true;
    var wrongChar = null;
    let charset = (type === PROTEIN) ? AA_CHARS : DNA_CHARS;
    console.debug(type, charset)
    for (let char of s) {
        if (! charset.has(char)) {
            console.debug(char)
            valid = false;
            wrongChar = char;
            break;
        }
    }
    return {valid, wrongChar};
}

function validateWindowSize(s) {

}


export {
    isNumeric,
    isValidInputSequence,
    validateWindowSize,
};
