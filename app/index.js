import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';

import rootReducer from './reducers/index';
import styles from './assets/styles/main';
import '../node_modules/simplemde/dist/simplemde.min.css';

import AppContainer from './containers/AppContainer';

const history = createHistory();
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const middleware = routerMiddleware(history);
const store = createStore(rootReducer, devTools, applyMiddleware(middleware, thunk));

const router = (
  <Provider store={ store }>
    <ConnectedRouter history={ history }>
      <Route path='/' component={ AppContainer } />
    </ConnectedRouter>
  </Provider>
);


ReactDOM.render(router, document.getElementById('app'));
