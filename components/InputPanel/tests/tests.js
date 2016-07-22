import { expect } from 'chai';


import { DNA, PROTEIN } from '../../constants/constants';
import { guessSequenceType } from '../input';

describe('InputPanel test suite', () => {

    it('input.guessSequenceType', () => {
        expect(guessSequenceType("AUATG")).to.be.equal(DNA);
        expect(guessSequenceType("AUAKG")).to.be.equal(PROTEIN);
        expect(guessSequenceType("AUATGKL", 4)).to.be.equal(DNA);
        expect(guessSequenceType("AUATGKL", 20)).to.be.equal(PROTEIN);
        expect(guessSequenceType("A".repeat(50000))).to.be.equal(DNA);
    });


});
