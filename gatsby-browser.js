import React from 'react'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import configureStore from './src/store'

export const replaceRouterComponent = ({ history }) => {
  const store = configureStore({});
  return ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );
};