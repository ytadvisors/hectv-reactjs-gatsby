import { createStore as reduxCreateStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import mainSaga from './sagas';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { loadingBarMiddleware } from 'react-redux-loading-bar'
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();
const loadingBar = loadingBarMiddleware({
  promiseTypeSuffixes: ['REQUEST', 'SUCCESS', 'FAILURE'],
});

let middlewares = [ sagaMiddleware, loadingBar ];

if(process.env.ACTIVE_ENV !== 'production')
  middlewares.push(logger);

export default function configureStore(initialState = {}) {
  const store = reduxCreateStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
  );

  // Extensions
  store.runSaga = sagaMiddleware.run(mainSaga);
  store.asyncReducers = {}; // Async reducer registry
  return store;
}
