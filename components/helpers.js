
/*
 * Get the slice of `seq` centered on `index` with `ws` elements on each side.
 */
function getSequenceAround(seq, index, ws) {
    return seq.slice(Math.max(index - ws, 0), Math.min(index + ws + 1, seq.length));
}

/*
 * Translate an RNA sequence to protein.
 */
function translateProtein(seq, phase=0) {
    let L = seq.length;
    let protein = [];
    phase = phase % 3;
    if ((L-phase) % 3 !== 0) {
        throw new Error("Cannot translate an RNA sequence whose length is not a multiple of 3.");
    }
    for (let i=phase; i<=L-3; i+=3) {
        let aa = geneticCode[seq.slice(i, i+3)];
        if (aa === undefined) {
            throw new Error("Undefined aminoacid for codon '"+seq.slice(i, i+3)+"'.");
        }
        protein.push(aa);
    }
    return protein;
}




export {
    getSequenceAround,
    translateProtein,
};
