import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export default class MainQuestion extends Component {
  constructor() {
    super();
    this.state = {
      tags: [],
    };
  }

  componentWillMount() {
    this.props.fetchQuestionTags(this.props.id)
      .then((tags) => {
        this.setState({ tags: this.state.tags.concat(tags) });
      });
  }

  renderTags() {
    return this.state.tags.map(tag => <a key={ tag.id } className="question-tag">{ tag.tag }</a>);
  }

  render() {
    const { title, user_name, answers, views, votes, created_at } = this.props;
    const tags = this.renderTags();
    return (
      <div className="question-wrapper">
        <div className="count-wrapper">
          <div>votes: { votes }</div>
          <div>answers: { answers }</div>
          <div>views: { views }</div>
        </div>
        <div className="summary-wrapper">
          <Link className="title-link" to={'/question'}>{ title }</Link>
          <div className="tags-wrapper">
            { tags }
          </div>
          <h4 className="main-user-name">{ user_name }</h4>
          <h5 className="main-created-at">{ created_at }</h5>
        </div>
      </div>
    );
  }
}