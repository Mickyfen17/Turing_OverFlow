process.env.NODE_ENV = 'test';

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

const chai = require('chai');

const should = chai.should();
const { expect } = require('chai');

import AnswerInput from '../../app/components/QuestionView/AnswerInput.js';

describe('AnswerInput testing', () => {
  const defaultUser = { nickname: 'Mickyfen17', picture: 'user_URL_image' };

  it.skip('Fires off addAnswer function on submit click', () => {
    const spy = sinon.spy();
    const w = shallow(<AnswerInput
      addAnswer={spy}
      refreshAnswers={spy}
      toggleInput={spy}
      question_id={1}
      user={ defaultUser }
    />);

    w.find('#editor').simulate('change', { target: { value: 'TEST' } });

    expect(w.state().answer).to.eql('TEST');
    w.find('.submit-answer--btn').simulate('click');
    expect(spy.called).to.be.true;
  });

  it('Does not call addAnswer function on submit click if no text in input', () => {
    const spy = sinon.spy();
    const w = shallow(<AnswerInput
      addAnswer={spy}
      refreshAnswers={spy}
      toggleInput={spy}
      question_id={1}
      user={ defaultUser }
    />);

    w.find('.submit-answer--btn').simulate('click');

    expect(spy.called).to.be.false;
  });
});
