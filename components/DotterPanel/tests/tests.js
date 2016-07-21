import { expect } from 'chai';


import { DnaScoreMatches, DnaSumMatches, getStep } from '../dotter';
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

    it('dotter.getStep integer', () => {
        expect(getStep(5, 5)).to.be.equal(1);
        expect(getStep(5, 10)).to.be.equal(2);
        expect(() => getStep(600, 10)).to.throw(RangeError);
    });
    it('dotter.getStep non-integer', () => {
        // 5 points for 6 chars: cannot put 1 per point, otherwise one is lost.
        expect(getStep(5, 6)).to.be.equal(2);
        expect(getStep(5, 11)).to.be.equal(3);
        // 12 points for 11 chars: put 1 per point, one remains empty.
        expect(getStep(12, 11)).to.be.equal(1);
        // Not well-defined: point size should increase instead.
        expect(() => getStep(600, 10)).to.throw(RangeError);
    })

    it('dotter.seqPosFromCoordinate', () => {
        // make sure it's ok when 5 points 6 chars and need to put 2 per point (empty clickable margin)
        //seqPosFromCoordinate(px, L, 600)
        //600px 270b -> 540, 2 per bin; 60 left empty --> round to 600
    });

});
