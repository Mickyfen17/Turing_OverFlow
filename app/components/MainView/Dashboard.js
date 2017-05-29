import React, { Component } from 'react';
// import moment from 'moment';

import MainQuestionContainer from '../../containers/MainQuestionContainer';

export default class Dashboard extends Component {

  componentWillMount() {
    this.props.fetchAllQuestions();
  }

  renderQuestions() {
    return this.props.questions.map((question) => {
      return (
        <MainQuestionContainer key={ question.id } { ...question } />
      );
    });
  }

  render() {
    return (
      <section className="dashboard">
        <h2 className="dashboard-header">Dashboard</h2>
        { this.renderQuestions() }
      </section>
    );
  }
}
