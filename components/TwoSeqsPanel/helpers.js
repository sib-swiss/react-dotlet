
/*
 * Complement a sub-sequence `w` with fillers around it when it is smaller than `size`.
 * @param subseq: subsequence to decorate.
 * @param i: index of the subsequence center in the whole original sequence.
 *  This 'center' could very well not be in the middle, if the sub-sequence was
 *  extracted from a border of the original one.
 * @param size: the total number of chars.
 */
function formatSeq(subseq, i, size, fill='_') {
    let half = Math.floor(size/2);
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


export {
    formatSeq,
};
