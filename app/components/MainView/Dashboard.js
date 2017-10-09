import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PopularQuestions from './PopularQuestions';
import AuthButton from '../AuthButton';
import MainQuestionContainer from '../../containers/MainQuestionContainer';
import TagLinkContainer from '../../containers/TagLinkContainer';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.askQuestionRedirect = this.askQuestionRedirect.bind(this);
  }

  componentWillMount() {
    const { fetchAllQuestions, fetchPopularQuestions, fetchRecentTags } = this.props;
    fetchAllQuestions();
    fetchPopularQuestions();
    fetchRecentTags();
  }

  renderQuestions() {
    return this.props.questions.map((question) => {
      return (
        <MainQuestionContainer key={ question.id } { ...question } />
      );
    });
  }

  renderPopularQuestions() {
    return this.props.popularQuestions.map((question) => {
      const { id, title, views } = question;
      return (
        <PopularQuestions key={ id } title={ title } views={ views } id={ id } />
      );
    });
  }

  renderTags() {
    return this.props.recentTags.map(tag => <TagLinkContainer key={ tag.id } name={ tag.tag } />);
  }

  askQuestionRedirect() {
    this.props.storedHistory.push('/ask-question');
  }

  render() {
    const questions = this.renderQuestions();
    const popularQuestions = this.renderPopularQuestions();
    const recentTags = this.renderTags();
    return (
      <section className="dashboard">
        <div className="dashboard-questions-wrapper">
          <div className='dashboard-header-container'>
            <h2 className="dashboard-header">Dashboard</h2>
            <AuthButton
              className={'add-question-link'}
              name={'Ask Question'}
              btnName={'Ask Question'}
              auth={this.props.auth}
              handleClick={ this.askQuestionRedirect }
            />
          </div>
          { questions }
        </div>
        <div className="popular-data">
          <div className='dashboard-header-container'>
            <h2 className="dashboard-header">Most Viewed</h2>
          </div>
          <div className="popular-questions-wrapper">
            { popularQuestions }
          </div>
          <div className='dashboard-header-container'>
            <h2 className="dashboard-header">Recent Tags</h2>
          </div>
          <div className="popular-questions-wrapper">
            { recentTags }
          </div>
        </div>
      </section>
    );
  }
}
