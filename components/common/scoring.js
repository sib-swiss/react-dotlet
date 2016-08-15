import { MATCH, MISMATCH, AA_MAP } from '../constants/constants';


/**
 * In DNA-DNA comparison, sum the number of matches/mismatches.
 */
function sumMatches(s1, s2) {
    let L = Math.min(s1.length, s2.length);
    let match = 0, mismatch = 0;
    for (let i=0; i<L; i++) {
        if (s1[i] === s2[i]) { match ++; }
        else { mismatch ++; }
    }
    return {
        [MATCH]: match,
        [MISMATCH]: mismatch,
    };
}

/**
 * In DNA-DNA comparison, return the similarity score.
 * @param s1: first sub-sequence.
 * @param s2: second sub-sequence.
 */
function calculateMatches(s1, s2, scoringMatrix) {
    let sums = sumMatches(s1, s2);
    return scoringMatrix[MATCH] * sums[MATCH]
         + scoringMatrix[MISMATCH] * sums[MISMATCH];
}

/**
 * In proteins comparison, return the similarity score.
 * @param s1: first sub-sequence.
 * @param s2: second sub-sequence.
 */
function calculateScore(s1, s2, scoringMatrix) {
    let score = 0;
    let L = Math.min(s1.length, s2.length);
    for (let k=0; k<L; k++) {
        let c1 = s1[k];
        let c2 = s2[k];
        let i = AA_MAP[c1];
        let j = AA_MAP[c2];
        score += scoringMatrix[i][j];
        if (isNaN(score)) {
            console.debug("NaN score: [c1,c2,i,j,[i,:]]", c1, c2, i, j, scoringMatrix[i])
        }
    }
    return score;
}


export {
    calculateMatches,
    calculateScore,
    sumMatches,
}
