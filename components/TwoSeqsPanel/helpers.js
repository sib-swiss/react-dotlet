
/*
 * Complement a sequence `w` with fillers around it when it is smaller than `size`.
 * @param w: subsequence to decorate
 * @param i: index of the subsequence center
 * @param size: the total number of chars
 */
function formatSeq(w, i, size, fill='_') {
    // Mark start of the sequence
    if (i < size/2) {
        w = fill.repeat(size/2-i) + w;
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
