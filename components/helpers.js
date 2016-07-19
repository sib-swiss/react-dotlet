
/*
 * Get the slice of `seq` centered on `index` with `ws` elements on each side.
 */
function getSequenceAround(seq, index, ws) {
    return seq.slice(Math.max(index - ws, 0), index + ws + 1);
}


export {
    getSequenceAround,
}
