import { combineReducers } from 'redux';

import accountReducers from './accountReducers';
import pageReducers from './pageReducers';
import postReducers from './postReducers';
import eventReducers from './eventReducers';
import donateReducers from './donateReducers';
import magazineReducers from './magazineReducers';
import scheduleReducers from './scheduleReducers';
import streamReducers from './streamReducers';
import formReducers from './formReducers';
import { loadingBarReducer } from 'react-redux-loading-bar';

export default combineReducers({
  pageReducers,
  accountReducers,
  postReducers,
  eventReducers,
  magazineReducers,
  donateReducers,
  scheduleReducers,
  streamReducers,
  loadingBar: loadingBarReducer,
  form: formReducers
});
