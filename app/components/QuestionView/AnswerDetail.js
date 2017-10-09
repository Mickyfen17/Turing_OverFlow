import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import Highlight from 'react-highlight';
import '../../../node_modules/highlight.js/styles/atom-one-light.css';

import UserVoteDetails from '../UserVoteDetails';

export default class AnswerDetail extends Component {
  constructor(props) {
    super();
    this.state = {
      votes: props.answer.votes,
    };
    this.handleAnswerVotes = this.handleAnswerVotes.bind(this);
  }

  handleAnswerVotes(e) {
    const { id } = this.props.answer;
    const { name } = e.target;
    this.props.updateAnswerCounters(id, name)
      .then((response) => {
        this.setState({ votes: response.votes });
      });
  }

  render() {
    const { answer: { user_name, user_img, handleAnswerVotes, created_at, answer }, auth } = this.props;
    const { votes } = this.state;
    return (
      <div className="answer-detail">
        <Highlight className='language-name-of-snippet'>
          <ReactMarkdown
            className="answer-desc-md"
            source ={ answer }
          />
        </Highlight>
        <UserVoteDetails
          user_name={ user_name }
          user_img={ user_img }
          votes={ votes }
          handleVotes={ this.handleAnswerVotes }
          created_at={ created_at }
          details={'answered'}
          auth={ auth }
        />
      </div>
    );
  }
}
