

/**
 * Get the slice of `seq` centered on `index` with `ws` elements on each side.
 */
function getSequenceAround(seq, index, ws) {
    return seq.slice(Math.max(index - ws, 0), Math.min(index + ws + 1, seq.length));
}


export {
    getSequenceAround,
};
