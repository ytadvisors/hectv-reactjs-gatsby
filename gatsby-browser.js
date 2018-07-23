import React from 'react'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import createHistory from "history/createBrowserHistory"
import configureStore from './src/store'

const timeout = 250;
const historyExitingEventType = `history::exiting`;
const getUserConfirmation = (pathname, callback) => {
  const event = new CustomEvent(historyExitingEventType, { detail: { pathname } });
  window.dispatchEvent(event);
  setTimeout(() => {
    callback(true)
  }, timeout)
};

let history;
if (typeof document !== 'undefined') {
  history = createHistory({ getUserConfirmation });
  history.block((location, action) => location.pathname);
}

export let replaceHistory = () => history;
export { historyExitingEventType, timeout }

export const replaceRouterComponent = ({ history }) => {
  const store = configureStore({});
  const ConnectedRouterWrapper =  ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );
  return ConnectedRouterWrapper;
};