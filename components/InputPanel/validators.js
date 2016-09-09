

function isIntegerString(s) {
    return (/^(0|[1-9][0-9]*)$/).test(s);
}

function isValidInputSequence(s, type) {
    let regex = /[^A-Z* \n]/ ;
    let wrongChar = s.match(regex);
    let valid = wrongChar === null;
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
