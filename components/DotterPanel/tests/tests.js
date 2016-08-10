import { expect } from 'chai';


import { getStep, seqIndexFromCoordinate, coordinateFromSeqIndex,
         greyScale, getCanvasPtSize, getNpoints } from '../dotter';
import { sumMatches, calculateMatches, calculateScore } from '../../common/scoring';
import { SCORING_MATRIX_NAMES, MATCH, MISMATCH } from '../../constants/constants';
import { SCORING_MATRICES } from '../../constants/scoring_matrices/scoring_matrices';

import { mount, shallow } from 'enzyme';


describe('DotterPanel test suite', () => {
    let s1 = "AAAAAAATTTCCCCCCTTGC";
    let s2 = "AAAGAAATTTCCCCCCATGC";

    it('dotter.sumMatches', () => {
        let sums = sumMatches(s1,s2);
        expect(sums[MATCH]).to.be.equal(18);
        expect(sums[MISMATCH]).to.be.equal(2);
    });

    it('dotter.calculateMatches', () => {
        let scoreMatrix = {[MATCH]: 2, [MISMATCH]: -1};
        let score = calculateMatches(s1, s2, scoreMatrix);
        expect(score).to.be.equal(18*2 - 2);
    });

    it('dotter.calculateScore, sequence of 1 char', () => {
        let matrix = SCORING_MATRICES[SCORING_MATRIX_NAMES.PAM30];
        let s1 = "G", s2 = "V";
        let score = calculateScore(s1, s2, matrix);
        expect(score).to.be.equal(-5);
    });
    it('dotter.calculateScore, more', () => {
        let matrix = SCORING_MATRICES[SCORING_MATRIX_NAMES.BLOSUM45];
        let s1 = "ARN", s2 = "NRA";
        let score = calculateScore(s1, s2, matrix);
        expect(score).to.be.equal(-1 + 7 + -1);
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
    });

    it('dotter.seqIndexFromCoordinate', () => {
        // make sure it's ok when 5 points 6 chars and need to put 2 per point (empty clickable margin)
        expect(seqIndexFromCoordinate(300, 100, 600)).to.be.equal(50);
        expect(seqIndexFromCoordinate(150, 100, 600)).to.be.equal(25);
        expect(seqIndexFromCoordinate(100, 100, 600)).to.be.equal(16);
        expect(seqIndexFromCoordinate(60, 100, 600)).to.be.equal(10);
        expect(seqIndexFromCoordinate(13, 100, 600)).to.be.equal(2);
        expect(seqIndexFromCoordinate(300, 12000, 600)).to.be.equal(6000);
    });

    it('dotter.coordinateFromSeqIndex', () => {
        expect(coordinateFromSeqIndex(1, 5, 400)).to.be.equal(80);
        expect(coordinateFromSeqIndex(3, 5, 400)).to.be.equal(240);
    });


});
