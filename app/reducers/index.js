import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import questions from './questionsReducer';
import searchResults from './searchReducer';
import popularQuestions from './popularQuestionsReducer';
import recentTags from './recentTagsReducer';
import storedHistory from './addHistoryReducer';
import user from './userReducer';


const appReducer = combineReducers({
  questions,
  searchResults,
  popularQuestions,
  recentTags,
  storedHistory,
  user,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
