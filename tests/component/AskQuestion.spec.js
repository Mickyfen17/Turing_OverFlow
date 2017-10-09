process.env.NODE_ENV = 'test';

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

const chai = require('chai');

const should = chai.should();
const { expect } = require('chai');

import AskQuestion from '../../app/components/MainView/AskQuestion.js';

describe('AskQuestion testing', () => {
  const defaultUser = { nickname: 'Mickyfen17', picture: 'user_URL_image' };

  it('Fires off addAnswer function on submit click', () => {
    const spy = sinon.spy();
    const w = shallow(<AskQuestion addAnswer={spy} user={ defaultUser } />);

    w.find('#editor').simulate('change', { target: { value: 'TEST' } });
    w.find('.submit-question--btn').simulate('click');
  });

  it('Does not call addAnswer function on submit click if no text in input', () => {
    const spy = sinon.spy();
    const w = shallow(<AskQuestion addAnswer={spy} user={ defaultUser } />);

    w.find('.submit-question--btn').simulate('click');

    expect(spy.called).to.be.false;
  });
});
