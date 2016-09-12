import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import Dotter from '../../common/Dotter';
import { SCORING_MATRIX_NAMES, MATCH, MISMATCH } from '../../constants/constants';
import { SCORING_MATRICES } from '../../constants/scoring_matrices/scoring_matrices';



describe('DotterPanel test suite', () => {
    let s1 = "AAAAAAATTTCCCCCCTTGC";  // len 20
    let s2 = "AAAGAAATTTCCCCCCATGC";

    it('dotter.calculateMatches', () => {
        let d2 = new Dotter(600, 1, s1,s2, SCORING_MATRIX_NAMES.IDENTITY);
        let score = d2.calculateMatches(s1, s2);
        expect(score).to.be.equal(18);
    });

    it('dotter.calculateScore, sequence of 1 char', () => {
        let s1 = "G", s2 = "V";
        let d = new Dotter(600, 1, s1,s2, SCORING_MATRIX_NAMES.BLOSUM80);
        let score = d.calculateScore(s1, s2);
        expect(score).to.be.equal(-4);
    });
    it('dotter.calculateScore, more', () => {
        let s1 = "ARN", s2 = "NRA";
        let d = new Dotter(600, 1, s1,s2, SCORING_MATRIX_NAMES.BLOSUM80);
        let score = d.calculateScore(s1, s2);
        expect(score).to.be.equal(-2 + 6 + -2);
    });

    it('dotter.seqIndexFromCoordinate(px)', () => {
        let d = new Dotter(600, 1, s1,s2, SCORING_MATRIX_NAMES.BLOSUM80);
        expect(d.seqIndexFromCoordinate(300)).to.be.equal(10);
        expect(d.seqIndexFromCoordinate(150)).to.be.equal(5);
        expect(d.seqIndexFromCoordinate(100)).to.be.equal(3);
        expect(d.seqIndexFromCoordinate(60)).to.be.equal(2);
        expect(d.seqIndexFromCoordinate(13)).to.be.equal(0);

        expect(d.seqIndexFromCoordinate(0)).to.be.equal(0);
        expect(d.seqIndexFromCoordinate(1)).to.be.equal(0);
        expect(d.seqIndexFromCoordinate(2)).to.be.equal(0);
        expect(d.seqIndexFromCoordinate(598)).to.be.equal(19);
        expect(d.seqIndexFromCoordinate(599)).to.be.equal(19);
        //expect(d.seqIndexFromCoordinate(600, 300, 600)).to.be.equal(20); // but 600 is out of scale! 0-599
    });

    it('dotter.coordinateFromSeqIndex(index)', () => {
        let d = new Dotter(600, 1, s1,s2, SCORING_MATRIX_NAMES.BLOSUM80);
        expect(d.coordinateFromSeqIndex(1)).to.be.equal(30);
        expect(d.coordinateFromSeqIndex(3)).to.be.equal(90);
        expect(d.coordinateFromSeqIndex(4)).to.be.equal(120);
        expect(d.coordinateFromSeqIndex(10)).to.be.equal(300);
    });

});
