
import geneticCode from '../constants/geneticCode';


/**
 * Translate an RNA sequence to protein.
 */
function translateProtein(seq, phase=0) {
    let L = seq.length;
    let protein = [];
    phase = phase % 3;
    if ((L-phase) % 3 !== 0) {
        console.warn("Cannot translate an RNA sequence whose length is not a multiple of 3.");
        return seq;
    }
    for (let i=phase; i<=L-3; i+=3) {
        let bases = seq.slice(i, i+3);
        if (! (bases in geneticCode)) {
            console.warn("Undefined aminoacid for codon '"+ bases +"'.");
            protein.push('X');
        } else {
            let aa = geneticCode[bases];
            protein.push(aa);
        }
    }
    return protein.join('');
}

/**
 * Return the reverse complement of this DNA string.
 */
function reverseComplementDNA(seq) {
    let revcomp = '';
    for (c of seq) {
        switch (c) {
            case 'A': revcomp += 'U'; break;
            case 'T': revcomp += 'A'; break;
            case 'C': revcomp += 'G'; break;
            case 'G': revcomp += 'C'; break;
            case 'U': revcomp += 'A'; break;
            default: revcomp += c;
        }
    }
    return revcomp;
}

/**
 * Return the protein obtained by phasing the corresponding DNA.
 * The result is shorter by 1 aminoacid because we don't know the last one.
 * @param phase: (int) [1 | 2].
 */
function phaseProtein(seq, phase) {
    return translateProtein(seq.slice(phase, seq.length-phase));
}


export {
    translateProtein,
    reverseComplementDNA,
    phaseProtein,
};

