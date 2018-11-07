import { createStore as reduxCreateStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import mainSaga from './sagas';
import reducers from './reducers';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV !== 'production') middlewares.push(logger);

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
