import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import configureStore from './src/store'

export const replaceServerBodyRender = ({ component: body }) => {

  const store = configureStore({});

  const ConnectedBody = () => (
    <Provider store={store}>
      {body}
    </Provider>
  );


  return {
    body: renderToString(<ConnectedBody/>),
  }
};