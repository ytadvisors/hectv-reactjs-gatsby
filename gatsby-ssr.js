import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import configureStore from './src/store'

export const replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {

  const store = configureStore({}).run();
  const ConnectedBody = () => (
    <Provider store={store}>
      {bodyComponent}
    </Provider>
  );
  replaceBodyHTMLString(renderToString(<ConnectedBody/>))
};