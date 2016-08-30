
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
    if (type === PROTEIN) {
        for (let char of s) {
            if (! AA_CHARS.has(char)) {
                valid = false;
                wrongChar = char;
            }
        }
    } else {
        for (let char of s) {
            if (! DNA_CHARS.has(char)) {
                valid = false;
                wrongChar = char;
            }
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
