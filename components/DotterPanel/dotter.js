
import {emptyArray} from './helpers';


function sumMatches(s1, s2) {
    let L = Math.min(s1.length, s2.length);
    let match = 0, mismatch = 0;

    for (let i=0; i<L; i++) {
         if (s1[i] == s2[i]) { match ++; }
         else { mismatch ++; }
    }

    return {
        'matches': match,
        'mismatches': mismatch,
    };
}

function scoreMatches(sums, scoreMatrix) {

}


export {
    sumMatches,
};
