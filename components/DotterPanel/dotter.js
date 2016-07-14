
import { MATCH, MISMATCH } from './constants/constants';


function DnaSumMatches(s1, s2) {
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

function DnaScoreMatches(s1, s2, scoreMatrix) {
    let sums = DnaSumMatches(s1, s2);
    let score = scoreMatrix[MATCH] * sums[MATCH]
              + scoreMatrix[MISMATCH] * sums[MISMATCH];
    return score;
}


export {
    DnaSumMatches,
    DnaScoreMatches,
};
