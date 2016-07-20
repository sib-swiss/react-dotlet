import { expect } from 'chai';
import { formatSeq } from '../helpers';


describe('TwoSeqsPanel test suite', () => {
    let s1 = "AAAAAAATTTCCCCCCTTGC";
    let s2 = "AAAGAAATTTCCCCCCATGC";

    it ("formatSeq even size", () => {
        let size = 20;
        expect(formatSeq("", 0, size, '_').length).to.be.equal(size);
        //expect(formatSeq("|", 0, size, '_').length).to.be.equal(size);
    });
    it ("formatSeq odd size", () => {
        let size = 21;
        expect(formatSeq("", 0, size, '_').length).to.be.equal(size);
        //expect(formatSeq("|", 0, size, '_').length).to.be.equal(size);
    });



});
