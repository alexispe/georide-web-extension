import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import Loader from './loader';

describe('button', function () {
  it('renders without problems', () => {
    const button = TestUtils.renderIntoDocument(<div><Loader/></div>);
    expect(button).to.not.be.null;
  });
});
