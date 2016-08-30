
const MATCH = 'match';
const MISMATCH = 'mismatch';
const CANVAS_SIZE = 400;
const CANVAS_ID = "dotter-canvas";

const SCORING_MATRIX_NAMES = {
    IDENTITY: 'Identity',
    BLOSUM45: 'BLOSUM_45',
    BLOSUM62: 'BLOSUM_62',
    BLOSUM80: 'BLOSUM_80',
    PAM30: 'PAM_30',
    PAM70: 'PAM_70',
};

const DNA = 'Type_DNA_string';
const PROTEIN = 'Type_protein_string';

// Aminoacids, in the same order as in the scoring matrices. Missing 'O', 'U' from full alphabet.
const AA = ['A', 'R', 'N', 'D', 'C', 'Q', 'E', 'G', 'H', 'I', 'L', 'K', 'M',
            'F', 'P', 'S', 'T', 'W', 'Y', 'V', 'B', 'J', 'Z', 'X', '*'];

// Store them in a map {aminoacid -> matrix index};
let temp = {};
AA.forEach( (aa, i) => { temp[aa] = i; } );
const AA_MAP = temp;

const DNA_CHARS = new Set(['A','T','G','C','U']);
const AA_CHARS = new Set(AA);


export {
    MATCH,
    MISMATCH,
    CANVAS_SIZE,
    CANVAS_ID,
    SCORING_MATRIX_NAMES,
    DNA_CHARS,
    AA_CHARS,
    AA_MAP,
    DNA,
    PROTEIN,
};
