
/*
 * Recursive function to initialize a n-dimensional array.
 * @param *dims:
 */

function emptyArray(dims) {
    var arr = new Array(dims || 0);
    var i = dims;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[dims-1 - i] = emptyArray.apply(this, args);
    }
    return arr;
}

export {
    emptyArray,
};
