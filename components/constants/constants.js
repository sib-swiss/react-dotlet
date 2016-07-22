
const MATCH = 'match';
const MISMATCH = 'mismatch';
const CANVAS_SIZE = 400;

const SCORING_MATRICES = {
    IDENTITY: 'identity',
    BLOSUM45: 'blosum 45',
    BLOSUM62: 'blosum 62',
    BLOSUM80: 'blosum 80',
    PAM30: 'pam 30',
    PAM70: 'pam 70',
};

const AA = ['A', 'R', 'N', 'D', 'C', 'Q', 'E', 'G', 'H', 'I', 'L', 'K', 'M',
            'F', 'P', 'S', 'T', 'W', 'Y', 'V', 'B', 'J', 'Z', 'X', '*'];

export {
    MATCH,
    MISMATCH,
    CANVAS_SIZE,
    SCORING_MATRICES,
    AA,
};
