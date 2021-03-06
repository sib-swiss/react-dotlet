

/**
 * Get the slice of `seq` centered on `index` with `ws` elements on each side.
 * @param index: zero-based index of the center char in `seq`.
 */
function getSequenceAround(seq, index, ws) {
    return seq.slice(Math.max(index - ws, 0), index + ws + 1);
}

/**
 * Return the position `(x,y)` of the top left corner of a rectangle of
 * this `size`, so that it represents the current zooming view
 * while always remaining entirely inside the canvas.
 */
function viewRectangleCoordinates(i, j, L, canvasSize, windowSize, zoomLevel) {
    let size = canvasSize / zoomLevel;
    let hSize = size / 2;
    // Transform to pixel coordinates
    let scale = (index) => ((canvasSize / (L - windowSize + 1)) * index);
    let x = scale(i) - hSize;
    let y = scale(j) - hSize;
    // Top and left borders must not go beyond the canvas borders
    x = Math.max(x, 0);
    y = Math.max(y, 0);
    // Bottom and right borders must not go beyond the canvas borders
    x = ~~ Math.min(x, canvasSize - size);
    y = ~~ Math.min(y, canvasSize - size);
    return {
        x, y, size
    };
}

/**
 * Get the (x,y) pixel coordinates of a mouse event in the canvas, relative to the canvas.
 * @param event
 */
function getCanvasMouseCoordinates(event) {
    let canvas = event.target;
    let dims = canvas.getBoundingClientRect();
    let x = event.pageX - dims.left,
        y = event.pageY - dims.top;
    return {x, y};
}



export {
    getSequenceAround,
    viewRectangleCoordinates,
    getCanvasMouseCoordinates,
};
