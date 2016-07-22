
/*
 * Guess if a sequence is a protein or DNA
 */
function guessSequenceType(seq) {
    let L = seq.length;
    // The longest known protein, Titin, has up to 33K aminoacids
    if (L > 50000) {
        return 'dna';
    }
    // Check the first N characters. If they are all ATGCU, conclude it is DNA.
    // Check up to the size of a long protein (~1000).
    // The original code went through the whole sequence and said it is DNA if more than 80% is ATGCU.
    let nucleotides = Set(['A','T','G','C','U']);
    let N = Math.min(1000, L);
    for (let i=0; i<N; i++) {
        if (! seq[i] in nucleotides) {
            return 'protein';
        }
    }
    return 'dna';
}
