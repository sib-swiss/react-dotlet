import { expect } from 'chai';

import { DNA, PROTEIN } from '../../constants/constants';
import { isValidInputSequence, isValidWindowSize } from '../validators';
import { guessSequenceType, formatSeq,  } from '../input';


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

    it('formatSeq replaces newlines and spaces', () => {
        expect(formatSeq("AAA  AAA\n\n  AAA")).to.be.equal("AAAAAAAAA");
    });
    it('formatSeq replaces unknwon aminoacids', () => {
        expect(formatSeq("AXOU UOX")).to.be.equal("AXXXXXX");
    });
    it('formatSeq removes fasta headers', () => {
        expect(formatSeq(">seqname\nAAA\nAAA")).to.be.equal("AAAAAA");
        expect(formatSeq(";seqname\nAAA\nAAA")).to.be.equal("AAAAAA");  // older form
        expect(formatSeq(">seq1\nA\n>seq2\nB")).to.be.equal("A>SEQ2B"); // it does not work with headers inside (which makes sense)
    });

    it('isValidInputSequence complains if there are special chars', () => {
        expect(isValidInputSequence("AAA").valid).to.be.equal(true);
        expect(isValidInputSequence("AAA(").valid).to.be.equal(false);
    });
    it('isValidInputSequence accepts unknown AAs, spaces, and fasta header', () => {
        expect(isValidInputSequence("AA  A").valid).to.be.equal(true);
    });

    it('isValidWindowSize returns false when window size is bigger than the sequence', () => {
        expect(isValidWindowSize(32, 32, 32)).to.be.equal(true);
        expect(isValidWindowSize(32, 31, 33)).to.be.equal(false);
        expect(isValidWindowSize(32, 33, 31)).to.be.equal(false);
    });
});
