import { expect } from 'chai';


import { seqIndexFromCoordinate, coordinateFromSeqIndex, greyScale } from '../dotter';
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

    it('dotter.seqIndexFromCoordinate(px, L, canvasSize)', () => {
        expect(seqIndexFromCoordinate(300, 100, 600)).to.be.equal(50);
        expect(seqIndexFromCoordinate(150, 100, 600)).to.be.equal(25);
        expect(seqIndexFromCoordinate(100, 100, 600)).to.be.equal(16);
        expect(seqIndexFromCoordinate(60, 100, 600)).to.be.equal(10);
        expect(seqIndexFromCoordinate(13, 100, 600)).to.be.equal(2);
        expect(seqIndexFromCoordinate(300, 12000, 600)).to.be.equal(6000);

        expect(seqIndexFromCoordinate(599, 300, 600)).to.be.equal(299);
        //expect(seqIndexFromCoordinate(600, 300, 600)).to.be.equal(300); // but 600 is out of scale! 0-599

        expect(seqIndexFromCoordinate(0, 3000, 600)).to.be.equal(0);
        expect(seqIndexFromCoordinate(1, 3000, 600)).to.be.equal(5);
        expect(seqIndexFromCoordinate(2, 3000, 600)).to.be.equal(10);
        expect(seqIndexFromCoordinate(598, 3000, 600)).to.be.equal(2990);
        expect(seqIndexFromCoordinate(599, 3000, 600)).to.be.equal(2995);
        //expect(seqIndexFromCoordinate(600, 3000, 600)).to.be.equal(3000); // but 600 is out of scale! 0-599

        expect(seqIndexFromCoordinate(599, 3000, 700)).to.be.equal(~~(599*(3000/700)));
        expect(seqIndexFromCoordinate(600, 3000, 700)).to.be.equal(~~(600*(3000/700)));

        expect(seqIndexFromCoordinate(0, 245, 400)).to.be.equal(0);
        expect(seqIndexFromCoordinate(1, 245, 400)).to.be.equal(0);
        expect(seqIndexFromCoordinate(2, 245, 400)).to.be.equal(1);
    });

    it('dotter.coordinateFromSeqIndex(index, L, canvasSize)', () => {
        expect(coordinateFromSeqIndex(1, 5, 400)).to.be.equal(80);
        expect(coordinateFromSeqIndex(3, 5, 400)).to.be.equal(240);
        expect(coordinateFromSeqIndex(12, 700, 400)).to.be.equal(6);
        expect(coordinateFromSeqIndex(12, 800, 400)).to.be.equal(6);
        expect(coordinateFromSeqIndex(12, 801, 400)).to.be.equal(5);
    });


});
