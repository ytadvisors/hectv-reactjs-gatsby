import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import mainSaga from './sagas';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const middlewares =
  process.env.NODE_ENV !== 'production'
    ? [sagaMiddleware, logger]
    : [sagaMiddleware];

export default function configureStore(initialState = {}) {
  // Create the store with two middlewares
  const composeEnhancers =
    (process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;
  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(...enhancers)
  );


  // Extensions
  store.runSaga = sagaMiddleware.run(mainSaga);
  store.asyncReducers = {}; // Async reducer registry

  return  { store } ;
}
