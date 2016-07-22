import { expect } from 'chai';


import { DNA, PROTEIN } from '../../constants/constants';
import { guessSequenceType, translate } from '../input';

describe('InputPanel test suite', () => {

    it('input.guessSequenceType', () => {
        expect(guessSequenceType("AUATG")).to.be.equal(DNA);
        expect(guessSequenceType("AUAKG")).to.be.equal(PROTEIN);
        expect(guessSequenceType("AUATGKL", 4)).to.be.equal(DNA);
        expect(guessSequenceType("AUATGKL", 20)).to.be.equal(PROTEIN);
        expect(guessSequenceType("A".repeat(50000))).to.be.equal(DNA);
    });

    it('input.translate', () => {
        expect(translate("TTT")).to.have.members(['F']);
        expect(translate("UUU")).to.have.members(['F']);
        expect(translate("ATTT", 1)).to.have.members(['F']);
        expect(translate("AGTTT", 2)).to.have.members(['F']);
        expect(translate("AGCTTT", 0)).to.have.members(['S','F']);

        expect((_) => translate("TUU")).to.throw(Error);
        expect((_) => translate("TUU", 1)).to.throw(Error);
        expect((_) => translate("TTTT")).to.throw(Error);
    });


});
