import { createStore as reduxCreateStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import mainSaga from './sagas';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const middlewares =
  process.env.ACTIVE_ENV !== 'production'
    ? [sagaMiddleware, logger]
    : [sagaMiddleware];

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
