import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import List from './list';

function sampleAction() {
  console.log('sampleAction');
}

describe('button', function () {
  it('renders without problems', () => {
    const button = TestUtils.renderIntoDocument(<div><List/></div>);
    expect(button).to.not.be.null;
  });
});
