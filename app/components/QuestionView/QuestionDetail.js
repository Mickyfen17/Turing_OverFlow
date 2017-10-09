import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import Highlight from 'react-highlight';
import '../../../node_modules/highlight.js/styles/atom-one-light.css';

import Button from '../Button';
import UserVoteDetails from '../UserVoteDetails';
import TagLinkContainer from '../../containers/TagLinkContainer';
import AnswerInputContainer from '../../containers/AnswerInputContainer';
import AnswerListContainer from '../../containers/AnswerListContainer';

export default class QuestionDetail extends Component {
  constructor() {
    super();
    this.state = {
      answers: '',
      answersArray: [],
      created_at: '',
      id: '',
      question: '',
      title: '',
      updated_at: '',
      user_name: '',
      user_img: '',
      views: '',
      votes: '',
      tags: [],
    };
    this.handleVotes = this.handleVotes.bind(this);
  }

  componentWillMount() {
    const { questions, id } = this.props;
    const question = questions.find((question) => {
      return question.id * 1 === id * 1;
    });

    if (question) {
      this.fetchMatchedQuestion(question);
    } else {
      this.fetchNewQuestion(id);
    }
  }

  fetchNewQuestion(id) {
    this.props.fetchQuestion(id)
      .then(question => {
        this.fetchMatchedQuestion(question);
      });
  }

  fetchMatchedQuestion(question) {
    this.fetchTags(question.id);
    this.setState(question);
    this.updateQuestionViews(question.id);
  }

  fetchTags(id) {
    this.props.fetchQuestionTags(id)
      .then((tags) => {
        this.setState({ tags: this.state.tags.concat(tags) });
      });
  }

  updateQuestionViews(id) {
    this.props.updateQuestionCounters(id, 'up', 'views')
    .then((response) => {
      this.setState({ views: response.views });
    });
  }

  renderTags() {
    return this.state.tags.map(tag => <TagLinkContainer key={ tag.id } name={ tag.tag } />);
  }

  handleVotes(e) {
    const { id } = this.state;
    const { name } = e.target;

    this.props.updateQuestionCounters(id, name, 'votes')
      .then((response) => {
        this.setState({ votes: response.votes });
      });
  }

  render() {
    const { title, question, user_name, user_img, answers, views, votes, created_at } = this.state;
    const { auth } = this.props;
    const id = this.state.id || this.props.id;
    const tags = this.renderTags();

    return (
      <section>
        <div className="question-desc-wrapper">
          <h1 className="question-desc-title">{ title }</h1>
          <Highlight className='language-name-of-snippet'>
            <ReactMarkdown
              className="question-desc-md"
              source={ question }
            />
          </Highlight>
          <div className="tags-wrapper">
            { tags }
          </div>
          <UserVoteDetails
            user_name={ user_name }
            user_img={ user_img }
            votes={ votes }
            handleVotes={ this.handleVotes }
            created_at={ created_at }
            details={'asked'}
            auth={ auth }
          />
        </div>
        <AnswerListContainer question_id={ id } auth={ auth }/>
      </section>
    );
  }
}
