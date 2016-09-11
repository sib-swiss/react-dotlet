

function isIntegerString(s) {
    return (/^(0|[1-9][0-9]*)$/).test(s);
}

function isValidInputSequence(s, type) {
    let regex = /[^A-Z* \n]/ ;
    let wrongChar = s.match(regex);
    let valid = wrongChar === null;
    return {valid, wrongChar};
}

/**
 * The window size input can only be an empty string
 * or a string representing a positive integer.
 */
function validateWindowSize(s) {
    if (s === '') {
        return true;
    } else if (! isIntegerString(s)) {
        return false;
    }
    let val = parseInt(s);
    return val > 0;
}


export {
    isIntegerString,
    isValidInputSequence,
    validateWindowSize,
};
