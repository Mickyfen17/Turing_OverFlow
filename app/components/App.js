import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';

import NavBar from './NavBar';
import LogoutModal from './LogoutModal';
import DashboardContainer from '../containers/DashboardContainer';
import AskQuestionContainer from '../containers/AskQuestionContainer';
import QuestionDetailContainer from '../containers/QuestionDetailContainer';
import SearchResultsContainer from '../containers/SearchResultsContainer';

import config from '../../config.json';
import Auth from '../Auth/auth';

const auth = new Auth(config.CLIENT_ID, config.DOMAIN);

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      toggleModal: false,
    };
    auth.on('userAdded', user => {
      this.storeUser(user);
    });
    this.toggleModal = this.toggleModal.bind(this);
    this.userLogout = this.userLogout.bind(this);
  }

  componentDidMount() {
    const { history, addHistoryToStore } = this.props;
    addHistoryToStore(history);

    const userProfile = auth.getProfile();
    const token = auth.loggedIn();

    token && this.storeUser(userProfile, token);
  }

  storeUser(userProfile, token) {
    const user = Object.assign({}, userProfile, { token });
    this.props.userLogin(user);
  }

  toggleModal() {
    const toggle = !this.state.toggleModal;
    this.setState({ toggleModal: toggle });
  }

  userLogout() {
    const { history, userLogout } = this.props;
    history.push('/');
    userLogout({});
  }

  render() {
    const { toggleModal } = this.state;
    const { user } = this.props;
    return (
      <div>
        <NavBar auth={auth} handleClick={this.toggleModal} />
        <Route
          exact
          path="/ask-question"
          render={() =>
            !auth.loggedIn() ? auth.login() : <AskQuestionContainer />}
        />
        <Route
          exact
          path="/"
          render={() => {
            return <DashboardContainer auth={auth} />;
          }}
        />
        <Route
          path="/question/:id"
          render={({ match }) => {
            return (
              <QuestionDetailContainer
                id={match.params.id}
                history={history}
                auth={auth}
              />
            );
          }}
        />
        <Route
          exact
          path="/search/:searchTerm"
          render={({ match, location }) => {
            return (
              <SearchResultsContainer
                location={location}
                searchTermMatch={match.params.searchTerm}
              />
            );
          }}
        />
        <Route
          exact
          path="/search/tag/:tag"
          render={({ match, location }) => {
            return (
              <SearchResultsContainer
                location={location}
                searchTermMatch={match.params.tag}
              />
            );
          }}
        />
        {toggleModal &&
          <LogoutModal
            user={user}
            auth={auth}
            userLogout={this.userLogout}
            toggleModal={this.toggleModal}
          />}
        <Alert
          stack={{ limit: 5 }}
          position="top"
          timeout={5000}
          effect="stackslide"
        />
      </div>
    );
  }
}
