import { translateProtein } from '../helpers';

/*
 * Complement a sub-sequence `subseq` with fillers around it when it is smaller than `size`.
 * `subseq` was extracted from a bigger original sequence, and is of length `size`
 * unless it was taken from a border, in which case it is shorter.
 *
 * @param subseq: subsequence to decorate.
 * @param i: index of the subsequence center in the whole original sequence.
 *  This 'center' could very well not be in the middle, if the sub-sequence was
 *  extracted from a border of the original one.
 * @param size: the total number of chars.
 */
function formatSeq(subseq, i, size, fill='_') {
    let half = Math.floor(size/2);
    if (subseq.length > size) {
        throw new RangeError("Cannot format a sequence bigger than its expected size");
    }
    let w = subseq;
    // Mark start of the sequence
    if (i < half) {
        w = fill.repeat(half-i) + w;
    }
    // Mark end of the sequence
    if (w.length < size) {
        w += fill.repeat(size - w.length)
    }
    return w;
}

/**
 * Return the reverse complement of this DNA string.
 */
function reverseComplementDNA(seq) {
    let revcomp = '';
    for (c of seq) {
        switch (c) {
            case 'A': revcomp += 'U'; break;
            case 'T': revcomp += 'A'; break;
            case 'C': revcomp += 'G'; break;
            case 'G': revcomp += 'C'; break;
            case 'U': revcomp += 'A'; break;
            default: revcomp += c;
        }
    }
    return revcomp;
}

/**
 * Return the protein obtained by phasing the corresponding DNA.
 * The result is shorter by 1 aminoacid because we don't know the last one.
 * @param phase: (int) [1 | 2].
 */
function phaseProtein(seq, phase) {
    return translateProtein(seq.slice(phase, seq.length-phase));
}


export {
    formatSeq,
};
