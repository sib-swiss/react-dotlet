/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';

import { getSequenceAround, translateProtein } from '../components/helpers';


describe('Global component helpers', () => {

    it('getSequenceAround', () => {
        expect(getSequenceAround("ATGC", 0, 0)).to.be.equal("A");
        expect(getSequenceAround("ATGC", 2, 0)).to.be.equal("G");
        expect(getSequenceAround("AATTCCGGCCTT", 5, 3)).to.be.equal("TTCCGGC");
        expect(getSequenceAround("AATTCCGGCCTT", 3, 2)).to.be.equal("ATTCC");
        expect(getSequenceAround("A".repeat(100), 50, 8).length).to.be.equal(2*8+1);
        expect(getSequenceAround("A".repeat(100), 50, 7).length).to.be.equal(2*7+1);
    });
    it('getSequenceAround close from the start of the sequence', () => {
        let ws = 10;
        expect(getSequenceAround("A".repeat(100), 5, ws).length).to.be.equal((5+1)+ws);
        expect(getSequenceAround("A".repeat(100), 1, ws).length).to.be.equal((1+1)+ws);
        expect(getSequenceAround("A".repeat(100), 0, ws).length).to.be.equal((0+1)+ws);
    });
    it('getSequenceAround close from the end of the sequence', () => {
        let ws = 10;
        expect(getSequenceAround("A".repeat(100), 95, ws).length).to.be.equal(5+ws);
        expect(getSequenceAround("A".repeat(100), 99, ws).length).to.be.equal(1+ws);
        expect(getSequenceAround("A".repeat(100), 100, ws).length).to.be.equal(0+ws);
    });
    it('getSequenceAround with index bigger than sequence length', () => {
        expect(getSequenceAround("ATGC", 100, 10)).to.be.equal("");
    });

    it('input.translateProtein', () => {
        expect(translateProtein("TTT")).to.be.equal('F');
        expect(translateProtein("UUU")).to.be.equal('F');
        expect(translateProtein("ATTT", 1)).to.be.equal('F');
        expect(translateProtein("AGTTT", 2)).to.be.equal('F');
        expect(translateProtein("AGCTTT", 0)).to.be.equal('SF');

        //expect((_) => translateprotein("tuu")).to.throw(error);
        //expect((_) => translateprotein("tuu", 1)).to.throw(error);
        //expect((_) => translateprotein("tttt")).to.throw(error);
        expect(translateProtein("TUU")).to.be.equal('X');
        expect(translateProtein("TUU", 1)).to.be.equal('TUU');
        expect(translateProtein("TTTT")).to.be.equal('TTTT');
    });



});
