
function toDensity(d) {
    let sum = 0;
    for (let v of Object.values(d)) {
        sum += v;
    }
    for (let key of Object.keys(d)) {
        d[key] = d[key] / sum;
    }
    return d;
}

function minMaxObject(d) {
    if (d.length === 0) {
        return { maxX: 1, minX: 0, maxY: 1, minY: 0 };
    }
    let maxX = 0,
        minX = Number.MAX_SAFE_INTEGER,
        maxY = 0,
        minY = Number.MAX_SAFE_INTEGER;
    for (let key of Object.keys(d)) {
        let val = d[key];
        maxX = Math.max(key, maxX);
        minX = Math.min(key, minX);
        maxY = Math.max(val, maxY);
        minY = Math.min(val, minY);
    }
    return { maxX, minX, maxY, minY };
}

/*
 * Format an object {key: val} to what d3 likes: {'key': key, 'val': val} .
 */
function object2array(d) {
    var entries = [];
    for (var key of Object.keys(d)) {
        entries.push({x: key, y: d[key]});
    }
    return entries;
}

export {
    toDensity,
    minMaxObject,
    object2array,
};
