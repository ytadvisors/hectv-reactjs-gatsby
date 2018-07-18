import { createStore as reduxCreateStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import mainSaga from './sagas';
import logger from 'redux-logger';
import { isServer } from './../utils/helperFunctions';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const middlewares =
  process.env.NODE_ENV !== 'production'
    ? [sagaMiddleware, logger]
    : [sagaMiddleware];

export default function configureStore(initialState = {}) {
  // Create the store with two middlewares
  const composeEnhancers =
    (process.env.NODE_ENV !== 'production' && !isServer && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;
  const enhancers = [applyMiddleware(...middlewares)];

  return {
    run : () => {
      const store = reduxCreateStore(
        reducers,
        initialState,
        composeEnhancers(...enhancers)
      );

      // Extensions
      store.runSaga = sagaMiddleware.run(mainSaga);
      store.asyncReducers = {}; // Async reducer registry
      return store;
    }
  };

}
