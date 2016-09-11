import { DNA, PROTEIN } from '../constants/constants';
import geneticCode from '../constants/geneticCode';


/**
 * Format an input sequence to be ready for computation internally (in the store).
 * Remove spaces and newlines, replace unknown AAs by "X"
 */
function formatSeq(s) {
    s = s.toUpperCase();
    s = s.replace(/^[>;].*\s/g, '');  // fasta header
    s = s.replace(/\s/g, '');      // spaces and newlines
    s = s.replace(/[OU]/g, 'X');   // unknown aminoacids
    return s;
}

/**
 * Internally, window size is a stricly positive int.
 */
function formatWindowSize(s) {
    if (s === '') {
        return 1;
    } else {
        return parseInt(s) || 1;
    }
}


/**
 * Guess if a sequence is a protein or DNA.
 * @param nchars: number of chars to test before concluding.
 */
function guessSequenceType(seq, nchars=200) {
    let L = seq.length;
    // The longest known protein, Titin, has up to 33K aminoacids.
    if (L === 0 || L > 40000) {
        return DNA;
    }
    // Check the first N characters. If they are all ATGCU, conclude it is DNA.
    // Check up to the size of a long protein (~1000).
    // The original code went through the whole sequence and said it is DNA if more than 80% is ATGCU.
    let nucleotides = new Set(['A','T','G','C','U']);
    let N = Math.min(nchars, L);
    for (let i=0; i<N; i++) {
        if (! (nucleotides.has(seq[i]))) {
            return PROTEIN;
        }
    }
    return DNA;
}


/**
 * Return `DNA` if both sequences are DNA, and `PROTEIN` otherwise.
 */
function commonSeqType(s1Type, s2Type) {
    if (!s1Type || !s2Type) {
        return undefined;
    }
    return (s1Type === DNA && s2Type === DNA) ? DNA : PROTEIN;
}


export {
    guessSequenceType,
    commonSeqType,
    formatSeq,
    formatWindowSize,
};
