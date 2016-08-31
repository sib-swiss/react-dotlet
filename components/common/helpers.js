

/**
 * Get the slice of `seq` centered on `index` with `ws` elements on each side.
 * @param index: zero-based index of the center char in `seq`.
 */
function getSequenceAround(seq, index, ws) {
    return seq.slice(Math.max(index - ws, 0), index + ws + 1);
}

function zoomInSequence(seq, index, zoomLevel) {
    let ws = ~~ (seq.length / zoomLevel / 2);
    index = Math.max(index, ws);
    return getSequenceAround(seq, index, ws);
}

function zoomOutSequence(seq, index, zoomLevel) {
    let ws = ~~ (seq.length * zoomLevel / 2);
    index = Math.max(index, ws);
    return getSequenceAround(seq, index, ws);
}


export {
    getSequenceAround,
    zoomInSequence,
    zoomOutSequence,
};
