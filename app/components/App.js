import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import NavBar from './NavBar'
import DashboardContainer from '../containers/DashboardContainer';
import AskQuestionContainer from '../containers/AskQuestionContainer';
import QuestionDetail from './QuestionView/QuestionDetail';

const App = ({ questions }) => {
  return (
    <div>
      <NavBar />
      <Route exact path='/' component={DashboardContainer} />
      <Route exact path='/question' component={QuestionDetail}/>
      <Route path="/question/:id" render={ ({ match }) =>  {
        const question = questions.find(q => q.id === parseInt(match.params.id))
        return <QuestionDetail {...question} />
      }} />
      <Route exact path='/ask-question' component={ AskQuestionContainer }/>
    </div>
  );
};

export default App;

