import React, { Component } from 'react';
import SimpleMDE from 'simplemde';
import Alert from 'react-s-alert';

import Button from '../Button';

export default class AnswerInput extends Component {
  constructor() {
    super();
    this.state = {
      answer: '',
    };
  }

  componentDidMount() {
    const simplemde = new SimpleMDE({
      element: document.getElementById('editor'),
      placeholder: 'Type answer here...',
    });
    simplemde.codemirror.on('change', () => {
      const answer = simplemde.value();
      this.setState({ answer });
    });
    simplemde.value(this.state.answer);
  }

  handleInput(e) {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  }

  inputChecker() {
    if (!this.state.answer) {
      Alert.error('Please enter a value into the answer text area');
    }
  }

  postAnswer(answer, name, picture) {
    const { question_id, refreshAnswers, toggleInput, addAnswer } = this.props;

    this.inputChecker();
    if (this.state.answer) {
      addAnswer(question_id, answer, name, picture)
        .then((response) => {
          toggleInput();
          refreshAnswers();
        });
    }
  }

  render() {
    const { question, answer, name } = this.state;
    const { user: { nickname, picture } } = this.props;

    return (
      <div className="supply-answer-wrapper">
        <h2 className="ask-question-header">Submit Answer</h2>
        <textarea id="editor" />
        <Button
          className="submit-answer--btn"
          btnName="Submit Answer"
          handleClick={ () => this.postAnswer(answer, nickname, picture) }
        />
      </div>
    );
  }
}
