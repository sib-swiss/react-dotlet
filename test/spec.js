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

import { getSequenceAround } from '../components/helpers';

describe('Test mocha works', () => {
  it('test', () => {
    expect(true).to.be.equal.true;
  });
});


describe('Global component helpers', () => {

    it('getSequenceAround in the middle of a big sequence', () => {
        expect(getSequenceAround("A".repeat(100), 50, 8).length).to.be.equal(17);
    });

});
