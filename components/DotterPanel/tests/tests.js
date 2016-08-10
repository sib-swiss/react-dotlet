import { expect } from 'chai';


import { getStep, seqIndexFromCoordinate, greyScale, getCanvasPtSize, getNpoints } from '../dotter';
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
        expect(seqIndexFromCoordinate(300, 100, 600)).to.be.equal(50-1);
        expect(seqIndexFromCoordinate(150, 100, 600)).to.be.equal(25-1);
        expect(seqIndexFromCoordinate(100, 100, 600)).to.be.equal(16);
        expect(seqIndexFromCoordinate(60, 100, 600)).to.be.equal(10-1);
        expect(seqIndexFromCoordinate(13, 100, 600)).to.be.equal(2);
        expect(seqIndexFromCoordinate(300, 12000, 600)).to.be.equal(6000-1);
    });

    it('dotter.seqToPixelScale', () => {
        var scale = seqIndexToPixelScale(20, 400, 400);
        expect(scale(400)).to.be.equal(400);
        expect(scale(20)).to.be.equal(20);
        var scale = seqIndexToPixelScale(20, 800, 400);
        expect(scale(400)).to.be.equal(200);
        expect(scale(20)).to.be.equal(10);
        var scale = seqIndexToPixelScale(20, 700, 400);
        expect(scale(700)).to.be.equal(400);
    });

    it('dotter.pixelToSeqIndexScale', () => {
        var scale = pixelToSeqIndexScale(4, 4, 400);
        console.log(0, scale(0))
        console.log(50, scale(50))
        console.log(66, scale(66))
        console.log(67, scale(67))
        console.log(99, scale(99))
        console.log(100, scale(100))
        console.log(120, scale(120))
        console.log(140, scale(140))
        console.log(199, scale(199))
        console.log(200, scale(200))
        console.log(201, scale(201))
        console.log(249, scale(249))
        console.log(250, scale(250))
        console.log(299, scale(299))
        console.log(300, scale(300))
        console.log(332, scale(332))
        console.log(333, scale(333))
        console.log(350, scale(350))
        console.log(400, scale(400))
        expect(scale(0)).to.be.equal(0);
        expect(scale(50)).to.be.equal(0);
        expect(scale(51)).to.be.equal(0);
        expect(scale(66)).to.be.equal(0);
        expect(scale(67)).to.be.equal(0);
        //expect(scale(99)).to.be.equal(0);
        //expect(scale(100)).to.be.equal(1);
        //expect(scale(101)).to.be.equal(1);
    });

    it('dotter.getCanvasPtSize', () => {
        let canvasSize = 400;
        let canvasPt = getCanvasPtSize(canvasSize, 11);
        expect(canvasPt).to.be.equal(canvasSize / 11);
        let npoints = getNpoints(canvasSize, canvasPt);
        expect(Math.ceil(npoints * canvasPt)).to.be.equal(canvasSize);
    });

    it ('scale', () => {
        var L = 5, CS = 400;
        var scale;
        if (L <= CS) {
            scale = function(px) {
                return Math.floor(CS/L) * px;
            }
        }
        else {
            scale = function(idx) {
                return Math.floor((CS/L) * idx);
            }
        }
    });


});
