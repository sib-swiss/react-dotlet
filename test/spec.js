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

import { getSequenceAround, viewRectangleCoordinates } from '../components/common/helpers';
import { translateProtein } from '../components/common/genetics';
import Dotter from '../components/common/dotter';


describe('Global component helpers:', () => {

    it('getSequenceAround', () => {
        expect(getSequenceAround("ATGC", 0, 0,0)).to.be.equal("A");
        expect(getSequenceAround("ATGC", 2, 0,0)).to.be.equal("G");
        expect(getSequenceAround("AATTCCGGCCTT", 5, 3,3)).to.be.equal("TTCCGGC");
        expect(getSequenceAround("AATTCCGGCCTT", 3, 2,2)).to.be.equal("ATTCC");
        expect(getSequenceAround("A".repeat(100), 50, 8,8).length).to.be.equal(2*8+1);
        expect(getSequenceAround("A".repeat(100), 50, 7,7).length).to.be.equal(2*7+1);
    });
    it('getSequenceAround close from the start of the sequence', () => {
        let ws = 10;
        expect(getSequenceAround("A".repeat(100), 5, ws,ws).length).to.be.equal((5+1)+ws);
        expect(getSequenceAround("A".repeat(100), 1, ws,ws).length).to.be.equal((1+1)+ws);
        expect(getSequenceAround("A".repeat(100), 0, ws,ws).length).to.be.equal((0+1)+ws);
    });
    it('getSequenceAround close from the end of the sequence', () => {
        let ws = 10;
        expect(getSequenceAround("A".repeat(100), 95, ws,ws).length).to.be.equal(5+ws);
        expect(getSequenceAround("A".repeat(100), 99, ws,ws).length).to.be.equal(1+ws);
        expect(getSequenceAround("A".repeat(100), 100, ws,ws).length).to.be.equal(0+ws);
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

    it('dotter.viewRectangleCoordinates with no zoom', () => {
        let rect = viewRectangleCoordinates(10, 10, 20, 100, 1, 1);
        expect(rect.x).to.be.equal(0);
        expect(rect.y).to.be.equal(0);
        expect(rect.size).to.be.equal(100);
    });

    it('dotter.viewRectangleCoordinates with zoom=2', () => {
        let rect = viewRectangleCoordinates(10, 10, 20, 100, 1, 2);
        expect(rect.x).to.be.equal(25);
        expect(rect.y).to.be.equal(25);
        expect(rect.size).to.be.equal(50);
    });

});


describe('Global component helpers:', () => {

    it ("zoom", () => {
        let canvasSize = 400;
        let windowSize = 10;
        let zoomLevel = 4;
        let L = 200;
        let s1 = "A".repeat(99) + "B" + "A".repeat(100);
        let s2 = "A".repeat(99) + "B" + "A".repeat(100);
        let rect = viewRectangleCoordinates(100, 100, L, canvasSize, windowSize, zoomLevel);
        //expect(rect.x).to.be.equal(150);
        //expect(rect.y).to.be.equal(150);
        expect(rect.size).to.be.equal(100);
        let d = new Dotter(canvasSize, windowSize, s1, s2, "Whatever")
        let xx = d.seqIndexFromCoordinate(rect.x);
        let yy = d.seqIndexFromCoordinate(rect.y);
        s1 = s1.slice(xx, Math.round(xx + L/zoomLevel) + 1);
        s2 = s2.slice(yy, Math.round(yy + L/zoomLevel) + 1);
        expect(s1).to.be.equal("A".repeat(24) + "B" + "A".repeat(26))
    })

});
