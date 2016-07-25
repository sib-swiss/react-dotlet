
const MATCH = 'match';
const MISMATCH = 'mismatch';
const CANVAS_SIZE = 400;
const CANVAS_ID = "dotter-canvas";

const SCORING_MATRIX_NAMES = {
    IDENTITY: 'identity',
    BLOSUM45: 'blosum 45',
    BLOSUM62: 'blosum 62',
    BLOSUM80: 'blosum 80',
    PAM30: 'pam 30',
    PAM70: 'pam 70',
};

const DNA = 'is DNA string';
const PROTEIN = 'is protein string';

// Aminoacids, in the same order as in the scoring matrices.
const AA = ['A', 'R', 'N', 'D', 'C', 'Q', 'E', 'G', 'H', 'I', 'L', 'K', 'M',
            'F', 'P', 'S', 'T', 'W', 'Y', 'V', 'B', 'J', 'Z', 'X', '*'];

// Store them in a map {aminoacid -> matrix index};
let temp = {};
AA.forEach( (aa, i) => { temp[aa] = i; } );
const AA_MAP = temp;



export {
    MATCH,
    MISMATCH,
    CANVAS_SIZE,
    CANVAS_ID,
    SCORING_MATRIX_NAMES,
    AA,
    AA_MAP,
    DNA,
    PROTEIN,
};
