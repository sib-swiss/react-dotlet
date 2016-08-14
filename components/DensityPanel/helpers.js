
function toDensity(d) {
    let density = {};
    let sum = 0;
    for (let v of Object.values(d)) {
        sum += v;
    }
    for (let key of Object.keys(d)) {
        density[key] = d[key] / sum;
    }
    return density;
}

/*
 * Format an object {key: val} to what d3 likes: {'key': key, 'val': val} .
 */
function object2array(d) {
    var entries = [];
    for (var key of Object.keys(d)) {
        entries.push({x: parseInt(key), y: d[key]});
    }
    return entries;
}

export {
    toDensity,
    object2array,
};
