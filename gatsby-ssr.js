import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import configureStore from './src/store'

export const replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {

  const store = configureStore({});
  replaceBodyHTMLString(
    renderToString(
      <Provider store={store}>
        {bodyComponent}
      </Provider>
    )
  )
};