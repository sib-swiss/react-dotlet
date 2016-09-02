
const MATCH = 'match';
const MISMATCH = 'mismatch';
const CANVAS_SIZE = 400;
const MINIMAP_SIZE = 150;

const CANVAS_ID = "dotter-canvas";
const CANVAS_ID_LINES = "dotter-canvas-topLayer";
const CANVAS_ID_MINIMAP_SQUARE = "dotter-canvas-minimap-square";
const CANVAS_ID_MINIMAP_LINES = "dotter-canvas-minimap-lines";
const CANVAS_ID_MINIMAP_TOP = "dotter-canvas-minimap-top";

const SCORING_MATRIX_NAMES = {
    IDENTITY: 'Identity',
    BLOSUM45: 'BLOSUM_45',
    BLOSUM62: 'BLOSUM_62',
    BLOSUM80: 'BLOSUM_80',
    PAM30: 'PAM_30',
    PAM70: 'PAM_70',
};

const DNA = 'DNA/RNA';
const PROTEIN = 'protein';

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
    MINIMAP_SIZE,
    CANVAS_ID,
    CANVAS_ID_LINES,
    CANVAS_ID_MINIMAP_SQUARE,
    CANVAS_ID_MINIMAP_LINES,
    CANVAS_ID_MINIMAP_TOP,
    SCORING_MATRIX_NAMES,
    DNA_CHARS,
    AA_CHARS,
    AA_MAP,
    DNA,
    PROTEIN,
};
