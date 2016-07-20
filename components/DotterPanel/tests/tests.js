import { expect } from 'chai';


import { DnaScoreMatches, DnaSumMatches } from '../dotter';
import * as C from '../../constants/constants';

describe('DotterPanel test suite', () => {
    let s1 = "AAAAAAATTTCCCCCCTTGC";
    let s2 = "AAAGAAATTTCCCCCCATGC";

    it('dotter.DnaSumMatches', () => {
        let sums = DnaSumMatches(s1,s2);
        expect(sums[C.MATCH]).to.be.equal(18);
        expect(sums[C.MISMATCH]).to.be.equal(2);
    });

    it('dotter.DnaScoreMatches', () => {
        let scoreMatrix = {[C.MATCH]: 2, [C.MISMATCH]: -1};
        let score = DnaScoreMatches(s1, s2, scoreMatrix);
        expect(score).to.be.equal(18*2 - 2);
    });

});
