import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import rootReducer from 'reducers';
import sagas from './sagas';

export const history = typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory();
const sagaMiddleware = createSagaMiddleware();

const initialState = {};
const enhancers = [];
const middlewares = [
  sagaMiddleware,
];

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension;
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }

  const { logger } = require(`redux-logger`);
  middlewares.push(logger);
}

const composedEnhancers = compose(
  applyMiddleware(...middlewares),
  ...enhancers
);

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
);

sagas.forEach(saga => sagaMiddleware.run(saga));

export default store;
