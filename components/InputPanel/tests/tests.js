import { expect } from 'chai';


import { DNA, PROTEIN } from '../../constants/constants';
import { guessSequenceType } from '../input';

describe('InputPanel test suite', () => {

    it('input.guessSequenceType pure DNA', () => {
        expect(guessSequenceType("AUATG")).to.be.equal(DNA);
    });
    it('input.guessSequenceType check only first N chars', () => {
        expect(guessSequenceType("AUATGKLLL", 4)).to.be.equal(DNA);
        expect(guessSequenceType("AUATGKLLL", 20)).to.be.equal(PROTEIN);
    });
    it('input.guessSequenceType very long sequence', () => {
        expect(guessSequenceType("A".repeat(50000))).to.be.equal(DNA);
    });

});
