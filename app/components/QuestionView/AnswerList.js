import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import AuthButton from '../AuthButton';
import AnswerDetail from './AnswerDetail';
import AnswerInputContainer from '../../containers/AnswerInputContainer';

export default class AnswerList extends Component {
  constructor() {
    super();
    this.state = {
      answersArray: [],
      toggleInput: false,
    };
    this.toggleInput = this.toggleInput.bind(this);
  }

  componentDidMount() {
    this.getAnswers('mount');
  }

  getAnswers(fired) {
    const { question_id } = this.props;

    if (question_id) {
      fetch(`/api/v1/answers/${question_id}`)
      .then(response => {
        response.json()
        .then((answersArray) => {
          fired !== 'mount' && this.props.updateQuestionCounters(question_id, 'up', 'answers');
          this.setState({ answersArray });
        });
      });
    }
  }

  toggleInput() {
    const toggleInput = !this.state.toggleInput;
    this.setState({ toggleInput });
  }

  render() {
    const { toggleInput, answersArray } = this.state;
    const { question_id, updateAnswerCounters, auth } = this.props;
    const answerValue = answersArray.length < 2 ? 'Answer' : 'Answers';

    const answersComponents = this.state.answersArray.map(answer => {
      return <AnswerDetail
        key={ answer.id }
        answer={ answer }
        updateAnswerCounters={ updateAnswerCounters }
        auth={ auth }
      />;
    });

    return (
      <div className="answer-list">
        { answersArray.length > 0 && <h2 className="answer-list-title">{answersArray.length} {answerValue}</h2> }
        <section className="answer-list-wrapper">
          { answersComponents }
        </section>
          <AuthButton
            className="show-answer--btn"
            btnName={'Add a new Answer'}
            auth={ auth }
            handleClick={() => this.toggleInput() }
          />
          {
            toggleInput &&
            <AnswerInputContainer
              refreshAnswers={ () => this.getAnswers() }
              toggleInput={ this.toggleInput }
              question_id={ question_id }
            />
          }
      </div>
    );
  }
}
